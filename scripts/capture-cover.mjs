/**
 * Chụp ảnh BÌA THIỆP (cover gate) cho modal "Đổi mẫu thiệp".
 *   node scripts/capture-cover.mjs            # chụp TẤT CẢ mẫu
 *   node scripts/capture-cover.mjs <slug>     # chụp 1 mẫu
 *
 * Yêu cầu: dev server (5173) + backend API (8899) đang chạy.
 * Ảnh lưu: public/invitation/covers/<slug>.webp (tỷ lệ dọc 3:4).
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'invitation', 'covers');

const APP = process.env.APP_URL || 'http://localhost:5173';
const API = process.env.API_URL || 'http://localhost:8899/api';
const onlySlug = process.argv[2] || null;

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

async function getSlugs() {
  if (onlySlug) return [onlySlug];
  const p = await browser.newPage();
  await p.goto(APP, { waitUntil: 'domcontentloaded' });
  const slugs = await p.evaluate(async (api) => {
    const j = await (await fetch(api + '/templates')).json();
    return (j.data || []).map((t) => t.slug);
  }, API);
  await p.close();
  return slugs;
}

async function shoot(slug) {
  const p = await browser.newPage();
  // tỷ lệ dọc cho thumbnail bìa (giống tỷ lệ thiệp)
  await p.setViewport({ width: 480, height: 640, deviceScaleFactor: 1 });
  try {
    // KHÔNG ?preview → giữ màn cover gate (bìa thiệp "Mở thiệp").
    await p.goto(`${APP}/thiep/demo/${slug}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    // chờ cover gate render (cover có nhiều class tuỳ layout: .gate / .flr-gate / .hmx-gate)
    await p.waitForSelector('.gate, .flr-gate, .hmx-gate', { timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2800)); // chờ font + ảnh hoa load
    // chụp viewport (vùng bìa), KHÔNG fullPage → đúng phần bìa đẹp
    await p.screenshot({ path: path.join(OUT, `${slug}.webp`), type: 'webp', quality: 80 });
    console.log('OK', slug);
    return true;
  } catch (e) {
    console.error('FAIL', slug, e.message.slice(0, 80));
    return false;
  } finally {
    await p.close();
  }
}

const slugs = await getSlugs();
let ok = 0;
for (const s of slugs) { if (await shoot(s)) ok++; }
await browser.close();
console.log(`DONE ${ok}/${slugs.length}`);
process.exit(ok === slugs.length ? 0 : 1);
