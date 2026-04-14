/**
 * render-spoken-stories.mjs
 *
 * Pipeline automatico storie parlate IG:
 * 1. Trascrive con Whisper API
 * 2. Genera titolo con GPT
 * 3. Crea title overlay PNG con Playwright (HTML/CSS)
 * 4. Sottotitoli ASS stile CapCut: outline spessa, ombra, font bold, no box
 * 5. Compositing finale con FFmpeg
 *
 * Uso: node scripts/render-spoken-stories.mjs [--brand marco|defimaso|362gradi]
 */

import 'dotenv/config';
import { OpenAI } from 'openai';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

// ── Config ──────────────────────────────────────────────────────────────────
const IS_CI = !!process.env.CI;
const FFMPEG = process.env.FFMPEG_PATH || (IS_CI ? 'ffmpeg' : 'C:\\ffmpeg\\ffmpeg.exe');
const FFPROBE = process.env.FFPROBE_PATH || (IS_CI ? 'ffprobe' : 'C:\\ffmpeg\\ffprobe.exe');

const REPO_ROOT = IS_CI ? process.cwd() : 'C:\\Users\\motok\\Desktop\\JC';
const FONTS_DIR = path.join(REPO_ROOT, 'assets', 'fonts');

const DRIVE_ROOT = 'G:\\Il mio Drive\\Storie Parlate';

const BRANDS = {
  marco: {
    driveDir: path.join(DRIVE_ROOT, 'marco'),
    inputDir: 'contenuti/da-pubblicare/marco/storie-parlate/input',
    outputDir: 'contenuti/da-pubblicare/marco/storie-parlate',
    handle: '@_marco_masoero_',
    style: 'poster',
    titleFont: 'Playfair Display',
    titleFontFile: 'PlayfairDisplay-Black.woff2',
    titleFontFormat: 'woff2',
    titleSize: 72,
    titleColor: '#FFFFFF',
    titleBg: 'rgba(0,0,0,0.95)',
    titleBorder: 'none',
    titleAccent: '#FFFFFF',
    subFont: 'Playfair Display',
    subFontFile: 'PlayfairDisplay-Black.woff2',
    subFontFormat: 'woff2',
    subSize: 64,
    subColor: '&H00FFFFFF',
    subOutline: '&H00000000',
    subOutlineWidth: 7,
    subShadowColor: '&H80000000',
  },
  defimaso: {
    driveDir: path.join(DRIVE_ROOT, 'defimaso'),
    inputDir: 'contenuti/da-pubblicare/defimaso/storie-parlate/input',
    outputDir: 'contenuti/da-pubblicare/defimaso/storie-parlate',
    handle: '@defimaso',
    titleFont: 'Space Grotesk',
    titleFontFile: 'SpaceGrotesk.ttf',
    titleSize: 52,
    titleColor: '#d4a840',
    titleBg: 'linear-gradient(135deg, rgba(18,14,8,0.9) 0%, rgba(40,30,15,0.8) 100%)',
    titleBorder: '2px solid rgba(212,168,64,0.5)',
    titleAccent: '#d4a840',
    subFont: 'Inter',
    subFontFile: 'Inter.ttf',
    subSize: 82,
    subColor: '&H00C8DCE8',
    subOutline: '&H00080E12',
    subOutlineWidth: 7,
    subShadowColor: '&H80080E12',
  },
  '362gradi': {
    driveDir: path.join(DRIVE_ROOT, '362gradi'),
    inputDir: 'contenuti/da-pubblicare/362gradi/storie-parlate/input',
    outputDir: 'contenuti/da-pubblicare/362gradi/storie-parlate',
    handle: '@ilaria_berry',
    titleFont: 'Space Grotesk',
    titleFontFile: 'SpaceGrotesk.ttf',
    titleSize: 52,
    titleColor: '#FFFFFF',
    titleBg: 'linear-gradient(135deg, rgba(26,83,92,0.9) 0%, rgba(78,205,196,0.2) 100%)',
    titleBorder: '2px solid rgba(78,205,196,0.5)',
    titleAccent: '#4ECDC4',
    subFont: 'Inter',
    subFontFile: 'Inter.ttf',
    subSize: 82,
    subColor: '&H00FFFFFF',
    subOutline: '&H005C531A',
    subOutlineWidth: 7,
    subShadowColor: '&H805C531A',
  },
};

const ROOT = REPO_ROOT;
const brand = process.argv.includes('--brand')
  ? process.argv[process.argv.indexOf('--brand') + 1]
  : 'marco';

const cfg = BRANDS[brand];
if (!cfg) { console.error(`Brand "${brand}" non valido.`); process.exit(1); }

// Override input/output via CLI (es. --input=contenuti/da-pubblicare/aprile-2026/2026-04-14/marco)
const inputArg = process.argv.find(a => a.startsWith('--input='));
const outputArg = process.argv.find(a => a.startsWith('--output='));
const INPUT_DIR = inputArg
  ? path.isAbsolute(inputArg.slice(8)) ? inputArg.slice(8) : path.join(ROOT, inputArg.slice(8))
  : path.join(ROOT, cfg.inputDir);
const OUTPUT_DIR = outputArg
  ? path.isAbsolute(outputArg.slice(9)) ? outputArg.slice(9) : path.join(ROOT, outputArg.slice(9))
  : path.join(ROOT, cfg.outputDir);
fs.mkdirSync(INPUT_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const TRIM = !process.argv.includes('--no-trim'); // trim silenzi attivo di default

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Rileva segmenti di silenzio con FFmpeg silencedetect */
function detectSilences(filePath, minDuration = 0.4, noiseDB = -35) {
  const r = spawnSync(FFMPEG, [
    '-i', filePath,
    '-af', `silencedetect=noise=${noiseDB}dB:d=${minDuration}`,
    '-f', 'null', '-'
  ], { encoding: 'utf-8', timeout: 120000, stdio: ['pipe', 'pipe', 'pipe'] });

  const output = r.stderr || '';
  const silences = [];
  const starts = [...output.matchAll(/silence_start: ([\d.]+)/g)];
  const ends = [...output.matchAll(/silence_end: ([\d.]+)/g)];

  for (let i = 0; i < Math.min(starts.length, ends.length); i++) {
    silences.push({
      start: parseFloat(starts[i][1]),
      end: parseFloat(ends[i][1]),
    });
  }
  return silences;
}

/** Taglia i tempi morti dal video, lasciando 0.15s di padding per naturalezza */
function trimSilences(filePath, outputPath) {
  console.log(`  ✂️  Rilevamento silenzi...`);
  const silences = detectSilences(filePath);

  if (!silences.length) {
    console.log(`  ✂️  Nessun silenzio rilevato, skip trim`);
    return filePath;
  }

  // Ottieni durata totale
  const info = getVideoInfo(filePath);
  const duration = info.duration;

  // Calcola segmenti da TENERE (inversione dei silenzi)
  const PAD = 0.15; // padding per transizioni naturali
  const keeps = [];
  let pos = 0;

  for (const s of silences) {
    const silStart = Math.max(0, s.start + PAD);
    const silEnd = Math.min(duration, s.end - PAD);

    if (silStart - pos > 0.1) {
      keeps.push({ start: pos, end: silStart });
    }
    pos = silEnd;
  }
  if (duration - pos > 0.1) {
    keeps.push({ start: pos, end: duration });
  }

  if (keeps.length === 0) {
    console.log(`  ✂️  Niente da tagliare`);
    return filePath;
  }

  const totalKept = keeps.reduce((acc, k) => acc + (k.end - k.start), 0);
  const removed = duration - totalKept;
  console.log(`  ✂️  ${silences.length} silenzi → taglio ${removed.toFixed(1)}s (${duration.toFixed(1)}s → ${totalKept.toFixed(1)}s)`);

  if (removed < 0.5) {
    console.log(`  ✂️  Troppo poco da tagliare, skip`);
    return filePath;
  }

  // Genera filtro concat per FFmpeg
  const filterParts = keeps.map((k, i) =>
    `[0:v]trim=start=${k.start.toFixed(3)}:end=${k.end.toFixed(3)},setpts=PTS-STARTPTS[v${i}];` +
    `[0:a]atrim=start=${k.start.toFixed(3)}:end=${k.end.toFixed(3)},asetpts=PTS-STARTPTS[a${i}];`
  ).join('');

  const concatInputs = keeps.map((_, i) => `[v${i}][a${i}]`).join('');
  const filter = `${filterParts}${concatInputs}concat=n=${keeps.length}:v=1:a=1[outv][outa]`;

  const args = [
    '-y', '-i', filePath,
    '-filter_complex', filter,
    '-map', '[outv]', '-map', '[outa]',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
    '-c:a', 'aac', '-b:a', '128k',
    '-movflags', '+faststart',
    outputPath,
  ];

  const result = spawnSync(FFMPEG, args, {
    encoding: 'utf-8',
    timeout: 300000,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    console.error(`  ❌ Trim fallito, uso video originale`);
    return filePath;
  }

  console.log(`  ✂️  Trim OK`);
  return outputPath;
}

function getVideoInfo(filePath) {
  const r = spawnSync(FFPROBE, [
    '-v', 'quiet', '-print_format', 'json', '-show_streams', '-show_format', filePath
  ], { encoding: 'utf-8' });
  if (!r.stdout || r.status !== 0) throw new Error(`FFprobe fallito per ${filePath}`);
  const data = JSON.parse(r.stdout);
  if (!data.streams) throw new Error(`Nessun stream trovato in ${filePath} — file corrotto?`);
  const video = data.streams.find(s => s.codec_type === 'video');
  if (!video) throw new Error(`Nessuno stream video in ${filePath}`);
  return { width: video.width, height: video.height, duration: parseFloat(data.format.duration) };
}

function extractAudioIfNeeded(filePath) {
  const MAX = 24 * 1024 * 1024;
  if (fs.statSync(filePath).size <= MAX) return filePath;
  console.log(`  📦 Estraggo audio MP3...`);
  const audioPath = filePath.replace(/\.[^.]+$/, '_audio.mp3');
  spawnSync(FFMPEG, ['-y', '-i', filePath, '-vn', '-acodec', 'libmp3lame', '-ab', '64k', '-ar', '16000', '-ac', '1', audioPath],
    { encoding: 'utf-8', timeout: 60000 });
  return audioPath;
}

async function transcribe(filePath) {
  console.log(`  🎙️  Trascrizione...`);
  const audioFile = extractAudioIfNeeded(filePath);
  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFile),
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word'],
    language: 'it',
  });
  if (audioFile !== filePath) fs.unlinkSync(audioFile);
  return response;
}

function chunkWords(words, maxWords = 3) {
  const chunks = [];
  let i = 0;
  while (i < words.length) {
    const remaining = words.length - i;
    let take = Math.min(maxWords, remaining);
    if (remaining - take === 1) take = remaining;
    const chunk = words.slice(i, i + take);
    chunks.push({
      text: chunk.map(w => w.word).join(' '),
      start: chunk[0].start,
      end: chunk[chunk.length - 1].end,
    });
    i += take;
  }
  return chunks;
}

async function generateTitle(text) {
  console.log(`  🏷️  Generazione titolo...`);
  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Genera un titolo breve (max 4-5 parole) e d\'impatto per questa storia parlata Instagram. Solo il titolo. Italiano. Maiuscolo.' },
      { role: 'user', content: text }
    ],
    max_tokens: 20,
  });
  return resp.choices[0].message.content.trim().replace(/["""]/g, '');
}

// ── Title PNG (Playwright) ──────────────────────────────────────────────────

async function renderTitlePNG(title, videoW, videoH, outputPath) {
  const titleFontPath = path.join(FONTS_DIR, cfg.titleFontFile).replace(/\\/g, '/');
  const fontFormat = cfg.titleFontFormat || 'truetype';

  let html;
  if (cfg.style === 'poster') {
    console.log(`  🎨 Rendering titolo (stile poster)...`);
    const fontSize = Math.round(cfg.titleSize * videoW / 1080);
    const padV = Math.round(28 * videoW / 1080);
    const padH = Math.round(58 * videoW / 1080);
    const marginTop = Math.round(videoH * 0.14);

    html = `<!DOCTYPE html><html><head><style>
      @font-face { font-family: 'TF'; src: url('file:///${titleFontPath}') format('${fontFormat}'); font-weight: 900; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${videoW}px; height: ${videoH}px; background: transparent !important; }
      body { display: flex; flex-direction: column; align-items: center; font-family: 'TF', 'Segoe UI Emoji', Georgia, serif; }
      .pill { margin-top: ${marginTop}px; background: ${cfg.titleBg}; padding: ${padV}px ${padH}px; border-radius: 9999px; max-width: ${Math.round(videoW * 0.88)}px; display: inline-block; }
      .title { font-family: 'TF', 'Segoe UI Emoji', 'Apple Color Emoji', Georgia, serif; font-size: ${fontSize}px; font-weight: 900; color: ${cfg.titleColor}; line-height: 1.1; text-align: center; white-space: normal; }
    </style></head><body>
      <div class="pill">
        <div class="title">${title}</div>
      </div>
    </body></html>`;
  } else {
    console.log(`  🎨 Rendering titolo (stile reel workout)...`);
    // Stile reel workout: titolo grande con band semi-trasparente, centrato
    html = `<!DOCTYPE html><html><head><style>
      @font-face { font-family: 'TF'; src: url('file:///${titleFontPath}') format('${fontFormat}'); font-weight: 700; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${videoW}px; height: ${videoH}px; background: transparent !important; }
      body { display: flex; flex-direction: column; align-items: center; }
      .band { margin-top: ${Math.round(videoH * 0.12)}px; background: rgba(0,0,0,0.5); padding: ${Math.round(16 * videoW / 1080)}px ${Math.round(32 * videoW / 1080)}px; border-radius: ${Math.round(14 * videoW / 1080)}px; border-left: ${Math.round(5 * videoW / 1080)}px solid ${cfg.titleAccent}; text-align: left; max-width: ${Math.round(videoW * 0.85)}px; }
      .title { font-family: 'TF', sans-serif; font-size: ${Math.round(cfg.titleSize * videoW / 1080)}px; font-weight: 700; color: ${cfg.titleColor}; line-height: 1.15; text-shadow: 0 ${Math.round(3 * videoW / 1080)}px ${Math.round(12 * videoW / 1080)}px rgba(0,0,0,0.6); letter-spacing: ${Math.round(2 * videoW / 1080)}px; text-transform: uppercase; }
      .handle { font-family: 'TF', sans-serif; font-size: ${Math.round(24 * videoW / 1080)}px; color: ${cfg.titleAccent}; margin-top: ${Math.round(8 * videoW / 1080)}px; letter-spacing: ${Math.round(3 * videoW / 1080)}px; text-shadow: 0 ${Math.round(2 * videoW / 1080)}px ${Math.round(8 * videoW / 1080)}px rgba(0,0,0,0.5); }
    </style></head><body>
      <div class="band">
        <div class="title">${title}</div>
        <div class="handle">${cfg.handle}</div>
      </div>
    </body></html>`;
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: videoW, height: videoH } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(200);
  await page.screenshot({ path: outputPath, omitBackground: true });
  await browser.close();
}

// ── Subtitle PNGs (reel workout exercise-name style: dark box + border-left accent) ──

async function renderSubtitlePNGs(chunks, videoW, videoH, outputDir, basename) {
  const subFontPath = path.join(FONTS_DIR, cfg.subFontFile).replace(/\\/g, '/');
  const subFontFormat = cfg.subFontFormat || 'truetype';
  const isPoster = cfg.style === 'poster';
  console.log(`  🎨 Rendering ${chunks.length} subtitle PNGs (stile ${isPoster ? 'poster' : 'reel workout'})...`);
  const marginBottom = Math.round(videoH * 0.16);
  const fontSize = isPoster
    ? Math.round((cfg.subSize || 64) * (videoW / 1080))
    : Math.round(56 * (videoW / 1080));

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: videoW, height: videoH } });

  const files = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const filepath = path.join(outputDir, `_sub_${basename}_${i}.png`);

    let html;
    if (isPoster) {
      const padV = Math.round(24 * videoW / 1080);
      const padH = Math.round(52 * videoW / 1080);
      html = `<!DOCTYPE html><html><head><style>
        @font-face { font-family: 'SF'; src: url('file:///${subFontPath}') format('${subFontFormat}'); font-weight: 900; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${videoW}px; height: ${videoH}px; background: transparent !important; }
        body { display: flex; align-items: flex-end; justify-content: center; padding-bottom: ${marginBottom}px; }
        .sub-box { background: rgba(0,0,0,0.95); padding: ${padV}px ${padH}px; border-radius: 9999px; max-width: ${Math.round(videoW * 0.88)}px; display: inline-block; }
        .sub-text { font-family: 'SF', 'Segoe UI Emoji', 'Apple Color Emoji', Georgia, serif; font-size: ${fontSize}px; font-weight: 900; color: white; text-align: center; line-height: 1.1; }
      </style></head><body>
        <div class="sub-box">
          <div class="sub-text">${chunk.text}</div>
        </div>
      </body></html>`;
    } else {
      html = `<!DOCTYPE html><html><head><style>
        @font-face { font-family: 'SF'; src: url('file:///${subFontPath}') format('${subFontFormat}'); font-weight: 700; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: ${videoW}px; height: ${videoH}px; background: transparent !important; }
        body { display: flex; align-items: flex-end; justify-content: center; padding-bottom: ${marginBottom}px; }
        .sub-box { background: rgba(0,0,0,0.75); border-left: ${Math.round(5 * videoW / 1080)}px solid ${cfg.titleAccent}; padding: ${Math.round(14 * videoW / 1080)}px ${Math.round(30 * videoW / 1080)}px; max-width: ${Math.round(videoW * 0.85)}px; }
        .sub-text { font-family: 'SF', sans-serif; font-size: ${fontSize}px; font-weight: 700; color: white; letter-spacing: 2px; text-shadow: 0 2px 10px rgba(0,0,0,0.6); text-transform: uppercase; }
      </style></head><body>
        <div class="sub-box">
          <div class="sub-text">${chunk.text}</div>
        </div>
      </body></html>`;
    }

    await page.setContent(html, { waitUntil: 'load' });
    await page.screenshot({ path: filepath, omitBackground: true });
    files.push({ file: filepath, start: chunk.start, end: chunk.end });
  }

  await browser.close();
  console.log(`  🎨 ${files.length} subtitle PNGs pronti`);
  return files;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function processVideo(videoPath, videoIndex = 0) {
  const basename = path.basename(videoPath, path.extname(videoPath));
  const outputPath = path.join(OUTPUT_DIR, `${basename}-sub.mp4`);
  const titlePNG = path.join(OUTPUT_DIR, `_title_${basename}.png`);
  // subtitle PNGs rendered later
  const trimmedPath = path.join(OUTPUT_DIR, `_trimmed_${basename}.mp4`);

  console.log(`\n📹 Processing: ${path.basename(videoPath)}`);

  // 0. Trim silenzi se --trim
  let workingVideo = videoPath;
  if (TRIM) {
    workingVideo = trimSilences(videoPath, trimmedPath);
  }

  const { width, height, duration } = getVideoInfo(workingVideo);
  console.log(`  📐 ${width}x${height} | ${duration.toFixed(1)}s`);

  const transcription = await transcribe(workingVideo);
  const fullText = transcription.text;
  console.log(`  📝 "${fullText.substring(0, 80)}..."`);

  if (!transcription.words?.length) {
    console.error('  ❌ Nessuna parola');
    return null;
  }

  const chunks = chunkWords(transcription.words, 3);
  console.log(`  🔤 ${transcription.words.length} parole → ${chunks.length} chunk`);

  let title;
  // Check for custom titles: --titles-file=path (one title per line) or --titles="T1|T2|T3"
  const titlesFileArg = process.argv.find(a => a.startsWith('--titles-file='));
  const titlesArg = process.argv.find(a => a.startsWith('--titles='));
  let customTitles = [];
  if (titlesFileArg) {
    const tf = titlesFileArg.substring('--titles-file='.length);
    customTitles = fs.readFileSync(tf, 'utf-8').split('\n').map(l => l.trim()).filter(Boolean);
  } else if (titlesArg) {
    customTitles = titlesArg.substring('--titles='.length).split('|');
  }
  const videoIdx = videoIndex;

  if (customTitles[videoIdx]) {
    title = customTitles[videoIdx];
  } else {
    const cleanName = basename.replace(/^\d+[-_]?/, '').replace(/[-_]/g, ' ').trim();
    if (cleanName.length > 3 && !/^(lv|vid|img|video|mov|dsc)?\s*\d+[\s\d]*$/i.test(cleanName)) {
      title = cleanName.toUpperCase();
    } else {
      title = await generateTitle(fullText);
    }
  }
  console.log(`  🏷️  Titolo: "${title}"`);

  await renderTitlePNG(title, width, height, titlePNG);

  // Render subtitle PNGs (exercise-name style: dark box + border-left accent)
  const subFiles = await renderSubtitlePNGs(chunks, width, height, OUTPUT_DIR, basename);

  console.log(`  🎬 Compositing (titolo + ${subFiles.length} sottotitoli)...`);

  const ffInputs = ['-y', '-i', workingVideo, '-i', titlePNG];
  for (const sf of subFiles) ffInputs.push('-i', sf.file);

  // Filter: title overlay → subtitle overlays con timing
  let filterStr = `[0:v][1:v]overlay=0:0[t0]`;
  for (let i = 0; i < subFiles.length; i++) {
    const sf = subFiles[i];
    const prev = i === 0 ? 't0' : `s${i - 1}`;
    const next = i === subFiles.length - 1 ? 'out' : `s${i}`;
    filterStr += `;[${prev}][${i + 2}:v]overlay=0:0:enable='between(t,${sf.start.toFixed(3)},${sf.end.toFixed(3)})'[${next}]`;
  }

  const args = [
    ...ffInputs,
    '-filter_complex', filterStr,
    '-map', '[out]', '-map', '0:a',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
    '-c:a', 'aac', '-b:a', '128k',
    '-movflags', '+faststart',
    outputPath
  ];

  const result = spawnSync(FFMPEG, args, {
    encoding: 'utf-8',
    timeout: 600000,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  [titlePNG, trimmedPath, ...subFiles.map(sf => sf.file)].forEach(f => { try { fs.unlinkSync(f); } catch {} });

  if (result.status !== 0) {
    console.error(`  ❌ FFmpeg error:`, result.stderr?.split('\n').slice(-10).join('\n'));
    return null;
  }

  // Compressione se > 15MB
  const rawSize = fs.statSync(outputPath).size / 1024 / 1024;
  if (rawSize > 15) {
    const compressedPath = outputPath.replace('-sub.mp4', '-sub-small.mp4');
    console.log(`  📦 Compressione: ${rawSize.toFixed(1)}MB → target <15MB...`);
    const targetBitrate = Math.floor((15 * 8 * 1024) / duration); // kbps
    spawnSync(FFMPEG, [
      '-y', '-i', outputPath,
      '-c:v', 'libx264', '-b:v', `${targetBitrate}k`, '-preset', 'fast',
      '-c:a', 'aac', '-b:a', '96k',
      '-movflags', '+faststart',
      compressedPath
    ], { encoding: 'utf-8', timeout: 300000, stdio: ['pipe', 'pipe', 'pipe'] });
    if (fs.existsSync(compressedPath)) {
      const compSize = (fs.statSync(compressedPath).size / 1024 / 1024).toFixed(1);
      console.log(`  📦 Compresso: ${compSize}MB`);
      fs.unlinkSync(outputPath);
      fs.renameSync(compressedPath, outputPath);
    }
  }

  const outSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1);
  console.log(`  ✅ Output: ${outputPath} (${outSize} MB)`);
  return outputPath;
}

/** Processa un video con titolo FORZATO (per split: tutte le parti hanno lo stesso titolo) */
async function processVideoWithTitle(videoPath, forcedTitle) {
  const basename = path.basename(videoPath, path.extname(videoPath));
  const outputPath = path.join(OUTPUT_DIR, `${basename}-sub.mp4`);
  const compressedPath = path.join(OUTPUT_DIR, `${basename}-sub-small.mp4`);
  const titlePNG = path.join(OUTPUT_DIR, `_title_${basename}.png`);
  const trimmedPath = path.join(OUTPUT_DIR, `_trimmed_${basename}.mp4`);

  console.log(`\n📹 Processing: ${path.basename(videoPath)} (titolo: "${forcedTitle}")`);

  let workingVideo = videoPath;
  if (TRIM) workingVideo = trimSilences(videoPath, trimmedPath);

  const { width, height, duration } = getVideoInfo(workingVideo);
  console.log(`  📐 ${width}x${height} | ${duration.toFixed(1)}s`);

  const transcription = await transcribe(workingVideo);
  console.log(`  📝 "${transcription.text.substring(0, 80)}..."`);

  if (!transcription.words?.length) {
    console.error('  ❌ Nessuna parola');
    return null;
  }

  const chunks = chunkWords(transcription.words, 3);
  console.log(`  🔤 ${transcription.words.length} parole → ${chunks.length} chunk`);
  console.log(`  🏷️  Titolo: "${forcedTitle}"`);

  await renderTitlePNG(forcedTitle, width, height, titlePNG);
  const subFiles = await renderSubtitlePNGs(chunks, width, height, OUTPUT_DIR, basename);

  console.log(`  🎬 Compositing (titolo + ${subFiles.length} sottotitoli)...`);

  const ffInputs = ['-y', '-i', workingVideo, '-i', titlePNG];
  for (const sf of subFiles) ffInputs.push('-i', sf.file);

  let filterStr = `[0:v][1:v]overlay=0:0[t0]`;
  for (let i = 0; i < subFiles.length; i++) {
    const sf = subFiles[i];
    const prev = i === 0 ? 't0' : `s${i - 1}`;
    const next = i === subFiles.length - 1 ? 'out' : `s${i}`;
    filterStr += `;[${prev}][${i + 2}:v]overlay=0:0:enable='between(t,${sf.start.toFixed(3)},${sf.end.toFixed(3)})'[${next}]`;
  }

  const args = [
    ...ffInputs,
    '-filter_complex', filterStr,
    '-map', '[out]', '-map', '0:a',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
    '-c:a', 'aac', '-b:a', '128k',
    '-movflags', '+faststart',
    outputPath
  ];

  const result = spawnSync(FFMPEG, args, { encoding: 'utf-8', timeout: 600000, stdio: ['pipe', 'pipe', 'pipe'] });
  [titlePNG, trimmedPath, ...subFiles.map(sf => sf.file)].forEach(f => { try { fs.unlinkSync(f); } catch {} });

  if (result.status !== 0) {
    console.error(`  ❌ FFmpeg error`);
    return null;
  }

  // Compressione se > 15MB
  const rawSize = fs.statSync(outputPath).size / 1024 / 1024;
  if (rawSize > 15) {
    console.log(`  📦 Compressione: ${rawSize.toFixed(1)}MB → target <15MB...`);
    const targetBitrate = Math.floor((15 * 8 * 1024) / duration); // kbps
    spawnSync(FFMPEG, [
      '-y', '-i', outputPath,
      '-c:v', 'libx264', '-b:v', `${targetBitrate}k`, '-preset', 'fast',
      '-c:a', 'aac', '-b:a', '96k',
      '-movflags', '+faststart',
      compressedPath
    ], { encoding: 'utf-8', timeout: 300000, stdio: ['pipe', 'pipe', 'pipe'] });
    if (fs.existsSync(compressedPath)) {
      const compSize = (fs.statSync(compressedPath).size / 1024 / 1024).toFixed(1);
      console.log(`  📦 Compresso: ${compSize}MB`);
      fs.unlinkSync(outputPath);
      fs.renameSync(compressedPath, outputPath);
    }
  }

  const outSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1);
  console.log(`  ✅ Output: ${outputPath} (${outSize} MB)`);
  return outputPath;
}

async function main() {
  const DRIVE_DIR = cfg.driveDir;
  let DRIVE_DONE = null;
  const hasDrive = !IS_CI && fs.existsSync(DRIVE_DIR);
  if (hasDrive) {
    DRIVE_DONE = path.join(DRIVE_DIR, 'fatto');
    fs.mkdirSync(DRIVE_DONE, { recursive: true });
  }

  console.log(`\n🎬 Render Spoken Stories — Brand: ${brand}${IS_CI ? ' (CI)' : ''}`);
  if (hasDrive) console.log(`📱 Google Drive: ${DRIVE_DIR}`);
  console.log(`📂 Input: ${INPUT_DIR}`);
  console.log(`📂 Output: ${OUTPUT_DIR}\n`);

  const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];

  // 1. Controlla Google Drive per nuovi video (skip in CI)
  let driveFiles = [];
  if (hasDrive) {
    try {
      driveFiles = fs.readdirSync(DRIVE_DIR)
        .filter(f => videoExts.includes(path.extname(f).toLowerCase()));
    } catch { /* Drive non disponibile */ }
  }

  // 2. Copia da Drive a input locale
  if (driveFiles.length) {
    console.log(`📱 ${driveFiles.length} video trovati su Google Drive`);
    for (const f of driveFiles) {
      const src = path.join(DRIVE_DIR, f);
      const dst = path.join(INPUT_DIR, f);
      if (!fs.existsSync(dst)) {
        console.log(`  📥 Copio: ${f}`);
        fs.copyFileSync(src, dst);
      }
    }
  }

  // 3. Processa tutti i video in input
  const files = fs.readdirSync(INPUT_DIR)
    .filter(f => videoExts.includes(path.extname(f).toLowerCase()))
    .sort();

  if (!files.length) {
    console.log(`⚠️  Nessun video.\n  Carica i video su Google Drive: ${DRIVE_DIR}\n  Oppure mettili in: ${INPUT_DIR}`);
    return;
  }

  console.log(`📹 ${files.length} video da processare\n`);
  const results = [];
  for (let _videoIndex = 0; _videoIndex < files.length; _videoIndex++) {
    const file = files[_videoIndex];
    try {
      const filePath = path.join(INPUT_DIR, file);
      const { duration } = getVideoInfo(filePath);

      if (duration > 65) {
        // ── SPLIT INTELLIGENTE: taglio tra le parole, mai a metà parola ──
        console.log(`\n📹 ${file} (${duration.toFixed(1)}s) → split intelligente (max 60s, tra le parole)`);

        // 1. Trascrivi il video INTERO per avere i word timestamps
        console.log(`  🎙️  Trascrizione video intero...`);
        const fullTranscription = await transcribe(filePath);
        // Use custom title if available, otherwise generate
        const titlesFileArg2 = process.argv.find(a => a.startsWith('--titles-file='));
        const titlesArg2 = process.argv.find(a => a.startsWith('--titles='));
        let splitCustomTitles = [];
        if (titlesFileArg2) splitCustomTitles = fs.readFileSync(titlesFileArg2.substring('--titles-file='.length), 'utf-8').split('\n').map(l => l.trim()).filter(Boolean);
        else if (titlesArg2) splitCustomTitles = titlesArg2.substring('--titles='.length).split('|');
        const sharedTitle = splitCustomTitles[_videoIndex] || await generateTitle(fullTranscription.text);
        console.log(`  🏷️  Titolo condiviso: "${sharedTitle}"`);

        // 2. Trova i punti di taglio: ultima parola che finisce entro il minuto
        const words = fullTranscription.words || [];
        const splitPoints = [0]; // inizio primo segmento
        let nextCut = 60;

        for (let w = 0; w < words.length; w++) {
          const wordEnd = words[w].end;
          // Se questa parola finisce oltre il punto di taglio
          if (wordEnd >= nextCut && w > 0) {
            // Taglio DOPO la parola precedente (che finisce entro il minuto)
            const cutTime = words[w - 1].end + 0.05; // 50ms di margine dopo fine parola
            splitPoints.push(cutTime);
            nextCut = cutTime + 60;
          }
        }

        const numParts = splitPoints.length;
        console.log(`  ✂️  ${numParts} parti — tagli a: ${splitPoints.map(t => t.toFixed(1) + 's').join(', ')}`);

        // 3. Split con FFmpeg ai punti esatti
        const parts = [];
        for (let p = 0; p < numParts; p++) {
          const partPath = path.join(INPUT_DIR, file.replace(/\.[^.]+$/, `-part${p+1}.mp4`));
          const ss = splitPoints[p];
          const to = p < numParts - 1 ? splitPoints[p + 1] : duration;
          const partDur = to - ss;
          console.log(`  ✂️  Part ${p+1}: ${ss.toFixed(1)}s → ${to.toFixed(1)}s (${partDur.toFixed(1)}s)`);
          spawnSync(FFMPEG, ['-y', '-i', filePath, '-ss', ss.toFixed(3), '-t', partDur.toFixed(3),
            '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-c:a', 'aac', '-b:a', '128k',
            '-movflags', '+faststart', partPath],
            { encoding: 'utf-8', timeout: 300000 });
          parts.push(partPath);
        }

        // 4. Processa ogni parte con lo stesso titolo
        for (let p = 0; p < parts.length; p++) {
          const partOut = await processVideoWithTitle(parts[p], sharedTitle);
          if (partOut) {
            results.push(partOut);
            if (DRIVE_DONE) {
              const outName = path.basename(partOut);
              fs.copyFileSync(partOut, path.join(DRIVE_DONE, outName));
            }
          }
          try { fs.unlinkSync(parts[p]); } catch {}
        }

        // Sposta originale (solo locale, Drive solo se disponibile)
        if (DRIVE_DONE) {
          const driveSrc = path.join(DRIVE_DIR, file);
          if (fs.existsSync(driveSrc)) {
            fs.renameSync(driveSrc, path.join(DRIVE_DONE, file));
          }
          console.log(`  📱 Drive/fatto/ → originale + ${numParts} parti sottotitolate`);
        }
        const localSrc = path.join(INPUT_DIR, file);
        if (fs.existsSync(localSrc)) fs.unlinkSync(localSrc);

      } else {
        // Video ≤ 65s: processa direttamente
        const outputPath = await processVideo(filePath, _videoIndex);
        if (outputPath) {
          results.push(outputPath);
          if (DRIVE_DONE) {
            const outName = path.basename(outputPath);
            try { fs.copyFileSync(outputPath, path.join(DRIVE_DONE, outName)); } catch {}
            const driveSrc = path.join(DRIVE_DIR, file);
            if (fs.existsSync(driveSrc)) {
              try { fs.renameSync(driveSrc, path.join(DRIVE_DONE, file)); } catch {}
            }
          }
          // Rimuovi dall'input locale (resta solo il -sub.mp4 in output)
          try { fs.unlinkSync(filePath); } catch {}
        }
      }
    } catch (e) {
      console.error(`  ❌ Errore su ${file}:`, e.message);
    }
  }

  console.log(`\n✅ Completati: ${results.length}/${files.length} video`);
  results.forEach(r => console.log(`  • ${path.basename(r)}`));
}

main().catch(e => { console.error('❌ Errore fatale:', e); process.exit(1); });