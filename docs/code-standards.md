# JunTech — Chuẩn Code & Cấu Trúc

> Cập nhật lần cuối: 2026-06-17  
> Tham chiếu: [HUONG-DAN-LAM-MAU-THIEP.md](./HUONG-DAN-LAM-MAU-THIEP.md) | [CLAUDE.md](../CLAUDE.md)

---

## 1. Quy ước đặt tên

### TypeScript / React

| Loại | Quy ước | Ví dụ |
|------|---------|-------|
| Component | PascalCase | `TemplateCard`, `AdminDesigner` |
| File component | PascalCase.tsx | `TemplateDetail.tsx` |
| Hook | camelCase, tiền tố `use` | `useCatalog`, `useCountdown` |
| Interface / Type | PascalCase | `DecoConfig`, `InvitationTheme` |
| Hằng số export | UPPER_SNAKE hoặc PascalCase const | `LAYOUTS`, `DEFAULT_DECORATIONS` |
| Props interface | `<ComponentName>Props` | `CoverProps`, `HeaderProps` |
| Biến / hàm thường | camelCase | `loadDecorations()`, `decosByZone()` |
| API helper objects | camelCase | `catalogApi`, `adminApi` |

### CSS

- **Quy ước BEM-ish**: `.feature-name__element--modifier`  
  - Ví dụ: `.template-card__image`, `.hero__title`, `.inv-header`
- **Prefix theo feature/layout**: layout floral dùng `.flr-`, layout traditional dùng `.trad-`
- **Prefix thiệp**: `.inv-` (invitation container), `.gate-` (cover gate)
- Mỗi component/feature có file `.css` riêng, import trong file `.tsx` tương ứng
- **KHÔNG** dùng TailwindCSS
- **KHÔNG** dùng inline styles trừ giá trị động (ví dụ: `style={{ color: theme.accent }}`)

### PHP (Backend)

- Class: PascalCase — `Database`, `AuthController`, `CatalogController`
- Method: camelCase — `templateBySlug()`, `createOrder()`
- Biến: camelCase — `$userId`, `$templateId`
- Constant config key: snake_case (trong array PHP) — `'db'`, `'cors_origins'`

---

## 2. CSS Variables & Theme System

### Marketing site (dark mode mặc định)

Định nghĩa trong `src/styles/variables.css`. Tất cả component **phải** dùng `var(--...)`, không hardcode màu.

```css
/* Dark mode (default) */
:root {
  --bg-primary: #000000;
  --bg-secondary: #0a0a0a;
  --bg-tertiary: #111111;
  --bg-elevated: #1a1a1a;
  --text-primary: #fafafa;
  --text-secondary: #a1a1a1;
  --text-muted: #525252;
  --accent-primary: #d4a853;      /* gold */
  --accent-secondary: #b8942e;
  --accent-glow: rgba(212, 168, 83, 0.15);
  --border-default: #1f1f1f;
  --border-accent: rgba(212, 168, 83, 0.3);
}

/* Light mode — class trên <html> */
[data-theme="light"] {
  --bg-primary: #ffffff;
  /* ... (xem variables.css) */
}
```

**Chuyển theme**: ThemeContext set `document.documentElement.setAttribute('data-theme', 'light')`. Transition: `background-color 0.3s ease, color 0.3s ease`.

### Thiệp cưới (light, cream + đỏ truyền thống)

Theme tokens thiệp được lưu trong `design.theme` JSON trong DB, áp dụng qua CSS variables inline khi render Invitation. Xem `src/features/invitation/themes.ts` cho cấu trúc `InvitationTheme`.

---

## 3. TypeScript

- **Strict mode**: `tsconfig.json` bật strict. Không dùng `any` trừ chỗ thực sự cần (API response chưa typed trong admin)
- Định nghĩa interface/type cho mọi props và data. File `src/data/types.ts` = types công khai (Template, PricingPlan, Testimonial)
- `src/features/invitation/types.ts` = Invitation interface (toàn bộ fields thiệp sống)
- Sau khi sửa lớn: `npx tsc --noEmit` phải sạch lỗi

---

## 4. PHP & Database

### PDO Prepared Statements — bắt buộc

```php
// ĐÚNG
$stmt = Database::query('SELECT * FROM templates WHERE slug = ?', [$slug]);

// SAI — SQL injection
$stmt = Database::query("SELECT * FROM templates WHERE slug = '$slug'");
```

### utf8mb4 — bắt buộc ở mọi tầng

| Tầng | Cấu hình |
|------|---------|
| MySQL | `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci` trên DB + bảng |
| PDO DSN | `charset=utf8mb4` trong `config.php` |
| JSON output | `json_encode($data, JSON_UNESCAPED_UNICODE)` |
| Import SQL | `mysql --default-character-set=utf8mb4 -u root < file.sql` |

Nếu không: chữ tiếng Việt hiển thị "├ó" hoặc "?".

### Password

Dùng `password_hash($pass, PASSWORD_DEFAULT)` (bcrypt). Xem `make_admin.php`.

---

## 5. Z-Index Conventions (Invitation)

Quy ước này phải tuân thủ khi viết layout hoặc CSS thiệp để tránh ảnh che chữ:

| Layer | z-index | Mô tả |
|-------|---------|-------|
| Dải đỏ / banner | `1` | Nền trang trí |
| Ảnh trang trí (decoration) | `2 – 9` | Phượng, hoa, Song Hỷ |
| Chữ / tên cặp đôi | `30` | **Luôn trên cùng**, không bị ảnh che |
| Edit layer (admin kéo-thả) | `50` | Cho phép click/kéo mọi ảnh trang trí |

---

## 6. Quy Tắc Decoration (Ảnh Trang Trí)

Tóm tắt từ [HUONG-DAN-LAM-MAU-THIEP.md](./HUONG-DAN-LAM-MAU-THIEP.md):

1. **KHÔNG dùng `<img>` tĩnh** cho họa tiết — phải dùng `DecorationLayer` với dữ liệu từ `design.decorations`
2. **Toạ độ `top`/`left`** tính theo toàn trang (`.inv-root`), không theo header riêng
3. **`DecorationLayer` phải render trong `<div className="inv-deco-root">`** (phủ `position:absolute; inset:0` toàn trang)
4. **Edit mode** (`editable` prop): `.deco-layer--edit { z-index: 50 }`, chữ đặt `pointer-events: none`
5. **Bỏ `overflow: hidden`** trên container khi edit để kéo ảnh ra mép không bị cắt
6. **Kéo-thả dùng `ref`** (không state) để tránh stale closure — đọc `listRef.current` trong drag handler

### Thêm mẫu mới (không cần code)

1. Admin → Mẫu thiệp → Thêm mẫu (chọn `layout` = `traditional` hoặc `floral`)
2. Upload ảnh vào `public/invitation/` hoặc qua nút "Tải ảnh lên" trong Designer
3. Admin → Thiết kế mẫu → chỉnh màu + kéo decorations cả 2 zone (Bìa + Nội dung)
4. Xem demo `/thiep/demo/<slug>` để xác nhận

### Thêm layout mới (cần code)

1. Tạo `src/features/invitation/layouts/<ten>.tsx` export `{ Cover, Header }` (tham khảo `traditional.tsx`)
2. Tạo `<ten>.css` với prefix class riêng
3. Đăng ký trong `src/features/invitation/layouts/index.ts`
4. Tạo mẫu trong DB với `layout = '<ten>'`

---

## 7. Component Size

- Mỗi component tối đa ~150 dòng. Tách component con nếu lớn hơn
- Feature-based folders: mỗi feature tự chứa `.tsx` + `.css` của nó
- Shared components ít, chỉ khi dùng >2 nơi: `src/components/common/`

---

## 8. Accessibility

- Mọi `<button>`, `<a>` có `aria-label` nếu không có text rõ ràng
- Ảnh có `alt` mô tả
- Focus states rõ ràng (không xóa outline mà không thay thế)
- Dùng đúng semantic HTML: `<button>` (không `<div onClick>`), `<nav>`, `<main>`, `<section>`, `<article>`
- Mỗi trang 1 `<h1>` duy nhất

---

## 9. Quy tắc Dev & Test

- **Dùng `localhost`** (không `127.0.0.1`) cho cả frontend và backend khi dev. Cookie session PHP bị mất nếu origin khác nhau.
- **Tự test trước khi báo xong**: UI interactive (kéo-thả) → test bằng Puppeteer. Không đẩy việc test cho user.
- Chỉ chạy 1 Vite dev server + 1 PHP server. Kill process cũ trước khi khởi động lại.
- `npx tsc --noEmit` + `npx vite build` phải sạch sau khi sửa lớn.
- `VITE_API_URL` trong `.env.local` điều chỉnh endpoint backend:
  ```
  VITE_API_URL=http://localhost:8899/api
  ```

---

## 10. Không làm

- Không dùng TailwindCSS
- Không hardcode màu/spacing trong component (dùng CSS variables)
- Không dùng `<img>` tĩnh cho họa tiết trong layout thiệp
- Không dùng `127.0.0.1` khi test session cookie
- Không dùng `mysql <` để import SQL tiếng Việt mà không set `--default-character-set=utf8mb4`

---

Xem thêm: [HUONG-DAN-LAM-MAU-THIEP.md](./HUONG-DAN-LAM-MAU-THIEP.md) | [System Architecture](./system-architecture.md) | [Codebase Summary](./codebase-summary.md)
