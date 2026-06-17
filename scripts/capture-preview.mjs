/**
 * Chụp ảnh preview thiệp (full dài) cho coverflow trang chủ.
 *   node scripts/capture-preview.mjs            # chụp TẤT CẢ mẫu
 *   node scripts/capture-preview.mjs <slug>     # chụp 1 mẫu
 *
 * Yêu cầu: dev server (5173) + backend API (8899) đang chạy.
 * Env (tuỳ chọn): APP_URL, API_URL.
 * Ảnh lưu: public/invitation/thumbs-full/<slug>.webp
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'invitation', 'thumbs-full');

const APP = process.env.APP_URL || 'http://localhost:5173';
const API = process.env.API_URL || 'http://localhost:8899/api';
const onlySlug = process.argv[2] || null;

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

/** Lấy danh sách slug active từ API (hoặc chỉ slug truyền vào). */
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
  await p.setViewport({ width: 400, height: 900, deviceScaleFactor: 1 });
  try {
    // domcontentloaded ổn định hơn networkidle2 (khi chạy nền cold-start chậm), timeout rộng.
    await p.goto(`${APP}/thiep/demo/${slug}?preview`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    // chờ nội dung thiệp render xong (section đầu tiên) — BẮT BUỘC, nếu timeout coi là lỗi.
    await p.waitForSelector('.inv-section', { timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2500));
    await p.screenshot({ path: path.join(OUT, `${slug}.webp`), type: 'webp', quality: 78, fullPage: true });
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
