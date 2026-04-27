#!/usr/bin/env node
/**
 * report-daily-funnel.mjs
 * Report mattutino Telegram — funnel 362gradi settimana precedente.
 *
 *   - Quiz, Calcolatore, Call: totali 7 giorni + breakdown per canale e profilo + dettaglio per giorno
 *   - Confronto con settimana precedente (W-1)
 *   - Conversion rate quiz→call
 *
 * Uso: node scripts/report-daily-funnel.mjs
 */

const SUPABASE_URL = 'https://ppbbqchycxffsfavtsjp.supabase.co';
const SRK = process.env.SUPABASE_SERVICE_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYmJxY2h5Y3hmZnNmYXZ0c2pwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ0NDA1MCwiZXhwIjoyMDg2MDIwMDUwfQ.d8SK9ncgnkdTBP1qciJpFkwCNlIPLVm34WUtVJkJMzk';

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7553279856:AAEAIw57fK5TNVSu7l0FYhYaDq9_obsupNU';
const TG_CHATS = [process.env.TELEGRAM_CHAT_ID || '489480689', process.env.TELEGRAM_CHAT_ID_2 || '403582502'];

const H = { apikey: SRK, Authorization: `Bearer ${SRK}` };

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
  return r.json();
}
async function count(p) {
  const r = await fetch(SUPABASE_URL + p, { headers: { ...H, Prefer: 'count=exact', Range: '0-0' } });
  const cr = r.headers.get('content-range') || '*/0';
  return Number(cr.split('/')[1] || 0);
}
async function sendTelegram(text) {
  for (const chat of TG_CHATS) {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: 'Markdown' }),
    }).catch(() => {});
  }
}

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

function groupByDay(rows, tz = 'Europe/Rome') {
  const map = new Map();
  rows.forEach(r => {
    const d = new Date(r.created_at);
    const key = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
    map.set(key, (map.get(key) || 0) + 1);
  });
  return [...map.entries()].sort();
}

function ddmm(yyyymmdd) {
  const [y, m, d] = yyyymmdd.split('-');
  const date = new Date(`${y}-${m}-${d}T12:00:00Z`);
  return new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: 'short' }).format(date);
}

(async () => {
  // Tutti i quiz_leads di W1 e W2
  const quizW1 = await getJSON(`/rest/v1/quiz_leads?select=created_at,source_channel,need_profile,utm_source,utm_medium&created_at=gte.${W1.startIso}&created_at=lte.${W1.endIso}&order=created_at.asc`);
  const quizW2Count = await count(`/rest/v1/quiz_leads?select=id&created_at=gte.${W2.startIso}&created_at=lte.${W2.endIso}`);

  const callW1 = await getJSON(`/rest/v1/funnel_events?select=created_at,email,name,utm_source,utm_medium,utm_campaign&event_type=eq.call_booked&created_at=gte.${W1.startIso}&created_at=lte.${W1.endIso}&order=created_at.asc`);
  const callW2Count = await count(`/rest/v1/funnel_events?select=id&event_type=eq.call_booked&created_at=gte.${W2.startIso}&created_at=lte.${W2.endIso}`);

  const calcW1 = await getJSON(`/rest/v1/calculator_leads?select=created_at,email,utm_source,utm_medium&created_at=gte.${W1.startIso}&created_at=lte.${W1.endIso}&order=created_at.asc`);
  const calcW2Count = await count(`/rest/v1/calculator_leads?select=id&created_at=gte.${W2.startIso}&created_at=lte.${W2.endIso}`);

  const qN = quizW1.length, cN = callW1.length, kN = calcW1.length;

  // Breakdown quiz
  const byCh = {}, byProfile = {}, byUtm = {};
  quizW1.forEach(r => {
    byCh[r.source_channel || 'n/d'] = (byCh[r.source_channel || 'n/d'] || 0) + 1;
    byProfile[r.need_profile || 'n/d'] = (byProfile[r.need_profile || 'n/d'] || 0) + 1;
    const utm = [r.utm_source, r.utm_medium].filter(Boolean).join('/') || 'direct';
    byUtm[utm] = (byUtm[utm] || 0) + 1;
  });

  // Quiz per giorno
  const quizPerDay = groupByDay(quizW1);
  const callPerDay = groupByDay(callW1);
  const calcPerDay = groupByDay(calcW1);

  // Conversion rate
  const convRate = qN > 0 ? ((cN / qN) * 100).toFixed(1) : '0';

  let msg = `🎯 *FUNNEL 362gradi — Settimana ${W1_LABEL}*\n\n`;

  msg += `📊 *Riepilogo*\n`;
  msg += `${emojiTrend(qN, quizW2Count)} Quiz: *${qN}* (W-1: ${quizW2Count}, ${pctDelta(qN, quizW2Count)})\n`;
  msg += `${emojiTrend(cN, callW2Count)} Call: *${cN}* (W-1: ${callW2Count}, ${pctDelta(cN, callW2Count)})\n`;
  msg += `${emojiTrend(kN, calcW2Count)} Calcolatore: *${kN}* (W-1: ${calcW2Count}, ${pctDelta(kN, calcW2Count)})\n`;
  msg += `🎯 Conv quiz→call: *${convRate}%*\n`;

  // Per giorno
  msg += `\n📅 *Quiz per giorno*\n`;
  if (quizPerDay.length) {
    quizPerDay.forEach(([d, n]) => { msg += `   ${ddmm(d)}  ${n}\n`; });
  } else msg += `   _nessuno_\n`;

  msg += `\n📅 *Call per giorno*\n`;
  if (callPerDay.length) {
    callPerDay.forEach(([d, n]) => { msg += `   ${ddmm(d)}  ${n}\n`; });
  } else msg += `   _nessuna_\n`;

  msg += `\n📅 *Calcolatore per giorno*\n`;
  if (calcPerDay.length) {
    calcPerDay.forEach(([d, n]) => { msg += `   ${ddmm(d)}  ${n}\n`; });
  } else msg += `   _nessuno_\n`;

  // Breakdown canale
  if (qN > 0) {
    msg += `\n🔗 *Quiz per canale (top 6)*\n`;
    Object.entries(byCh).sort((a,b)=>b[1]-a[1]).slice(0, 6).forEach(([k,v]) => {
      const pct = ((v/qN)*100).toFixed(0);
      msg += `   • ${k}: ${v} (${pct}%)\n`;
    });
    msg += `\n👤 *Profili emersi*\n`;
    Object.entries(byProfile).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => {
      msg += `   • ${k}: ${v}\n`;
    });
  }

  if (cN > 0) {
    msg += `\n📞 *Dettaglio call (${cN})*\n`;
    callW1.slice(0, 12).forEach(r => {
      const name = r.name || '(anon)';
      const email = r.email || '—';
      const src = [r.utm_source, r.utm_medium].filter(Boolean).join('/') || 'direct';
      msg += `   • ${name} <${email}> — ${src}\n`;
    });
    if (cN > 12) msg += `   _...+${cN - 12}_\n`;
  }

  if (qN === 0 && cN === 0 && kN === 0) {
    msg += `\n_Nessuna attività tracciata nella settimana._`;
  }

  console.log(msg);
  await sendTelegram(msg);
  console.log('\n✅ Report funnel inviato');
})().catch(e => { console.error('❌', e); process.exit(1); });
