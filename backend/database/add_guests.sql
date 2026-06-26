-- Phase 02 — Guest Management
-- Bảng danh sách khách mời + link riêng (?g=token) + RSVP per-guest.
-- Chạy: mysql -u root juntech_wedding < add_guests.sql --default-character-set=utf8mb4
-- (KHÔNG sửa schema.sql gốc — file migration bổ sung.)

CREATE TABLE IF NOT EXISTS guests (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invitation_id INT UNSIGNED NOT NULL,
  name          VARCHAR(120) NOT NULL,
  token         VARCHAR(24)  NOT NULL UNIQUE,
  tag           VARCHAR(60)  DEFAULT NULL,
  rsvp_status   ENUM('pending','yes','no','maybe') NOT NULL DEFAULT 'pending',
  rsvp_count    TINYINT UNSIGNED NOT NULL DEFAULT 1,
  opened_at     DATETIME DEFAULT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE,
  INDEX idx_guests_inv (invitation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ALTER rsvps thêm guest_id (MySQL không có ADD COLUMN IF NOT EXISTS ở mọi version).
-- Nếu lỗi "Duplicate column name 'guest_id'" -> đã chạy trước, BỎ QUA an toàn.
ALTER TABLE rsvps ADD COLUMN guest_id INT UNSIGNED DEFAULT NULL AFTER invitation_id;
ALTER TABLE rsvps ADD FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE SET NULL;
