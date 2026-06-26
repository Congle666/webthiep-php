# Phase 03 — Template Engine: `frameType` (ảnh-based vs code-based)

## Context links
- Overview: [plan.md](plan.md)
- Nghiệp vụ: [docs/PHAN-TICH-NGHIEP-VU-THIEP.md](../../docs/PHAN-TICH-NGHIEP-VU-THIEP.md) §2 (2 nhóm template), §5 P3.
- Bắt buộc đọc: [docs/HUONG-DAN-LAM-MAU-THIEP.md](../../docs/HUONG-DAN-LAM-MAU-THIEP.md) (kiến trúc Layout × Theme × Decoration, z-index chữ/ảnh).

## Overview
- Date: 2026-06-26 · Priority: TB · Status: PLANNED
- Hỗ trợ 2 nhóm mẫu: **ảnh-based** (PNG decoration: phượng, nhật bình — đẹp/nặng) và **code-based** (SVG/CSS: khung viền, oval — nhẹ, đổi màu dễ). Thêm `frameType` chọn cách render khung.

## Key Insights
- Hệ hiện tại: khung/hoạ tiết = ẢNH (`DecoConfig.src` luôn trỏ file webp, `decorations.ts`). KHÔNG có đường vẽ SVG/CSS.
- ChungĐôi đo thật: nhóm A (`long-phung`, `nhat-binh`) frameUsesImg=true; nhóm B (`song-hy`, `minimalism`) frameUsesImg=false dùng SVG/CSS.
- **Rủi ro lớn:** vẽ SVG phượng/nhật bình chi tiết = tốn công vô ích. → SVG/CSS CHỈ dùng cho khung ĐƠN GIẢN (đường viền, oval, góc hoa văn hình học). Hoạ tiết phức tạp GIỮ PNG. (YAGNI)

## Requirements
1. Template design khai báo `frameType: 'image' | 'svg' | 'none'`.
2. `image`: render như hiện tại (DecoConfig PNG). `svg`: render component khung vẽ bằng SVG/CSS (param màu/độ dày). `none`: không khung (minimalist trắng).
3. AdminDesigner cho chọn frameType khi tạo/sửa mẫu.
4. Backward-compat: mẫu cũ không có frameType → coi như `'image'`.

## Architecture

### Data
`InvitationDesign` (`types.ts`) thêm:
```ts
export interface InvitationDesign {
  theme?: Record<string, string>;
  decorations?: DecoConfig[];
  frameType?: 'image' | 'svg' | 'none';   // default 'image'
  frameStyle?: { variant?: string; color?: string; stroke?: number }; // cho svg
}
```
Lưu trong cột `templates.design` JSON (đã tồn tại, schema.sql:42) → KHÔNG ALTER TABLE.

### Render
- Component MỚI `src/features/invitation/FrameSvg.tsx`: nhận `variant` ('oval' | 'border' | 'corners') + màu → trả SVG/CSS thuần. Bắt đầu 2-3 variant đơn giản (KISS), KHÔNG vẽ phượng.
- Layer chọn theo `frameType`:
  - `image` → giữ `DecorationLayer.tsx` hiện tại.
  - `svg` → render `<FrameSvg>` (z-index thấp hơn chữ — theo HUONG-DAN mục z-index).
  - `none` → bỏ qua.
- Điểm cắm: nơi layout render decoration (`layouts/traditional.tsx`, `layouts/floral.tsx`, `DecorationLayer.tsx`).

## Related code files (đường dẫn thật)
- `src/features/invitation/types.ts` — `InvitationDesign` + frameType/frameStyle.
- `src/features/invitation/decorations.ts` — helper `frameTypeOf(design)` default 'image'.
- `src/features/invitation/FrameSvg.tsx` — **MỚI**, khung SVG/CSS (oval/border/corners).
- `src/features/invitation/DecorationLayer.tsx` — switch theo frameType.
- `src/features/invitation/layouts/traditional.tsx`, `layouts/floral.tsx` — cắm FrameSvg khi frameType='svg'.
- `src/features/admin/AdminDesigner.tsx` + `AdminDesigner.css` — UI chọn frameType + frameStyle (màu/độ dày), preview.
- `src/features/admin/DesignerPreview.tsx` — preview phản ánh frameType.
- `backend/database/seed_templates_v2.php` — thêm 1-2 mẫu code-based demo (song-hỷ SVG, minimalist none) để chứng minh engine.
- `backend` mapping: `templates.design` đã trả qua `mapInvitation()` field `design` (bootstrap.php:105) → không đổi BE.

## Implementation Steps
1. types: thêm frameType/frameStyle.
2. `FrameSvg.tsx`: variant `oval` (ellipse stroke), `border` (khung chữ nhật bo góc), `corners` (4 góc hoa văn CSS). Param màu từ `theme`.
3. `DecorationLayer.tsx`: đọc `design.frameType`, render nhánh phù hợp.
4. Cắm vào 2 layout; kiểm z-index (khung dưới chữ).
5. AdminDesigner: dropdown frameType + color picker + stroke; live preview.
6. Seed 1 mẫu `svg` + 1 mẫu `none` demo.
7. Test: mẫu cũ (image) không đổi; mẫu svg đổi màu chạy; none sạch.

## Todo list
- [ ] types frameType/frameStyle + helper default
- [ ] FrameSvg.tsx (3 variant đơn giản)
- [ ] DecorationLayer switch theo frameType
- [ ] Cắm 2 layout + fix z-index
- [ ] AdminDesigner UI chọn frame
- [ ] Seed mẫu demo svg + none
- [ ] Test backward-compat + đổi màu

## Success Criteria
- 3 frameType render đúng; mẫu image cũ y nguyên.
- SVG đổi màu/độ dày qua AdminDesigner không cần ảnh mới.
- Bundle không phình (không thêm lib nặng).

## Risk Assessment
- **CAO**: cám dỗ vẽ SVG phức tạp → giới hạn 3 variant hình học. Hoạ tiết phức tạp = PNG. Ghi rõ trong code comment.
- TB: z-index khung đè chữ (bẫy đã ghi trong HUONG-DAN) → test kỹ.
- THẤP: AdminDesigner phình UI → chỉ lộ frameStyle khi frameType='svg'.

## Security Considerations
- `frameStyle.color` user nhập → validate là mã màu hợp lệ (regex `#[0-9a-fA-F]{3,8}` hoặc tên CSS whitelist) trước khi inject vào SVG/style, tránh CSS injection.
- frameType là enum đóng → reject giá trị lạ ở BE/FE.

## Next steps
→ Sau khi engine ổn, có thể mở rộng thư viện variant. Liên quan P4 (typography đồng nhất giữa các frameType).
