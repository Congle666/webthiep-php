# Phase 04 — UX Polish (Scroll reveal + Typography đồng nhất)

## Context links
- Overview: [plan.md](plan.md)
- Nghiệp vụ: [docs/PHAN-TICH-NGHIEP-VU-THIEP.md](../../docs/PHAN-TICH-NGHIEP-VU-THIEP.md) §5 P4.
- Bẫy specificity: [docs/HUONG-DAN-LAM-MAU-THIEP.md](../../docs/HUONG-DAN-LAM-MAU-THIEP.md).

## Overview
- Date: 2026-06-26 · Priority: THẤP (đánh bóng) · Status: PLANNED
- Mịn hoá scroll reveal (framer-motion ĐÃ có) + đồng nhất typography thiệp (script/serif/sans nhất quán mọi layout), né bẫy `.inv-root h1`.

## Key Insights
- `InvitationBody.tsx` đã dùng `revealAnim` (dòng 24-29): `opacity 0→1, y 26→0, duration .6 easeOut, viewport once`. Ổn nhưng đồng loạt, thiếu stagger cho grid (album/countdown).
- `staticMode` tắt animation (dòng 30,81) — giữ cho ảnh export/SSR.
- Typography phân tán giữa `Invitation.css`, `layouts/floral.css`, `layouts/traditional.css` → dễ lệch font tên CD-CR / tiêu đề. CLAUDE.md ChungĐôi spec: Cormorant/Dancing/Inter.

## Requirements
1. Scroll reveal mượt hơn: thêm stagger cho phần tử con trong grid; tránh giật trên mobile.
2. Typography đồng nhất: 1 nguồn biến font (script tên, serif tiêu đề, sans body) áp mọi layout.
3. Không phá `staticMode`.
4. Né bẫy specificity `.inv-root h1` (heading layout bị global override).

## Architecture
- Định nghĩa variants chung trong `InvitationBody.tsx` (hoặc tách `motion-variants.ts`): `container` (staggerChildren 0.08) + `item` (fadeInUp). Áp container cho section có nhiều con (album grid, countdown grid).
- Biến font tập trung: thêm vào `Invitation.css :root` (scope `.inv-root`):
  ```css
  --inv-font-script: 'Dancing Script', cursive;
  --inv-font-serif:  'Cormorant Garamond', serif;
  --inv-font-body:   'Inter', sans-serif;
  ```
  Các layout css dùng biến thay hardcode (DRY).
- Fix specificity: mọi heading thiệp dùng class (`.inv-h2`, `.inv-couple-name`) — KHÔNG selector trần `h1/h2`; nếu có global `.inv-root h1` thì tăng cụ thể bằng class.

## Related code files (đường dẫn thật)
- `src/features/invitation/InvitationBody.tsx` — refactor `revealAnim` → container/item variants; áp stagger cho `inv-album-grid` (dòng 167), `inv-countdown-grid` (dòng 204).
- `src/features/invitation/Invitation.css` — biến font tập trung + transition.
- `src/features/invitation/layouts/floral.css` — dùng biến font, kiểm specificity.
- `src/features/invitation/layouts/traditional.css` — dùng biến font, kiểm specificity.
- (optional) `src/features/invitation/motion-variants.ts` — **MỚI** nếu tách variants.

## Implementation Steps
1. Tách/định nghĩa `container`+`item` variants; giữ `staticMode` trả `{}`.
2. Áp stagger cho 2 grid (album, countdown); kiểm mobile không giật (giảm y, dùng `margin` viewport hợp lý).
3. Thêm biến font vào `.inv-root`; thay hardcode font trong 3 file css.
4. Rà selector heading trần → đổi sang class; test specificity.
5. Test desktop + mobile, light/dark thiệp đỏ, staticMode.

## Todo list
- [ ] container/item variants + stagger 2 grid
- [ ] giữ staticMode tắt anim
- [ ] biến font tập trung .inv-root
- [ ] 3 file css dùng biến font
- [ ] fix selector heading trần
- [ ] test mobile/desktop/static

## Success Criteria
- Reveal mượt, grid stagger; không giật mobile.
- Font tên/tiêu đề/body nhất quán mọi layout.
- staticMode vẫn tắt animation; không regression heading.

## Risk Assessment
- THẤP toàn phase. Rủi ro nhỏ: stagger gây trễ cảm giác → giữ delay ≤0.1s.
- TB: đổi biến font có thể lệch layout cũ → so sánh trước/sau từng layout.

## Security Considerations
- Thuần CSS/animation, không input người dùng. Không có bề mặt tấn công mới.

## Next steps
→ Phase cuối. Sau đó cập nhật `docs/HUONG-DAN-LAM-MAU-THIEP.md` ghi chuẩn font + variants để mẫu mới tuân theo.
