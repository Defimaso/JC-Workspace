/**
 * Vercel Cron — WA Monitor health check.
 * Sostituisce il workflow n8n "Baileys Health Check".
 *
 * Logica:
 * 1) Legge l'ultimo `created_at` da coach_messages
 * 2) Se > 1 ora E in orario lavorativo (8-22 IT) → alert Telegram
 * 3) Solo 1 alert per giorno (idempotente via marker in tabella `health_marker`)
 *
 * Schedule: ogni 15 min
 * Env: SUPABASE_SERVICE_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */

const SUPABASE_URL = 'https://ppbbqchycxffsfavtsjp.supabase.co';
const SRK = process.env.SUPABASE_SERVICE_KEY;
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHATS = [process.env.TELEGRAM_CHAT_ID || '489480689', process.env.TELEGRAM_CHAT_ID_2 || '403582502'];

const HS = { apikey: SRK, Authorization: `Bearer ${SRK}`, 'Content-Type': 'application/json' };

async function tgSend(text) {
  for (const chat of TG_CHATS) {
    try {
      await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chat, text, parse_mode: 'Markdown' }),
      });
    } catch {}
  }
}

function nowItalyHour() {
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', hour: 'numeric', hour12: false });
  return Number(fmt.format(new Date()));
}

function todayKey() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export default async function handler(req, res) {
  const auth = req.headers.authorization || '';
  const queryToken = req.query?.token || '';
  const cronSecret = process.env.CRON_SECRET || '';
  const ok = (auth === `Bearer ${cronSecret}`) || (cronSecret && queryToken === cronSecret) || !cronSecret;
  if (!ok) return res.status(401).json({ error: 'unauthorized' });

  if (!SRK || !TG_TOKEN) return res.status(500).json({ error: 'missing env' });

  try {
    // Orario lavorativo (8-22 IT)
    const hour = nowItalyHour();
    if (hour < 8 || hour >= 22) {
      return res.status(200).json({ ok: true, skipped: 'fuori orario', hour });
    }

    // Ultimo messaggio coach
    const r = await fetch(`${SUPABASE_URL}/rest/v1/coach_messages?select=created_at&order=created_at.desc&limit=1`, { headers: HS });
    if (!r.ok) throw new Error('coach_messages query failed: ' + r.status);
    const arr = await r.json();
    if (!arr.length) {
      return res.status(200).json({ ok: true, status: 'no_messages_yet' });
    }
    const lastIso = arr[0].created_at;
    const ageMs = Date.now() - new Date(lastIso).getTime();
    const ageMin = Math.round(ageMs / 60000);

    // Soglia: 60 min
    if (ageMin < 60) {
      return res.status(200).json({ ok: true, status: 'healthy', last_msg_min_ago: ageMin });
    }

    // Idempotent: 1 alert ogni 4h max (usa funnel_events come marker)
    const fourHoursAgo = new Date(Date.now() - 4 * 3600_000).toISOString();
    const seenR = await fetch(`${SUPABASE_URL}/rest/v1/funnel_events?select=id&event_type=eq.wa_monitor_alert&created_at=gte.${fourHoursAgo}&limit=1`, { headers: HS });
    let alreadySent = false;
    if (seenR.ok) {
      const seen = await seenR.json();
      alreadySent = Array.isArray(seen) && seen.length > 0;
    }
    if (alreadySent) {
      return res.status(200).json({ ok: true, status: 'down', last_msg_min_ago: ageMin, alert_skipped: 'sent_within_4h' });
    }

    // Send alert
    const msg = [
      `🚨 *WA MONITOR — POSSIBILE DOWN*`,
      ``,
      `Ultimo messaggio coach_messages: *${ageMin} min fa*`,
      `(soglia: 60 min in orario 8-22 IT)`,
      ``,
      `🔧 *Azione:*`,
      `\`ssh root@91.99.192.47\``,
      `\`systemctl status wa-monitor\``,
      `\`systemctl restart wa-monitor\``,
      ``,
      `Console: console.hetzner.com`,
    ].join('\n');
    await tgSend(msg);

    // Save marker in funnel_events
    await fetch(`${SUPABASE_URL}/rest/v1/funnel_events`, {
      method: 'POST',
      headers: { ...HS, Prefer: 'return=minimal' },
      body: JSON.stringify({
        event_type: 'wa_monitor_alert',
        source_detail: 'vercel-cron-healthcheck',
        metadata: { last_msg_min_ago: ageMin, last_msg_iso: lastIso },
      }),
    }).catch(() => {});

    return res.status(200).json({ ok: true, status: 'down', last_msg_min_ago: ageMin, alert_sent: true });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}
