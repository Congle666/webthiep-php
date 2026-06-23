<?php
/**
 * Tạo hash bcrypt cho admin và UPDATE vào DB.
 * Chạy: php make_admin.php
 * Đọc ADMIN_EMAIL + ADMIN_PASSWORD từ .env (hoặc hardcode tạm)
 */

// Load .env thủ công (không cần thư viện)
$envFile = __DIR__ . '/../../.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        if (!str_contains($line, '=')) continue;
        [$k, $v] = explode('=', $line, 2);
        putenv(trim($k) . '=' . trim($v));
    }
}

$cfg    = require __DIR__ . '/../config/config.php';
$email  = getenv('ADMIN_EMAIL')    ?: 'manhcanda04@gmail.com';
$name   = getenv('ADMIN_FULL_NAME') ?: 'Admin JunTech';
$pass   = getenv('ADMIN_PASSWORD') ?: 'Admin@123456';
$hash   = password_hash($pass, PASSWORD_BCRYPT, ['cost' => 10]);

try {
    $dsn = "mysql:host={$cfg['db']['host']};port={$cfg['db']['port']};dbname={$cfg['db']['name']};charset=utf8mb4";
    $pdo = new PDO($dsn, $cfg['db']['user'], $cfg['db']['pass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    // Upsert admin
    $stmt = $pdo->prepare("
        INSERT INTO users (full_name, email, phone, password_hash, role)
        VALUES (?, ?, '0900000000', ?, 'admin')
        ON DUPLICATE KEY UPDATE
          full_name = VALUES(full_name),
          password_hash = VALUES(password_hash),
          role = 'admin'
    ");
    $stmt->execute([$name, $email, $hash]);

    echo "✅ Admin upserted: $email\n";
    echo "   Password: $pass\n";
    echo "   Hash: $hash\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
