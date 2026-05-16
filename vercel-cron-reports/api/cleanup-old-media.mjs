/**
 * Vercel Cron — pulisce file vecchi dal bucket ig-media.
 * Strategia: cancella i file collegati a ig_schedule.published=true con publish_at piu vecchio di 30 giorni.
 * Schedulato ogni giorno alle 03:00 UTC.
 *
 * Test manuale: GET /api/cleanup-old-media
 */

const SUPABASE_URL = 'https://ppbbqchycxffsfavtsjp.supabase.co';
const SRK = process.env.SUPABASE_SERVICE_KEY;

const H = { apikey: SRK, Authorization: `Bearer ${SRK}`, 'Content-Type': 'application/json' };

async function fetchJson(path, init = {}) {
  const r = await fetch(SUPABASE_URL + path, { ...init, headers: { ...H, ...(init.headers || {}) } });
  const text = await r.text();
  if (!r.ok) throw new Error(`${r.status}: ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
}

async function listOldFiles() {
  const cutoff = new Date(Date.now() - 30 * 86400_000).toISOString();
  const records = await fetchJson(`/rest/v1/ig_schedule?select=id,publish_at,file_key,files&published=eq.true&publish_at=lt.${cutoff}`);

  const paths = new Set();
  for (const r of records) {
    if (r.file_key) paths.add(r.file_key);
    if (Array.isArray(r.files)) r.files.forEach((f) => paths.add(f));
  }
  return { records, paths: Array.from(paths) };
}

async function deleteBatch(paths) {
  if (!paths.length) return 0;
  const url = `${SUPABASE_URL}/storage/v1/object/ig-media`;
  const r = await fetch(url, { method: 'DELETE', headers: H, body: JSON.stringify({ prefixes: paths }) });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`storage delete: ${r.status} ${t.slice(0, 200)}`);
  }
  const data = await r.json();
  return Array.isArray(data) ? data.length : 0;
}

export default async function handler(req, res) {
  // Auth
  const auth = req.headers.authorization || '';
  const queryToken = req.query?.token || '';
  const cronSecret = process.env.CRON_SECRET || '';
  const ok = (auth === `Bearer ${cronSecret}`) || (cronSecret && queryToken === cronSecret) || !cronSecret;
  if (!ok) { res.status(401).json({ error: 'unauthorized' }); return; }

  if (!SRK) { res.status(500).json({ error: 'SUPABASE_SERVICE_KEY missing' }); return; }

  try {
    const { records, paths } = await listOldFiles();

    let deleted = 0;
    const errors = [];
    for (let i = 0; i < paths.length; i += 100) {
      const batch = paths.slice(i, i + 100);
      try { deleted += await deleteBatch(batch); }
      catch (e) { errors.push(String(e.message || e)); }
    }

    res.status(200).json({
      ok: true,
      candidate_records: records.length,
      candidate_paths: paths.length,
      deleted,
      errors: errors.slice(0, 5),
    });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
}
