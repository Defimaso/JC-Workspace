/**
 * Vercel Cron — polla Calendly API ogni 15 min, scrive su call_bookings, manda alert Telegram.
 *
 * Sostituisce il workflow n8n PnTaByS1p2RIbgq4 (saturo per execution limit).
 *
 * Schedule: vercel.json `0,15,30,45 * * * *`
 * Env: SUPABASE_SERVICE_KEY, CALENDLY_TOKEN, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_CHAT_ID_2
 */

const SUPABASE_URL = 'https://ppbbqchycxffsfavtsjp.supabase.co';
const SRK = process.env.SUPABASE_SERVICE_KEY;
const CAL_TOKEN = process.env.CALENDLY_TOKEN;
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHATS = [process.env.TELEGRAM_CHAT_ID || '489480689', process.env.TELEGRAM_CHAT_ID_2 || '403582502'];

const HS = { apikey: SRK, Authorization: `Bearer ${SRK}`, 'Content-Type': 'application/json' };
const HC = { Authorization: `Bearer ${CAL_TOKEN}`, 'Content-Type': 'application/json' };

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

function formatIt(iso) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('it-IT', {
      timeZone: 'Europe/Rome',
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso));
  } catch { return iso; }
}

async function getUserAndOrg() {
  const r = await fetch('https://api.calendly.com/users/me', { headers: HC });
  const j = await r.json();
  if (!r.ok) throw new Error('Calendly users/me: ' + JSON.stringify(j));
  return { userUri: j.resource.uri, orgUri: j.resource.current_organization };
}

async function fetchInviteeForEvent(eventUri) {
  const r = await fetch(`${eventUri}/invitees`, { headers: HC });
  if (!r.ok) return null;
  const j = await r.json();
  return j.collection?.[0] || null;
}

async function listRecentEvents(orgUri, minutesBack = 60) {
  const minStart = new Date(Date.now() - minutesBack * 60_000).toISOString();
  const url = `https://api.calendly.com/scheduled_events?organization=${encodeURIComponent(orgUri)}&min_start_time=${minStart}&sort=start_time:desc&count=50`;
  const r = await fetch(url, { headers: HC });
  const j = await r.json();
  if (!r.ok) throw new Error('Calendly scheduled_events: ' + JSON.stringify(j));
  return j.collection || [];
}

async function alreadyTracked(calendlyEventUri) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/call_bookings?select=id&calendly_event_uri=eq.${encodeURIComponent(calendlyEventUri)}&limit=1`, { headers: HS });
  if (!r.ok) return false;
  const arr = await r.json();
  return Array.isArray(arr) && arr.length > 0;
}

async function findQuizLead(email, name) {
  // Match per email esatto
  if (email) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/quiz_leads?select=id,name,email&email=eq.${encodeURIComponent(email)}&limit=1`, { headers: HS });
    if (r.ok) {
      const arr = await r.json();
      if (arr.length > 0) return { id: arr[0].id, matchType: 'email' };
    }
  }
  // Match per nome
  if (name && name.toLowerCase() !== 'sconosciuto') {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/quiz_leads?select=id,name,email&name=ilike.${encodeURIComponent(name)}&limit=5&order=created_at.desc`, { headers: HS });
    if (r.ok) {
      const arr = await r.json();
      if (arr.length === 1) return { id: arr[0].id, matchType: 'name', otherEmail: arr[0].email };
      if (arr.length > 1) return { id: null, matchType: 'name_ambiguous', count: arr.length };
    }
  }
  return { id: null, matchType: 'unmatched' };
}

async function insertBooking(record) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/call_bookings`, {
    method: 'POST',
    headers: { ...HS, Prefer: 'return=minimal' },
    body: JSON.stringify(record),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`insert call_bookings: ${r.status} ${t.slice(0, 200)}`);
  }
}

async function markLeadBooked(leadId) {
  if (!leadId) return;
  await fetch(`${SUPABASE_URL}/rest/v1/quiz_leads?id=eq.${leadId}`, {
    method: 'PATCH',
    headers: { ...HS, Prefer: 'return=minimal' },
    body: JSON.stringify({ call_booked: true }),
  });
}

async function insertFunnelEvent(rec) {
  await fetch(`${SUPABASE_URL}/rest/v1/funnel_events`, {
    method: 'POST',
    headers: { ...HS, Prefer: 'return=minimal' },
    body: JSON.stringify(rec),
  }).catch(() => {});
}

export default async function handler(req, res) {
  // Auth
  const auth = req.headers.authorization || '';
  const queryToken = req.query?.token || '';
  const cronSecret = process.env.CRON_SECRET || '';
  const ok = (auth === `Bearer ${cronSecret}`) || (cronSecret && queryToken === cronSecret) || !cronSecret;
  if (!ok) return res.status(401).json({ error: 'unauthorized' });

  if (!SRK || !CAL_TOKEN || !TG_TOKEN) {
    return res.status(500).json({ error: 'missing env vars', need: ['SUPABASE_SERVICE_KEY','CALENDLY_TOKEN','TELEGRAM_BOT_TOKEN'] });
  }

  try {
    const { orgUri } = await getUserAndOrg();
    const events = await listRecentEvents(orgUri, 60);

    const results = { processed: 0, new: 0, skipped: 0, errors: [] };

    for (const ev of events) {
      if (ev.status === 'canceled') continue;
      try {
        const exists = await alreadyTracked(ev.uri);
        if (exists) { results.skipped++; continue; }

        const invitee = await fetchInviteeForEvent(ev.uri);
        if (!invitee) { results.skipped++; continue; }

        const name = invitee.name || invitee.first_name || '';
        const email = (invitee.email || '').toLowerCase().trim();
        const tracking = invitee.tracking || {};
        const utm_source = tracking.utm_source || '';
        const utm_medium = tracking.utm_medium || '';
        const utm_campaign = tracking.utm_campaign || '';
        const utm_content = tracking.utm_content || '';
        const referrer_url = tracking.referrer_url || '';
        const sourceLabel = utm_campaign || utm_source || (referrer_url ? `referrer:${referrer_url}` : 'diretto');

        const match = await findQuizLead(email, name);

        await insertBooking({
          calendly_event_uri: ev.uri,
          calendly_invitee_uri: invitee.uri,
          email,
          name,
          event_name: ev.name || 'Call 362',
          scheduled_at: ev.start_time || null,
          status: 'booked',
          source: sourceLabel,
          utm_source,
          utm_medium,
          utm_campaign,
          referrer_url,
          questions_answers: invitee.questions_and_answers || [],
          quiz_lead_id: match.id,
          match_type: match.matchType,
        });

        await markLeadBooked(match.id);
        await insertFunnelEvent({
          event_type: 'call_booked',
          email,
          name,
          utm_source,
          utm_medium,
          utm_campaign,
          source_detail: `VERCEL-CRON: ${ev.name || 'Call 362'}`,
          quiz_lead_id: match.id,
          metadata: { match_type: match.matchType, calendly_event_uri: ev.uri, via: 'vercel-cron-poller' },
        });

        const matchEmoji = match.matchType === 'email' ? '✅' : match.matchType === 'name' ? '⚠️' : '❌';
        const matchLabel = match.matchType === 'email' ? 'Quiz lead trovato'
          : match.matchType === 'name' ? `Match per nome (email quiz: ${match.otherEmail})`
          : match.matchType === 'name_ambiguous' ? `Match ambiguo (${match.count} lead stesso nome)`
          : 'Lead SENZA quiz';

        const tgLines = [
          '🎯 *CALL PRENOTATA — 362gradi*',
          '',
          `👤 ${name || 'Sconosciuto'}`,
          email ? `📧 ${email}` : '',
          `📞 ${ev.name || 'Call 362'}`,
          ev.start_time ? `🗓 ${formatIt(ev.start_time)}` : '',
          `📍 Fonte: ${sourceLabel}`,
          utm_campaign ? `🌐 Campaign: ${utm_campaign}` : '',
          utm_content ? `🎬 Content: ${utm_content}` : '',
          referrer_url ? `🔗 Da: ${referrer_url}` : '',
          `${matchEmoji} ${matchLabel}`,
        ].filter(Boolean);

        const qa = (invitee.questions_and_answers || []).filter((q) => q.answer);
        if (qa.length > 0) {
          tgLines.push('', '📝 *Risposte:*');
          for (const q of qa.slice(0, 5)) tgLines.push(`   ${q.question}: ${q.answer}`);
        }
        await tgSend(tgLines.join('\n'));

        results.new++;
      } catch (e) {
        results.errors.push(String(e.message || e).slice(0, 200));
      }
      results.processed++;
    }

    return res.status(200).json({ ok: true, ...results });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}
