# JunTech — Project Overview & PDR

> Cập nhật lần cuối: 2026-06-17

## 1. Vấn đề giải quyết

Thiệp cưới truyền thống in giấy tốn kém, chậm, khó cá nhân hóa và không gửi được qua ứng dụng nhắn tin. JunTech cung cấp dịch vụ **thuê thiệp cưới kỹ thuật số** (digital invitation): cặp đôi chọn mẫu, điền thông tin, nhận link thiệp sống và chia sẻ qua Zalo, Messenger, SMS — không cần in ấn.

## 2. Đối tượng người dùng

| Nhóm | Nhu cầu chính |
|------|---------------|
| **Cặp đôi (khách hàng)** | Tạo thiệp cưới đẹp nhanh chóng, gửi link cho quan khách |
| **Quản trị viên (admin)** | Quản lý danh mục mẫu thiệp, đơn thuê, liên hệ, thiết kế mẫu |

## 3. Tính năng chính

### Marketing (trang công khai)
- Trang chủ: hero, giới thiệu tính năng, showcase mẫu, quy trình 3 bước, testimonials
- Danh sách mẫu thiệp (`/mau-thiep`) — lọc theo danh mục, xem demo trực tiếp
- Chi tiết mẫu thiệp (`/mau-thiep/:slug`) — gallery, gói giá, demo link
- Bảng giá (`/bang-gia`) — 3 gói: Cơ Bản / Cao Cấp / VIP
- Form liên hệ/đặt thuê (`/lien-he`)

### Thiệp sống (invitation)
- URL công khai `/thiep/:slug` — hiển thị thiệp cưới đầy đủ
- URL demo `/thiep/demo/:slug` — xem trước không cần order
- Bìa thiệp (CoverGate) — hiệu ứng mở thiệp
- Nội dung dùng chung (InvitationBody): thông tin lễ, đếm ngược, lịch âm, địa điểm, album, QR mừng cưới, RSVP, sổ lưu bút
- Hệ thống layout đa mẫu: `traditional` (Song Phụng Đỏ), `floral` (Magnolia Xanh), dễ mở rộng

### Tài khoản khách hàng
- Đăng ký / đăng nhập
- Tạo đơn thuê (chọn mẫu + gói)
- Xem và chỉnh nội dung thiệp của mình
- Publish thiệp (chọn slug)

### Admin
- Dashboard: thống kê (số mẫu, đơn, thiệp, khách hàng, liên hệ mới, doanh thu)
- Biểu đồ Recharts: doanh thu theo tháng, phân bổ danh mục, phân bổ trạng thái
- Quản lý: mẫu thiệp, đơn thuê, liên hệ, người dùng, gói giá, testimonials, cài đặt
- **AdminDesigner**: kéo-thả ảnh trang trí, chỉnh màu theme, lưu `design` JSON vào DB
- Thư viện ảnh: upload ảnh trang trí, quản lý `public/invitation/`

## 4. Phạm vi đã làm / chưa làm

### Đã có
- Toàn bộ giao diện marketing (landing page, template catalog, pricing, contact). Coverflow trang chủ dùng ảnh `.webp` (không iframe → mượt ~60fps).
- Hệ thống thiệp sống: 2 layouts (traditional, floral), DecorationLayer kéo-thả. `InvitationView` dùng chung. `.inv-root` 520px căn giữa.
- **Editor khách tự tạo/sửa thiệp** `/tao-thiep/:slug`: form full-width có toggle Hiện/Ẩn, preview render-from-state (không iframe), Lưu + Đăng thiệp.
- **Auth toàn site**: `AuthContext` + `LoginModal` popup; Header Đăng nhập/Đăng xuất.
- DB cột `extra` JSON (ảnh đôi, dress code, lịch trình, cảm ơn, phong bì, cờ Hiện/Ẩn).
- REST API PHP đầy đủ (public + auth + customer + admin). Auth session cookie (HttpOnly, SameSite=Lax). Admin panel + AdminDesigner. Schema DB + seed.

### Chưa có / TODO (chi tiết ở [project-roadmap.md](./project-roadmap.md))
- **Thanh toán**: đơn `payment_status='unpaid'`, admin xác nhận tay. Chưa tích hợp cổng.
- Trang **"Thiệp Của Tôi"** `/tai-khoan` chưa có (Header/nav đã trỏ tới).
- **Đổi mẫu** trong editor chưa hoạt động; **song ngữ** Việt/En mới là UI; upload ảnh thật cho ảnh đôi/album (hiện nhập URL).
- ⚠️ **Coverflow:** ảnh chụp sẵn, chưa tự sinh lại khi đổi mẫu → cần chức năng admin "Tạo lại ảnh preview".
- Chưa có email thông báo / reset mật khẩu / tests tự động.

## 5. Yêu cầu sản phẩm

### Chức năng (Functional)
- FR-01: Khách không đăng nhập có thể xem mẫu thiệp, gói giá, gửi liên hệ
- FR-02: Thiệp sống (`/thiep/:slug`) accessible không cần đăng nhập, chỉ cần `is_published=1`
- FR-03: Demo thiệp (`/thiep/demo/:slug`) luôn accessible để xem trước
- FR-04: Khách hàng đăng ký/đăng nhập để tạo đơn thuê
- FR-05: Admin có thể thiết kế mẫu (theme + decorations) không cần sửa code
- FR-06: RSVP và guestbook submit công khai, guestbook duyệt bởi admin

### Phi chức năng (Non-functional)
- NFR-01: SPA React — load nhanh, không reload trang khi điều hướng
- NFR-02: Responsive: mobile (<640px), tablet (640-1024px), desktop (>1024px)
- NFR-03: Dark mode mặc định (marketing site), light mode thiệp cưới (cream/đỏ truyền thống)
- NFR-04: utf8mb4 xuyên suốt (DB + PDO + JSON) — tiếng Việt + emoji không lỗi
- NFR-05: Session cookie phải dùng `localhost` (không `127.0.0.1`) để cookie đồng nhất
- NFR-06: TypeScript strict — không `any` trừ chỗ thực sự cần

## 6. Roadmap ngắn

Xem chi tiết: **[project-roadmap.md](./project-roadmap.md)**. Ưu tiên gần:

| Ưu tiên | Hạng mục |
|---------|----------|
| P1 | Admin "Tạo lại ảnh preview" coverflow (mẫu mới tự lên trang chủ) |
| P1 | Trang "Thiệp Của Tôi" `/tai-khoan` + đổi mẫu trong editor |
| P1 | Tích hợp thanh toán (SePay/VNPay) |
| P2 | Upload ảnh thật (ảnh đôi/album), song ngữ Việt/En, email thông báo |
| P3 | Thêm layouts mới, SEO nâng cao, tests tự động |

---

Xem thêm: [Codebase Summary](./codebase-summary.md) | [System Architecture](./system-architecture.md) | [Code Standards](./code-standards.md)
