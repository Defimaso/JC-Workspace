#!/usr/bin/env node
/**
 * report-daily-social.mjs
 * Report mattutino Telegram — 4 account IG, settimana precedente con trend.
 *
 *   - Snapshot live followers_count → salvato in social_snapshots
 *   - Delta ieri → oggi (snapshot DB precedente, ~24h)
 *   - Trend 7 giorni (Insights Meta) per ogni account
 *
 * Uso: node scripts/report-daily-social.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const SUPABASE_URL = 'https://ppbbqchycxffsfavtsjp.supabase.co';
const SRK = process.env.SUPABASE_SERVICE_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYmJxY2h5Y3hmZnNmYXZ0c2pwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ0NDA1MCwiZXhwIjoyMDg2MDIwMDUwfQ.d8SK9ncgnkdTBP1qciJpFkwCNlIPLVm34WUtVJkJMzk';

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7553279856:AAEAIw57fK5TNVSu7l0FYhYaDq9_obsupNU';
const TG_CHATS = [process.env.TELEGRAM_CHAT_ID || '489480689', process.env.TELEGRAM_CHAT_ID_2 || '403582502'];

function readEnvFile(fp) {
  const out = {};
  if (!fs.existsSync(fp)) return out;
  fs.readFileSync(fp, 'utf8').split(/\r?\n/).forEach(l => {
    const m = l.match(/^([A-Z0-9_]+)="?([^"\r\n]+)"?\s*$/);
    if (m) out[m[1]] = m[2];
  });
  return out;
}

const envMasoLab = readEnvFile(path.resolve('progetti/MasoLab/.env.production'));
const envJC = readEnvFile(path.resolve('.env'));

const ACCOUNTS = [
  { label: 'ilaria_berry',    igId: '17841400655863733', token: process.env.META_362_TOKEN || envJC.META_362_TOKEN, kind: 'graph_fb' },
  { label: '362gradi.ae',     token: process.env.IG_TOKEN_362GRADI || envMasoLab.IG_TOKEN_362GRADI, kind: 'ig_direct' },
  { label: '_marco_masoero_', token: process.env.IG_TOKEN_MARCO    || envMasoLab.IG_TOKEN_MARCO,    kind: 'ig_direct' },
  { label: 'defimaso',        token: process.env.IG_TOKEN_DEFIMASO || envMasoLab.IG_TOKEN_DEFIMASO, kind: 'ig_direct' },
];

const H = { apikey: SRK, Authorization: `Bearer ${SRK}`, 'Content-Type': 'application/json' };
const sinceStr = new Date(Date.now() - 8 * 86400_000).toISOString().slice(0, 10);
const untilStr = new Date(Date.now() + 86400_000).toISOString().slice(0, 10);

async function igDirect(token, p) {
  const r = await fetch(`https://graph.instagram.com/v18.0/${p}${p.includes('?') ? '&' : '?'}access_token=${token}`);
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j;
}
async function graphFb(token, p) {
  const r = await fetch(`https://graph.facebook.com/v18.0/${p}${p.includes('?') ? '&' : '?'}access_token=${token}`);
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j;
}

async function fetchLive(acc) {
  if (acc.kind === 'graph_fb') {
    const j = await graphFb(acc.token, `${acc.igId}?fields=username,followers_count,media_count`);
    return { igId: acc.igId, username: j.username, followers: j.followers_count, media: j.media_count };
  }
  const me = await igDirect(acc.token, 'me?fields=id,username');
  const j = await igDirect(acc.token, `${me.id}?fields=username,followers_count,media_count`);
  return { igId: me.id, username: j.username, followers: j.followers_count, media: j.media_count };
}

async function fetchInsights7d(acc, igId) {
  const qs = `insights?metric=follower_count&period=day&since=${sinceStr}&until=${untilStr}`;
  try {
    const j = acc.kind === 'graph_fb'
      ? await graphFb(acc.token, `${igId}/${qs}`)
      : await igDirect(acc.token, `${igId}/${qs}`);
    const values = (j.data?.[0]?.values || []).sort((a, b) => a.end_time.localeCompare(b.end_time));
    return values.slice(-7);
  } catch { return null; }
}

async function insertSnapshot(row) {
  await fetch(`${SUPABASE_URL}/rest/v1/social_snapshots`, {
    method: 'POST', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify(row),
  }).catch(() => {});
}

async function getPreviousSnapshot(label) {
  const minAgoIso = new Date(Date.now() - 20 * 3600_000).toISOString();
  const maxAgoIso = new Date(Date.now() - 32 * 3600_000).toISOString();
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/social_snapshots?account=eq.${encodeURIComponent(label)}` +
    `&captured_at=gte.${maxAgoIso}&captured_at=lte.${minAgoIso}` +
    `&followers_count=not.is.null&order=captured_at.desc&limit=1`,
    { headers: H }
  );
  const d = await r.json();
  return d[0] || null;
}

async function getSnapshot7dAgo(label) {
  // snapshot più vecchio di 6.5 giorni come baseline settimana
  const olderIso = new Date(Date.now() - 7 * 86400_000).toISOString();
  const newerIso = new Date(Date.now() - 6.5 * 86400_000).toISOString();
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/social_snapshots?account=eq.${encodeURIComponent(label)}` +
    `&captured_at=gte.${olderIso}&captured_at=lte.${newerIso}` +
    `&followers_count=not.is.null&order=captured_at.asc&limit=1`,
    { headers: H }
  );
  const d = await r.json();
  return d[0] || null;
}

async function sendTelegram(text) {
  for (const chat of TG_CHATS) {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: 'Markdown' }),
    }).catch(() => {});
  }
}

function fmtDelta(n) {
  if (n === null || n === undefined) return '—';
  if (n > 0) return `+${n}`;
  return String(n);
}
function fmtInt(n) { return Number(n).toLocaleString('it-IT'); }
function fmtDay(iso) {
  return new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: 'short' }).format(new Date(iso));
}
function emojiDelta(n) {
  if (n > 0) return '📈';
  if (n < 0) return '📉';
  return '➖';
}

(async () => {
  const dateLabel = new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  let msg = `📸 *FOLLOWER — ${dateLabel}*\n`;

  for (const acc of ACCOUNTS) {
    msg += `\n━━━━━━━━━━━━━━\n`;
    if (!acc.token) {
      msg += `⚠️ *@${acc.label}* — token mancante\n`;
      continue;
    }
    let live;
    try { live = await fetchLive(acc); }
    catch (e) {
      msg += `⚠️ *@${acc.label}* — token scaduto\n   \`${String(e.message).slice(0, 70)}\`\n`;
      await insertSnapshot({ account: acc.label, captured_at: new Date().toISOString(), source: acc.kind, error: String(e.message).slice(0, 400) });
      continue;
    }

    await insertSnapshot({
      account: acc.label, ig_user_id: live.igId, username: live.username,
      followers_count: live.followers, media_count: live.media,
      captured_at: new Date().toISOString(), source: acc.kind,
    });

    const [prev, weekAgo, insights] = await Promise.all([
      getPreviousSnapshot(acc.label),
      getSnapshot7dAgo(acc.label),
      fetchInsights7d(acc, live.igId),
    ]);

    msg += `\n📌 *@${live.username}* — ${fmtInt(live.followers)}\n`;

    if (prev) {
      const d = live.followers - prev.followers_count;
      msg += `${emojiDelta(d)} Ieri → oggi: *${fmtDelta(d)}*\n`;
    }
    if (weekAgo) {
      const d7 = live.followers - weekAgo.followers_count;
      msg += `${emojiDelta(d7)} 7gg: *${fmtDelta(d7)}* (snapshot)\n`;
    }
    if (insights && insights.length) {
      const total = insights.reduce((a, v) => a + (v.value || 0), 0);
      const avg = Math.round(total / insights.length);
      msg += `\n*Trend Insights 7gg:* ${fmtDelta(total)} _(media ${fmtDelta(avg)}/gg)_\n`;
      insights.forEach(v => {
        const day = fmtDay(v.end_time);
        msg += `   ${day}  ${fmtDelta(v.value || 0)}\n`;
      });
    } else if (insights === null) {
      msg += `_(insights non disponibili)_\n`;
    }
    if (!prev && !weekAgo && (!insights || !insights.length)) {
      msg += `_(baseline acquisita, dati 7gg dal prossimo ciclo)_\n`;
    }
  }

  msg += `\n━━━━━━━━━━━━━━\n_Insights Meta lag 24-48h. Delta snapshot real-time._`;

  console.log(msg);
  await sendTelegram(msg);
  console.log('\n✅ Report social inviato');
})().catch(e => { console.error('❌', e); process.exit(1); });
