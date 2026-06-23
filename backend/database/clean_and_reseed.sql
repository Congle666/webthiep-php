-- ============================================================
-- Clean & Reseed — chỉ giữ 2 mẫu thiệp + 2 user
-- Chạy: C:/xampp/mysql/bin/mysql.exe -u root --default-character-set=utf8mb4 juntech_wedding < clean_and_reseed.sql
-- ============================================================
USE juntech_wedding;

SET FOREIGN_KEY_CHECKS = 0;

-- Xóa tất cả data test
TRUNCATE TABLE invitations;
TRUNCATE TABLE orders;
TRUNCATE TABLE rsvp;
TRUNCATE TABLE guestbook;
DELETE FROM templates;
DELETE FROM users;

SET FOREIGN_KEY_CHECKS = 1;

-- Reset auto increment
ALTER TABLE templates AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

-- ── 2 mẫu thiệp giữ lại ────────────────────────────────────

-- 1. Floral Magnolia
INSERT INTO templates (slug, name, category, description, layout, price_from, is_active, sort_order, design) VALUES
('floral-magnolia', 'Floral Magnolia', 'floral',
 'Thiệp cưới phong cách hoa tươi thanh lịch, nền kem nhẹ nhàng với hoa magnolia trắng tinh khôi.',
 'floral', 299000, 1, 1,
 JSON_OBJECT(
   'theme', JSON_OBJECT(
     'red','#4a6741','redDeep','#3a5232','redSoft','rgba(74,103,65,0.10)',
     'text','#5a5040','heading','#3a5232','muted','#8a8070',
     'bg','#f8f5ee','paper','/invitation/paper-bg.jpg'
   ),
   'decorations', JSON_ARRAY()
 ));

-- 2. Long Phụng Đỏ (traditional)
INSERT INTO templates (slug, name, category, description, layout, price_from, is_active, sort_order, design) VALUES
('long-phung-do', 'Long Phụng Đỏ', 'classic',
 'Thiệp cưới truyền thống với hoa văn rồng phụng, màu đỏ may mắn sang trọng.',
 'traditional', 199000, 1, 2,
 JSON_OBJECT(
   'theme', JSON_OBJECT(
     'red','#9e2b25','redDeep','#7a1f1b','redSoft','rgba(158,43,37,0.10)',
     'text','#5a4a3a','heading','#8a241f','muted','#9c8b76',
     'bg','#f5ead7','paper','/invitation/paper-bg.jpg'
   ),
   'decorations', JSON_ARRAY()
 ));

-- ── 2 users ────────────────────────────────────────────────

-- Admin (password hash sẽ được cập nhật bởi make_admin.php)
-- Tạm thời insert với hash placeholder, sau đó chạy make_admin.php để cập nhật đúng
INSERT INTO users (full_name, email, phone, password_hash, role) VALUES
('Admin JunTech', 'ADMIN_EMAIL_PLACEHOLDER', '0900000000',
 '$2y$10$placeholder_run_make_admin_php', 'admin');

-- User thường
INSERT INTO users (full_name, email, phone, password_hash, role) VALUES
('Lê Hoàng Công', 'lhc09062004@gmail.com', NULL,
 '$2y$10$placeholder_register_to_set_password', 'customer');

SELECT 'Done! Templates:' as msg;
SELECT id, slug, name, layout FROM templates;
SELECT 'Users:' as msg;
SELECT id, email, role FROM users;
