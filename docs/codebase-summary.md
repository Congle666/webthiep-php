# JunTech — Codebase Summary

> Cập nhật lần cuối: 2026-06-17 (rev2: editor render-from-state, auth modal, cột `extra`, coverflow ảnh)

## 1. Cây thư mục chính

```
web-thiep/
├── public/
│   └── invitation/          # Ảnh trang trí thiệp (webp, svg, paper-bg)
│       ├── uploads/         # Ảnh do admin upload qua API
│       └── thumbs-full/     # Ảnh .webp FULL DÀI chụp sẵn mỗi mẫu (coverflow trang chủ). Tạo bằng capture_full.js
├── src/
│   ├── api/
│   │   └── client.ts        # Fetch wrapper + tất cả API helpers (catalogApi, authApi, adminApi, invitationApi, contactApi)
│   ├── components/
│   │   ├── common/          # Button, ScrollReveal, LoginModal (popup đăng nhập/đăng ký toàn site)
│   │   └── layout/          # Header, Footer
│   ├── context/
│   │   ├── ThemeContext.tsx  # Dark/light mode (localStorage + data-theme trên <html>)
│   │   └── AuthContext.tsx   # Auth toàn site: user hiện tại + điều khiển LoginModal (openLogin/logout)
│   ├── data/
│   │   ├── types.ts         # Template, PricingPlan, Testimonial, CategoryFilter
│   │   └── index.ts         # (không dùng mock data — fetch từ API)
│   ├── features/
│   │   ├── home/            # Trang chủ marketing (Hero, Features, Showcase, HowItWorks, Testimonials, CTA)
│   │   ├── templates/       # Danh sách mẫu (Templates.tsx) + Chi tiết mẫu (TemplateDetail.tsx)
│   │   ├── pricing/         # Bảng giá 3 gói + FAQ accordion
│   │   ├── contact/         # Form liên hệ/đặt thuê
│   │   ├── create/          # Editor tạo/sửa thiệp của KHÁCH (/tao-thiep/:templateSlug)
│   │   │   ├── CreateInvitation.tsx # Điều phối: auth gate → tạo đơn nháp → top bar + tab Chỉnh sửa/Xem trước
│   │   │   ├── InvitationForm.tsx   # Form full-width: section có toggle Hiện/Ẩn, nhà trai/gái 2 cột đối xứng
│   │   │   ├── buildPreviewInv.ts   # Map form state (Partial<Invitation>) → Invitation đầy đủ để render preview
│   │   │   └── CreateInvitation.css
│   │   ├── invitation/      # Thiệp sống — toàn bộ hệ thống render thiệp
│   │   │   ├── Invitation.tsx       # Điều phối: fetch data, nhạc nền, auto-scroll → InvitationView
│   │   │   ├── InvitationView.tsx   # DÙNG CHUNG: render cover+header+body THUẦN từ object Invitation (thiệp sống + editor preview)
│   │   │   ├── CoverGate.tsx        # Màn hình "Mở thiệp" (bìa)
│   │   │   ├── InvitationBody.tsx   # Nội dung dùng chung (lễ, countdown, địa điểm, album, QR, RSVP, guestbook)
│   │   │   ├── DecorationLayer.tsx  # Render + kéo-thả ảnh trang trí
│   │   │   ├── decorations.ts       # DecoConfig, DEFAULT_DECORATIONS, loadDecorations/save/reset
│   │   │   ├── themes.ts            # InvitationTheme tokens, THEMES registry
│   │   │   ├── types.ts             # Invitation interface (toàn bộ fields thiệp)
│   │   │   ├── useCountdown.ts      # Hook đếm ngược đến ngày cưới
│   │   │   ├── WeddingCalendar.tsx  # Hiển thị lịch âm dương
│   │   │   ├── GiftQR.tsx           # Section QR mừng cưới + thông tin ngân hàng
│   │   │   ├── InvitationForms.tsx  # Form RSVP + Form guestbook
│   │   │   └── layouts/
│   │   │       ├── index.ts         # LAYOUTS registry: { traditional, floral }
│   │   │       ├── types.ts         # CoverProps, HeaderProps, LayoutDef
│   │   │       ├── traditional.tsx  # Layout "Song Phụng Đỏ" (Cover + Header)
│   │   │       ├── floral.tsx       # Layout "Magnolia Xanh" (Cover + Header)
│   │   │       └── floral.css       # CSS riêng layout floral (prefix .flr-)
│   │   └── admin/
│   │       ├── Admin.tsx            # Login gate + router tab admin
│   │       ├── AdminDashboard.tsx   # Stats cards + Recharts charts
│   │       ├── AdminTemplates.tsx   # CRUD mẫu thiệp
│   │       ├── AdminDesigner.tsx    # Thiết kế mẫu: chỉnh màu + kéo-thả decorations
│   │       ├── DesignerPreview.tsx  # Preview thiệp trong AdminDesigner
│   │       ├── AdminInvitations.tsx # Danh sách thiệp + detail
│   │       ├── AdminTables.tsx      # Bảng đơn hàng, liên hệ, người dùng
│   │       ├── AdminMisc.tsx        # Gói giá, testimonials, cài đặt
│   │       ├── shared.ts            # Utility dùng chung trong admin
│   │       └── sampleInvitation.ts  # Invitation mẫu cho preview designer
│   ├── hooks/
│   │   └── useCatalog.ts    # useCatalog hook: fetch templates + plans + testimonials
│   ├── styles/
│   │   ├── variables.css    # CSS custom properties (color palette, spacing)
│   │   ├── globals.css      # Base styles, font import
│   │   └── reset.css        # CSS reset
│   ├── App.tsx              # Route definitions + layout wrappers
│   └── main.tsx             # Entry point Vite
├── backend/
│   ├── public/
│   │   ├── index.php        # Entry point + array-based router
│   │   └── .htaccess        # Apache rewrite rules
│   ├── src/
│   │   ├── bootstrap.php    # Load config, khởi tạo session, CORS headers
│   │   ├── Database.php     # PDO singleton, query/fetch/execute helpers
│   │   ├── Request.php      # getBody(), getParam() — parse JSON input
│   │   ├── Response.php     # ok(), error() — JSON output helpers
│   │   └── Auth.php         # requireLogin(), requireAdmin(), currentUser()
│   ├── controllers/
│   │   ├── CatalogController.php        # Public: templates, plans, testimonials
│   │   ├── ContactController.php        # Public: gửi liên hệ
│   │   ├── InvitationPublicController.php # Public: xem thiệp, RSVP, guestbook
│   │   ├── AuthController.php           # register, login, logout, me
│   │   ├── CustomerController.php       # orders, my invitations
│   │   └── AdminController.php          # Toàn bộ admin endpoints
│   ├── config/
│   │   └── config.php       # DB credentials, CORS origins, app_secret, assets_dir
│   └── database/
│       ├── schema.sql        # DDL — 10 bảng (utf8mb4)
│       ├── seed.sql          # Dữ liệu mẫu: templates, plans, testimonials
│       └── make_admin.php    # Tạo user admin (password_hash bcrypt)
├── docs/                     # Tài liệu dự án (nguồn chân lý)
│   ├── HUONG-DAN-LAM-MAU-THIEP.md  # Hướng dẫn thêm mẫu thiệp + pitfalls
│   ├── project-overview-pdr.md
│   ├── codebase-summary.md
│   ├── code-standards.md
│   └── system-architecture.md
├── CLAUDE.md                 # Spec dự án (design system, tech stack, conventions)
├── index.html                # HTML template Vite
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 2. Vai trò từng phần

### Frontend — `src/`

| Phần | Vai trò |
|------|---------|
| `api/client.ts` | Duy nhất fetch ra ngoài. Tất cả module dùng các helper export từ đây (`catalogApi`, `authApi`, `adminApi`, `invitationApi`, `contactApi`). Tự động gửi cookie session (`credentials: 'include'`). |
| `features/home` | Landing page marketing, render hoàn toàn từ dữ liệu API (templates, plans, testimonials). |
| `features/templates` | Danh sách + chi tiết mẫu, nút "Xem Demo" mở `/thiep/demo/:slug`. |
| `features/invitation` | Hệ thống thiệp sống: Invitation điều phối → chọn layout → render Cover + InvitationBody. DecorationLayer render ảnh trang trí có thể kéo-thả (khi `?edit`). |
| `features/admin` | Toàn bộ admin panel. Admin.tsx kiểm tra auth, AdminDesigner là công cụ chỉnh thiết kế mẫu. |
| `context/ThemeContext` | Dark/light toggle. Class `[data-theme="light"]` trên `<html>`. Lưu preference vào `localStorage`. |
| `styles/variables.css` | Nguồn chân lý CSS tokens (màu, spacing). Tất cả component dùng `var(--...)`. |

### Backend — `backend/`

| Phần | Vai trò |
|------|---------|
| `public/index.php` | Router mảng tĩnh. Match `METHOD + regex pattern` → gọi `[Controller, method]`. Không có framework, không DI container. |
| `src/bootstrap.php` | Khởi chạy session PHP, set CORS headers từ `config.php`, load autoloader. |
| `src/Database.php` | PDO singleton. Cung cấp `query()` (SELECT), `execute()` (INSERT/UPDATE/DELETE), `fetch()`, `fetchAll()`. |
| `src/Auth.php` | `requireLogin()` / `requireAdmin()` dừng request nếu không có session. `currentUser()` trả thông tin từ `$_SESSION`. |
| `controllers/` | Mỗi controller = static class, method nhận params từ URL. Gọi `Database`, trả `Response::ok()` hoặc `Response::error()`. |
| `config/config.php` | Trả array PHP. Không có `.env` — sửa trực tiếp file này khi deploy. |

### Database — `juntech_wedding`

10 bảng, tất cả `utf8mb4_unicode_ci`:

| Bảng | Mục đích |
|------|---------|
| `users` | Admin + khách hàng, phân quyền bằng `role` ENUM |
| `templates` | Catalog mẫu thiệp. Cột `design` JSON = `{theme, decorations[]}`. Cột `layout` = tên layout code. |
| `pricing_plans` | 3 gói thuê (basic/premium/vip). `features` JSON. `duration_days` tính expiry. |
| `testimonials` | Nhận xét khách hàng hiển thị marketing. |
| `contact_requests` | Form liên hệ/đặt thuê. Trạng thái: new/contacted/done/spam. |
| `orders` | Đơn thuê: `user_id + template_id + plan_id`. `payment_status` mặc định `unpaid`. |
| `invitations` | Thiệp sống. 1 order → 1 invitation. Lưu nội dung (tên, ngày, địa điểm, gallery, loveStory, settings JSON). **Cột `extra` JSON** (rev2): ảnh đôi (groomPhoto/bridePhoto), danh xưng/tên ngắn, brideFirst, intro, dressCode{note,colors}, schedule[], thanks, envelope, `visible{}` (cờ Hiện/Ẩn từng khối). `FamilyInfo` thêm `title`. |
| `rsvps` | Khách mời xác nhận tham dự. Foreign key → `invitations`. |
| `guestbook` | Lời chúc. `is_approved` để admin duyệt. |
| `settings` | Key-value cấu hình website (skey, svalue). |

## 3. Điểm vào (Entry Points)

- **Frontend**: `src/main.tsx` → `<App />` (BrowserRouter + ThemeProvider)
- **Backend**: `backend/public/index.php` — mọi request `/api/*` vào đây
- **DB setup**: `backend/database/schema.sql` → `seed.sql` → `make_admin.php`

## 4. Luồng dữ liệu chính

```
Browser
  │
  ├─ React Component
  │     └─ gọi catalogApi / adminApi / invitationApi (src/api/client.ts)
  │           └─ fetch(BASE + path, { credentials:'include' })
  │
  ├─ HTTP Request → backend/public/index.php
  │     └─ bootstrap.php (session, CORS)
  │     └─ Router match METHOD + regex path
  │           └─ Controller::method($urlParam...)
  │                 └─ Auth::requireLogin() (nếu cần)
  │                 └─ Request::getBody() (parse JSON input)
  │                 └─ Database::query() / execute() (PDO + prepared statements)
  │                 └─ Response::ok($data) / Response::error($msg, $code)
  │
  └─ JSON response → ApiResponse<T> → React state update → re-render
```

### Luồng thiệp sống (invitation render)

```
/thiep/:slug
  └─ Invitation.tsx  → invitationApi.view(slug) (hoặc demo / draft owner)
        └─ InvitationView (DÙNG CHUNG)
              └─ LAYOUTS[layout] → Cover + Header (DecorationLayer zone cover/body)
              └─ InvitationBody (lễ, ảnh đôi, intro, countdown, địa điểm, album, dress code, lịch trình, QR, RSVP, guestbook, cảm ơn, phong bì — ẩn/hiện theo extra.visible)
```
`.inv-root` giới hạn `max-width:520px` căn giữa (desktop) + backdrop `::before` full-viewport → hoạ tiết (% bề ngang) không phình to.

### Luồng editor tạo thiệp (render-from-state, KHÔNG iframe)

```
/tao-thiep/:templateSlug → CreateInvitation.tsx
  └─ useAuth(): chưa login → openLogin() (LoginModal popup)
  └─ có user → customerApi.createOrder() → slug nháp → getInvitation() → form state
  └─ Top bar sticky: brand · nav · chip mẫu · [Chỉnh sửa | Xem trước] (giữa) · Tiếng Việt · Lưu · Đăng thiệp
  └─ Tab "Chỉnh sửa" → InvitationForm (form full-width căn giữa)
  └─ Tab "Xem trước" → InvitationView(buildPreviewInv(form)) — render TĨNH, fill REAL-TIME từ state (không iframe/websocket)
  └─ Lưu → customerApi.updateInvitation(slug, form)  |  Đăng → publish(slug)
```

### Luồng coverflow trang chủ (Showcase — nhẹ, không iframe)

```
Home.tsx → Showcase
  └─ mỗi card = <img src="/invitation/thumbs-full/<slug>.webp">  (KHÔNG iframe)
  └─ card giữa: ảnh tự cuộn dọc bằng CSS animation cf-scroll (GPU, ~60fps)
  └─ bấm card giữa → TemplateModal (1 iframe khi mở — không lag vì chỉ 1)
```
> ⚠️ Ảnh `thumbs-full/*.webp` là **chụp sẵn** → xem mục [Quy trình mẫu thiệp mới](#5-quy-trình-mẫu-thiệp-mới-quan-trọng).

## 5. Quy trình mẫu thiệp mới (QUAN TRỌNG)

**Hai loại "mẫu mới":**

1. **Cùng layout, chỉ đổi màu + hoạ tiết** → Admin tự làm, **KHÔNG cần code**:
   `/admin` → Mẫu thiệp → Thêm → chọn layout (`traditional`/`floral`) → AdminDesigner chỉnh `theme` + kéo-thả `decorations` → Lưu.
2. **Layout mới hoàn toàn** (bố cục khác) → **CẦN code**: thêm file vào `src/features/invitation/layouts/` + đăng ký `index.ts`. Theo `docs/HUONG-DAN-LAM-MAU-THIEP.md`.

**⚠️ Lỗ hổng hiện tại — ảnh coverflow không tự cập nhật:**
Coverflow trang chủ đọc ảnh `public/invitation/thumbs-full/<slug>.webp` **chụp sẵn**. Khi admin thêm/sửa mẫu, ảnh này **KHÔNG tự sinh** → mẫu mới không hiện (hoặc hiện ảnh cũ).
- **Cách xử lý tạm (thủ công):** chạy `node .claude/skills/chrome-devtools/scripts/capture_full.js` (yêu cầu dev server + backend đang chạy) để chụp lại toàn bộ ảnh.
- **Khuyến nghị (roadmap, ưu tiên cao):** Admin cần **nút "Tạo lại ảnh preview"** — backend trigger headless browser chụp `/thiep/demo/<slug>` → lưu `thumbs-full/`, để mẫu mới tự lên coverflow không cần thao tác tay. Xem [Roadmap](./project-roadmap.md).

---

Xem thêm: [System Architecture](./system-architecture.md) | [Code Standards](./code-standards.md) | [Project Overview](./project-overview-pdr.md)
