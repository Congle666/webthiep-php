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

    // ---------- GOOGLE OAUTH ----------

    /** GET /api/auth/google/login — trả URL redirect Google. */
    public static function googleLogin(): void
    {
        $cfg = require __DIR__ . '/../config/config.php';
        $g   = $cfg['google'];
        if (!$g['client_id']) Response::error('Google OAuth chưa được cấu hình.', 501);

        $state = bin2hex(random_bytes(16));
        $_SESSION['oauth_state'] = $state;

        $params = http_build_query([
            'client_id'     => $g['client_id'],
            'redirect_uri'  => $g['redirect_uri'],
            'response_type' => 'code',
            'scope'         => 'openid email profile',
            'state'         => $state,
            'access_type'   => 'online',
            'prompt'        => 'select_account',
        ]);

        Response::ok(['url' => 'https://accounts.google.com/o/oauth2/v2/auth?' . $params]);
    }

    /** GET /api/auth/google/callback — nhận code từ Google, tạo/login user, redirect frontend. */
    public static function googleCallback(): void
    {
        $cfg      = require __DIR__ . '/../config/config.php';
        $g        = $cfg['google'];
        $frontUrl = $cfg['cors_origins'][0] ?? 'http://localhost:5173';

        $code  = $_GET['code']  ?? '';
        $state = $_GET['state'] ?? '';
        $error = $_GET['error'] ?? '';

        if ($error) {
            header("Location: $frontUrl/auth/google/error?msg=" . urlencode($error));
            exit;
        }

        // Validate CSRF state
        if (!$code || !$state || $state !== ($_SESSION['oauth_state'] ?? null)) {
            header("Location: $frontUrl/auth/google/error?msg=state_mismatch");
            exit;
        }
        unset($_SESSION['oauth_state']);

        // Đổi code lấy token
        $tokenData = self::googleExchangeCode($code, $g);
        if (!$tokenData || empty($tokenData['id_token'])) {
            header("Location: $frontUrl/auth/google/error?msg=token_exchange_failed");
            exit;
        }

        // Decode JWT payload (không cần verify sig — đã đi qua HTTPS backend-to-backend)
        $parts   = explode('.', $tokenData['id_token']);
        $payload = json_decode(base64_decode(str_pad(strtr($parts[1] ?? '', '-_', '+/'), strlen($parts[1] ?? '') % 4 ? strlen($parts[1] ?? '') + (4 - strlen($parts[1] ?? '') % 4) : 0, '=')), true);

        $googleId = $payload['sub']     ?? null;
        $email    = $payload['email']   ?? null;
        $name     = $payload['name']    ?? 'Người dùng';
        $avatar   = $payload['picture'] ?? null;

        if (!$googleId || !$email) {
            header("Location: $frontUrl/auth/google/error?msg=invalid_token");
            exit;
        }

        // Tìm hoặc tạo user
        $user = Database::one("SELECT * FROM users WHERE google_id = ?", [$googleId]);
        if (!$user) {
            // Thử khớp theo email (user đã đăng ký bình thường trước đó)
            $user = Database::one("SELECT * FROM users WHERE email = ?", [$email]);
            if ($user) {
                // Gắn google_id vào tài khoản có sẵn
                Database::run("UPDATE users SET google_id=?, avatar=? WHERE id=?", [$googleId, $avatar, $user['id']]);
                $user['google_id'] = $googleId;
                $user['avatar']    = $avatar;
            } else {
                // Tạo tài khoản mới
                $id = Database::insert(
                    "INSERT INTO users (full_name, email, google_id, avatar, password_hash, role) VALUES (?,?,?,?,NULL,'customer')",
                    [$name, $email, $googleId, $avatar]
                );
                $user = Database::one("SELECT * FROM users WHERE id = ?", [$id]);
            }
        }

        if (!$user || $user['status'] === 'blocked') {
            header("Location: $frontUrl/auth/google/error?msg=account_blocked");
            exit;
        }

        Auth::login($user);
        header("Location: $frontUrl/auth/google/success");
        exit;
    }

    /** Đổi authorization code lấy token qua HTTPS POST đến Google. */
    private static function googleExchangeCode(string $code, array $g): ?array
    {
        if (!function_exists('curl_init')) return null;
        $ch = curl_init('https://oauth2.googleapis.com/token');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query([
                'code'          => $code,
                'client_id'     => $g['client_id'],
                'client_secret' => $g['client_secret'],
                'redirect_uri'  => $g['redirect_uri'],
                'grant_type'    => 'authorization_code',
            ]),
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_TIMEOUT        => 15,
        ]);
        $raw = curl_exec($ch);
        curl_close($ch);
        return $raw ? json_decode($raw, true) : null;
    }

    private static function publicUser(array $u): array
    {
        return [
            'id'       => (int) $u['id'],
            'fullName' => $u['full_name'],
            'email'    => $u['email'],
            'phone'    => $u['phone'],
            'role'     => $u['role'],
            'avatar'   => $u['avatar'] ?? null,
        ];
    }
}
