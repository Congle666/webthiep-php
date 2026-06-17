# Họa tiết SVG cho thiệp cưới

Thả file `.svg` vào thư mục này, hệ thống **tự nhận** và tô màu theo theme từng mẫu.

## Cách hoạt động
- Đặt tên file theo đúng tên khai báo trong `src/features/invitation/themes.ts` (mục `ornaments`).
- File được tô màu động qua CSS mask → **dùng SVG 1 màu (đặc/silhouette) là đẹp nhất**.
- Nếu chưa có file → tự fallback về họa tiết code sẵn (không vỡ giao diện).

## Tên file cần tải (theo themes.ts hiện tại)

| Tên file | Dùng cho mẫu | Loại họa tiết gợi ý |
|----------|--------------|---------------------|
| `dragon-corner.svg` | Hoa Hồng Vàng | Rồng cách điệu ở góc |
| `phoenix-divider.svg` | Hoa Hồng Vàng | Phượng / đường chia |
| `royal-frame.svg` | Hoa Hồng Vàng, Golden Elegance | Khung ornament hoàng gia |
| `gold-corner.svg` | Golden Elegance | Ornament góc vàng |
| `gold-divider.svg` | Golden Elegance, Black Tie | Đường chia thanh mảnh |
| `sakura-corner.svg` | Sakura Dream | Hoa anh đào góc |
| `floral-divider.svg` | các mẫu floral | Hoa lá đường chia |
| `floral-frame.svg` | Sakura Dream | Khung hoa |
| `leaf-corner.svg` | Garden Romance | Lá cây góc |

## Nguồn tải miễn phí (an toàn thương mại)
- **svgrepo.com** — gõ "dragon ornament", "phoenix", "lotus divider", "floral corner" → tải SVG (CC0/MIT)
- **freepik.com** — đẹp hơn, cần tài khoản + ghi nguồn (kiểm tra license)

## Lưu ý
- Chọn SVG **dạng nét/silhouette 1 màu** (không nhiều màu) để mask đổi màu đẹp.
- Nếu muốn giữ SVG nhiều màu (không đổi màu theo theme): sửa `OrnamentSlot.tsx` đổi từ mask sang `<img src>`.
