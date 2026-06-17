<?php
/**
 * Xác thực bằng PHP session (cookie). Đủ dùng cho admin + khách hàng, KISS.
 */
class Auth
{
    public static function boot(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_set_cookie_params([
                'lifetime' => 0,
                'path'     => '/',
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
            session_start();
        }
    }

    public static function login(array $user): void
    {
        self::boot();
        session_regenerate_id(true);
        $_SESSION['user'] = [
            'id'    => (int) $user['id'],
            'email' => $user['email'],
            'name'  => $user['full_name'],
            'role'  => $user['role'],
        ];
    }

    public static function logout(): void
    {
        self::boot();
        $_SESSION = [];
        session_destroy();
    }

    public static function user(): ?array
    {
        self::boot();
        return $_SESSION['user'] ?? null;
    }

    public static function id(): ?int
    {
        return self::user()['id'] ?? null;
    }

    /** Bắt buộc đã đăng nhập, nếu không → 401. */
    public static function require(): array
    {
        $u = self::user();
        if (!$u) Response::error('Bạn cần đăng nhập.', 401);
        return $u;
    }

    /** Bắt buộc là admin, nếu không → 403. */
    public static function requireAdmin(): array
    {
        $u = self::require();
        if ($u['role'] !== 'admin') Response::error('Không có quyền truy cập.', 403);
        return $u;
    }
}
