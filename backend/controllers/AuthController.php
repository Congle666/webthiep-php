<?php
/** Đăng ký / đăng nhập / đăng xuất / thông tin tài khoản. */
class AuthController
{
    /** POST /api/auth/register */
    public static function register(): void
    {
        [$errors, $d] = Request::validate([
            'full_name' => 'required|max:120',
            'email'     => 'required|email|max:160',
            'phone'     => 'phone',
            'password'  => 'required|min:6|max:72',
        ]);
        if ($errors) Response::validation($errors);

        $exists = Database::one("SELECT id FROM users WHERE email = ?", [$d['email']]);
        if ($exists) Response::error('Email đã được sử dụng.', 409);

        $hash = password_hash($d['password'], PASSWORD_BCRYPT);
        $id = Database::insert(
            "INSERT INTO users (full_name, email, phone, password_hash, role)
             VALUES (?, ?, ?, ?, 'customer')",
            [$d['full_name'], $d['email'], $d['phone'] ?? null, $hash]
        );

        $user = Database::one("SELECT * FROM users WHERE id = ?", [$id]);
        Auth::login($user);
        Response::created(self::publicUser($user), 'Đăng ký thành công!');
    }

    /** POST /api/auth/login */
    public static function login(): void
    {
        [$errors, $d] = Request::validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);
        if ($errors) Response::validation($errors);

        $user = Database::one("SELECT * FROM users WHERE email = ?", [$d['email']]);
        if (!$user || !password_verify($d['password'], $user['password_hash'])) {
            Response::error('Email hoặc mật khẩu không đúng.', 401);
        }
        if ($user['status'] === 'blocked') {
            Response::error('Tài khoản đã bị khoá.', 403);
        }

        Auth::login($user);
        Response::ok(self::publicUser($user), 'Đăng nhập thành công!');
    }

    /** POST /api/auth/logout */
    public static function logout(): void
    {
        Auth::logout();
        Response::ok(null, 'Đã đăng xuất.');
    }

    /** GET /api/auth/me */
    public static function me(): void
    {
        $u = Auth::user();
        if (!$u) Response::error('Chưa đăng nhập.', 401);
        $user = Database::one("SELECT * FROM users WHERE id = ?", [$u['id']]);
        Response::ok(self::publicUser($user));
    }

    private static function publicUser(array $u): array
    {
        return [
            'id'       => (int) $u['id'],
            'fullName' => $u['full_name'],
            'email'    => $u['email'],
            'phone'    => $u['phone'],
            'role'     => $u['role'],
        ];
    }
}
