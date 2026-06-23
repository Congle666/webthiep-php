<?php
/**
 * Cấu hình ứng dụng. Sửa thông số XAMPP MySQL tại đây.
 * Mặc định XAMPP: host=127.0.0.1, user=root, pass='' (rỗng)
 */

return [
    'db' => [
        'host'    => getenv('DB_HOST') ?: '127.0.0.1',
        'port'    => (int)(getenv('DB_PORT') ?: 3306),
        'name'    => getenv('DB_NAME') ?: 'juntech_wedding',
        'user'    => getenv('DB_USER') ?: 'root',
        'pass'    => getenv('DB_PASS') ?: '',
        'charset' => 'utf8mb4',
    ],

    // Origin của frontend Vite để bật CORS đúng (đổi nếu deploy)
    'cors_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],

    // Secret cho session/CSRF — đọc từ .env
    'app_secret' => getenv('APP_SECRET') ?: 'change-this-to-a-long-random-string',

    // Google OAuth 2.0 — điền sau khi tạo credentials trên Google Cloud Console
    'google' => [
        'client_id'     => getenv('GOOGLE_CLIENT_ID')     ?: '',
        'client_secret' => getenv('GOOGLE_CLIENT_SECRET') ?: '',
        'redirect_uri'  => 'http://localhost:8899/api/auth/google/callback',
    ],

    'app_env' => 'development',          // development | production

    // Thư mục ảnh thiệp (frontend public/invitation) — nơi upload + quét thư viện.
    // Mặc định: ../../public/invitation so với backend/. Đổi nếu cấu trúc khác.
    'assets_dir' => __DIR__ . '/../../public/invitation',
    'assets_url' => '/invitation',       // URL gốc khi frontend hiển thị

    // Chụp lại ảnh preview coverflow (admin). PHP exec() chạy Node + Puppeteer.
    // Yêu cầu dev server (5173) + API (8899) đang chạy. Đổi node_bin nếu node không nằm trong PATH.
    'preview' => [
        'node_bin'    => 'node',                                  // hoặc đường dẫn tuyệt đối tới node.exe
        'script'      => __DIR__ . '/../../scripts/capture-preview.mjs',
        'project_dir' => __DIR__ . '/../..',                      // cwd khi chạy script
        'timeout'     => 90,                                      // giây
    ],
];
