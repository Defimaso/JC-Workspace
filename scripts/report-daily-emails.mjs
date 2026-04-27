#!/usr/bin/env node
/**
 * report-daily-emails.mjs
 * Report mattutino Telegram — email settimana precedente, dettagliato.
 *
 *   - Totali settimana W1 vs W2 (settimana prima)
 *   - Breakdown per FUNNEL × PROFILO × posizione
 *   - Open rate, CTR per funnel
 *   - Volume per giorno
 *   - Eventi Resend webhook (delivered, open, click, bounce)
 *
 * Uso: node scripts/report-daily-emails.mjs
 */

const SUPABASE_URL = 'https://ppbbqchycxffsfavtsjp.supabase.co';
const SRK = process.env.SUPABASE_SERVICE_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYmJxY2h5Y3hmZnNmYXZ0c2pwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ0NDA1MCwiZXhwIjoyMDg2MDIwMDUwfQ.d8SK9ncgnkdTBP1qciJpFkwCNlIPLVm34WUtVJkJMzk';

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7553279856:AAEAIw57fK5TNVSu7l0FYhYaDq9_obsupNU';
const TG_CHATS = [process.env.TELEGRAM_CHAT_ID || '489480689', process.env.TELEGRAM_CHAT_ID_2 || '403582502'];

const H = { apikey: SRK, Authorization: `Bearer ${SRK}` };

const QUIZ_PROFILES = new Set(['significance', 'intelligence', 'acceptance', 'approval', 'power', 'pity']);
const CALC_PROFILES = new Set(['calculator']);
function funnelFor(profile) {
  if (!profile) return 'altro';
  if (QUIZ_PROFILES.has(profile)) return 'quiz';
  if (CALC_PROFILES.has(profile)) return 'calcolatore';
  return 'altro';
}

const NOW = new Date();
const W1_END = new Date(NOW); W1_END.setUTCHours(23, 59, 59, 999);
const W1_START = new Date(W1_END.getTime() - 7 * 86400_000 + 1);
const W2_END = new Date(W1_START.getTime() - 1);
const W2_START = new Date(W2_END.getTime() - 7 * 86400_000 + 1);
const W1 = { startIso: W1_START.toISOString(), endIso: W1_END.toISOString() };
const W2 = { startIso: W2_START.toISOString(), endIso: W2_END.toISOString() };
const dateLabel = (d) => new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: 'short' }).format(d);
const W1_LABEL = `${dateLabel(W1_START)} → ${dateLabel(W1_END)}`;

async function getJSON(p) {
  const r = await fetch(SUPABASE_URL + p, { headers: H });
  if (!r.ok) throw new Error(`${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}
async function sendTelegram(text) {
  for (const chat of TG_CHATS) {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: 'Markdown' }),
    }).catch(() => {});
  }
}
function pct(num, den) { return den > 0 ? `${((num / den) * 100).toFixed(1)}%` : '—'; }
function pctDelta(cur, prev) {
  if (!prev) return cur > 0 ? '+∞%' : '0%';
  const p = ((cur - prev) / prev) * 100;
  const s = p > 0 ? '+' : '';
  return `${s}${p.toFixed(0)}%`;
}
function emojiTrend(cur, prev) {
  if (cur > prev) return '📈';
  if (cur < prev) return '📉';
  return '➖';
}
function ddmm(yyyymmdd) {
  const [y, m, d] = yyyymmdd.split('-');
  const date = new Date(`${y}-${m}-${d}T12:00:00Z`);
  return new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: 'short' }).format(date);
}

async function fetchQueueRange(range) {
  const rows = await getJSON(
    `/rest/v1/email_queue?select=id,sequence_id,position,opened_at,clicked_at,sent_at&status=eq.sent&sent_at=gte.${range.startIso}&sent_at=lte.${range.endIso}&order=sent_at.asc&limit=10000`
  );
  return rows;
}

async function loadSeqMap(seqIds) {
  if (!seqIds.length) return {};
  const inList = seqIds.map(id => `"${id}"`).join(',');
  const seqs = await getJSON(`/rest/v1/email_sequences?select=id,profile,position,subject&id=in.(${encodeURIComponent(inList)})`);
  const m = {};
  seqs.forEach(s => { m[s.id] = s; });
  return m;
}

(async () => {
  const queueW1 = await fetchQueueRange(W1);
  const queueW2 = await fetchQueueRange(W2);

  const seqIds = [...new Set([...queueW1, ...queueW2].map(q => q.sequence_id).filter(Boolean))];
  const seqMap = await loadSeqMap(seqIds);

  // Aggregate W1 per funnel + per profile + per position
  const aggFunnel = {
    quiz:        { sent: 0, opened: 0, clicked: 0 },
    calcolatore: { sent: 0, opened: 0, clicked: 0 },
    altro:       { sent: 0, opened: 0, clicked: 0 },
  };
  const byProfile = {};
  const byPosition = {};
  const perDay = new Map();

  queueW1.forEach(q => {
    const seq = seqMap[q.sequence_id] || {};
    const funnel = funnelFor(seq.profile);
    aggFunnel[funnel].sent++;
    if (q.opened_at) aggFunnel[funnel].opened++;
    if (q.clicked_at) aggFunnel[funnel].clicked++;

    const prof = seq.profile || 'n/d';
    if (!byProfile[prof]) byProfile[prof] = { sent: 0, opened: 0, clicked: 0 };
    byProfile[prof].sent++;
    if (q.opened_at) byProfile[prof].opened++;
    if (q.clicked_at) byProfile[prof].clicked++;

    const pos = q.position ?? '?';
    if (!byPosition[pos]) byPosition[pos] = { sent: 0, opened: 0, clicked: 0 };
    byPosition[pos].sent++;
    if (q.opened_at) byPosition[pos].opened++;
    if (q.clicked_at) byPosition[pos].clicked++;

    const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(q.sent_at));
    perDay.set(dayKey, (perDay.get(dayKey) || 0) + 1);
  });

  const W1_total = queueW1.length;
  const W2_total = queueW2.length;
  const W1_open = queueW1.filter(q => q.opened_at).length;
  const W1_click = queueW1.filter(q => q.clicked_at).length;
  const W2_open = queueW2.filter(q => q.opened_at).length;
  const W2_click = queueW2.filter(q => q.clicked_at).length;

  // Eventi Resend webhook ultima settimana
  const events = await getJSON(`/rest/v1/email_events?select=event_type&created_at=gte.${W1.startIso}&created_at=lte.${W1.endIso}&limit=10000`);
  const eventCount = { delivered: 0, opened: 0, clicked: 0, bounced: 0, complained: 0 };
  events.forEach(e => { if (eventCount[e.event_type] !== undefined) eventCount[e.event_type]++; });

  let msg = `📧 *EMAIL — Settimana ${W1_LABEL}*\n\n`;

  msg += `📊 *Riepilogo settimana*\n`;
  msg += `${emojiTrend(W1_total, W2_total)} Inviate: *${W1_total}* (W-1: ${W2_total}, ${pctDelta(W1_total, W2_total)})\n`;
  msg += `👁 Aperte: *${W1_open}* (${pct(W1_open, W1_total)})  vs W-1 ${W2_open} (${pct(W2_open, W2_total)})\n`;
  msg += `🖱 Click: *${W1_click}* (${pct(W1_click, W1_total)})  vs W-1 ${W2_click} (${pct(W2_click, W2_total)})\n`;

  msg += `\n📅 *Volume per giorno*\n`;
  if (perDay.size === 0) msg += `   _nessuna_\n`;
  else [...perDay.entries()].sort().forEach(([d, n]) => { msg += `   ${ddmm(d)}  ${n}\n`; });

  function fmtFunnel(name, emoji, d) {
    if (d.sent === 0) return `${emoji} *${name}*: nessuna\n`;
    return `${emoji} *${name}*: ${d.sent} inviate · ${d.opened} open (${pct(d.opened, d.sent)}) · ${d.clicked} click (${pct(d.clicked, d.sent)})\n`;
  }
  msg += `\n🔀 *Per funnel*\n`;
  msg += fmtFunnel('Quiz (6 profili)', '🧩', aggFunnel.quiz);
  msg += fmtFunnel('Calcolatore', '🧮', aggFunnel.calcolatore);
  if (aggFunnel.altro.sent > 0) msg += fmtFunnel('Altro', '📌', aggFunnel.altro);

  // Per profile
  if (Object.keys(byProfile).length) {
    msg += `\n👤 *Per profilo*\n`;
    Object.entries(byProfile).sort((a, b) => b[1].sent - a[1].sent).forEach(([p, d]) => {
      msg += `   • ${p}: ${d.sent} sent · ${pct(d.opened, d.sent)} open · ${pct(d.clicked, d.sent)} click\n`;
    });
  }

  // Per position
  if (Object.keys(byPosition).length) {
    msg += `\n🔢 *Per posizione (email N° in sequenza)*\n`;
    Object.entries(byPosition).sort((a, b) => Number(a[0]) - Number(b[0])).forEach(([p, d]) => {
      msg += `   • #${p}: ${d.sent} sent · ${pct(d.opened, d.sent)} open · ${pct(d.clicked, d.sent)} click\n`;
    });
  }

  // Resend webhook
  if (eventCount.delivered + eventCount.opened + eventCount.clicked + eventCount.bounced > 0) {
    msg += `\n📡 *Resend webhook (incl. email dirette tipo guida post-quiz)*\n`;
    msg += `   ✅ ${eventCount.delivered} delivered · 👁 ${eventCount.opened} open · 🖱 ${eventCount.clicked} click`;
    if (eventCount.bounced > 0) msg += ` · ⚠️ ${eventCount.bounced} bounce`;
    if (eventCount.complained > 0) msg += ` · 🚫 ${eventCount.complained} complaint`;
    msg += `\n`;
  }

  if (W1_total === 0 && eventCount.delivered === 0) {
    msg = `📧 *EMAIL — ${W1_LABEL}*\n\n_Nessuna email tracciata nella settimana._`;
  }

  console.log(msg);
  await sendTelegram(msg);
  console.log('\n✅ Report email inviato');
})().catch(e => { console.error('❌', e.message || e); process.exit(1); });
