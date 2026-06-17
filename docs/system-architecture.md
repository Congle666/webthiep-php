# JunTech — Kiến Trúc Hệ Thống

> Cập nhật lần cuối: 2026-06-17

## 1. Tổng Quan Tầng

```
┌─────────────────────────────────────────────────────────┐
│                   BROWSER (Client)                       │
│                                                          │
│  React SPA (Vite + TypeScript)                          │
│  ├── Marketing: Home (coverflow ảnh .webp), Templates…   │
│  ├── Invitation: /thiep/:slug  (thiệp sống công khai)   │
│  ├── Editor:  /tao-thiep/:slug (khách tạo thiệp)         │
│  ├── Auth:    AuthContext + LoginModal (popup toàn site) │
│  └── Admin Panel: /admin                                 │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS  credentials:include (session cookie)
                     │ Base URL: VITE_API_URL  (default: http://localhost:8899/api)
┌────────────────────▼────────────────────────────────────┐
│              PHP REST API (plain PHP, PDO)               │
│                                                          │
│  backend/public/index.php  ← entry point                │
│  ├── bootstrap.php  (session start, CORS headers)        │
│  ├── Router (array-based regex match)                    │
│  └── Controllers:                                        │
│      ├── CatalogController    (public catalog)           │
│      ├── ContactController    (form liên hệ)             │
│      ├── InvitationPublicController (thiệp + RSVP)       │
│      ├── AuthController       (register/login/me)        │
│      ├── CustomerController   (orders, my invitations)   │
│      └── AdminController      (full admin CRUD)          │
└────────────────────┬────────────────────────────────────┘
                     │ PDO prepared statements (utf8mb4)
┌────────────────────▼────────────────────────────────────┐
│              MySQL / MariaDB  (XAMPP)                    │
│              Database: juntech_wedding                   │
│              Charset: utf8mb4_unicode_ci                 │
└─────────────────────────────────────────────────────────┘
```

## 2. Auth Session Flow

```
Browser                    PHP Backend               Database
   │                           │                         │
   │── POST /auth/login ───────▶                         │
   │   {email, password}       │── SELECT user by email ▶│
   │                           │◀── user row ────────────│
   │                           │── password_verify()     │
   │                           │── $_SESSION['user_id']  │
   │                           │   $_SESSION['role']     │
   │◀── Set-Cookie: PHPSESSID ─│                         │
   │    (HttpOnly, SameSite=Lax)                          │
   │                           │                         │
   │── GET /admin/stats ───────▶                         │
   │   Cookie: PHPSESSID=...   │── Auth::requireAdmin()  │
   │                           │   kiểm tra $_SESSION    │
   │◀── JSON stats data ───────│                         │
```

**Quan trọng**: Frontend phải dùng `http://localhost` (không `http://127.0.0.1`) để cookie domain khớp với backend. Cả frontend (`:5173`) lẫn backend (`:8899`) phải cùng host `localhost`.

## 3. Multi-Layout Template Architecture

Công thức: **1 Layout (code) × 1 Theme (màu JSON) × N Decorations (ảnh JSON) = 1 mẫu thiệp**

```
templates (DB)
├── layout: "traditional" | "floral" | ...  ← key vào LAYOUTS registry
└── design: {
      theme: { bg, accent, accentDeep, text, heading, ... },
      decorations: [
        { id, src, top, left, width, rotate, flip, z, opacity, zone:'cover'|'body' },
        ...
      ]
    }

LAYOUTS registry (src/features/invitation/layouts/index.ts)
├── traditional → { Cover: TraditionalCover, Header: TraditionalHeader }
└── floral      → { Cover: FloralCover,      Header: FloralHeader      }

Invitation.tsx (runtime)
├── fetch template → lấy layout key + design JSON
├── LAYOUTS[template.layout] → Cover + Header components
├── InvitationBody → dùng chung (không phụ thuộc layout)
└── DecorationLayer → render decorations, split theo zone
```

### Cấu trúc Render Thiệp

```
<Invitation>
  ├── <CoverGate>   ← màn mở thiệp
  │     └── LAYOUTS[layout].Cover
  │           └── <DecorationLayer zone="cover" decos={coverDecos} />
  │
  └── (sau khi mở)
        ├── LAYOUTS[layout].Header
        │     └── <DecorationLayer zone="body" decos={bodyDecos} />
        └── <InvitationBody>   ← DÙNG CHUNG tất cả layouts
              ├── Thông tin lễ (tên cặp đôi, ngày, giờ)
              ├── <WeddingCalendar>  (lịch âm dương)
              ├── Địa điểm + bản đồ
              ├── Album ảnh
              ├── <GiftQR>  (QR + thông tin ngân hàng)
              ├── <InvitationForms>  (RSVP + Guestbook)
              └── Footer
```

## 4. Admin Designer Flow

```
AdminDesigner.tsx
  │
  ├── Load: catalogApi.templates() + adminApi.assets()
  ├── Chọn mẫu → adminApi.templateDetail(id) → load theme + decorations
  │
  ├── Tab "Bìa thiệp"  (zone='cover')
  │     ├── <DesignerPreview zone="cover" />
  │     │     └── LAYOUTS[layout].Cover  (editable=true)
  │     │           └── <DecorationLayer editable onDecoChange />
  │     └── Panel trái: chỉnh màu, thư viện ảnh, slider size/rotate/z
  │
  ├── Tab "Nội dung"  (zone='body')
  │     └── tương tự với Header + InvitationBody
  │
  └── Lưu → adminApi.updateDesign(id, { theme, decorations })
              → PUT /admin/templates/{id}/design
              → UPDATE templates SET design=? WHERE id=?
```

Kéo-thả decoration: `DecorationLayer` lắng nghe `onMouseDown → mousemove → mouseup`, tính `top/left` theo `%` toàn trang, báo `onDecoChange` lên AdminDesigner để cập nhật state.

## 5. Public Invitation Render Flow

```
User mở /thiep/huy-anh
  └── Invitation.tsx mount
        └── invitationApi.view('huy-anh')
              → GET /api/thiep/huy-anh
              → InvitationPublicController::view()
                    → kiểm tra is_published=1 + expires_at
                    → trả JOIN: invitation + template.design + template.layout
              → Invitation render với data đầy đủ
```

Demo (không cần published): `/thiep/demo/:slug` → `GET /api/demo/:slug` → không kiểm tra `is_published`.

## 6. Danh Sách API Endpoints

### Public (không cần auth)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/templates` | Danh sách mẫu thiệp (`?category=&q=`) |
| GET | `/templates/{slug}` | Chi tiết mẫu |
| GET | `/demo/{slug}` | Demo thiệp (không cần published) |
| GET | `/plans` | Gói giá |
| GET | `/testimonials` | Nhận xét |
| POST | `/contact` | Gửi form liên hệ |
| GET | `/thiep/{slug}` | Xem thiệp sống (phải published) |
| POST | `/thiep/{slug}/rsvp` | Khách xác nhận tham dự |
| POST | `/thiep/{slug}/guestbook` | Gửi lời chúc |

### Auth

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/auth/register` | Đăng ký tài khoản |
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/logout` | Đăng xuất |
| GET | `/auth/me` | Thông tin tài khoản hiện tại |

### Customer (cần đăng nhập)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/orders` | Tạo đơn thuê |
| GET | `/orders` | Danh sách đơn của tôi |
| GET | `/my/invitations` | Danh sách thiệp của tôi |
| GET | `/my/invitations/{slug}` | Chi tiết thiệp |
| PUT | `/my/invitations/{slug}` | Cập nhật nội dung thiệp |
| POST | `/my/invitations/{slug}/publish` | Đăng thiệp |

### Admin (cần role=admin)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/stats` | Dashboard stats |
| GET | `/admin/charts` | Biểu đồ doanh thu/danh mục/trạng thái |
| POST | `/admin/templates` | Tạo mẫu thiệp mới |
| GET | `/admin/templates/{id}` | Chi tiết mẫu (bao gồm design) |
| PUT | `/admin/templates/{id}` | Cập nhật thông tin mẫu |
| PUT | `/admin/templates/{id}/design` | Lưu design (theme + decorations) |
| DELETE | `/admin/templates/{id}` | Xóa mẫu |
| GET | `/admin/orders` | Danh sách đơn hàng |
| PATCH | `/admin/orders/{id}` | Cập nhật trạng thái đơn (xác nhận thanh toán) |
| GET | `/admin/contacts` | Danh sách liên hệ |
| PATCH | `/admin/contacts/{id}` | Cập nhật trạng thái liên hệ |
| GET | `/admin/users` | Danh sách người dùng |
| PATCH | `/admin/users/{id}` | Cập nhật trạng thái user |
| GET | `/admin/invitations` | Danh sách thiệp sống |
| GET | `/admin/invitations/{id}` | Chi tiết thiệp + RSVP + guestbook |
| PATCH | `/admin/guestbook/{id}` | Duyệt/từ chối lời chúc |
| GET | `/admin/plans` | Gói giá |
| PUT | `/admin/plans/{id}` | Cập nhật gói giá |
| GET | `/admin/testimonials` | Nhận xét |
| POST | `/admin/testimonials` | Thêm nhận xét |
| DELETE | `/admin/testimonials/{id}` | Xóa nhận xét |
| GET | `/admin/assets` | Thư viện ảnh trang trí |
| POST | `/admin/assets/upload` | Upload ảnh trang trí |
| GET | `/admin/settings` | Cài đặt website |
| PUT | `/admin/settings` | Cập nhật cài đặt |

## 7. Schema Database & Quan Hệ

```
users (id, full_name, email, phone, password_hash, role, status)
  │
  ├──< orders (id, order_code, user_id, template_id, plan_id, amount, payment_status, status)
  │         │        └── templates (id, slug, name, category, layout, design JSON, ...)
  │         │        └── pricing_plans (id, code, name, price, duration_days, ...)
  │         │
  │         └──< invitations (id, order_id, user_id, template_id, slug, ...)
  │                   │        [groom/bride info, dates, venue, gallery, love_story, settings JSON,
  │                   │         extra JSON ← ảnh đôi, dress code, lịch trình, lời cảm ơn, phong bì, visible{}]
  │                   │
  │                   ├──< rsvps (id, invitation_id, guest_name, attendance, guest_count)
  │                   └──< guestbook (id, invitation_id, guest_name, message, is_approved)
  │
  └── (contact_requests standalone, FK template_id nullable)

contact_requests (id, full_name, phone, email, template_id?, note, status)

testimonials (id, name, avatar, quote, rating, is_active)

settings (skey PK, svalue)
```

**Quyết định kiến trúc (rev2):**
- **Editor render-from-state:** tab "Xem trước" KHÔNG dùng iframe/websocket — render `InvitationView` trực tiếp từ React state (`buildPreviewInv`). Fill real-time, không độ trễ. `InvitationView` dùng chung cho cả thiệp sống.
- **Coverflow ảnh tĩnh:** trang chủ KHÔNG nhúng iframe (5 iframe = 5 React app gây lag) — dùng ảnh `.webp` full chụp sẵn (`thumbs-full/`) + CSS scroll. ⚠️ Ảnh chụp sẵn → cần regenerate khi đổi mẫu (xem roadmap).
- **`.inv-root` max-width 520px:** thiệp = khung dọc căn giữa trên desktop, tránh hoạ tiết (% bề ngang) phình to.

**Quan hệ chính:**
- `orders` → `users` (ON DELETE CASCADE)
- `orders` → `templates` (ON DELETE RESTRICT — không xóa mẫu đang được dùng)
- `orders` → `pricing_plans` (ON DELETE RESTRICT)
- `invitations` → `orders` (ON DELETE CASCADE, UNIQUE — 1 order = 1 invitation)
- `rsvps`, `guestbook` → `invitations` (ON DELETE CASCADE)

---

Xem thêm: [Codebase Summary](./codebase-summary.md) | [Code Standards](./code-standards.md) | [Project Overview](./project-overview-pdr.md)
