<?php
/**
 * Chuẩn hoá JSON response + CORS. Mọi API trả về { success, data?, message?, errors? }.
 */
class Response
{
    public static function cors(): void
    {
        $cfg = require __DIR__ . '/../config/config.php';
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if (in_array($origin, $cfg['cors_origins'], true)) {
            header("Access-Control-Allow-Origin: $origin");
        }
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
        header('Content-Type: application/json; charset=utf-8');

        if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }

    public static function json($data, int $code = 200): void
    {
        http_response_code($code);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function ok($data = null, ?string $message = null): void
    {
        $out = ['success' => true];
        if ($data !== null)    $out['data'] = $data;
        if ($message !== null) $out['message'] = $message;
        self::json($out, 200);
    }

    public static function created($data = null, ?string $message = null): void
    {
        $out = ['success' => true];
        if ($data !== null)    $out['data'] = $data;
        if ($message !== null) $out['message'] = $message;
        self::json($out, 201);
    }

    public static function error(string $message, int $code = 400, $detail = null): void
    {
        $out = ['success' => false, 'message' => $message];
        if ($detail !== null) $out['detail'] = $detail;
        self::json($out, $code);
    }

    public static function validation(array $errors): void
    {
        self::json(['success' => false, 'message' => 'Dữ liệu không hợp lệ', 'errors' => $errors], 422);
    }
}
