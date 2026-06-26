# Fix Bố Cục CHỮ Thiệp (Long Phụng + Floral)

> Theo brainstorm 2026-06-25. Vấn đề: bố cục CHỮ (thứ tự khối + khoảng cách), KHÔNG phải ảnh trang trí.

## Vấn đề (user xác nhận)
1. **Long Phụng**: tên CD-CR đang nằm GIỮA (sau family) → muốn lên **TRÊN CÙNG trên phượng**
2. **Cả 2 thiệp**: khoảng cách khối chữ quá CHẬT → bị đè/chen → muốn **THOÁNG như ChungĐôi**

## Quyết định (brainstorm)
- Tên LP lên header (cách A — KISS, đúng kiến trúc "Header khác nhau mỗi layout")
- Bỏ `margin-bottom: -65px` của floral header
- Tăng spacing dọc các section

## Phases
| # | Phase | Status |
|---|-------|--------|
| 01 | Tên CD-CR lên header Long Phụng | ✅ DONE |
| 02 | Spacing thoáng cả 2 thiệp | ✅ DONE |
| 03 | Test + verify trên browser (Puppeteer screenshot) | ✅ DONE |

## Files đụng tới
- `src/features/invitation/layouts/traditional.tsx` (thêm tên CD-CR vào header)
- `src/features/invitation/layouts/traditional.css` (CSS tên header LP — tạo mới nếu chưa có)
- `src/features/invitation/InvitationBody.tsx` (ẩn section couple names khi layout=traditional)
- `src/features/invitation/Invitation.css` (spacing + header height)
- `src/features/invitation/layouts/floral.css` (bỏ margin âm)

## Success
- LP: tên CD-CR trên cùng, trên phượng, căn giữa, không bị phượng đè
- Floral: family cách khung hoa thoáng, không đè
- Cả 2: section cách nhau rộng rãi như ChungĐôi
- `npx tsc --noEmit` sạch
