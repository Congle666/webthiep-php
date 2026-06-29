# Brainstorm: Hệ thống Body thiệp cưới (chuẩn hóa + đa dạng)

**Ngày:** 2026-06-28 · **Trạng thái:** Chốt hướng, chờ implement

## 1. Vấn đề

Muốn mỗi mẫu thiệp trông khác nhau (như ChungĐôi) nhưng KHÔNG đập đi xây lại. Lo mẫu mình "1 form". Câu hỏi sâu: cùng 1 body sao tên CD/CR, ảnh đại diện, ảnh footer mỗi mẫu lại khác — làm sao thống nhất để chỉnh ảnh không đè chữ.

## 2. Phát hiện then chốt (đo thật 10 mẫu ChungĐôi)

**10 mẫu ChungĐôi DÙNG CHUNG 1 BODY.** Không phải nhiều body. Cùng bộ section:
`Lễ cưới → Album → Tiệc → (Đếm ngược) → (Dress code) → Lịch trình → Lưu bút → Phong bao`

Khác biệt giữa mẫu CHỈ LÀ:
1. **Font** (Times / Baskerville / SVN-HC Titling / script) — đòn bẩy MẠNH NHẤT
2. **Màu** (palette)
3. **Ảnh trang trí** (hoa/lâu đài/phượng/song hỷ)
4. **Bật/tắt + đổi thứ tự section**
5. **Cover (bìa)** — đa dạng nhất

→ "Khác nhau trong body" mà user thấy = khác FONT/MÀU/visible/decoration, KHÔNG phải khác cấu trúc.

## 3. Hiện trạng mình (gap analysis)

| Năng lực | ChungĐôi | Mình | Trạng thái |
|---|---|---|---|
| 1 body chung | ✅ | ✅ InvitationBody | OK |
| Bật/tắt section | ✅ | ✅ visible | OK |
| Đổi thứ tự | ✅ | ✅ sectionOrder | OK |
| Màu theo mẫu | ✅ | ✅ DB theme→CSS var | OK |
| Ảnh trang trí | ✅ | ✅ decorations | OK |
| **Font theo mẫu** | ✅ | ❌ | **GAP CHÍNH** |
| **Zone footer** | ✅ | ❌ chỉ cover/body/header | **GAP** |
| **Quy ước z-index** | ✅ | ⚠️ ảnh z có thể > chữ | **BUG** |

## 4. Hai bug "không thống nhất" — gốc rễ

**Bug A — ảnh đè chữ khi chỉnh admin:** `.inv-section` (chữ) z-index:3, nhưng decoration body có ảnh z:4/5 → đè. → QUY ƯỚC: ảnh body z ≤ 2, chữ z ≥ 3. Ràng buộc ở hệ thống, không để admin đặt z cao.

**Bug B — ảnh footer mỗi mẫu một chỗ:** chỉ có zone cover/body/header. Ảnh footer đặt zone body top~92% (% toàn trang) → trang dài ngắn khác nhau → ảnh trôi. → THÊM zone `footer` (tọa độ theo block footer như header).

## 5. Hướng đã chốt

**LÀM:** A (fontset) + dọn debt + zone footer + quy ước z-index + C (preset nhanh) + cover mới.
**BỎ:** B (body variants — bố cục bên trong section khác nhau). Lý do: ChungĐôi 10 mẫu KHÔNG làm; vi phạm YAGNI; nhân maintain. Để dành khi >20 mẫu và thật sự cần.

### Ưu tiên (ROI giảm dần)
1. **Fontset system** — thêm `fontset` vào design.theme; body đọc `--font-heading/--font-name/--font-body` từ DB (giống đọc màu). ~5 bộ: classic-serif, elegant, bold-titling, script-soft, modern-sans. Biến 1 body → N mẫu khác hẳn. (~1 ngày)
2. **Quy ước z-index** — chữ z:3+, ảnh body z:0–2. Clamp z trong admin slider ≤ 2 cho zone body. Sửa decoration DB nào z≥3.
3. **Zone footer** — thêm 'footer' vào DecoConfig.zone + render layer bám block footer.
4. **Dọn themes.ts chết** — file có headingFont nhưng không ai dùng → gây nhầm. Gộp vào fontset hoặc xóa.
5. **2-3 cover layout mới** — bìa khách thấy đầu tiên, đáng đầu tư đa dạng.
6. **Preset + checklist tạo mẫu** — 1 mẫu mới = {fontset, palette, decorations, sectionOrder, cover}. Mục tiêu ~10-15 phút/mẫu.

## 6. Nguyên tắc thống nhất (đóng vào docs/HUONG-DAN)

- Tên CD/CR, ảnh đại diện = SECTION (không phải decoration). Khác nhau qua fontset + visible.
- Ảnh hoa/khung cảnh/footer = DECORATION. Khác nhau qua vị trí + ảnh, z ≤ 2.
- 4 zone: cover (bìa) · header (khối tên) · body (% toàn trang) · footer (block cuối).
- z-index: nền 0 · trang trí 1-2 · chữ 3+ · UI nổi 50+.

## 7. Rủi ro

- Fontset: cần load thêm Google Fonts (chấp nhận được, đã có cơ chế trong index.html).
- Zone footer: cần đảm bảo block footer có position:relative để ảnh bám đúng.
- Migration: decoration cũ z≥3 phải hạ xuống ≤2 (script 1 lần).

## 8. Bước tiếp

Chờ user duyệt → implement theo thứ tự ưu tiên mục 5. Mỗi bước test bằng Puppeteer screenshot so ChungĐôi.
