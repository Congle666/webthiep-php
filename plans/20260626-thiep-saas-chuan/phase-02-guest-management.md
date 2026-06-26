# Phase 02 — Guest Management (DB + link riêng + RSVP per-guest)

## Context links
- Overview: [plan.md](plan.md)
- Nghiệp vụ: [docs/PHAN-TICH-NGHIEP-VU-THIEP.md](../../docs/PHAN-TICH-NGHIEP-VU-THIEP.md) §4 (guest mgmt), §5 P2.

## Overview
- Date: 2026-06-26 · Priority: CAO · Status: PLANNED
- Chủ thiệp tạo DANH SÁCH khách mời, mỗi khách 1 link riêng (chèn tên + token), theo dõi RSVP per-guest (ai đã mở, ai xác nhận đi/không).

## Key Insights
- **UserPanel.tsx ĐÃ có tab "Khách mời"** nhưng lưu `localStorage` (`juntech_guests_${slug}`, hàm `getGuests/saveGuests` dòng 21-28) — KHÔNG bền, không cross-device, không liên kết RSVP. → Cần thay bằng DB.
- Thiệp public đã nhận tên khách qua `?khach=` (`InvitationView.tsx` prop `guestName`, dòng 34/39/86). Tái dùng cơ chế này.
- Bảng `rsvps` hiện có (schema.sql:170) chỉ có `guest_name` tự do — KHÔNG link tới guest cụ thể. Cần thêm `guest_id` nullable để map RSVP ↔ khách trong danh sách (vẫn cho RSVP tự do nếu null).

## Requirements
1. CRUD khách mời lưu DB (thêm/sửa/xóa, theo từng thiệp).
2. Mỗi khách: tên, token duy nhất, link riêng, trạng thái RSVP, lượt mở (optional).
3. Copy link riêng + copy/tải QR cho từng khách.
4. RSVP từ link riêng tự gắn vào đúng guest.
5. Chủ thiệp xem tổng quan: tổng khách / đã xác nhận / từ chối / chưa trả lời.
6. Migrate (hoặc bỏ) dữ liệu localStorage cũ.

## Architecture

### DB — bảng mới `guests`
```sql
CREATE TABLE guests (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invitation_id INT UNSIGNED NOT NULL,
  name          VARCHAR(120) NOT NULL,
  token         VARCHAR(24)  NOT NULL UNIQUE,   -- link riêng /thiep/slug?g=token
  tag           VARCHAR(60)  DEFAULT NULL,       -- "Nhà gái","Bạn CR" (optional, group)
  rsvp_status   ENUM('pending','yes','no','maybe') NOT NULL DEFAULT 'pending',
  rsvp_count    TINYINT UNSIGNED NOT NULL DEFAULT 1,
  opened_at     DATETIME DEFAULT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE,
  INDEX idx_guests_inv (invitation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE rsvps ADD COLUMN guest_id INT UNSIGNED DEFAULT NULL AFTER invitation_id,
  ADD FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE SET NULL;
```
File migration MỚI: `backend/database/add_guests.sql` (KHÔNG sửa schema.sql gốc trực tiếp — append + note).

### Link riêng
Giữ `?khach=Tên` (tương thích) + thêm `?g=token`. Thiệp public: nếu có `?g=token` → BE lookup guest, set `opened_at`, trả về tên để hiện ở CoverGate; RSVP submit kèm token → gắn `guest_id` + cập nhật `guests.rsvp_status`.

### API (backend)
- `CustomerController` (chủ thiệp, cần auth + sở hữu):
  - `GET  /api/my/invitations/{slug}/guests` — list + thống kê.
  - `POST /api/my/invitations/{slug}/guests` — thêm (sinh token random 12-16 ký tự).
  - `PUT  /api/my/invitations/{slug}/guests/{id}` — sửa tên/tag.
  - `DELETE /api/my/invitations/{slug}/guests/{id}`.
- `InvitationPublicController`:
  - `view()` mở rộng: nếu `?g=token` hợp lệ → set `opened_at`, trả `guestName`.
  - `rsvp()` mở rộng: nhận `token` optional → resolve `guest_id`, UPDATE `guests.rsvp_status`/`rsvp_count`.

## Related code files (đường dẫn thật)
- `backend/database/add_guests.sql` — **MỚI** (bảng guests + ALTER rsvps).
- `backend/controllers/CustomerController.php` — thêm 4 endpoint guests (cạnh `getInvitation`/`updateInvitation` dòng 85-136; pattern `ownInvitation()` dùng lại).
- `backend/controllers/InvitationPublicController.php` — mở rộng `view()` (dòng 6) + `rsvp()` (dòng 30) xử lý token.
- `backend/public/index.php` (hoặc router) — đăng ký route mới. *(scan để xác nhận file định tuyến — `backend/public/router.php`/`index.php`.)*
- `backend/src/bootstrap.php` — nếu cần helper map guest.
- `src/features/user/UserPanel.tsx` — thay `getGuests/saveGuests` localStorage (dòng 21-28) bằng gọi API; tab "Khách mời" (Tab `'guests'` dòng 19) render list + nút copy link/QR (đã có `QrModal` dòng 40) + thống kê RSVP.
- `src/api/client.ts` — thêm `customerApi.guests.*`.
- `src/features/invitation/InvitationView.tsx` — đọc `?g=` (cạnh `?khach=`), truyền token cho RsvpForm.
- `src/features/invitation/InvitationForms.tsx` — `RsvpForm` gửi kèm token.
- `src/features/invitation/types.ts` — thêm interface `Guest` (chuẩn DB, khác `Guest` localStorage cũ trong UserPanel).

## Implementation Steps
1. `add_guests.sql` + chạy migrate trên XAMPP.
2. BE: 4 endpoint CRUD guests + token gen (`bin2hex(random_bytes(8))`). Validate sở hữu qua `ownInvitation()`.
3. BE: mở rộng public `view()`/`rsvp()` cho token.
4. FE api client + types `Guest`.
5. UserPanel: thay localStorage → API; UI list, thêm/xóa, copy link `?g=token`, QR per-guest, thẻ thống kê (đã có Recharts import dòng 12 → pie trạng thái RSVP).
6. InvitationView/RsvpForm: truyền token.
7. Migrate: nút "Nhập từ danh sách cũ" đọc localStorage 1 lần (optional) hoặc bỏ qua.
8. Test: tạo 3 khách, mở link riêng, RSVP, kiểm tra thống kê + opened_at.

## Todo list
- [ ] add_guests.sql (bảng + ALTER rsvps.guest_id)
- [ ] BE CRUD guests (4 endpoint) + token gen
- [ ] BE view()/rsvp() xử lý ?g=token
- [ ] Đăng ký routes
- [ ] FE api client + type Guest
- [ ] UserPanel tab Khách mời dùng DB + copy link/QR + thống kê
- [ ] RsvpForm gửi token
- [ ] Test end-to-end + xử lý localStorage cũ

## Success Criteria
- Khách mời lưu DB, hiện cross-device.
- Link `?g=token` mở đúng tên + ghi `opened_at`; RSVP gắn đúng guest, cập nhật trạng thái.
- Thống kê tổng/đi/không/chưa chính xác.

## Risk Assessment
- **CAO**: feature lớn (DB + 6 endpoint + UI + migrate). Chia nhỏ: làm CRUD trước, token/RSVP-link sau.
- TB: trùng `?khach=` cũ vs `?g=` mới → ưu tiên token, fallback khach.
- THẤP: token đoán được → dùng random_bytes (không sequential).

## Security Considerations
- CRUD guests CHỈ chủ thiệp (kiểm `ownInvitation()` — đã có pattern).
- Public lookup token KHÔNG lộ danh sách khách khác; chỉ trả tên của token đó.
- Rate-limit RSVP submit (tránh spam ghi `guests.rsvp_status`). Validate token tồn tại + thuộc đúng invitation.
- Token unique, đủ dài (≥12 hex). Không log token.

## Next steps
→ Có thể ghép thống kê guest vào Admin "Thiệp sống". Phase độc lập với P1/P3/P4.
