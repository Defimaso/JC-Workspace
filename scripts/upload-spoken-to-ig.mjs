#!/usr/bin/env node
/**
 * upload-spoken-to-ig.mjs — Carica video sottotitolati su Supabase ig_schedule
 *
 * Prende tutti i *-sub.mp4 da una cartella e li schedula come STORIES.
 * Le parti (part1, part2...) vengono schedulate in sequenza con 2 min di intervallo.
 *
 * Uso:
 *   node scripts/upload-spoken-to-ig.mjs --input=tmp/output --brand=marco --time=10:00
 *   node scripts/upload-spoken-to-ig.mjs --input=tmp/output --brand=marco --time=10:00,16:00
 */

import fs from 'fs';
import path from 'path';

const SUPA_URL = process.env.SUPABASE_URL || 'https://ppbbqchycxffsfavtsjp.supabase.co';
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYmJxY2h5Y3hmZnNmYXZ0c2pwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ0NDA1MCwiZXhwIjoyMDg2MDIwMDUwfQ.d8SK9ncgnkdTBP1qciJpFkwCNlIPLVm34WUtVJkJMzk';

const args = process.argv.slice(2);
const getArg = (name) => {
  const a = args.find(a => a.startsWith(`--${name}=`));
  return a ? a.split('=').slice(1).join('=') : null;
};

const INPUT_DIR = getArg('input') || 'tmp/output';
const brand = getArg('brand') || 'marco';
const times = (getArg('time') || '10:00').split(',');
const date = getArg('date') || new Date().toISOString().split('T')[0];
const dryRun = args.includes('--dry-run');

// CEST/CET detection
const dateObj = new Date(date + 'T12:00:00Z');
const month = dateObj.getMonth();
const day = dateObj.getDate();
const isCEST = (month > 2 && month < 9) || (month === 2 && day >= 29);
const utcOffset = isCEST ? 2 : 1;

function toUTC(oraIT, minIT = 0) {
  const h = parseInt(oraIT.split(':')[0]) - utcOffset;
  const m = parseInt(oraIT.split(':')[1] || '0') + minIT;
  return `${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00Z`;
}

async function uploadFile(filePath, fileKey) {
  const buf = fs.readFileSync(filePath);
  const mime = fileKey.endsWith('.mp4') ? 'video/mp4' : 'image/png';
  const r = await fetch(`${SUPA_URL}/storage/v1/object/ig-media/${fileKey}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPA_KEY}`,
      'apikey': SUPA_KEY,
      'Content-Type': mime,
      'x-upsert': 'true',
    },
    body: buf,
  });
  if (!r.ok) throw new Error(`Upload ${fileKey}: ${r.status} ${await r.text()}`);
}

async function insertRecord(item) {
  const r = await fetch(`${SUPA_URL}/rest/v1/ig_schedule`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPA_KEY}`,
      'apikey': SUPA_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(item),
  });
  if (!r.ok) throw new Error(`Insert: ${r.status} ${await r.text()}`);
  return (await r.json())[0];
}

async function main() {
  console.log(`\nUpload parlate sottotitolate → IG Schedule`);
  console.log(`Brand: ${brand} | Date: ${date} | Times: ${times.join(', ')} IT`);
  console.log(`Input: ${INPUT_DIR}`);
  if (dryRun) console.log('DRY RUN');

  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`Cartella non trovata: ${INPUT_DIR}`);
    process.exit(1);
  }

  // Trova tutti i -sub.mp4
  const allFiles = fs.readdirSync(INPUT_DIR)
    .filter(f => f.endsWith('-sub.mp4'))
    .sort();

  if (!allFiles.length) {
    console.error('Nessun file *-sub.mp4 trovato');
    process.exit(1);
  }

  // Raggruppa per video originale (le parti hanno -part1-sub.mp4, -part2-sub.mp4)
  const groups = {};
  for (const f of allFiles) {
    // 20260414_105149-part1-sub.mp4 → base = 20260414_105149
    // 20260414_105149-sub.mp4 → base = 20260414_105149
    const base = f.replace(/-part\d+-sub\.mp4$/, '').replace(/-sub\.mp4$/, '');
    if (!groups[base]) groups[base] = [];
    groups[base].push(f);
  }

  const groupKeys = Object.keys(groups).sort();
  console.log(`${allFiles.length} video (${groupKeys.length} gruppi) da schedulare\n`);

  let scheduled = 0;
  for (let g = 0; g < groupKeys.length; g++) {
    const baseTime = times[g % times.length]; // cicla gli orari se piu video che slot
    const parts = groups[groupKeys[g]];

    for (let p = 0; p < parts.length; p++) {
      const fileName = parts[p];
      const filePath = path.join(INPUT_DIR, fileName);
      const publishAt = toUTC(baseTime, p * 2); // 2 min tra le parti

      if (dryRun) {
        console.log(`  [DRY] ${baseTime} IT +${p * 2}min | ${fileName}`);
        continue;
      }

      try {
        console.log(`  Uploading ${fileName}...`);
        await uploadFile(filePath, fileName);
        const record = await insertRecord({
          account: brand,
          media_type: 'STORIES',
          file_key: fileName,
          publish_at: publishAt,
          caption: '',
          published: false,
        });
        console.log(`  OK ${baseTime} IT +${p * 2}min | ${fileName} | ID ${record.id}`);
        scheduled++;
      } catch (err) {
        console.error(`  ERRORE ${fileName}: ${err.message}`);
      }

      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log(`\n${scheduled} video schedulati su ig_schedule`);
}

main().catch(e => { console.error('Errore fatale:', e.message); process.exit(1); });
