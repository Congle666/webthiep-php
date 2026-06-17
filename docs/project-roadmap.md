# JunTech — Project Roadmap

> Cập nhật: 2026-06-17

## ✅ Đã xong
- Landing page (Hero, Features, Showcase coverflow, How-it-works, Testimonials, CTA) — light+pink.
- Backend PHP/PDO + MySQL (utf8mb4): auth session cookie, catalog, orders, invitations, RSVP, guestbook, contact, admin.
- Thiệp sống `/thiep/:slug` đa layout (traditional "Song Phụng Đỏ", floral "Magnolia Xanh") — cover gate, nhạc nền, countdown, lịch, bản đồ, QR VietQR, RSVP, sổ lưu bút.
- `.inv-root` giới hạn 520px căn giữa (desktop) → hoạ tiết không phình to/đè chữ. Áp dụng cả editor preview.
- Admin panel: dashboard (Recharts), CRUD mẫu, AdminDesigner (chỉnh theme + kéo-thả decorations), đơn hàng, thiệp, gói giá, testimonials, người dùng, cài đặt.
- **Editor tạo thiệp `/tao-thiep/:slug`** (khách): 1 cột full-width, top bar sticky, tab Chỉnh sửa/Xem trước. Form đối xứng nhà trai/gái + toggle Hiện/Ẩn từng khối. Preview render **trực tiếp từ state** (không iframe), fill real-time.
- **Auth toàn site**: `AuthContext` + `LoginModal` popup; Header Đăng nhập/Đăng xuất; editor tự bật popup khi chưa login.
- DB cột `extra` JSON: ảnh đôi, dress code, lịch trình, lời cảm ơn, phong bì, cờ Hiện/Ẩn — render đầy đủ trên thiệp sống.
- **Coverflow trang chủ bỏ iframe** → ảnh `.webp` full + CSS scroll (GPU ~60fps), hết lag.

## 🚧 Đang/Chưa làm (tồn đọng)
| Việc | Ghi chú |
|------|---------|
| Trang **"Thiệp Của Tôi"** `/tai-khoan` | Nav + Header trỏ tới nhưng **route chưa tồn tại**. Cần trang liệt kê thiệp user + RSVP/guestbook. |
| **Đổi mẫu** trong editor | Chip tên mẫu chưa bấm được. Cần modal lưới chọn + API đổi `template_id`. |
| **Song ngữ** Việt/English | Dropdown mới là UI, chưa dịch nội dung. Cần field dịch trong DB. |
| **Upload ảnh thật** | Ảnh đôi/Album hiện nhập URL. Cần nút upload (đã có API upload cho admin, mở cho customer). |
| Floral gap nhỏ | Kiểm tra lại khoảng trống dưới khối cô dâu chú rể (nếu còn). |

## ⭐ Khuyến nghị (ưu tiên)
1. **[CAO] Admin "Tạo lại ảnh preview"** — coverflow dùng ảnh `thumbs-full/*.webp` chụp sẵn, **không tự cập nhật** khi thêm/sửa mẫu. Cần nút admin trigger chụp lại (headless browser → lưu webp). Nếu không, mỗi lần ra mẫu mới phải chạy tay `capture_full.js`. Xem [Codebase Summary §5](./codebase-summary.md#5-quy-trình-mẫu-thiệp-mới-quan-trọng).
2. **[TB] Thanh toán** — `orders.payment_status` hiện thủ công (admin xác nhận). Cân nhắc tích hợp cổng (VietQR/Sepay) khi cần.
3. **[TB] Thumbnail tự sinh khi publish** — gắn capture vào lúc admin lưu mẫu hoặc cron định kỳ.
4. **[THẤP] Trang chi tiết mẫu** dùng ảnh full thay iframe (đồng bộ với coverflow).

## 📌 Lưu ý vận hành
- Thêm mẫu **cùng layout**: Admin tự làm, không cần dev.
- Thêm **layout mới**: cần dev — theo `HUONG-DAN-LAM-MAU-THIEP.md`.
- Sau khi thêm/sửa mẫu: **chạy `capture_full.js`** để coverflow cập nhật (cho tới khi có chức năng admin tự động).
- Dev: dùng `localhost:5173` (frontend) + `0.0.0.0:8899` (PHP) để cookie same-site hoạt động. DB phải `utf8mb4`.
