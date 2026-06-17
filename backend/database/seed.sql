-- ============================================================
-- Seed data — chạy SAU schema.sql
-- Admin mặc định: admin@juntech.vn / Admin@123
-- (hash bcrypt của "Admin@123")
-- ============================================================
USE juntech_wedding;

-- Admin (password = Admin@123)
INSERT INTO users (full_name, email, phone, password_hash, role) VALUES
('Quản Trị JunTech', 'admin@juntech.vn', '0900000000',
 '$2y$10$wH8Qe1cP4Yk7q3sFv2bТ.x', 'admin');
-- LƯU Ý: hash trên là placeholder. Chạy backend/database/make_admin.php để tạo hash đúng,
-- hoặc dùng tài khoản đăng ký rồi UPDATE role='admin'.

-- Pricing plans
INSERT INTO pricing_plans (code, name, price, duration, duration_days, description, features, is_recommended, sort_order) VALUES
('basic', 'Cơ Bản', 199000, '3 tháng', 90,
 'Phù hợp cho các cặp đôi muốn trải nghiệm thiệp cưới online đơn giản, đẹp mắt.',
 JSON_ARRAY(
   JSON_OBJECT('text','Chọn 1 mẫu thiệp','included',true),
   JSON_OBJECT('text','Thông tin cơ bản (tên, ngày, địa điểm)','included',true),
   JSON_OBJECT('text','Nhạc nền mặc định','included',true),
   JSON_OBJECT('text','Countdown đếm ngược','included',true),
   JSON_OBJECT('text','Chia sẻ qua link','included',true),
   JSON_OBJECT('text','Gallery ảnh (tối đa 5 ảnh)','included',true),
   JSON_OBJECT('text','RSVP xác nhận tham dự','included',false),
   JSON_OBJECT('text','Bản đồ địa điểm','included',false),
   JSON_OBJECT('text','Love Story timeline','included',false),
   JSON_OBJECT('text','Hỗ trợ 24/7','included',false)
 ), 0, 1),
('premium', 'Cao Cấp', 399000, '6 tháng', 180,
 'Gói phổ biến nhất — đầy đủ tính năng, thiệp cưới hoàn hảo cho ngày trọng đại.',
 JSON_ARRAY(
   JSON_OBJECT('text','Chọn 1 mẫu thiệp bất kỳ','included',true),
   JSON_OBJECT('text','Thông tin đầy đủ','included',true),
   JSON_OBJECT('text','Tùy chỉnh nhạc nền','included',true),
   JSON_OBJECT('text','Countdown đếm ngược','included',true),
   JSON_OBJECT('text','Chia sẻ qua link & QR Code','included',true),
   JSON_OBJECT('text','Gallery ảnh (tối đa 20 ảnh)','included',true),
   JSON_OBJECT('text','RSVP xác nhận tham dự','included',true),
   JSON_OBJECT('text','Bản đồ địa điểm','included',true),
   JSON_OBJECT('text','Love Story timeline','included',true),
   JSON_OBJECT('text','Guestbook chúc mừng','included',false)
 ), 1, 2),
('vip', 'VIP', 699000, '1 năm', 365,
 'Trải nghiệm cao cấp nhất — tùy chỉnh không giới hạn, hỗ trợ cá nhân riêng.',
 JSON_ARRAY(
   JSON_OBJECT('text','Chọn mẫu thiệp + tùy chỉnh riêng','included',true),
   JSON_OBJECT('text','Thông tin không giới hạn','included',true),
   JSON_OBJECT('text','Tùy chỉnh nhạc nền & hiệu ứng','included',true),
   JSON_OBJECT('text','Gallery ảnh không giới hạn','included',true),
   JSON_OBJECT('text','RSVP + quản lý khách mời','included',true),
   JSON_OBJECT('text','Love Story timeline','included',true),
   JSON_OBJECT('text','Guestbook chúc mừng','included',true),
   JSON_OBJECT('text','Hỗ trợ 24/7 + tư vấn riêng','included',true)
 ), 0, 3);

-- Templates (12 mẫu — khớp frontend mock)
INSERT INTO templates (slug, name, category, description, features, price_from, rating, review_count, is_new, is_hot, sort_order) VALUES
('hoa-hong-vang','Hoa Hồng Vàng','luxury','Thiệp cưới sang trọng với họa tiết hoa hồng vàng tinh tế trên nền đen huyền bí. Phong cách quý phái, lịch lãm cho các cặp đôi yêu thích sự đẳng cấp.', JSON_ARRAY('Nhạc nền','Countdown','RSVP','Gallery ảnh','Bản đồ'), 299000, 4.9, 128, 0, 1, 1),
('minimalist-white','Minimalist White','minimalist','Thiệp cưới tối giản với tông trắng tinh khôi. Đường nét sạch sẽ, hiện đại, phù hợp các cặp đôi yêu thích sự thanh lịch, đơn giản.', JSON_ARRAY('Nhạc nền','Countdown','RSVP','Gallery ảnh'), 199000, 4.8, 95, 0, 1, 2),
('garden-romance','Garden Romance','floral','Thiệp cưới lãng mạn với hoa lá pastel mềm mại. Như một khu vườn tình yêu nở rộ, đem đến cảm giác ấm áp và thơ mộng.', JSON_ARRAY('Nhạc nền','Countdown','RSVP','Gallery ảnh','Love Story'), 249000, 4.7, 82, 1, 0, 3),
('royal-navy','Royal Navy','classic','Thiệp cưới cổ điển tông xanh navy kết hợp vàng gold. Phong cách hoàng gia, trang nhã, lý tưởng cho tiệc cưới long trọng.', JSON_ARRAY('Nhạc nền','Countdown','RSVP','Gallery ảnh','Bản đồ','Dress Code'), 349000, 4.9, 64, 0, 0, 4),
('sakura-dream','Sakura Dream','floral','Thiệp cưới nhẹ nhàng với hoa anh đào Nhật Bản. Gam hồng pastel tinh tế, hiệu ứng cánh hoa bay lãng mạn.', JSON_ARRAY('Nhạc nền','Countdown','RSVP','Hiệu ứng cánh hoa'), 279000, 4.8, 73, 1, 1, 5),
('modern-geometric','Modern Geometric','modern','Thiệp cưới hiện đại với các hình khối geometric art deco. Sắc nét, cá tính, phù hợp các cặp đôi trẻ trung, năng động.', JSON_ARRAY('Nhạc nền','Countdown','RSVP','Gallery ảnh'), 229000, 4.6, 56, 0, 0, 6),
('vintage-rustic','Vintage Rustic','vintage','Thiệp cưới phong cách vintage mộc mạc. Tông màu nâu ấm, họa tiết craft paper, hoa khô và typography retro.', JSON_ARRAY('Nhạc nền','Countdown','RSVP','Gallery ảnh','Love Story'), 259000, 4.7, 48, 0, 0, 7),
('golden-elegance','Golden Elegance','luxury','Thiệp cưới đẳng cấp với hoạ tiết vàng gold trên nền marble trắng. Sự kết hợp hoàn hảo giữa sang trọng và tinh tế.', JSON_ARRAY('Nhạc nền','Countdown','RSVP','Gallery ảnh','Bản đồ','Guestbook'), 399000, 5.0, 112, 0, 1, 8),
('tropical-paradise','Tropical Paradise','modern','Thiệp cưới tươi sáng với hoa lá nhiệt đới. Gam xanh lá và cam san hô tạo cảm giác vui tươi, tràn đầy năng lượng.', JSON_ARRAY('Nhạc nền','Countdown','RSVP','Gallery ảnh'), 239000, 4.5, 39, 1, 0, 9),
('eternal-love','Eternal Love','classic','Thiệp cưới cổ điển với khung viền ornament tinh xảo. Phong cách truyền thống kết hợp hiện đại, phù hợp mọi phong cách tiệc cưới.', JSON_ARRAY('Nhạc nền','Countdown','RSVP','Gallery ảnh','Bản đồ','Love Story'), 319000, 4.8, 87, 0, 0, 10),
('blush-watercolor','Blush Watercolor','floral','Thiệp cưới watercolor hồng pastel mềm mại. Phong cách art hand-painted, mỗi thiệp như một tác phẩm nghệ thuật riêng.', JSON_ARRAY('Nhạc nền','Countdown','RSVP','Gallery ảnh'), 269000, 4.7, 61, 1, 0, 11),
('black-tie','Black Tie','luxury','Thiệp cưới đen huyền bí, phong cách dạ hội Black Tie. Typography serif sang trọng, viền vàng nhấn nhá tinh tế.', JSON_ARRAY('Nhạc nền','Countdown','RSVP','Gallery ảnh','Dress Code','Bản đồ'), 379000, 4.9, 93, 0, 1, 12);

-- Testimonials
INSERT INTO testimonials (name, avatar, quote, rating) VALUES
('Minh Anh & Đức Huy','💑','Thiệp cưới online từ JunTech đẹp quá! Quan khách ai cũng khen. Giao diện mượt mà, dễ dùng. Rất hài lòng!', 5),
('Thu Hà & Quốc Bảo','💍','Tiết kiệm chi phí in thiệp truyền thống mà vẫn sang trọng. Tính năng RSVP giúp quản lý khách mời rất tiện.', 5),
('Phương Linh & Văn Nam','💒','Mẫu Sakura Dream quá đẹp luôn! Hiệu ứng cánh hoa bay rất lãng mạn. Bạn bè ai cũng xin link để xem.', 5),
('Ngọc Trâm & Hoàng Long','🥂','Đội ngũ JunTech hỗ trợ rất nhiệt tình. Thiệp đẹp, chuyên nghiệp, gửi link qua Zalo nhanh gọn. 10 điểm!', 5);
