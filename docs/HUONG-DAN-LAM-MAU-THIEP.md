# Hướng Dẫn Làm Mẫu Thiệp Mới (Template Guide)

> Tài liệu này tổng hợp **kiến trúc + quy tắc + các sai lầm đã gặp** khi làm thiệp cưới sống.
> Đọc trước khi thêm mẫu mới để làm **nhanh, gọn, không lặp lỗi cũ**.

---

## 1. Mô hình tổng quát (PHẢI hiểu trước)

Một "mẫu thiệp" = **2 phần tách biệt**, đừng trộn lẫn:

| Phần | Là gì | Sửa ở đâu |
|------|-------|-----------|
| **Metadata** | tên, slug, giá, danh mục, badge | Admin → **Mẫu thiệp** (bảng `templates`) |
| **Design** | giao diện thiệp sống: màu + **font (fontset)** + ảnh trang trí | Admin → **Thiết kế mẫu** (cột `templates.design` JSON) |
| **Layout** | bố cục/khung (cover gate + header) | **Code** — `templates.layout` chọn 1 trong các layout có sẵn |

Công thức: **1 Layout (code) × 1 Theme (màu) × 1 Fontset (font) × N Decorations (ảnh) = 1 mẫu**.

> 💡 **ĐÒN BẨY ĐA DẠNG (như ChungĐôi):** ChungĐôi 10 mẫu DÙNG CHUNG 1 body — chỉ đổi **font + màu + ảnh + bật/tắt/thứ tự section**. KHÔNG cần body variant. Muốn mẫu trông khác hẳn → đổi **fontset** trước (mạnh nhất), rồi màu, rồi ảnh.

```
Invitation.tsx (điều phối: fetch data, chọn layout)
├── LAYOUTS[template.layout]      ← bố cục riêng (code)
│   ├── Cover  (màn "Mở thiệp")   ← khác nhau mỗi layout
│   └── Header (đầu thiệp)         ← khác nhau mỗi layout
├── InvitationBody.tsx            ← DÙNG CHUNG mọi layout (lễ/lịch/QR/RSVP/guestbook)
└── DecorationLayer               ← ảnh trang trí (theo design.decorations)
```

**Quy tắc vàng:** phần **dưới** (thông tin lễ, tên, thời gian, lịch, countdown, địa điểm, album, QR mừng cưới, RSVP, sổ lưu bút, footer) **luôn dùng chung** `InvitationBody`. Mỗi layout chỉ khác **Cover + Header** (~30% phần đầu). → Thêm mẫu = chỉ viết Cover + Header.

---

## 2. Quy trình thêm 1 MẪU MỚI (chỉ đổi màu/ảnh, dùng layout có sẵn) — NHANH NHẤT

Không cần code. Làm 100% qua Admin:

1. **Admin → Mẫu thiệp → Thêm mẫu**: nhập tên, slug, danh mục, giá, chọn `layout` (traditional / floral...).
2. Bỏ ảnh trang trí vào `public/invitation/` (hoặc dùng nút **Tải ảnh lên** trong designer → vào `public/invitation/uploads/`).
3. **Admin → Thiết kế mẫu → chọn mẫu**:
   - Đổi **màu** (đỏ chính / chữ / tiêu đề / nền).
   - Tab **Bìa thiệp** + tab **Nội dung**: bấm ảnh từ **Thư viện** để thêm, **kéo-thả** đặt vị trí, chỉnh size/xoay/lớp, nút **Đối xứng / Căn giữa**.
   - **Lưu thiết kế** → áp ngay cho khách.
4. Xem demo: `/thiep/demo/<slug>`.

→ Mẫu mới ra trong vài phút, **không động code**.

### 2b. ⚡ TEMPLATE FACTORY — preset vị trí (khi seed decoration bằng code)
Khi cần định nghĩa `DEFAULT_*_DECORATIONS` cho layout mới, DÙNG `templatePresets.ts` thay vì gõ tay top/left/width:
```ts
import { deco, asset } from './templatePresets';
export const DEFAULT_X_DECORATIONS = [
  deco('hero',     asset('castle','blue-1'), 'fullScene', { z: 2 }),
  deco('flower-tl', asset('flower','moc-1'), 'cornerTL',  { z: 3, opacity: 0.9 }),
  deco('flower-br', asset('flower','moc-2'), 'cornerBR',  { z: 3, opacity: 0.9 }),
];
```
**Preset có sẵn:** cornerTL/TR/BL/BR (4 góc hoa), sideL/sideR (cây/phượng 2 bên), fullScene (khung cảnh full-width), frameCenter (khung oval), bannerTop (dải ngang), heroTop, atmosphereTop. Chỉnh 1 chỗ trong PRESETS → mọi mẫu hưởng. KHÔNG gõ pixel tay.
> Lợi ích: tạo decoration nhanh + nhất quán giữa các mẫu. KHÔNG refactor mẫu cũ đang chạy (YAGNI) — chỉ dùng cho mẫu MỚI.

---

## 3. Quy trình thêm 1 LAYOUT MỚI (bố cục khác hẳn) — KHI MẪU CẦN KHUNG RIÊNG

Khi mẫu cần bố cục khác (vd cover có ảnh cặp đôi, header dạng khung oval...), thêm layout:

1. **Chuẩn bị assets**: bỏ ảnh/SVG vào `public/invitation/<ten-layout>/`.
2. **Tạo file** `src/features/invitation/layouts/<ten>.tsx` export `{ Cover, Header }`:
   - `Cover(props: CoverProps)`: màn "Mở thiệp". Phải nhận + truyền `decorations, inline, editable, onDecoChange, selectedId, onSelect` xuống `<DecorationLayer>`.
   - `Header(props: HeaderProps)`: đầu thiệp. **Render `<DecorationLayer>` trong `<div className="inv-deco-root">`** (xem mục 5).
   - Tham khảo `traditional.tsx` (đơn giản nhất) hoặc `floral.tsx`.
3. **Đăng ký** trong `src/features/invitation/layouts/index.ts`: `export const LAYOUTS = { traditional, floral, <ten> }`.
4. **CSS riêng** `<ten>.css` (prefix class riêng, vd `flr-` cho floral) — `import` trong file layout đó.
5. DB: tạo mẫu với `layout = '<ten>'` + seed `design` (theme + decorations 2 zone).
6. Body (InvitationBody) **không cần sửa** — tự dùng lại.

---

## 4. Cấu trúc dữ liệu Decoration (ảnh trang trí)

```ts
interface DecoConfig {
  id: string;          // duy nhất
  label?: string;      // tên hiển thị trong editor
  src: string;         // /invitation/....webp
  top: number;         // % theo TOÀN trang thiệp (KHÔNG phải theo header)
  left: number;        // %
  width: number;       // % bề rộng trang
  rotate: number;      // độ
  flip: boolean;       // lật ngang
  z: number;           // thứ tự lớp (0 = dưới cùng, cao = nổi trên)
  opacity: number;     // 0.1 - 1
  zone?: 'cover' | 'body' | 'header' | 'footer';  // Thiếu = 'body'
}
```

`design` lưu trong DB: `{ theme: {...}, fontset: '<key>', spacing?: {sectionGap, headerMin}, decorations: DecoConfig[], sectionOrder?: [...] }`.

**Khoảng cách (spacing) — chỉnh trong admin (2 thanh trượt):**
- `sectionGap` → CSS var `--inv-section-gap` (padding dọc mỗi `.inv-section`, mặc định 64px).
- `headerMin` → CSS var `--inv-header-min` (chiều cao header laudai/floral — để khung hoa/lâu đài không đè family). Mặc định: floral 820, laudai 720, khác 480.
- CSS dùng `var(--inv-header-min, <fallback>)` ở MỌI media query (mobile cũng dùng var, không hard-code).
- Backend `updateDesign` MERGE design cũ → không mất sectionOrder khi lưu.

**4 ZONE — tọa độ % tính theo block khác nhau (QUAN TRỌNG, tránh ảnh trôi):**
| zone | % tính theo | dùng cho |
|------|-------------|----------|
| `cover` | thẻ bìa (gate-card) | ảnh trang trí màn "Mở thiệp" |
| `header` | block tên/header layout | khung cảnh bám tên (lâu đài, khung hoa oval) — KHÔNG trôi xuống body |
| `body` | TOÀN trang thiệp | hoa rải dọc thân (% trang dài → cẩn thận trôi) |
| `footer` | block `.inv-footer` cuối | cụm hoa/đài phun nước cuối thiệp — bám footer dù trang dài ngắn. `top` âm = tràn LÊN trên footer |

**⚠️ QUY ƯỚC Z-INDEX (RÀNG BUỘC — chống ảnh đè chữ):**
- Chữ body (`.inv-section`) ở `z:3`, chữ footer ở `z:3`, chữ cover ở `z:60`.
- Ảnh trang trí **zone body/header/footer: `z` TỐI ĐA = 2** (luôn DƯỚI chữ). Slider admin đã giới hạn max=2 cho các zone này.
- Ảnh **zone cover**: `z` tới 9 (vì chữ cover ở z:60).
- Lớp edit (admin): `z:50` để kéo được.
- → KHÔNG bao giờ set ảnh body z≥3. Nếu thấy ảnh đè chữ = ảnh có z quá cao, hạ về ≤2.

---

## 4b. ⭐ FONTSET — bộ font theo mẫu (đòn bẩy đa dạng MẠNH NHẤT)

File: `src/features/invitation/fontsets.ts`. Mỗi fontset map 3 CSS var:
- `--font-heading` (tiêu đề section), `--font-name` (tên CD/CR), `--font-body` (nội dung).

5 bộ sẵn: `classic-serif` (Playfair, mặc định) · `elegant` (Cormorant/Garamond) · `script-soft` (Dancing Script) · `romantic` (Great Vibes) · `modern-sans` (Be Vietnam Pro).

**Cách dùng:** Admin → Thiết kế mẫu → dropdown **"Bộ font"** → chọn → Lưu. Lưu vào `design.fontset`.

**Thêm fontset mới:** (1) thêm font vào `index.html` (phải có Vietnamese subset); (2) thêm 1 entry vào `FONTSETS`. Body tự đọc var, không cần sửa component.

**Quy tắc:** CSS thiệp dùng `font-family: var(--font-heading, '<fallback>')` — KHÔNG hard-code font. Layout đặc thù (laudai dùng Cormorant cho tên) có thể giữ font riêng nếu cố ý.

---

## 5. ⚠️ CÁC SAI LẦM ĐÃ GẶP — TUYỆT ĐỐI TRÁNH

### 5.1. KHÔNG dùng `<img>` tĩnh cho họa tiết
**Sai:** vẽ phượng/hoa/Song Hỷ bằng `<img className="...">` hard-code trong layout.
**Hậu quả:** không kéo/chỉnh/xóa được trong admin; trộn 2 cơ chế gây rối.
**Đúng:** MỌI họa tiết = **decoration** trong `design.decorations`, render qua `<DecorationLayer>`. Chữ + khung + banner mới là HTML tĩnh.

### 5.2. Toạ độ decoration tính theo TOÀN TRANG, không theo header
**Sai:** đặt `<DecorationLayer>` trong `.inv-header` (cao cố định 360px) → kéo ảnh xuống quá header là **bị kẹt/mất**.
**Đúng:** render layer trong `<div className="inv-deco-root">` (phủ `position:absolute; inset:0` toàn `.inv-root`). top/left = % toàn trang → kéo ảnh đi **bất kỳ đâu**.

### 5.3. Chữ phải LUÔN nổi trên ảnh
Chữ (`.gate-content`, tên cặp đôi) đặt `z-index: 30`; decoration tối đa z=9 → chữ luôn đọc được, không bị phượng che. Thêm lớp nền kem mờ (`::before`) sau chữ nếu cần.

### 5.4. Edit mode: lớp ảnh phải lên TRÊN CÙNG + nội dung tắt pointer-events
Khi `editable`: `.deco-layer--edit { z-index: 50 }` + `.inv-deco-root:has(.deco-layer--edit){ z-index:50 }`; chữ/banner đặt `pointer-events: none`. Nếu không → bấm trúng chữ, không chọn được ảnh.

### 5.5. Overflow bìa thiệp: LIVE clip, EDIT visible (QUAN TRỌNG — đừng để hoa tràn ngoài bìa)
**Quy tắc:** Card bìa (`.flr-gate-card`, `.hmx-gate-card`, `.gate-card`) phải `overflow: hidden` ở chế độ LIVE (khách xem) → hoa/họa tiết chỉ hiện TRONG khoảng bìa, phần tràn ngoài bị ẩn. Chỉ khi EDIT (admin kéo-thả) mới mở `overflow: visible` để kéo ảnh ra mép không bị cắt vùng click.
**Sai (đã gặp):** để card `overflow: visible` mặc định → hoa tràn ra ngoài card cả khi khách xem, nhìn lem nhem.
**Đúng:**
```css
.flr-gate-card, .hmx-gate-card { overflow: hidden; }  /* LIVE clip trong bìa */
/* EDIT: mở overflow để kéo ảnh ra mép */
.flr-gate--inline .flr-gate-card:has(.deco-layer--edit),
.hmx-gate--inline .hmx-gate-card:has(.deco-layer--edit),
.inv-header:has(.deco-layer--edit) { overflow: visible; }
```
→ Mỗi layout MỚI có cover card riêng: thêm card đó vào rule `:has(.deco-layer--edit) { overflow: visible }` trong `Invitation.css`, và set card `overflow: hidden` mặc định.

### 5.6. Giới hạn kéo tính theo KÍCH THƯỚC ẢNH, không theo % trang
**Sai (đã gây bug "ảnh tự nhảy xuống"):** clamp `top = max(KEEP - hImg, ...)` với KEEP là % trang → ra số dương → ép ảnh nhảy.
**Đúng:** cho ảnh tràn ra ngoài nhưng giữ ≥ `KEEP_FRAC` (35%) **thân ảnh** trong khung:
```ts
const KEEP_FRAC = 0.35;
const hImg = (w * rect.width) / rect.height;
left = clamp(g.ox+dx, -w*(1-KEEP_FRAC), 100 - w*KEEP_FRAC);
top  = clamp(g.oy+dy, -hImg*(1-KEEP_FRAC), 100 - hImg*KEEP_FRAC);
```
→ vừa tràn mép đẹp, vừa luôn bấm lại được.

### 5.7. Kéo-thả phải dùng ref tránh stale-closure
Drag listener đọc `listRef.current` (luôn mới), gắn `mousemove/mouseup` ngay trong `onMouseDown`, gỡ khi `mouseup`. Nếu dùng state cũ trong closure → kéo ảnh khác làm ảnh trước nhảy về chỗ cũ.

### 5.8. Panel chỉnh KHÔNG nổi đè preview
Bảng chỉnh (slider size/xoay/lớp) đặt ở **cột trái** (AdminDesigner), không render nổi trong khung xem trước (che mất thiệp). DecorationLayer chỉ lo kéo + báo `onSelect`.

---

## 6. Song ngữ (Bilingual) — Quy tắc căn chỉnh text

### 6.1. Kiến trúc song ngữ
- `i18n.ts → buildBilingual(langs)` — ghép các ngôn ngữ thành `"VI / EN"` (dùng ` / ` làm dấu phân cách).
- `splitBi(text)` — tách `"VI / EN"` thành `{ primary, secondary }` để render 2 dòng riêng.
- Component `<BiLine text={...} />` trong `InvitationBody.tsx` — render primary (to) + secondary (nhỏ, mờ 52%) theo chiều dọc, tránh tràn ngang.

### 6.2. ⚠️ KHÔNG render song ngữ bằng chuỗi dài 1 dòng
**Sai:** `<h2>{t.venueTitle}</h2>` → khi song ngữ thành `"TIỆC CƯỚI SẼ TỔ CHỨC TẠI / WEDDING VENUE"` → xuống dòng giữa chừng, xấu.
**Đúng:** `<h2 className="inv-h2"><BiLine text={t.venueTitle} /></h2>` → primary + secondary 2 dòng gọn.

### 6.3. Nguyên tắc khi thêm text mới vào InvitationBody
Bất cứ khi nào thêm element hiển thị text từ `t.xxxKey`:
- **Dùng `<BiLine text={t.xxxKey} />`** — đặc biệt với heading (h2, inv-h2), các label ngắn (groomSide, brideTitle...), text tiền tố (ceremonyAt, monthLabel...).
- **KHÔNG cần BiLine** với: input placeholder, nội dung user nhập (tên, địa điểm), giờ/ngày số, các string chắc chắn ngắn (không bao giờ > 20 ký tự sau song ngữ).

### 6.4. CSS BiLine
```css
.inv-biline { display: inline-flex; flex-direction: column; align-items: center; gap: 1px; }
.inv-biline__pri { display: block; }
.inv-biline__sec { display: block; font-size: 0.78em; opacity: 0.52; letter-spacing: 0.03em; font-weight: 400; }
```
Đã có sẵn trong `Invitation.css`. **Không cần copy lại.**

### 6.5. Danh sách 12 ngôn ngữ hỗ trợ
vi, en, zh, ko, ja, fr, es, ar, ru, id, de, zh-tw — tất cả đã có đủ ~50 key bản dịch trong `i18n.ts`.

---

## 7. Encoding & MySQL (tránh chữ Việt bị vỡ "├ó")

- DB + bảng + cột: **utf8mb4**.
- Import SQL: `mysql --default-character-set=utf8mb4 -u root < file.sql` (KHÔNG để console Windows tự dùng cp850 → hỏng chữ).
- PHP PDO: DSN có `charset=utf8mb4`.
- JSON: `json_encode(..., JSON_UNESCAPED_UNICODE)`.
- Seed tiếng Việt nên chạy qua **PHP** (PDO utf8mb4), tránh `mysql <` nếu không set charset.

---

## 8. Quy tắc làm việc (cho dev/AI)

- **Tự test trước khi báo xong** — không đẩy việc test cho user. Tương tác UI (kéo-thả) thì test bằng Puppeteer (`chrome-devtools`), mô phỏng thao tác thật, xác nhận PASS rồi mới báo.
- **Phục vụ session-side:** API frontend gọi `http://localhost:8899/api` qua **`localhost`** (KHÔNG `127.0.0.1`) để cookie session đồng nhất.
- Sau khi sửa nhiều: `npx tsc --noEmit` + `npx vite build` phải sạch.
- Chỉ chạy 1 Vite + 1 PHP server (kill cũ trước khi start để khỏi lẫn port/.env cũ).

---

## 9. Checklist nhanh khi thêm mẫu mới

- [ ] Ảnh đã ở `public/invitation/` (hoặc `<layout>/`)
- [ ] Tạo mẫu trong Admin → Mẫu thiệp (tên/slug/giá/danh mục/layout)
- [ ] Thiết kế mẫu: màu + decorations cả 2 zone (Bìa + Nội dung)
- [ ] Chữ z=30, ảnh z=2-9, dải đỏ z=1
- [ ] Xem `/thiep/demo/<slug>` — bìa + nội dung đều đúng
- [ ] Tên mẫu hiển thị đúng tiếng Việt (utf8mb4)
- [ ] (Nếu layout mới) đăng ký trong `layouts/index.ts` + CSS prefix riêng
- [ ] **Sinh ảnh coverflow + thumbnail** (BẮT BUỘC — nếu thiếu, home/modal hiện ảnh vỡ):
  - `node scripts/capture-preview.mjs <slug>` → `public/invitation/thumbs-full/<slug>.webp` (coverflow home "Cảm hứng cặp đôi" + ảnh mẫu)
  - `node scripts/capture-cover.mjs <slug>` → `public/invitation/covers/<slug>.webp` (modal "Đổi mẫu thiệp" — ảnh bìa)
  - Cần dev server (5173) + backend (8899) đang chạy khi chụp.

> **Lưu ý coverflow home:** Section "Cảm hứng từ những cặp đôi" — click thiệp giữa → mở thẳng `/thiep/demo/<slug>` (chỉ xem, KHÔNG modal). Tự lấy `useTemplates()` nên thêm mẫu mới là tự hiện, chỉ cần có `thumbs-full/<slug>.webp`.

## 10. ⚠️ QUY TRÌNH CLONE MẪU CHUẨN (BẮT BUỘC — tránh lỗi đã gặp)

> Bài học: làm mẫu Hoa Mộc Xanh bị (a) demo render khác bố cục thật, (b) admin designer KHÔNG thấy ảnh cô dâu chú rể → không thiết kế được. Root cause: quên đồng bộ demo data ở admin.

### 10.1. Đo CSS THẬT trước khi code (KHÔNG đoán)
Dùng Puppeteer (`node_modules` có sẵn) `getComputedStyle` trên trang ChungĐôi thật: fontFamily/Size, màu hex, vị trí (getBoundingClientRect), thứ tự DOM. KHÔNG ước lượng bằng mắt → ra số chính xác. Đã có spec mẫu trong memory `chungdoi-css-spec`.

### 10.2. ⭐ ĐỒNG BỘ 3 NGUỒN DEMO DATA (mắt xích hay quên nhất)
Một mẫu cần dữ liệu demo ở **3 nơi** — thiếu 1 là lệch:
| Nguồn | File | Phục vụ |
|-------|------|---------|
| 1. Demo công khai | `backend/controllers/CatalogController.php` `demo()` | `/thiep/demo/<slug>` |
| 2. Admin preview | `src/features/admin/sampleInvitation.ts` | `/admin/thiet-ke-mau/<id>` |
| 3. DB design | `backend/database/seed_templates_v2.php` | theme + decorations |

→ Nếu layout dùng ảnh động (ảnh đôi, couplePhoto...) thì CẢ nguồn 1 VÀ 2 phải có ảnh placeholder. Nếu chỉ thêm nguồn 1, admin designer sẽ render trống ảnh → user không thiết kế được.

### 10.3. Test CẢ HAI nơi trước khi báo xong
- [ ] `/thiep/demo/<slug>` — bố cục khớp ChungĐôi (screenshot đối chiếu)
- [ ] `/admin/thiet-ke-mau/<id>` — preview thấy ĐỦ mọi phần (ảnh đôi, hoa, khung) để thiết kế được
- [ ] Nếu 2 nơi khác nhau → đồng bộ demo data (mục 10.2)

### 10.4. Nền giấy chỉ cho Long Phụng
`paper-bg.jpg` là đặc trưng Long Phụng (đỏ truyền thống). Layout khác (floral, hoamoc...) dùng nền màu trơn — override `.inv-<layout> { background: <màu> !important; background-image: none !important; }`.
