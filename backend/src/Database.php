<?php
/**
 * Kết nối MySQL qua PDO (singleton). Prepared statements mặc định → chống SQL injection.
 */
class Database
{
    private static ?PDO $pdo = null;

    public static function conn(): PDO
    {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        $cfg = require __DIR__ . '/../config/config.php';
        $db  = $cfg['db'];

        $dsn = "mysql:host={$db['host']};port={$db['port']};dbname={$db['name']};charset={$db['charset']}";

        try {
            self::$pdo = new PDO($dsn, $db['user'], $db['pass'], [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            Response::error('Không kết nối được cơ sở dữ liệu. Kiểm tra XAMPP MySQL đã chạy chưa.', 500,
                $cfg['app_env'] === 'development' ? $e->getMessage() : null);
        }

        return self::$pdo;
    }

    /** Chạy query có tham số, trả về statement. */
    public static function run(string $sql, array $params = []): PDOStatement
    {
        $stmt = self::conn()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public static function all(string $sql, array $params = []): array
    {
        return self::run($sql, $params)->fetchAll();
    }

    public static function one(string $sql, array $params = []): ?array
    {
        $row = self::run($sql, $params)->fetch();
        return $row === false ? null : $row;
    }

    public static function insert(string $sql, array $params = []): int
    {
        self::run($sql, $params);
        return (int) self::conn()->lastInsertId();
    }
}
