# JunTech Backend — PHP + MySQL (XAMPP)

Backend PHP thuần (PDO, không framework) cho web thuê thiệp cưới online. REST API trả JSON.

## Yêu cầu
- XAMPP (Apache + MySQL/MariaDB, PHP 8.0+)

## Cài đặt (5 bước)

1. **Copy thư mục** `backend/` vào `C:\xampp\htdocs\juntech-api`
   (sao cho có `C:\xampp\htdocs\juntech-api\public\index.php`)

2. **Bật Apache + MySQL** trong XAMPP Control Panel.

3. **Tạo database** — mở http://localhost/phpmyadmin → tab SQL, chạy lần lượt:
   - `database/schema.sql`
   - `database/seed.sql`

4. **Tạo admin** (mật khẩu hash đúng) — mở terminal:
   ```
   C:\xampp\php\php.exe database\make_admin.php
   ```
   → admin: `admin@juntech.vn` / `Admin@123`

5. **Kiểm tra**: mở http://localhost/juntech-api/public/api
   → `{"success":true,"data":{"service":"JunTech API",...}}`

> Nếu muốn URL gọn `http://localhost/juntech-api/api`, trỏ DocumentRoot hoặc Alias vào thư mục `public`. Đơn giản nhất: đặt nội dung thư mục `public` ngay tại `htdocs/juntech-api` và sửa đường dẫn require trong `index.php` (hoặc giữ `/public/api` và set `VITE_API_URL` tương ứng).

## Cấu hình DB
Sửa `config/config.php` nếu MySQL có user/pass khác (XAMPP mặc định `root` / rỗng).

## Danh sách API

### Public
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET  | `/templates?category=&q=` | Danh sách mẫu thiệp |
| GET  | `/templates/{slug}` | Chi tiết mẫu |
| GET  | `/plans` | Gói giá |
| GET  | `/testimonials` | Nhận xét |
| POST | `/contact` | Gửi form liên hệ/đặt thuê |
| GET  | `/thiep/{slug}` | Xem thiệp sống (đã publish) |
| POST | `/thiep/{slug}/rsvp` | Khách xác nhận tham dự |
| POST | `/thiep/{slug}/guestbook` | Khách gửi lời chúc |

### Auth
| POST | `/auth/register` · `/auth/login` · `/auth/logout` | |
| GET  | `/auth/me` | Thông tin tài khoản hiện tại |

### Customer (cần đăng nhập)
| POST | `/orders` | Tạo đơn thuê → tự tạo thiệp nháp |
| GET  | `/orders` | Đơn của tôi |
| GET  | `/my/invitations` | Thiệp của tôi |
| GET/PUT | `/my/invitations/{slug}` | Xem/sửa nội dung thiệp |
| POST | `/my/invitations/{slug}/publish` | Đăng thiệp (chọn slug đẹp) |

### Admin (role=admin)
| GET  | `/admin/stats` | Dashboard |
| POST/PUT/DELETE | `/admin/templates[/{id}]` | CRUD mẫu thiệp |
| GET/PATCH | `/admin/orders[/{id}]` | Xem/xác nhận đơn (thanh toán tay) |
| GET/PATCH | `/admin/contacts[/{id}]` | Xử lý liên hệ |
| GET  | `/admin/users` | Danh sách người dùng |

## Bảo mật
- PDO prepared statements (chống SQL injection)
- `password_hash` bcrypt
- Session cookie HttpOnly + SameSite=Lax
- CORS giới hạn origin frontend (sửa trong `config.php`)
- Validation đầu vào ở mọi endpoint ghi dữ liệu

## Thanh toán
Chưa tích hợp cổng — đơn lưu `payment_status='unpaid'`. Admin xác nhận tay qua
`PATCH /admin/orders/{id}` (set `paid`). Có thể gắn SePay webhook sau (skill `integrate:sepay`).
