<?php
/**
 * Cấu hình ứng dụng. Sửa thông số XAMPP MySQL tại đây.
 * Mặc định XAMPP: host=127.0.0.1, user=root, pass='' (rỗng)
 */

return [
    'db' => [
        'host'    => '127.0.0.1',
        'port'    => 3306,
        'name'    => 'juntech_wedding',
        'user'    => 'root',
        'pass'    => '',                 // XAMPP mặc định để rỗng
        'charset' => 'utf8mb4',
    ],

    // Origin của frontend Vite để bật CORS đúng (đổi nếu deploy)
    'cors_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],

    // Secret cho session/CSRF (đổi thành chuỗi ngẫu nhiên khi deploy thật)
    'app_secret' => 'change-this-to-a-long-random-string',

    'app_env' => 'development',          // development | production

    // Thư mục ảnh thiệp (frontend public/invitation) — nơi upload + quét thư viện.
    // Mặc định: ../../public/invitation so với backend/. Đổi nếu cấu trúc khác.
    'assets_dir' => __DIR__ . '/../../public/invitation',
    'assets_url' => '/invitation',       // URL gốc khi frontend hiển thị
];
