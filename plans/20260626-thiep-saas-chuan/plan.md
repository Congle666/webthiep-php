# Plan: Nâng cấp thiệp cưới online → chuẩn SaaS (ChungĐôi/Cinelove)

> Date: 2026-06-26 · Owner: JunTech · Status: PLANNED
> Context: [docs/PHAN-TICH-NGHIEP-VU-THIEP.md](../../docs/PHAN-TICH-NGHIEP-VU-THIEP.md) · [docs/HUONG-DAN-LAM-MAU-THIEP.md](../../docs/HUONG-DAN-LAM-MAU-THIEP.md)

## Mục tiêu
Đưa thiệp sống (`/thiep/:slug`) lên chuẩn SaaS: tách Lễ/Tiệc + âm lịch, quản lý khách mời thật (DB), template engine 2 nhóm (ảnh/code), UX polish. Honoring YAGNI/KISS/DRY.

## Kiến trúc hiện tại (đã scan)
- FE: Vite+React+TS. Thiệp sống = `Invitation.tsx` → `InvitationView.tsx` → `InvitationBody.tsx` (CHUNG mọi layout) + layout wrapper (`layouts/traditional.tsx`, `layouts/floral.tsx`).
- Data: `src/features/invitation/types.ts` (`Invitation`, `InvitationExtra`, `InvitationSettings`). Khối ngoài schema cũ nhét vào cột JSON `extra`.
- Trang trí: `decorations.ts` (`DecoConfig` — toàn ảnh PNG/webp theo zone cover/body/header).
- BE: PHP thuần PDO. `backend/database/schema.sql` (bảng `invitations`, `rsvps`, `guestbook`, `templates`). `mapInvitation()` ở `backend/src/bootstrap.php`. CRUD chủ thiệp ở `CustomerController.php`, public view ở `InvitationPublicController.php`.
- i18n thiệp: `src/features/invitation/i18n.ts` (12 ngôn ngữ, đã có `ceremonyAt/reception/banquet/monthLabel/familyTitle`).
- **Phát hiện then chốt:** UserPanel.tsx ĐÃ có tab "Khách mời" nhưng lưu `localStorage` (`juntech_guests_${slug}`) — chưa có DB/RSVP per-guest.

## 4 Phase

| # | Phase | Ưu tiên | Rủi ro | File |
|---|-------|---------|--------|------|
| 1 | Tách Lễ/Tiệc + Âm lịch VN | CAO (lõi) | TB (cần lib âm lịch) | [phase-01-tach-le-tiec-amlich.md](phase-01-tach-le-tiec-amlich.md) |
| 2 | Guest management (DB + link riêng + RSVP per-guest) | CAO | CAO (feature lớn, migrate localStorage) | [phase-02-guest-management.md](phase-02-guest-management.md) |
| 3 | Template engine `frameType` (ảnh vs SVG/CSS) | TB | CAO (SVG phượng khó) | [phase-03-template-engine-frametype.md](phase-03-template-engine-frametype.md) |
| 4 | UX polish (scroll reveal + typography) | THẤP | THẤP | [phase-04-ux-polish.md](phase-04-ux-polish.md) |

## Thứ tự thực thi đề xuất
P1 → P2 (độc lập, P2 chạy song song được) → P3 → P4. P1 đụng data model nhiều nhất nên làm trước.

## Nguyên tắc xuyên suốt
- JSON `extra` là nơi mở rộng MẶC ĐỊNH — chỉ thêm cột SQL khi cần index/query. (KISS)
- Mọi field mới phải qua: `types.ts` → `mapInvitation()` → whitelist `updateInvitation()` → form editor → render. Bỏ sót 1 mắt xích = mất dữ liệu.
- Tuân thủ HUONG-DAN-LAM-MAU-THIEP.md (encoding utf8mb4, z-index chữ/ảnh, toạ độ theo block, clamp kéo-thả).

## Câu hỏi mở (toàn dự án)
- Lib âm lịch: bundle `lunar-javascript` (~tăng bundle) hay tự viết thuật toán Hồ Ngọc Đức (~150 dòng, không dep)? → xem P1.
- Guest link: token riêng (`/thiep/slug?g=token`) hay giữ `?khach=Tên` hiện tại? → xem P2.
