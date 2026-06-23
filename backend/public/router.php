<?php
/**
 * PHP built-in server router — chuyển mọi request về index.php.
 * Dùng: php -S localhost:8899 -t backend/public backend/public/router.php
 */
if (php_sapi_name() === 'cli-server') {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    // Nếu file tồn tại thật trên disk → serve trực tiếp
    if ($path !== '/' && file_exists(__DIR__ . $path)) {
        return false;
    }
}
// Mọi trường hợp còn lại → index.php (router chính)
require_once __DIR__ . '/index.php';
