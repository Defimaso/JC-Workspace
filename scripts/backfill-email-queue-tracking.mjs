#!/usr/bin/env node
/**
 * backfill-email-queue-tracking.mjs
 * Popola email_queue.opened_at e clicked_at usando email_events storici.
 * Idempotente: aggiorna solo righe ancora null.
 */

const SUPABASE_URL = 'https://ppbbqchycxffsfavtsjp.supabase.co';
const SRK = process.env.SUPABASE_SERVICE_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYmJxY2h5Y3hmZnNmYXZ0c2pwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ0NDA1MCwiZXhwIjoyMDg2MDIwMDUwfQ.d8SK9ncgnkdTBP1qciJpFkwCNlIPLVm34WUtVJkJMzk';
const H = { apikey: SRK, Authorization: `Bearer ${SRK}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' };

async function getJSON(p) {
  const r = await fetch(SUPABASE_URL + p, { headers: { apikey: SRK, Authorization: `Bearer ${SRK}` } });
  if (!r.ok) throw new Error(`${r.status}: ${await r.text()}`);
  return r.json();
}

async function paginate(basePath, pageSize = 1000) {
  const all = [];
  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;
    const r = await fetch(SUPABASE_URL + basePath, {
      headers: { apikey: SRK, Authorization: `Bearer ${SRK}`, Range: `${from}-${to}` },
    });
    if (!r.ok) throw new Error(`${r.status}: ${await r.text()}`);
    const rows = await r.json();
    all.push(...rows);
    if (rows.length < pageSize) break;
  }
  return all;
}

(async () => {
  console.log('🔄 Backfill email_queue.opened_at / clicked_at da email_events...');

  // 1. Tutti gli eventi 'open' → mappa queue_id → first event timestamp
  const opens = await paginate(`/rest/v1/email_events?select=queue_id,created_at&event_type=eq.open&queue_id=not.is.null&order=created_at.asc`);
  const clicks = await paginate(`/rest/v1/email_events?select=queue_id,created_at&event_type=eq.click&queue_id=not.is.null&order=created_at.asc`);

  console.log(`📥 ${opens.length} open events, ${clicks.length} click events letti`);

  const firstOpen = new Map();
  opens.forEach(e => { if (!firstOpen.has(e.queue_id)) firstOpen.set(e.queue_id, e.created_at); });
  const firstClick = new Map();
  clicks.forEach(e => { if (!firstClick.has(e.queue_id)) firstClick.set(e.queue_id, e.created_at); });

  console.log(`📊 Unique queue_id: ${firstOpen.size} con open, ${firstClick.size} con click`);

  // 2. UPDATE batch per opens
  let updatedOpens = 0, updatedClicks = 0;
  for (const [qid, ts] of firstOpen) {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/email_queue?id=eq.${qid}&opened_at=is.null`,
      { method: 'PATCH', headers: H, body: JSON.stringify({ opened_at: ts }) }
    );
    if (r.ok) updatedOpens++;
    else if (r.status !== 404) console.error('open err', qid, await r.text());
  }
  for (const [qid, ts] of firstClick) {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/email_queue?id=eq.${qid}&clicked_at=is.null`,
      { method: 'PATCH', headers: H, body: JSON.stringify({ clicked_at: ts }) }
    );
    if (r.ok) updatedClicks++;
    else if (r.status !== 404) console.error('click err', qid, await r.text());
  }

  console.log(`✅ Backfill completato: ${updatedOpens} righe opened_at, ${updatedClicks} righe clicked_at aggiornate`);
})().catch(e => { console.error('❌', e); process.exit(1); });
