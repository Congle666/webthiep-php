# JunTech — Thuê Thiệp Cưới Online

Dịch vụ thuê thiệp cưới kỹ thuật số. Cặp đôi chọn mẫu, điền thông tin, nhận link thiệp sống và chia sẻ qua Zalo, Messenger, SMS.

## Tech Stack

| Phần | Công nghệ |
|------|-----------|
| Frontend | Vite + React 18 + TypeScript |
| Styling | Vanilla CSS (CSS variables, BEM-ish) — KHÔNG TailwindCSS |
| Animation | Framer Motion |
| Charts (admin) | Recharts |
| Icons | Lucide React |
| Routing | React Router v6 |
| State | React Context API |
| Backend | PHP 8.0+ (plain PDO, không framework) |
| Database | MySQL / MariaDB (XAMPP) |
| Deploy | Static hosting (Vercel/Netlify) + PHP hosting |

## Cấu Trúc Nhanh

```
web-thiep/
├── src/
│   ├── api/client.ts          # API client (fetch + helpers)
│   ├── features/
│   │   ├── home/              # Landing page marketing
│   │   ├── templates/         # Danh sách + chi tiết mẫu thiệp
│   │   ├── pricing/           # Bảng giá
│   │   ├── contact/           # Form liên hệ
│   │   ├── invitation/        # Thiệp sống (/thiep/:slug)
│   │   │   └── layouts/       # Layout registry: traditional, floral
│   │   └── admin/             # Admin panel + AdminDesigner
│   ├── styles/variables.css   # CSS tokens (màu, spacing)
│   └── App.tsx                # Routes
├── backend/
│   ├── public/index.php       # Entry point + router
│   ├── src/                   # Database, Auth, Request, Response
│   ├── controllers/           # CatalogController, AdminController, ...
│   ├── config/config.php      # DB credentials, CORS
│   └── database/
│       ├── schema.sql         # DDL 10 bảng (utf8mb4)
│       ├── seed.sql           # Dữ liệu mẫu
│       └── make_admin.php     # Tạo admin account
├── docs/                      # Tài liệu (xem mục Tài Liệu bên dưới)
└── public/invitation/         # Ảnh trang trí thiệp (webp)
```

## Cài Đặt & Chạy

### Yêu cầu

- Node.js 18+
- XAMPP (Apache + MySQL/MariaDB, PHP 8.0+)

### 1. Frontend

```bash
# Cài dependencies
npm install

# Tạo file env (điều chỉnh URL backend nếu khác)
echo "VITE_API_URL=http://localhost:8899/api" > .env.local

# Chạy dev server (port 5173)
npm run dev
```

> Dùng `http://localhost:5173` (không `127.0.0.1`) để session cookie hoạt động.

### 2. Backend (XAMPP)

```bash
# Copy backend/ vào htdocs XAMPP
# Windows: C:\xampp\htdocs\juntech-api\
# Sao cho có: C:\xampp\htdocs\juntech-api\public\index.php

# Bật Apache + MySQL trong XAMPP Control Panel
```

Hoặc chạy PHP built-in server (không cần XAMPP Apache):

```bash
cd backend
php -S 0.0.0.0:8899 -t public
```

> Dùng `http://localhost:8899/api` làm `VITE_API_URL`.

### 3. Database

Mở http://localhost/phpmyadmin → tab SQL, chạy lần lượt:

```sql
-- 1. Tạo schema + bảng
source database/schema.sql

-- 2. Import dữ liệu mẫu
source database/seed.sql
```

Hoặc qua command line (bắt buộc set charset để tiếng Việt không lỗi):

```bash
mysql --default-character-set=utf8mb4 -u root < backend/database/schema.sql
mysql --default-character-set=utf8mb4 -u root juntech_wedding < backend/database/seed.sql
```

### 4. Tạo tài khoản Admin

```bash
# Windows XAMPP
C:\xampp\php\php.exe backend/database/make_admin.php

# Hoặc nếu PHP trong PATH
php backend/database/make_admin.php
```

Tài khoản mặc định: `admin@juntech.vn` / `Admin@123`

### 5. Kiểm tra

- Frontend: http://localhost:5173
- API health: http://localhost:8899/api → `{"success":true,"data":{"service":"JunTech API",...}}`
- Admin panel: http://localhost:5173/admin

## Lưu Ý Quan Trọng

**Cookie session**: Phải dùng `localhost` cho cả frontend lẫn backend. Nếu frontend dùng `localhost:5173` mà `VITE_API_URL` trỏ `127.0.0.1:8899`, cookie sẽ không được gửi → đăng nhập thất bại.

**Thanh toán**: Chưa tích hợp. Đơn hàng tạo với `payment_status='unpaid'`, admin xác nhận tay qua `/admin/orders`.

**Import SQL tiếng Việt**: Luôn dùng `--default-character-set=utf8mb4`. Không dùng console Windows mặc định (cp850) để import — chữ Việt sẽ bị vỡ.

**Ảnh coverflow trang chủ**: Coverflow dùng ảnh `.webp` chụp sẵn ở `public/invitation/thumbs-full/<slug>.webp` (không nhúng iframe → mượt). Ảnh **không tự cập nhật** khi thêm/sửa mẫu. Sau khi đổi mẫu, chạy lại:
```bash
node .claude/skills/chrome-devtools/scripts/capture_full.js   # cần dev server + backend đang chạy
```
→ Khuyến nghị làm chức năng admin tự chụp, xem [docs/project-roadmap.md](docs/project-roadmap.md).

## Tài Liệu

| File | Nội dung |
|------|---------|
| [docs/project-overview-pdr.md](docs/project-overview-pdr.md) | Tổng quan dự án, PDR |
| [docs/project-roadmap.md](docs/project-roadmap.md) | Roadmap: đã xong / tồn đọng / khuyến nghị (gồm quy trình mẫu mới) |
| [docs/codebase-summary.md](docs/codebase-summary.md) | Cây thư mục, vai trò từng phần, luồng dữ liệu |
| [docs/system-architecture.md](docs/system-architecture.md) | Kiến trúc hệ thống, API endpoints, DB schema |
| [docs/code-standards.md](docs/code-standards.md) | Chuẩn code, CSS conventions, z-index, decoration rules |
| [docs/HUONG-DAN-LAM-MAU-THIEP.md](docs/HUONG-DAN-LAM-MAU-THIEP.md) | Hướng dẫn thêm mẫu thiệp mới, các pitfalls đã gặp |
| [backend/README.md](backend/README.md) | Hướng dẫn cài đặt backend chi tiết |

## Các Trang

| URL | Mô tả |
|-----|-------|
| `/` | Trang chủ marketing |
| `/mau-thiep` | Danh sách mẫu thiệp |
| `/mau-thiep/:slug` | Chi tiết mẫu thiệp |
| `/bang-gia` | Bảng giá 3 gói |
| `/lien-he` | Form liên hệ/đặt thuê |
| `/thiep/:slug` | Thiệp sống (public) |
| `/thiep/demo/:slug` | Xem demo thiệp |
| `/tao-thiep/:templateSlug` | Editor khách tạo/sửa thiệp (cần đăng nhập — popup) |
| `/admin` | Admin panel |
