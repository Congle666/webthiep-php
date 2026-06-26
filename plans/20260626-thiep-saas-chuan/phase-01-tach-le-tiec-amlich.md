# Phase 01 — Tách Lễ cưới / Tiệc cưới + Âm lịch VN

## Context links
- Overview: [plan.md](plan.md)
- Nghiệp vụ: [docs/PHAN-TICH-NGHIEP-VU-THIEP.md](../../docs/PHAN-TICH-NGHIEP-VU-THIEP.md) §3 (khối 4 vs 6), §5 P1.
- Sai lầm đã gặp: [docs/HUONG-DAN-LAM-MAU-THIEP.md](../../docs/HUONG-DAN-LAM-MAU-THIEP.md)

## Overview
- Date: 2026-06-26 · Priority: CAO (nghiệp vụ lõi) · Status: PLANNED
- Tách 2 sự kiện riêng: **Lễ thành hôn** (tư gia, giờ + địa điểm riêng) vs **Tiệc cưới** (nhà hàng, đón khách + khai tiệc). Hiện chỉ 1 mốc `wedding_date` + `reception_time`.
- Thêm **âm lịch**: hiển thị "(Tức ngày X tháng Y năm Z âm lịch)" dưới mỗi ngày dương.

## Key Insights
- Hiện tại `wedding_date` bị dùng nhập nhằng: vừa là "khai tiệc" (xem `InvitationBody.tsx:184-189` block `inv-two-time`) vừa là mốc countdown/calendar/gcal. `reception_time` = giờ đón khách.
- ChungĐôi tách HẲN: khối 4 = Lễ tại TƯ GIA (giờ lễ + ngày + âm lịch); khối 6 = Tiệc tại nhà hàng (đón khách/khai tiệc + ngày + âm lịch). 2 ngày có thể KHÁC nhau.
- → Cần model 2 sự kiện. Giữ `wedding_date` làm mốc CHÍNH (countdown/calendar) để không vỡ logic cũ; thêm dữ liệu lễ + dữ liệu tiệc.

## Requirements
1. Data: lưu được (a) lễ: giờ + ngày + địa điểm tư gia + địa chỉ; (b) tiệc: giờ đón khách + giờ khai tiệc + ngày + nhà hàng + địa chỉ + map.
2. Render: 2 section riêng "LỄ THÀNH HÔN" và "TIỆC CƯỚI" trên thiệp, mỗi cái có ngày dương + (âm lịch).
3. Toggle hiện/ẩn từng section (lễ có thể ẩn nếu chỉ làm tiệc).
4. i18n: nhãn lễ/tiệc cho 12 ngôn ngữ (âm lịch chỉ hiện khi lang chính = vi).
5. Editor (UserPanel/InvitationForm) nhập đủ field mới.
6. Không vỡ thiệp cũ (backward-compat: thiếu field → fallback `wedding_date`).

## Architecture

### Lựa chọn data model — dùng JSON `extra` (KISS, không migrate SQL)
Thêm vào `InvitationExtra` (cột `extra` đã tồn tại, không cần ALTER TABLE):
```ts
// types.ts — InvitationExtra
ceremony?: {            // Lễ thành hôn (tư gia)
  enabled?: boolean;
  datetime?: string;    // "2026-11-20 09:00"
  venue?: string;       // "Tư gia nhà gái"
  address?: string;
};
reception?: {           // Tiệc cưới (nhà hàng) — chi tiết bổ sung
  welcomeTime?: string; // giờ đón khách "17:00" (thay role reception_time cũ)
  banquetTime?: string; // giờ khai tiệc "18:30"
  // ngày/venue tiệc DÙNG LẠI wedding_date + venue_name/address hiện có (DRY)
};
```
> Quyết định: KHÔNG thêm cột SQL. Lễ/tiệc không cần query/index → JSON `extra` đủ. `wedding_date`+`venue_*` = ngày/nơi TIỆC (mốc chính). Lễ nằm trong `extra.ceremony`. Giữ `receptionTime` cũ để backward-compat, map sang `extra.reception.welcomeTime` ở editor.

### Âm lịch — quyết định lib
2 phương án:
- **A. `lunar-javascript` (npm)**: chính xác, đủ can-chi, +~40KB bundle. `npm i lunar-javascript`.
- **B. Thuật toán Hồ Ngọc Đức** (tự viết `lunar.ts` ~120 dòng, 0 dep): đủ cho "ngày/tháng/năm âm" + năm can-chi. Khuyến nghị KISS.
→ **Chọn B** (file `src/features/invitation/lunar.ts`): hàm `solarToLunar(d: Date): {day,month,year,canChi,isLeap}` + `fmtLunarVi(d): string` → "ngày 12 tháng 10 năm Bính Ngọ". Chỉ gọi khi lang chính = 'vi'.

## Related code files (đường dẫn thật)
- `src/features/invitation/types.ts` — thêm `ceremony`/`reception` vào `InvitationExtra`; thêm `'ceremony'`,`'reception'` vào `SectionVisibility`.
- `src/features/invitation/InvitationBody.tsx` — tách block thời gian (hiện 1 block `inv-time` dòng 176-190) thành 2 section Lễ + Tiệc; thêm dòng âm lịch.
- `src/features/invitation/lunar.ts` — **MỚI**, thuật toán âm lịch.
- `src/features/invitation/i18n.ts` — thêm key `ceremonyTitle`, `receptionTitle`, `welcomeGuests`, `lunarPrefix` cho 12 ngôn ngữ (đã có `reception/banquet/ceremonyAt`).
- `src/features/create/InvitationForm.tsx` — form nhập lễ/tiệc.
- `src/features/user/UserPanel.tsx` — nếu edit nội dung ở đây.
- `backend/controllers/CustomerController.php` — `updateInvitation()` đã whitelist `extra` (dòng 117) → KHÔNG cần đổi BE nếu dùng `extra`. Map `receptionTime` vẫn giữ.
- `backend/src/bootstrap.php` — `mapInvitation()` đã trả `extra` (dòng 102) → không đổi.
- `backend/database/schema.sql` — KHÔNG đổi (dùng JSON extra). Ghi comment cập nhật role `wedding_date`.

## Implementation Steps
1. Viết `lunar.ts` + unit test nhanh (vài ngày đã biết: 2026-11-20 → âm lịch đúng).
2. Mở rộng `InvitationExtra` trong `types.ts` (+ `SectionVisibility`).
3. i18n: thêm 4 key × 12 ngôn ngữ.
4. `InvitationBody.tsx`: thay block `inv-time` đơn → 2 motion.section: "LỄ" (nếu `ex.ceremony?.enabled`) dùng `ceremony.datetime`; "TIỆC" dùng `wedding_date` + `welcomeTime/banquetTime`. Mỗi section thêm `<p className="inv-lunar">{fmtLunarVi(...)}</p>` khi lang vi.
5. Editor: thêm field giờ/ngày/địa điểm lễ + giờ đón/khai tiệc; map `welcomeTime`→ `receptionTime` để backward-compat.
6. Test thật: tạo thiệp có lễ ≠ ngày tiệc, kiểm tra render + âm lịch + ẩn lễ.

## Todo list
- [ ] `lunar.ts` solarToLunar + fmtLunarVi
- [ ] types: extra.ceremony, extra.reception, visibility ceremony/reception
- [ ] i18n 4 key × 12 lang
- [ ] InvitationBody: 2 section Lễ/Tiệc + dòng âm lịch
- [ ] Editor form fields + backward-compat map
- [ ] Test ngày lễ ≠ ngày tiệc; test thiệp cũ không vỡ

## Success Criteria
- Thiệp hiện 2 mốc riêng khi có dữ liệu lễ; chỉ tiệc khi không.
- Âm lịch đúng (đối chiếu lịch vạn niên 3 ngày mẫu).
- Thiệp cũ (không có `extra.ceremony`) render y như trước.

## Risk Assessment
- **TB**: thuật toán âm lịch sai lệch ±1 ngày nếu múi giờ sai → ép tính theo GMT+7. Test kỹ giao mùng 1.
- THẤP: nhầm vai trò `wedding_date` → ghi rõ comment + giữ backward-compat.

## Security Considerations
- `extra` là JSON do user nhập → đã `json_encode(JSON_UNESCAPED_UNICODE)` ở BE; render qua React (auto-escape). Không cho HTML thô. Validate độ dài chuỗi địa chỉ ở form.

## Next steps
→ Phase 02 (guest management) độc lập, có thể song song. Sau khi P1 ổn data model, cập nhật seed mẫu để demo lễ/tiệc.
