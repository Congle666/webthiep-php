-- Blog posts table for JunTech Cẩm Nang
CREATE TABLE IF NOT EXISTS posts (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(220)  NOT NULL UNIQUE,
  title         VARCHAR(300)  NOT NULL,
  excerpt       TEXT          DEFAULT NULL,
  content_html  LONGTEXT      DEFAULT NULL,
  content_json  LONGTEXT      DEFAULT NULL,
  cover_image   VARCHAR(500)  DEFAULT NULL,
  category      VARCHAR(80)   NOT NULL DEFAULT 'cam-nang',
  status        ENUM('draft','published','scheduled') NOT NULL DEFAULT 'draft',
  author_id     INT UNSIGNED  DEFAULT NULL,
  meta_title    VARCHAR(70)   DEFAULT NULL,
  meta_desc     VARCHAR(165)  DEFAULT NULL,
  og_image      VARCHAR(500)  DEFAULT NULL,
  view_count    INT UNSIGNED  NOT NULL DEFAULT 0,
  reading_time  TINYINT UNSIGNED NOT NULL DEFAULT 1,
  published_at  TIMESTAMP     NULL DEFAULT NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_posts_status (status),
  INDEX idx_posts_category (category),
  INDEX idx_posts_published (published_at),
  FULLTEXT idx_posts_search (title, excerpt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed 3 sample posts
INSERT INTO posts (slug, title, excerpt, content_html, category, status, meta_title, meta_desc, reading_time, published_at) VALUES
('thiet-ke-thiep-cuoi-online-dep',
 'Cách Thiết Kế Thiệp Cưới Online Đẹp Và Ấn Tượng',
 'Thiệp cưới online ngày càng phổ biến vì tiết kiệm chi phí, gửi nhanh và dễ cá nhân hóa. Cùng khám phá cách tạo thiệp cưới online thật đẹp.',
 '<h2>Thiệp Cưới Online Là Gì?</h2><p>Thiệp cưới online (hay thiệp cưới điện tử) là dạng thiệp được gửi qua link, tin nhắn hoặc mạng xã hội thay vì in ấn truyền thống.</p><h2>Lợi Ích Nổi Bật</h2><ul><li>Tiết kiệm chi phí in ấn</li><li>Gửi ngay cho hàng trăm khách mời</li><li>Cá nhân hóa dễ dàng</li><li>Tích hợp nhạc, ảnh, bản đồ</li></ul>',
 'cam-nang', 'published', 'Thiết Kế Thiệp Cưới Online Đẹp | JunTech', 'Hướng dẫn thiết kế thiệp cưới online đẹp, ấn tượng. Tiết kiệm chi phí, gửi nhanh qua Zalo, Facebook. Giá chỉ từ 199k.', 4, NOW()),
('thiep-cuoi-giay-hay-dien-tu',
 'Thiệp Cưới Giấy Hay Điện Tử — Cái Nào Tốt Hơn?',
 'So sánh chi tiết thiệp cưới giấy truyền thống và thiệp cưới điện tử hiện đại về chi phí, thẩm mỹ và tính tiện dụng.',
 '<h2>Thiệp Cưới Giấy</h2><p>Thiệp giấy mang lại cảm giác sang trọng, có thể lưu giữ làm kỷ niệm. Tuy nhiên chi phí in cao và mất thời gian giao nhận.</p><h2>Thiệp Cưới Điện Tử</h2><p>Thiệp điện tử nhanh, tiện lợi, tích hợp nhiều tính năng tương tác. Giá thành thấp hơn nhiều so với thiệp giấy.</p>',
 'so-sanh', 'published', 'Thiệp Cưới Giấy Hay Điện Tử? So Sánh Chi Tiết | JunTech', 'So sánh thiệp cưới giấy và điện tử về chi phí, thẩm mỹ, tính tiện dụng. Giúp bạn chọn đúng loại thiệp cho đám cưới.', 5, NOW()),
('loi-moi-dam-cuoi-hay',
 '50 Mẫu Lời Mời Đám Cưới Hay Và Ý Nghĩa Nhất 2026',
 'Tổng hợp 50 mẫu lời mời đám cưới hay, trang trọng và cảm xúc nhất. Phù hợp cho mọi phong cách đám cưới từ truyền thống đến hiện đại.',
 '<h2>Lời Mời Trang Trọng</h2><p>Trân trọng kính mời ông/bà/anh/chị đến dự tiệc cưới của chúng tôi...</p><h2>Lời Mời Thân Mật</h2><p>Mình và người ấy sẽ làm đám cưới, rất mong bạn đến chung vui cùng nhé!</p>',
 'cam-nang', 'published', '50 Mẫu Lời Mời Đám Cưới Hay Nhất 2026 | JunTech', 'Tổng hợp 50 mẫu lời mời đám cưới hay, trang trọng và cảm xúc. Phù hợp cho mọi phong cách từ truyền thống đến hiện đại.', 7, NOW());
