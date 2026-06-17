-- ============================================================
-- JunTech - Thuê Thiệp Cưới Online
-- MySQL Schema (XAMPP / MySQL 5.7+ / MariaDB 10.3+)
-- Charset: utf8mb4 (hỗ trợ tiếng Việt + emoji)
-- ============================================================

CREATE DATABASE IF NOT EXISTS juntech_wedding
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE juntech_wedding;

-- ------------------------------------------------------------
-- 1. USERS — admin + khách hàng (1 bảng, phân quyền bằng role)
-- ------------------------------------------------------------
CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(120)  NOT NULL,
  email         VARCHAR(160)  NOT NULL UNIQUE,
  phone         VARCHAR(20)   DEFAULT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('admin','customer') NOT NULL DEFAULT 'customer',
  status        ENUM('active','blocked') NOT NULL DEFAULT 'active',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. TEMPLATES — mẫu thiệp (catalog)
-- ------------------------------------------------------------
CREATE TABLE templates (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug         VARCHAR(160) NOT NULL UNIQUE,
  name         VARCHAR(160) NOT NULL,
  category     ENUM('luxury','modern','classic','minimalist','floral','vintage') NOT NULL,
  layout       VARCHAR(40) NOT NULL DEFAULT 'traditional', -- bố cục thiệp sống: traditional|floral|modern...
  description  TEXT,
  thumbnail    VARCHAR(255) DEFAULT '',
  gallery      JSON,                     -- ["url1","url2",...]
  features     JSON,                     -- ["Nhạc nền","RSVP",...]
  design       JSON,                     -- thiết kế thiệp sống: {theme:{...}, decorations:[...]}
  price_from   INT UNSIGNED NOT NULL DEFAULT 0,
  rating       DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  review_count INT UNSIGNED NOT NULL DEFAULT 0,
  is_new       TINYINT(1) NOT NULL DEFAULT 0,
  is_hot       TINYINT(1) NOT NULL DEFAULT 0,
  is_active    TINYINT(1) NOT NULL DEFAULT 1,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_templates_category (category),
  INDEX idx_templates_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. PRICING_PLANS — gói giá
-- ------------------------------------------------------------
CREATE TABLE pricing_plans (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(40) NOT NULL UNIQUE,   -- basic / premium / vip
  name            VARCHAR(80) NOT NULL,
  price           INT UNSIGNED NOT NULL,
  duration        VARCHAR(40) NOT NULL,          -- "3 tháng"
  duration_days   INT UNSIGNED NOT NULL DEFAULT 90, -- để tính expiry thiệp
  description     TEXT,
  features        JSON,                          -- [{"text":"...","included":true}]
  is_recommended  TINYINT(1) NOT NULL DEFAULT 0,
  cta_text        VARCHAR(60) NOT NULL DEFAULT 'Chọn Gói Này',
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  sort_order      INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. TESTIMONIALS — nhận xét khách hàng (hiển thị marketing)
-- ------------------------------------------------------------
CREATE TABLE testimonials (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  avatar      VARCHAR(20)  DEFAULT '💑',
  quote       TEXT NOT NULL,
  rating      TINYINT UNSIGNED NOT NULL DEFAULT 5,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. CONTACT_REQUESTS — form liên hệ / đặt thuê
-- ------------------------------------------------------------
CREATE TABLE contact_requests (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(120) NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  email         VARCHAR(160) DEFAULT NULL,
  template_id   INT UNSIGNED DEFAULT NULL,
  note          TEXT,
  status        ENUM('new','contacted','done','spam') NOT NULL DEFAULT 'new',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL,
  INDEX idx_contact_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. ORDERS — đơn thuê thiệp (gắn user + template + plan)
--    Thanh toán làm sau → payment_status mặc định 'unpaid'
-- ------------------------------------------------------------
CREATE TABLE orders (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_code     VARCHAR(30) NOT NULL UNIQUE,    -- JT20260615XXXX
  user_id        INT UNSIGNED NOT NULL,
  template_id    INT UNSIGNED NOT NULL,
  plan_id        INT UNSIGNED NOT NULL,
  amount         INT UNSIGNED NOT NULL,
  payment_status ENUM('unpaid','paid','refunded') NOT NULL DEFAULT 'unpaid',
  status         ENUM('pending','active','expired','cancelled') NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(id)         ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES templates(id)     ON DELETE RESTRICT,
  FOREIGN KEY (plan_id)     REFERENCES pricing_plans(id) ON DELETE RESTRICT,
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. INVITATIONS — thiệp sống của từng cặp đôi (/thiep/:slug)
--    1 order -> 1 invitation. Chứa toàn bộ nội dung tuỳ biến.
-- ------------------------------------------------------------
CREATE TABLE invitations (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id       INT UNSIGNED NOT NULL UNIQUE,
  user_id        INT UNSIGNED NOT NULL,
  template_id    INT UNSIGNED NOT NULL,
  slug           VARCHAR(180) NOT NULL UNIQUE,   -- vd: "huy-anh" -> /thiep/huy-anh
  groom_name     VARCHAR(120) NOT NULL,
  bride_name     VARCHAR(120) NOT NULL,
  wedding_date   DATETIME DEFAULT NULL,
  reception_time DATETIME DEFAULT NULL,            -- giờ đón khách (wedding_date = khai tiệc)
  venue_name     VARCHAR(200) DEFAULT NULL,
  venue_address  VARCHAR(255) DEFAULT NULL,
  map_url        VARCHAR(500) DEFAULT NULL,
  cover_photo    VARCHAR(255) DEFAULT NULL,
  groom_family   JSON,                            -- {father, mother} nhà trai
  bride_family   JSON,                            -- {father, mother} nhà gái
  gift_qr_groom  VARCHAR(255) DEFAULT NULL,        -- ảnh QR mừng cưới chú rể
  gift_qr_bride  VARCHAR(255) DEFAULT NULL,        -- ảnh QR mừng cưới cô dâu
  bank_groom     JSON,                            -- {bank, account, name} chú rể (VietQR)
  bank_bride     JSON,                            -- {bank, account, name} cô dâu (VietQR)
  gallery        JSON,                            -- ảnh album
  love_story     JSON,                            -- [{"date":"...","title":"...","text":"..."}]
  music_url      VARCHAR(255) DEFAULT NULL,
  invite_message TEXT,                            -- lời mời
  settings       JSON,                            -- {countdown:true, rsvp:true, guestbook:true,...}
  is_published   TINYINT(1) NOT NULL DEFAULT 0,
  expires_at     DATETIME DEFAULT NULL,           -- theo plan.duration_days
  view_count     INT UNSIGNED NOT NULL DEFAULT 0,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id)    REFERENCES orders(id)     ON DELETE CASCADE,
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES templates(id)  ON DELETE RESTRICT,
  INDEX idx_inv_user (user_id),
  INDEX idx_inv_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. RSVPS — khách mời xác nhận tham dự (public submit)
-- ------------------------------------------------------------
CREATE TABLE rsvps (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invitation_id  INT UNSIGNED NOT NULL,
  guest_name     VARCHAR(120) NOT NULL,
  attendance     ENUM('yes','no','maybe') NOT NULL DEFAULT 'yes',
  guest_count    TINYINT UNSIGNED NOT NULL DEFAULT 1,
  message        TEXT,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE,
  INDEX idx_rsvp_inv (invitation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. GUESTBOOK — sổ lưu bút (lời chúc, public submit + duyệt)
-- ------------------------------------------------------------
CREATE TABLE guestbook (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invitation_id  INT UNSIGNED NOT NULL,
  guest_name     VARCHAR(120) NOT NULL,
  message        TEXT NOT NULL,
  is_approved    TINYINT(1) NOT NULL DEFAULT 1,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE,
  INDEX idx_gb_inv (invitation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 10. SETTINGS — cấu hình website (key-value)
-- ------------------------------------------------------------
CREATE TABLE settings (
  skey       VARCHAR(60) PRIMARY KEY,
  svalue     TEXT,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
