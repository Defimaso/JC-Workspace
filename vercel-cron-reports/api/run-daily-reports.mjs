/**
 * Vercel Cron endpoint — esegue i 3 report Telegram giornalieri.
 * Schedulato in vercel.json (`crons`) ogni mattina alle 06:00 UTC = 08:00 IT.
 *
 * Test manuale: GET /api/run-daily-reports?token=$CRON_SECRET
 * Vercel chiama con Authorization: Bearer $CRON_SECRET (env var auto-iniettata)
 */

const SUPABASE_URL = 'https://ppbbqchycxffsfavtsjp.supabase.co';
const SRK = process.env.SUPABASE_SERVICE_KEY;
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHATS = [process.env.TELEGRAM_CHAT_ID || '489480689', process.env.TELEGRAM_CHAT_ID_2 || '403582502'];

const META_362_TOKEN = process.env.META_362_TOKEN;
const IG_TOKEN_362GRADI = process.env.IG_TOKEN_362GRADI;
const IG_TOKEN_MARCO = process.env.IG_TOKEN_MARCO;
const IG_TOKEN_DEFIMASO = process.env.IG_TOKEN_DEFIMASO;

const H = { apikey: SRK, Authorization: `Bearer ${SRK}`, 'Content-Type': 'application/json' };
const HG = { apikey: SRK, Authorization: `Bearer ${SRK}` };

// =============== utils ===============
async function getJSON(p) { const r = await fetch(SUPABASE_URL + p, { headers: HG }); if (!r.ok) throw new Error(`${r.status}: ${(await r.text()).slice(0,200)}`); return r.json(); }
async function count(p) { const r = await fetch(SUPABASE_URL + p, { headers: { ...HG, Prefer: 'count=exact', Range: '0-0' } }); const cr = r.headers.get('content-range') || '*/0'; return Number(cr.split('/')[1] || 0); }
async function sendTelegram(text) {
  for (const chat of TG_CHATS) {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: 'Markdown' }),
    }).catch(() => {});
  }
}
function fmtDelta(n) { if (n == null) return '—'; if (n > 0) return `+${n}`; return String(n); }
function fmtInt(n) { return Number(n).toLocaleString('it-IT'); }
function fmtDay(iso) { return new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: 'short' }).format(new Date(iso)); }
function ddmm(yyyymmdd) { const [y,m,d] = yyyymmdd.split('-'); return new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: 'short' }).format(new Date(`${y}-${m}-${d}T12:00:00Z`)); }
function emojiDelta(n) { if (n > 0) return '📈'; if (n < 0) return '📉'; return '➖'; }
function pct(num, den) { return den > 0 ? `${((num/den)*100).toFixed(1)}%` : '—'; }
function pctDelta(cur, prev) { if (!prev) return cur > 0 ? '+∞%' : '0%'; const p = ((cur-prev)/prev)*100; return `${p>0?'+':''}${p.toFixed(0)}%`; }
function emojiTrend(cur, prev) { if (cur > prev) return '📈'; if (cur < prev) return '📉'; return '➖'; }

// =============== SOCIAL ===============
async function igDirect(token, p) { const r = await fetch(`https://graph.instagram.com/v18.0/${p}${p.includes('?')?'&':'?'}access_token=${token}`); const j = await r.json(); if (j.error) throw new Error(j.error.message); return j; }
async function graphFb(token, p) { const r = await fetch(`https://graph.facebook.com/v18.0/${p}${p.includes('?')?'&':'?'}access_token=${token}`); const j = await r.json(); if (j.error) throw new Error(j.error.message); return j; }

async function reportSocial() {
  const ACCOUNTS = [
    { label: 'ilaria_berry',    igId: '17841400655863733', token: META_362_TOKEN, kind: 'graph_fb' },
    { label: '362gradi.ae',     token: IG_TOKEN_362GRADI, kind: 'ig_direct' },
    { label: '_marco_masoero_', token: IG_TOKEN_MARCO,    kind: 'ig_direct' },
    { label: 'defimaso',        token: IG_TOKEN_DEFIMASO, kind: 'ig_direct' },
  ];
  const sinceStr = new Date(Date.now() - 8*86400_000).toISOString().slice(0,10);
  const untilStr = new Date(Date.now() + 86400_000).toISOString().slice(0,10);

  async function fetchLive(acc) {
    if (acc.kind === 'graph_fb') { const j = await graphFb(acc.token, `${acc.igId}?fields=username,followers_count,media_count`); return { igId: acc.igId, username: j.username, followers: j.followers_count, media: j.media_count }; }
    const me = await igDirect(acc.token, 'me?fields=id,username');
    const j = await igDirect(acc.token, `${me.id}?fields=username,followers_count,media_count`);
    return { igId: me.id, username: j.username, followers: j.followers_count, media: j.media_count };
  }
  async function fetchInsights7d(acc, igId) {
    const qs = `insights?metric=follower_count&period=day&since=${sinceStr}&until=${untilStr}`;
    try {
      const j = acc.kind === 'graph_fb' ? await graphFb(acc.token, `${igId}/${qs}`) : await igDirect(acc.token, `${igId}/${qs}`);
      const values = (j.data?.[0]?.values || []).sort((a,b) => a.end_time.localeCompare(b.end_time));
      return values.slice(-7);
    } catch { return null; }
  }
  async function insertSnapshot(row) { await fetch(`${SUPABASE_URL}/rest/v1/social_snapshots`, { method: 'POST', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify(row) }).catch(() => {}); }
  async function getPreviousSnapshot(label) {
    const minAgoIso = new Date(Date.now() - 20*3600_000).toISOString();
    const maxAgoIso = new Date(Date.now() - 32*3600_000).toISOString();
    const r = await fetch(`${SUPABASE_URL}/rest/v1/social_snapshots?account=eq.${encodeURIComponent(label)}&captured_at=gte.${maxAgoIso}&captured_at=lte.${minAgoIso}&followers_count=not.is.null&order=captured_at.desc&limit=1`, { headers: HG });
    return (await r.json())[0] || null;
  }
  async function getSnapshot7dAgo(label) {
    const olderIso = new Date(Date.now() - 7*86400_000).toISOString();
    const newerIso = new Date(Date.now() - 6.5*86400_000).toISOString();
    const r = await fetch(`${SUPABASE_URL}/rest/v1/social_snapshots?account=eq.${encodeURIComponent(label)}&captured_at=gte.${olderIso}&captured_at=lte.${newerIso}&followers_count=not.is.null&order=captured_at.asc&limit=1`, { headers: HG });
    return (await r.json())[0] || null;
  }

  const dateLabel = new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  let msg = `📸 *FOLLOWER — ${dateLabel}*\n`;

  for (const acc of ACCOUNTS) {
    msg += `\n━━━━━━━━━━━━━━\n`;
    if (!acc.token) { msg += `⚠️ *@${acc.label}* — token mancante\n`; continue; }
    let live;
    try { live = await fetchLive(acc); } catch (e) {
      msg += `⚠️ *@${acc.label}* — token scaduto\n   \`${String(e.message).slice(0,70)}\`\n`;
      await insertSnapshot({ account: acc.label, captured_at: new Date().toISOString(), source: acc.kind, error: String(e.message).slice(0,400) });
      continue;
    }
    await insertSnapshot({ account: acc.label, ig_user_id: live.igId, username: live.username, followers_count: live.followers, media_count: live.media, captured_at: new Date().toISOString(), source: acc.kind });
    const [prev, weekAgo, insights] = await Promise.all([ getPreviousSnapshot(acc.label), getSnapshot7dAgo(acc.label), fetchInsights7d(acc, live.igId) ]);
    msg += `\n📌 *@${live.username}* — ${fmtInt(live.followers)}\n`;
    if (prev) { const d = live.followers - prev.followers_count; msg += `${emojiDelta(d)} Ieri → oggi: *${fmtDelta(d)}*\n`; }
    if (weekAgo) { const d7 = live.followers - weekAgo.followers_count; msg += `${emojiDelta(d7)} 7gg: *${fmtDelta(d7)}* (snapshot)\n`; }
    if (insights && insights.length) {
      const total = insights.reduce((a,v) => a + (v.value || 0), 0);
      const avg = Math.round(total/insights.length);
      msg += `\n*Trend Insights 7gg:* ${fmtDelta(total)} _(media ${fmtDelta(avg)}/gg)_\n`;
      insights.forEach(v => { msg += `   ${fmtDay(v.end_time)}  ${fmtDelta(v.value || 0)}\n`; });
    } else if (insights === null) msg += `_(insights non disponibili)_\n`;
    if (!prev && !weekAgo && (!insights || !insights.length)) msg += `_(baseline acquisita, dati 7gg dal prossimo ciclo)_\n`;
  }
  msg += `\n━━━━━━━━━━━━━━\n_Insights Meta lag 24-48h. Delta snapshot real-time._`;
  await sendTelegram(msg);
  return msg;
}

// =============== FUNNEL ===============
async function reportFunnel() {
  const NOW = new Date();
  const W1_END = new Date(NOW); W1_END.setUTCHours(23,59,59,999);
  const W1_START = new Date(W1_END.getTime() - 7*86400_000 + 1);
  const W2_END = new Date(W1_START.getTime() - 1);
  const W2_START = new Date(W2_END.getTime() - 7*86400_000 + 1);
  const W1 = { startIso: W1_START.toISOString(), endIso: W1_END.toISOString() };
  const W2 = { startIso: W2_START.toISOString(), endIso: W2_END.toISOString() };
  const dateLabel = (d) => new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: 'short' }).format(d);
  const W1_LABEL = `${dateLabel(W1_START)} → ${dateLabel(W1_END)}`;

  const quizW1 = await getJSON(`/rest/v1/quiz_leads?select=created_at,source_channel,need_profile,utm_source,utm_medium&created_at=gte.${W1.startIso}&created_at=lte.${W1.endIso}&order=created_at.asc`);
  const quizW2Count = await count(`/rest/v1/quiz_leads?select=id&created_at=gte.${W2.startIso}&created_at=lte.${W2.endIso}`);
  const callW1 = await getJSON(`/rest/v1/funnel_events?select=created_at,email,name,utm_source,utm_medium,utm_campaign&event_type=eq.call_booked&created_at=gte.${W1.startIso}&created_at=lte.${W1.endIso}&order=created_at.asc`);
  const callW2Count = await count(`/rest/v1/funnel_events?select=id&event_type=eq.call_booked&created_at=gte.${W2.startIso}&created_at=lte.${W2.endIso}`);
  const calcW1 = await getJSON(`/rest/v1/calculator_leads?select=created_at,email,utm_source,utm_medium&created_at=gte.${W1.startIso}&created_at=lte.${W1.endIso}&order=created_at.asc`);
  const calcW2Count = await count(`/rest/v1/calculator_leads?select=id&created_at=gte.${W2.startIso}&created_at=lte.${W2.endIso}`);

  const qN = quizW1.length, cN = callW1.length, kN = calcW1.length;
  const byCh = {}, byProfile = {};
  quizW1.forEach(r => {
    byCh[r.source_channel || 'n/d'] = (byCh[r.source_channel || 'n/d'] || 0) + 1;
    byProfile[r.need_profile || 'n/d'] = (byProfile[r.need_profile || 'n/d'] || 0) + 1;
  });
  function groupByDay(rows) {
    const m = new Map();
    rows.forEach(r => {
      const d = new Date(r.created_at);
      const key = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
      m.set(key, (m.get(key) || 0) + 1);
    });
    return [...m.entries()].sort();
  }
  const quizPerDay = groupByDay(quizW1), callPerDay = groupByDay(callW1), calcPerDay = groupByDay(calcW1);
  const convRate = qN > 0 ? ((cN/qN)*100).toFixed(1) : '0';

  let msg = `🎯 *FUNNEL 362gradi — Settimana ${W1_LABEL}*\n\n📊 *Riepilogo*\n`;
  msg += `${emojiTrend(qN, quizW2Count)} Quiz: *${qN}* (W-1: ${quizW2Count}, ${pctDelta(qN, quizW2Count)})\n`;
  msg += `${emojiTrend(cN, callW2Count)} Call: *${cN}* (W-1: ${callW2Count}, ${pctDelta(cN, callW2Count)})\n`;
  msg += `${emojiTrend(kN, calcW2Count)} Calcolatore: *${kN}* (W-1: ${calcW2Count}, ${pctDelta(kN, calcW2Count)})\n`;
  msg += `🎯 Conv quiz→call: *${convRate}%*\n\n📅 *Quiz per giorno*\n`;
  if (quizPerDay.length) quizPerDay.forEach(([d,n]) => msg += `   ${ddmm(d)}  ${n}\n`); else msg += `   _nessuno_\n`;
  msg += `\n📅 *Call per giorno*\n`;
  if (callPerDay.length) callPerDay.forEach(([d,n]) => msg += `   ${ddmm(d)}  ${n}\n`); else msg += `   _nessuna_\n`;
  msg += `\n📅 *Calcolatore per giorno*\n`;
  if (calcPerDay.length) calcPerDay.forEach(([d,n]) => msg += `   ${ddmm(d)}  ${n}\n`); else msg += `   _nessuno_\n`;
  if (qN > 0) {
    msg += `\n🔗 *Quiz per canale (top 6)*\n`;
    Object.entries(byCh).sort((a,b)=>b[1]-a[1]).slice(0,6).forEach(([k,v]) => msg += `   • ${k}: ${v} (${((v/qN)*100).toFixed(0)}%)\n`);
    msg += `\n👤 *Profili emersi*\n`;
    Object.entries(byProfile).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => msg += `   • ${k}: ${v}\n`);
  }
  if (cN > 0) {
    msg += `\n📞 *Dettaglio call (${cN})*\n`;
    callW1.slice(0,12).forEach(r => {
      const src = [r.utm_source, r.utm_medium].filter(Boolean).join('/') || 'direct';
      msg += `   • ${r.name || '(anon)'} <${r.email || '—'}> — ${src}\n`;
    });
    if (cN > 12) msg += `   _...+${cN-12}_\n`;
  }
  if (qN === 0 && cN === 0 && kN === 0) msg += `\n_Nessuna attività tracciata nella settimana._`;
  await sendTelegram(msg);
  return msg;
}

// =============== EMAILS ===============
async function reportEmails() {
  const QUIZ_PROFILES = new Set(['significance','intelligence','acceptance','approval','power','pity']);
  const CALC_PROFILES = new Set(['calculator']);
  const funnelFor = (p) => !p ? 'altro' : QUIZ_PROFILES.has(p) ? 'quiz' : CALC_PROFILES.has(p) ? 'calcolatore' : 'altro';
  const NOW = new Date();
  const W1_END = new Date(NOW); W1_END.setUTCHours(23,59,59,999);
  const W1_START = new Date(W1_END.getTime() - 7*86400_000 + 1);
  const W2_END = new Date(W1_START.getTime() - 1);
  const W2_START = new Date(W2_END.getTime() - 7*86400_000 + 1);
  const W1 = { startIso: W1_START.toISOString(), endIso: W1_END.toISOString() };
  const W2 = { startIso: W2_START.toISOString(), endIso: W2_END.toISOString() };
  const dateLabel = (d) => new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: 'short' }).format(d);
  const W1_LABEL = `${dateLabel(W1_START)} → ${dateLabel(W1_END)}`;

  async function fetchQueueRange(range) {
    return await getJSON(`/rest/v1/email_queue?select=id,sequence_id,position,opened_at,clicked_at,sent_at&status=eq.sent&sent_at=gte.${range.startIso}&sent_at=lte.${range.endIso}&order=sent_at.asc&limit=10000`);
  }
  const queueW1 = await fetchQueueRange(W1);
  const queueW2 = await fetchQueueRange(W2);
  const seqIds = [...new Set([...queueW1, ...queueW2].map(q => q.sequence_id).filter(Boolean))];
  let seqMap = {};
  if (seqIds.length) {
    const inList = seqIds.map(id => `"${id}"`).join(',');
    const seqs = await getJSON(`/rest/v1/email_sequences?select=id,profile,position,subject&id=in.(${encodeURIComponent(inList)})`);
    seqs.forEach(s => { seqMap[s.id] = s; });
  }
  const aggFunnel = { quiz: { sent: 0, opened: 0, clicked: 0 }, calcolatore: { sent: 0, opened: 0, clicked: 0 }, altro: { sent: 0, opened: 0, clicked: 0 } };
  const byProfile = {}, byPosition = {};
  const perDay = new Map();
  queueW1.forEach(q => {
    const seq = seqMap[q.sequence_id] || {};
    const f = funnelFor(seq.profile);
    aggFunnel[f].sent++; if (q.opened_at) aggFunnel[f].opened++; if (q.clicked_at) aggFunnel[f].clicked++;
    const prof = seq.profile || 'n/d';
    if (!byProfile[prof]) byProfile[prof] = { sent: 0, opened: 0, clicked: 0 };
    byProfile[prof].sent++; if (q.opened_at) byProfile[prof].opened++; if (q.clicked_at) byProfile[prof].clicked++;
    const pos = q.position ?? '?';
    if (!byPosition[pos]) byPosition[pos] = { sent: 0, opened: 0, clicked: 0 };
    byPosition[pos].sent++; if (q.opened_at) byPosition[pos].opened++; if (q.clicked_at) byPosition[pos].clicked++;
    const k = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(q.sent_at));
    perDay.set(k, (perDay.get(k) || 0) + 1);
  });
  const W1_total = queueW1.length, W2_total = queueW2.length;
  const W1_open = queueW1.filter(q => q.opened_at).length;
  const W1_click = queueW1.filter(q => q.clicked_at).length;
  const W2_open = queueW2.filter(q => q.opened_at).length;
  const W2_click = queueW2.filter(q => q.clicked_at).length;

  const events = await getJSON(`/rest/v1/email_events?select=event_type&created_at=gte.${W1.startIso}&created_at=lte.${W1.endIso}&limit=10000`);
  const ec = { delivered: 0, open: 0, click: 0, bounce: 0, complaint: 0 };
  events.forEach(e => { if (ec[e.event_type] !== undefined) ec[e.event_type]++; });

  let msg = `📧 *EMAIL — Settimana ${W1_LABEL}*\n\n📊 *Riepilogo settimana*\n`;
  msg += `${emojiTrend(W1_total, W2_total)} Inviate: *${W1_total}* (W-1: ${W2_total}, ${pctDelta(W1_total, W2_total)})\n`;
  msg += `👁 Aperte: *${W1_open}* (${pct(W1_open, W1_total)})  vs W-1 ${W2_open} (${pct(W2_open, W2_total)})\n`;
  msg += `🖱 Click: *${W1_click}* (${pct(W1_click, W1_total)})  vs W-1 ${W2_click} (${pct(W2_click, W2_total)})\n`;
  msg += `\n📅 *Volume per giorno*\n`;
  if (perDay.size === 0) msg += `   _nessuna_\n`;
  else [...perDay.entries()].sort().forEach(([d,n]) => msg += `   ${ddmm(d)}  ${n}\n`);
  function fmtFunnel(name, emoji, d) { return d.sent === 0 ? `${emoji} *${name}*: nessuna\n` : `${emoji} *${name}*: ${d.sent} inviate · ${d.opened} open (${pct(d.opened, d.sent)}) · ${d.clicked} click (${pct(d.clicked, d.sent)})\n`; }
  msg += `\n🔀 *Per funnel*\n${fmtFunnel('Quiz (6 profili)','🧩',aggFunnel.quiz)}${fmtFunnel('Calcolatore','🧮',aggFunnel.calcolatore)}`;
  if (aggFunnel.altro.sent > 0) msg += fmtFunnel('Altro','📌',aggFunnel.altro);
  if (Object.keys(byProfile).length) {
    msg += `\n👤 *Per profilo*\n`;
    Object.entries(byProfile).sort((a,b)=>b[1].sent-a[1].sent).forEach(([p,d]) => msg += `   • ${p}: ${d.sent} sent · ${pct(d.opened,d.sent)} open · ${pct(d.clicked,d.sent)} click\n`);
  }
  if (Object.keys(byPosition).length) {
    msg += `\n🔢 *Per posizione*\n`;
    Object.entries(byPosition).sort((a,b)=>Number(a[0])-Number(b[0])).forEach(([p,d]) => msg += `   • #${p}: ${d.sent} sent · ${pct(d.opened,d.sent)} open · ${pct(d.clicked,d.sent)} click\n`);
  }
  if (ec.delivered + ec.open + ec.click + ec.bounce > 0) {
    msg += `\n📡 *Resend webhook*\n   ✅ ${ec.delivered} delivered · 👁 ${ec.open} open · 🖱 ${ec.click} click`;
    if (ec.bounce > 0) msg += ` · ⚠️ ${ec.bounce} bounce`;
    if (ec.complaint > 0) msg += ` · 🚫 ${ec.complaint} complaint`;
    msg += `\n`;
  }
  if (W1_total === 0 && ec.delivered === 0) msg = `📧 *EMAIL — ${W1_LABEL}*\n\n_Nessuna email tracciata nella settimana._`;
  await sendTelegram(msg);
  return msg;
}

// =============== HANDLER ===============
export default async function handler(req, res) {
  // Vercel Cron auth: header `Authorization: Bearer $CRON_SECRET`
  const auth = req.headers.authorization || '';
  const queryToken = req.query?.token || '';
  const cronSecret = process.env.CRON_SECRET || '';
  const ok = (auth === `Bearer ${cronSecret}`) || (cronSecret && queryToken === cronSecret) || !cronSecret;
  if (!ok) { res.status(401).json({ error: 'unauthorized' }); return; }

  if (!SRK || !TG_TOKEN) {
    res.status(500).json({ error: 'missing env vars', need: ['SUPABASE_SERVICE_KEY', 'TELEGRAM_BOT_TOKEN'] });
    return;
  }

  const results = { social: null, funnel: null, emails: null };
  try { results.social = await reportSocial(); } catch (e) { results.social = `ERR: ${String(e.message || e)}`; await sendTelegram(`⚠️ Report SOCIAL fallito: \`${String(e.message || e).slice(0,200)}\``); }
  try { results.funnel = await reportFunnel(); } catch (e) { results.funnel = `ERR: ${String(e.message || e)}`; await sendTelegram(`⚠️ Report FUNNEL fallito: \`${String(e.message || e).slice(0,200)}\``); }
  try { results.emails = await reportEmails(); } catch (e) { results.emails = `ERR: ${String(e.message || e)}`; await sendTelegram(`⚠️ Report EMAILS fallito: \`${String(e.message || e).slice(0,200)}\``); }

  res.status(200).json({ ok: true, results: { social: results.social?.slice(0,200), funnel: results.funnel?.slice(0,200), emails: results.emails?.slice(0,200) } });
}
