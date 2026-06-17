<?php
/**
 * Tạo / cập nhật tài khoản admin với mật khẩu hash đúng.
 * Chạy:  php backend/database/make_admin.php
 * (vì seed.sql chứa hash placeholder, dùng script này để set mật khẩu thật)
 */
require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/Response.php';

$email = 'admin@juntech.vn';
$pass  = 'Admin@123';
$name  = 'Quản Trị JunTech';
$hash  = password_hash($pass, PASSWORD_BCRYPT);

$exists = Database::one("SELECT id FROM users WHERE email = ?", [$email]);
if ($exists) {
    Database::run("UPDATE users SET password_hash=?, role='admin', status='active' WHERE email=?", [$hash, $email]);
    echo "Đã cập nhật admin: $email / $pass\n";
} else {
    Database::insert(
        "INSERT INTO users (full_name, email, password_hash, role) VALUES (?,?,?,'admin')",
        [$name, $email, $hash]
    );
    echo "Đã tạo admin: $email / $pass\n";
}
