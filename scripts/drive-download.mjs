#!/usr/bin/env node
/**
 * drive-download.mjs — Scarica video da Google Drive (cartella condivisa con link)
 *
 * Usa gdown (Python) per gestire file grandi e conferme Google.
 * Fallback: fetch diretto per file piccoli.
 *
 * Uso:
 *   node scripts/drive-download.mjs --folder-id=XXXXX --output=tmp/videos
 *   node scripts/drive-download.mjs --url="https://drive.google.com/drive/folders/XXX" --output=tmp/videos
 *   node scripts/drive-download.mjs --file-url="https://drive.google.com/file/d/XXX/view" --output=tmp/videos
 */

import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const getArg = (name) => {
  const a = args.find(a => a.startsWith(`--${name}=`));
  return a ? a.split('=').slice(1).join('=') : null;
};

const OUTPUT_DIR = getArg('output') || 'tmp/videos';
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function extractFolderId(input) {
  const m = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  // assume gia un ID
  if (/^[a-zA-Z0-9_-]{10,}$/.test(input)) return input;
  return null;
}

function extractFileId(input) {
  const m = input.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  const m2 = input.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2) return m2[1];
  if (/^[a-zA-Z0-9_-]{10,}$/.test(input)) return input;
  return null;
}

function runGdown(gdownArgs) {
  const result = spawnSync('gdown', gdownArgs, {
    encoding: 'utf-8',
    timeout: 600000, // 10 min per file grandi
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: OUTPUT_DIR,
  });
  if (result.stdout) console.log(result.stdout);
  if (result.stderr) console.error(result.stderr);
  if (result.status !== 0) {
    throw new Error(`gdown fallito (exit ${result.status})`);
  }
}

async function main() {
  // Verifica gdown installato
  try {
    execSync('gdown --version', { encoding: 'utf-8', stdio: 'pipe' });
  } catch {
    console.error('gdown non installato. Installa con: pip install gdown');
    process.exit(1);
  }

  const folderInput = getArg('folder-id') || getArg('folder-url');
  const fileInput = getArg('file-url') || getArg('file-id');
  const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];

  if (folderInput) {
    const folderId = extractFolderId(folderInput);
    if (!folderId) {
      console.error(`ID cartella non valido: ${folderInput}`);
      process.exit(1);
    }
    console.log(`Scarico video dalla cartella Drive: ${folderId}`);
    console.log(`Output: ${OUTPUT_DIR}\n`);

    // gdown --folder scarica tutto il contenuto della cartella condivisa
    runGdown(['--folder', `https://drive.google.com/drive/folders/${folderId}`, '--remaining-ok']);

    // Filtra solo video
    const downloaded = fs.readdirSync(OUTPUT_DIR)
      .filter(f => videoExts.some(ext => f.toLowerCase().endsWith(ext)));

    if (!downloaded.length) {
      console.error('Nessun video trovato nella cartella');
      process.exit(1);
    }

    console.log(`\n${downloaded.length} video scaricati:`);
    downloaded.forEach(f => {
      const size = (fs.statSync(path.join(OUTPUT_DIR, f)).size / 1024 / 1024).toFixed(1);
      console.log(`  ${f} (${size} MB)`);
    });

  } else if (fileInput) {
    const fileId = extractFileId(fileInput);
    if (!fileId) {
      console.error(`ID file non valido: ${fileInput}`);
      process.exit(1);
    }
    console.log(`Scarico file: ${fileId}`);
    runGdown([`https://drive.google.com/uc?id=${fileId}`]);

    const downloaded = fs.readdirSync(OUTPUT_DIR).filter(f => !f.startsWith('.'));
    console.log(`\nFile scaricato: ${downloaded.join(', ')}`);

  } else {
    console.error('Specifica --folder-id=XXX o --file-url=XXX');
    process.exit(1);
  }
}

main().catch(e => { console.error('Errore:', e.message); process.exit(1); });
