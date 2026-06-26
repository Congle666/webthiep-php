<?php
/** Blog posts — Cẩm Nang cưới (public) + quản trị (admin). */
class PostController
{
    // ---------- PUBLIC ----------

    /** GET /api/posts?page=&limit=&category=&search= */
    public static function list(): void
    {
        $page     = max(1, (int)($_GET['page']     ?? 1));
        $limit    = min(50, max(1, (int)($_GET['limit'] ?? 9)));
        $category = trim($_GET['category'] ?? '');
        $search   = trim($_GET['search']   ?? '');
        $offset   = ($page - 1) * $limit;

        $where  = ["status = 'published'"];
        $params = [];

        if ($category !== '') {
            $where[]  = 'category = ?';
            $params[] = $category;
        }
        if ($search !== '') {
            $where[]  = '(title LIKE ? OR excerpt LIKE ?)';
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $whereStr = implode(' AND ', $where);

        $total = (int) Database::one(
            "SELECT COUNT(*) c FROM posts WHERE $whereStr",
            $params
        )['c'];

        $rows = Database::all(
            "SELECT id, slug, title, excerpt, cover_image, category,
                    meta_title, meta_desc, reading_time, view_count, published_at
             FROM posts
             WHERE $whereStr
             ORDER BY published_at DESC
             LIMIT $limit OFFSET $offset",
            $params
        );

        Response::ok([
            'posts'      => array_map([self::class, 'mapRow'], $rows),
            'total'      => $total,
            'page'       => $page,
            'totalPages' => (int) ceil($total / $limit),
        ]);
    }

    /** GET /api/posts/{slug} */
    public static function detail(string $slug): void
    {
        $post = Database::one(
            "SELECT * FROM posts WHERE slug = ? AND status = 'published'",
            [$slug]
        );
        if (!$post) Response::error('Bài viết không tồn tại.', 404);

        // Tăng view_count
        Database::run("UPDATE posts SET view_count = view_count + 1 WHERE id = ?", [$post['id']]);
        $post['view_count']++;

        Response::ok(self::mapRowFull($post));
    }

    /** GET /sitemap.xml */
    public static function sitemap(): void
    {
        $posts = Database::all(
            "SELECT slug, updated_at FROM posts WHERE status = 'published' ORDER BY published_at DESC"
        );
        $templates = Database::all(
            "SELECT slug, updated_at FROM templates WHERE is_active = 1"
        );

        header('Content-Type: application/xml; charset=utf-8');
        $cfg      = require __DIR__ . '/../config/config.php';
        $frontUrl = $cfg['cors_origins'][0] ?? 'http://localhost:5173';

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        // Trang chủ
        echo "  <url><loc>$frontUrl/</loc></url>\n";
        echo "  <url><loc>$frontUrl/mau-thiep</loc></url>\n";
        echo "  <url><loc>$frontUrl/bang-gia</loc></url>\n";
        echo "  <url><loc>$frontUrl/cam-nang</loc></url>\n";
        echo "  <url><loc>$frontUrl/lien-he</loc></url>\n";

        foreach ($posts as $p) {
            $loc = htmlspecialchars("$frontUrl/cam-nang/{$p['slug']}");
            $mod = substr($p['updated_at'], 0, 10);
            echo "  <url><loc>$loc</loc><lastmod>$mod</lastmod></url>\n";
        }
        foreach ($templates as $t) {
            $loc = htmlspecialchars("$frontUrl/mau-thiep/{$t['slug']}");
            $mod = substr($t['updated_at'], 0, 10);
            echo "  <url><loc>$loc</loc><lastmod>$mod</lastmod></url>\n";
        }

        echo '</urlset>';
        exit;
    }

    // ---------- ADMIN ----------

    /** GET /api/admin/posts */
    public static function adminList(): void
    {
        Auth::requireAdmin();
        $rows = Database::all(
            "SELECT p.*, u.full_name AS author_name
             FROM posts p
             LEFT JOIN users u ON u.id = p.author_id
             ORDER BY p.created_at DESC"
        );
        Response::ok(array_map([self::class, 'mapRowFull'], $rows));
    }

    /** GET /api/admin/posts/{id} */
    public static function adminDetail(string $id): void
    {
        Auth::requireAdmin();
        $post = Database::one("SELECT * FROM posts WHERE id = ?", [(int)$id]);
        if (!$post) Response::error('Bài viết không tồn tại.', 404);
        Response::ok(self::mapRowFull($post));
    }

    /** POST /api/admin/posts */
    public static function create(): void
    {
        Auth::requireAdmin();
        [$errors, $d] = Request::validate([
            'title' => 'required|max:300',
        ]);
        if ($errors) Response::validation($errors);

        $b    = Request::body();
        $user = Auth::user();

        $title = $d['title'];
        $slug  = self::uniqueSlug(!empty($b['slug']) ? self::slugify($b['slug']) : self::slugify($title));

        $contentHtml = $b['contentHtml'] ?? $b['content_html'] ?? null;
        $readingTime = self::calcReadingTime($contentHtml);

        $publishedAt = null;
        if (!empty($b['publishedAt'])) {
            $publishedAt = $b['publishedAt'];
        } elseif (!empty($b['published_at'])) {
            $publishedAt = $b['published_at'];
        } elseif (($b['status'] ?? 'draft') === 'published') {
            $publishedAt = date('Y-m-d H:i:s');
        }

        $id = Database::insert(
            "INSERT INTO posts
                (slug, title, excerpt, content_html, content_json, cover_image, category,
                 status, author_id, meta_title, meta_desc, og_image, reading_time, published_at)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
                $slug,
                $title,
                $b['excerpt']     ?? null,
                $contentHtml,
                $b['contentJson'] ?? $b['content_json'] ?? null,
                $b['coverImage']  ?? $b['cover_image']  ?? null,
                $b['category']    ?? 'cam-nang',
                $b['status']      ?? 'draft',
                $user['id']       ?? null,
                $b['metaTitle']   ?? $b['meta_title']   ?? null,
                $b['metaDesc']    ?? $b['meta_desc']    ?? null,
                $b['ogImage']     ?? $b['og_image']     ?? null,
                $readingTime,
                $publishedAt,
            ]
        );

        $post = Database::one("SELECT * FROM posts WHERE id = ?", [$id]);
        Response::created(self::mapRowFull($post), 'Đã tạo bài viết.');
    }

    /** PUT /api/admin/posts/{id} */
    public static function update(string $id): void
    {
        Auth::requireAdmin();
        $post = Database::one("SELECT * FROM posts WHERE id = ?", [(int)$id]);
        if (!$post) Response::error('Bài viết không tồn tại.', 404);

        $b = Request::body();

        // Slug
        $slug = $post['slug'];
        if (!empty($b['slug'])) {
            $newSlug = self::slugify($b['slug']);
            if ($newSlug !== $post['slug']) {
                $slug = self::uniqueSlug($newSlug, (int)$id);
            }
        }

        $contentHtml = $b['contentHtml'] ?? $b['content_html'] ?? $post['content_html'];
        $readingTime = self::calcReadingTime($contentHtml);

        $status = $b['status'] ?? $post['status'];
        $publishedAt = $post['published_at'];
        if (!empty($b['publishedAt'])) {
            $publishedAt = $b['publishedAt'];
        } elseif (!empty($b['published_at'])) {
            $publishedAt = $b['published_at'];
        } elseif ($status === 'published' && !$publishedAt) {
            $publishedAt = date('Y-m-d H:i:s');
        }

        Database::run(
            "UPDATE posts SET
                slug=?, title=?, excerpt=?, content_html=?, content_json=?, cover_image=?,
                category=?, status=?, meta_title=?, meta_desc=?, og_image=?,
                reading_time=?, published_at=?
             WHERE id=?",
            [
                $slug,
                $b['title']       ?? $post['title'],
                $b['excerpt']     ?? $post['excerpt'],
                $contentHtml,
                $b['contentJson'] ?? $b['content_json'] ?? $post['content_json'],
                $b['coverImage']  ?? $b['cover_image']  ?? $post['cover_image'],
                $b['category']    ?? $post['category'],
                $status,
                $b['metaTitle']   ?? $b['meta_title']   ?? $post['meta_title'],
                $b['metaDesc']    ?? $b['meta_desc']    ?? $post['meta_desc'],
                $b['ogImage']     ?? $b['og_image']     ?? $post['og_image'],
                $readingTime,
                $publishedAt,
                $post['id'],
            ]
        );

        $updated = Database::one("SELECT * FROM posts WHERE id = ?", [$post['id']]);
        Response::ok(self::mapRowFull($updated), 'Đã cập nhật bài viết.');
    }

    /** DELETE /api/admin/posts/{id} */
    public static function delete(string $id): void
    {
        Auth::requireAdmin();
        $post = Database::one("SELECT id FROM posts WHERE id = ?", [(int)$id]);
        if (!$post) Response::error('Bài viết không tồn tại.', 404);

        Database::run("DELETE FROM posts WHERE id = ?", [$post['id']]);
        Response::ok(null, 'Đã xoá bài viết.');
    }

    /** POST /api/admin/posts/upload-image — upload ảnh inline TipTap. */
    public static function uploadImage(): void
    {
        Auth::requireAdmin();

        // Frontend gửi field 'file' (đồng bộ với các upload khác). Fallback 'image' cho tương thích cũ.
        $f = $_FILES['file'] ?? $_FILES['image'] ?? null;
        if (!$f || $f['error'] !== UPLOAD_ERR_OK) {
            Response::error('Không nhận được file. Vui lòng chọn ảnh.', 422);
        }
        $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ['webp', 'png', 'jpg', 'jpeg', 'gif'], true)) {
            Response::error('Định dạng không hỗ trợ (chỉ webp/png/jpg/jpeg/gif).', 422);
        }
        if ($f['size'] > 5 * 1024 * 1024) {
            Response::error('Ảnh quá lớn (tối đa 5MB).', 422);
        }

        $dir = __DIR__ . '/../../public/blog-images';
        if (!is_dir($dir)) @mkdir($dir, 0777, true);

        $safe  = preg_replace('/[^a-z0-9._-]/i', '-', pathinfo($f['name'], PATHINFO_FILENAME));
        $fname = $safe . '-' . substr(bin2hex(random_bytes(4)), 0, 6) . '.' . $ext;

        if (!move_uploaded_file($f['tmp_name'], $dir . '/' . $fname)) {
            Response::error('Lưu ảnh thất bại.', 500);
        }

        Response::created(['url' => '/blog-images/' . $fname], 'Đã tải ảnh lên.');
    }

    // ---------- PRIVATE HELPERS ----------

    /** Chuyển tiếng Việt có dấu → slug ASCII. */
    private static function slugify(string $text): string
    {
        $text = mb_strtolower($text, 'UTF-8');
        $map  = [
            'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a',
            'ă'=>'a','ắ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a','ặ'=>'a',
            'â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
            'đ'=>'d',
            'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e',
            'ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
            'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
            'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o',
            'ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o',
            'ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
            'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u',
            'ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
            'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
        ];
        $text = strtr($text, $map);
        $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
        $text = preg_replace('/[\s-]+/', '-', trim($text));
        return trim($text, '-');
    }

    /** Tạo slug duy nhất (nối -2, -3... nếu trùng). Bỏ qua $excludeId khi update. */
    private static function uniqueSlug(string $base, int $excludeId = 0): string
    {
        $slug     = $base;
        $counter  = 2;
        while (true) {
            $exists = Database::one(
                "SELECT id FROM posts WHERE slug = ? AND id != ?",
                [$slug, $excludeId]
            );
            if (!$exists) break;
            $slug = $base . '-' . $counter++;
        }
        return $slug;
    }

    /** Tính reading_time từ content HTML (words / 200, tối thiểu 1). */
    private static function calcReadingTime(?string $html): int
    {
        if (!$html) return 1;
        $text      = strip_tags($html);
        $wordCount = str_word_count(preg_replace('/\s+/', ' ', trim($text)));
        return max(1, (int) ceil($wordCount / 200));
    }

    /** Map DB row → camelCase (danh sách / public). */
    private static function mapRow(array $r): array
    {
        return [
            'id'          => (int) $r['id'],
            'slug'        => $r['slug'],
            'title'       => $r['title'],
            'excerpt'     => $r['excerpt'],
            'coverImage'  => $r['cover_image'],
            'category'    => $r['category'],
            'metaTitle'   => $r['meta_title'],
            'metaDesc'    => $r['meta_desc'],
            'readingTime' => (int) $r['reading_time'],
            'viewCount'   => (int) $r['view_count'],
            'publishedAt' => $r['published_at'],
        ];
    }

    /** Map DB row → camelCase đầy đủ (chi tiết / admin). */
    private static function mapRowFull(array $r): array
    {
        return array_merge(self::mapRow($r), [
            'contentHtml' => $r['content_html'] ?? null,
            'contentJson' => $r['content_json'] ?? null,
            'ogImage'     => $r['og_image']     ?? null,
            'status'      => $r['status']       ?? null,
            'authorId'    => isset($r['author_id']) ? (int) $r['author_id'] : null,
            'authorName'  => $r['author_name']  ?? null,
            'createdAt'   => $r['created_at']   ?? null,
            'updatedAt'   => $r['updated_at']   ?? null,
        ]);
    }
}
