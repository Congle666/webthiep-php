# Phase 01 — Tên CD-CR lên header Long Phụng

Priority: HIGH | Status: ⬜ TODO

## Mục tiêu
Long Phụng: tên CD-CR ở TRÊN CÙNG (trên phượng/banner), giống ChungĐôi.
Floral: GIỮ NGUYÊN (tên đã trong khung oval ở header rồi).

## Cách (KISS)
1. `traditional.tsx` — `TraditionalHeader` render tên CD-CR phía trên `inv-header`/banner.
2. `InvitationBody.tsx` — ẩn section "TÊN CÔ DÂU CHÚ RỂ" khi `inv.layout === 'traditional'` (vì đã đưa lên header). Floral cũng đã có tên ở header → ẩn luôn cho cả floral để tránh lặp.
   → Thực tế: section couple names trong body chỉ hiện cho layout KHÔNG có tên ở header. Cả traditional + floral đều có header tên → ẩn cho cả 2.

## Steps
1. Sửa `traditional.tsx`: thêm block tên CD-CR (dùng class `.inv-lp-names`) phía trên `<header className="inv-header">`.
2. Tạo CSS `.inv-lp-names` trong `traditional.css` (tạo file mới, import vào traditional.tsx).
3. Sửa `InvitationBody.tsx`: bọc section couple names trong điều kiện `inv.layout !== 'traditional' && inv.layout !== 'floral'` (mặc định ẩn vì 2 layout này có tên header). Giữ logic an toàn: nếu layout lạ thì vẫn hiện.

## Files
- src/features/invitation/layouts/traditional.tsx
- src/features/invitation/layouts/traditional.css (NEW)
- src/features/invitation/InvitationBody.tsx

## Success
- LP demo: tên trên cùng, căn giữa, trên phượng
- Floral demo: tên vẫn trong khung, body không lặp tên
- tsc sạch
