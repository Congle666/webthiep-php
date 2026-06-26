# Phân Tích Nghiệp Vụ & Plan Template Chuẩn — Thiệp Cưới Online

> Phân tích ChungĐôi + Cinelove (đo thật bằng Puppeteer 2026-06) → plan template chuẩn SaaS.

## 1. Mô hình 2 đối thủ

| | ChungĐôi | Cinelove |
|--|----------|----------|
| Mô hình | SaaS cao cấp (trả phí) | Miễn phí, hướng cảm xúc |
| Điểm mạnh | Tách Lễ/Tiệc, âm lịch, guest mgmt, nhiều mẫu | Love story, ảnh immersive, reaction live |
| Section | 10 khối chuẩn | Ảnh nền + story + RSVP |

## 2. ⭐ PHÂN LOẠI TEMPLATE (then chốt — đo thật 5 mẫu ChungĐôi)

ChungĐôi chia template thành **2 NHÓM kỹ thuật**:

### Nhóm A — "Ảnh-based" (decoration nặng, dùng nhiều ảnh PNG)
- **long-phung-v3-do**: 43 ảnh, frameUsesImg=true — phượng/khung là ảnh
- **nhat-binh-do**: 42 ảnh, font Gotham — áo nhật bình, nhiều ảnh trang trí
- **hoa-moc-hong**: 27 ảnh, frameUsesImg=true
- → Đặc điểm: khung + hoạ tiết = ảnh PNG decoration. Đẹp, chi tiết, nhưng nặng.

### Nhóm B — "Code-based" (CSS/SVG thuần, ít ảnh)
- **song-hy-xanh**: 18 ảnh, frameUsesImg=FALSE, 12 svg — khung vẽ bằng SVG/CSS
- **minimalism-do**: 19 ảnh, frameUsesImg=FALSE, 23 svg — tối giản, đường nét SVG
- → Đặc điểm: khung/đường nét = SVG hoặc CSS border. Nhẹ, sắc nét mọi màn hình, dễ đổi màu.

**KẾT LUẬN:** Template chuẩn cần hỗ trợ CẢ 2: `frameType: 'image' | 'svg' | 'none'`.

## 3. Cấu trúc 10 KHỐI CHUẨN (thứ tự ChungĐôi)

1. **Cover/Gate** — "Nhấn để mở" + tên khách (?khach=)
2. **Header** — tên CD-CR (script font) + decoration (khung/phượng/hoa)
3. **Thông tin lễ cưới** — Nhà Trai/Nhà Gái 2 cột (Ông Bà + cha mẹ + địa chỉ)
4. **Tên CD-CR đầy đủ** — "TRÂN TRỌNG BÁO TIN / LỄ THÀNH HÔN..." + LỄ tại TƯ GIA + giờ + ngày dương + **(âm lịch)**
5. **Album ảnh cưới** — grid
6. **Thông tin TIỆC cưới** — TÁCH RIÊNG: giờ tiệc + đón khách/khai tiệc + ngày + (âm lịch)
7. **Calendar tháng** + đếm ngược + "Thêm vào lịch"
8. **Tiệc tổ chức tại** — venue + map
9. **(Dress code — optional)**
10. **Lịch trình ngày cưới** — timeline (đón khách → khai tiệc → ...)
11. **Sổ lưu bút** — RSVP + lời chúc (realtime)
12. **Phong bao mừng cưới** — QR VietQR

## 4. So với hệ thống của mình (gap analysis)

| Nghiệp vụ | Mình có? | Cần làm |
|-----------|----------|---------|
| Tách Lễ/Tiệc cưới | ❌ chỉ 1 thời gian | ✅ thêm tiệc riêng (giờ/địa điểm) |
| Âm lịch | ❌ | ✅ tính + hiển thị "(Tức ngày X)" |
| Guest management | ⚠️ có ?khach= | ✅ panel tạo danh sách + link riêng |
| frameType (image/svg) | ⚠️ chỉ image deco | ✅ thêm option svg/none |
| Scroll reveal | ⚠️ có framer-motion | ✅ tinh chỉnh smooth |
| Love story | ❌ | optional (phase sau) |

## 5. Plan template chuẩn — phases
- **P1 (nghiệp vụ lõi):** Tách Lễ/Tiệc + Âm lịch — data model `inv.ceremony` vs `inv.reception`
- **P2 (guest):** Panel quản lý khách + link riêng + RSVP per-guest
- **P3 (template engine):** `frameType` cho cả ảnh-based + code-based
- **P4 (UX polish):** Scroll reveal mượt, typography đồng nhất
