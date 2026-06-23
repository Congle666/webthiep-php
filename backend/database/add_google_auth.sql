-- Migration: thêm cột google_id để hỗ trợ đăng nhập Google OAuth
-- Chạy 1 lần trong phpMyAdmin hoặc MySQL CLI

ALTER TABLE users
  ADD COLUMN google_id VARCHAR(120) DEFAULT NULL AFTER email,
  ADD COLUMN avatar     VARCHAR(500) DEFAULT NULL AFTER phone,
  MODIFY COLUMN password_hash VARCHAR(255) DEFAULT NULL,  -- cho phép NULL (user Google không có password)
  ADD UNIQUE INDEX idx_users_google_id (google_id);
