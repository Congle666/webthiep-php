<?php
/**
 * Đọc input: JSON body hoặc form, query params. Cung cấp validator gọn.
 */
class Request
{
    private static ?array $body = null;

    /** Lấy toàn bộ body (JSON ưu tiên, fallback form-data). */
    public static function body(): array
    {
        if (self::$body !== null) return self::$body;

        $raw = file_get_contents('php://input');
        $json = json_decode($raw, true);
        if (is_array($json)) {
            self::$body = $json;
        } else {
            self::$body = $_POST ?: [];
        }
        return self::$body;
    }

    public static function input(string $key, $default = null)
    {
        return self::body()[$key] ?? $default;
    }

    public static function query(string $key, $default = null)
    {
        return $_GET[$key] ?? $default;
    }

    /**
     * Validate đơn giản. $rules = ['field' => 'required|email|min:6|max:120|in:a,b'].
     * Trả về [errors, cleaned]. errors rỗng = hợp lệ.
     */
    public static function validate(array $rules): array
    {
        $body   = self::body();
        $errors = [];
        $clean  = [];

        foreach ($rules as $field => $ruleStr) {
            $value = $body[$field] ?? null;
            if (is_string($value)) $value = trim($value);
            $rulesList = explode('|', $ruleStr);
            $required  = in_array('required', $rulesList, true);

            if ($required && ($value === null || $value === '')) {
                $errors[$field] = "Trường \"$field\" là bắt buộc.";
                continue;
            }
            if (!$required && ($value === null || $value === '')) {
                $clean[$field] = $value;
                continue;
            }

            foreach ($rulesList as $rule) {
                if ($rule === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $errors[$field] = 'Email không hợp lệ.';
                } elseif (str_starts_with($rule, 'min:')) {
                    $min = (int) substr($rule, 4);
                    if (mb_strlen((string)$value) < $min) $errors[$field] = "Tối thiểu $min ký tự.";
                } elseif (str_starts_with($rule, 'max:')) {
                    $max = (int) substr($rule, 4);
                    if (mb_strlen((string)$value) > $max) $errors[$field] = "Tối đa $max ký tự.";
                } elseif (str_starts_with($rule, 'in:')) {
                    $allowed = explode(',', substr($rule, 3));
                    if (!in_array($value, $allowed, true)) $errors[$field] = 'Giá trị không hợp lệ.';
                } elseif ($rule === 'int' && !is_numeric($value)) {
                    $errors[$field] = 'Phải là số.';
                } elseif ($rule === 'phone' && !preg_match('/^[0-9+\s().-]{8,20}$/', (string)$value)) {
                    $errors[$field] = 'Số điện thoại không hợp lệ.';
                }
            }
            $clean[$field] = $value;
        }

        return [$errors, $clean];
    }
}
