<?php
/** Khu quản trị (role=admin). Quản lý mẫu thiệp, đơn, liên hệ, người dùng. */
class AdminController
{
    /** GET /api/admin/stats — số liệu tổng quan dashboard. */
    public static function stats(): void
    {
        Auth::requireAdmin();
        Response::ok([
            'templates'    => (int) Database::one("SELECT COUNT(*) c FROM templates")['c'],
            'orders'       => (int) Database::one("SELECT COUNT(*) c FROM orders")['c'],
            'invitations'  => (int) Database::one("SELECT COUNT(*) c FROM invitations WHERE is_published=1")['c'],
            'customers'    => (int) Database::one("SELECT COUNT(*) c FROM users WHERE role='customer'")['c'],
            'newContacts'  => (int) Database::one("SELECT COUNT(*) c FROM contact_requests WHERE status='new'")['c'],
            'revenuePaid'  => (int) Database::one("SELECT COALESCE(SUM(amount),0) s FROM orders WHERE payment_status='paid'")['s'],
        ]);
    }

    // ---------- TEMPLATES ----------
    /** POST /api/admin/templates */
    public static function createTemplate(): void
    {
        Auth::requireAdmin();
        [$errors, $d] = Request::validate([
            'name'     => 'required|max:160',
            'slug'     => 'required|max:160',
            'category' => 'required|in:luxury,modern,classic,minimalist,floral,vintage',
        ]);
        if ($errors) Response::validation($errors);

        $b = Request::body();
        $id = Database::insert(
            "INSERT INTO templates (slug,name,category,description,thumbnail,gallery,features,price_from,is_new,is_hot,sort_order)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            [$d['slug'], $d['name'], $d['category'], $b['description'] ?? '', $b['thumbnail'] ?? '',
             json_encode($b['gallery'] ?? [], JSON_UNESCAPED_UNICODE),
             json_encode($b['features'] ?? [], JSON_UNESCAPED_UNICODE),
             (int)($b['priceFrom'] ?? 0), !empty($b['isNew']) ? 1 : 0, !empty($b['isHot']) ? 1 : 0, (int)($b['sortOrder'] ?? 0)]
        );
        Response::created(['id' => $id], 'Đã thêm mẫu thiệp.');
    }

    /** PUT /api/admin/templates/{id} */
    public static function updateTemplate(string $id): void
    {
        Auth::requireAdmin();
        $t = Database::one("SELECT * FROM templates WHERE id = ?", [(int)$id]);
        if (!$t) Response::error('Không tìm thấy mẫu thiệp.', 404);

        $b = Request::body();
        Database::run(
            "UPDATE templates SET name=?, slug=?, category=?, description=?, thumbnail=?,
                gallery=?, features=?, price_from=?, is_new=?, is_hot=?, is_active=?, sort_order=? WHERE id=?",
            [$b['name'] ?? $t['name'], $b['slug'] ?? $t['slug'], $b['category'] ?? $t['category'],
             $b['description'] ?? $t['description'], $b['thumbnail'] ?? $t['thumbnail'],
             isset($b['gallery']) ? json_encode($b['gallery'], JSON_UNESCAPED_UNICODE) : $t['gallery'],
             isset($b['features']) ? json_encode($b['features'], JSON_UNESCAPED_UNICODE) : $t['features'],
             $b['priceFrom'] ?? $t['price_from'],
             isset($b['isNew']) ? (int)$b['isNew'] : $t['is_new'],
             isset($b['isHot']) ? (int)$b['isHot'] : $t['is_hot'],
             isset($b['isActive']) ? (int)$b['isActive'] : $t['is_active'],
             $b['sortOrder'] ?? $t['sort_order'], $t['id']]
        );
        Response::ok(null, 'Đã cập nhật mẫu thiệp.');
    }

    /** DELETE /api/admin/templates/{id} */
    public static function deleteTemplate(string $id): void
    {
        Auth::requireAdmin();
        Database::run("UPDATE templates SET is_active = 0 WHERE id = ?", [(int)$id]); // soft delete
        Response::ok(null, 'Đã ẩn mẫu thiệp.');
    }

    /** GET /api/admin/templates/{id} — chi tiết 1 mẫu kèm design. */
    public static function templateDetail(string $id): void
    {
        Auth::requireAdmin();
        $t = Database::one("SELECT * FROM templates WHERE id=?", [(int)$id]);
        if (!$t) Response::error('Không tìm thấy mẫu thiệp.', 404);
        $out = mapTemplate($t);
        $out['design'] = jdec($t['design'] ?? null);
        Response::ok($out);
    }

    /** PUT /api/admin/templates/{id}/design — lưu thiết kế (theme + decorations). */
    public static function updateDesign(string $id): void
    {
        Auth::requireAdmin();
        $t = Database::one("SELECT id FROM templates WHERE id=?", [(int)$id]);
        if (!$t) Response::error('Không tìm thấy mẫu thiệp.', 404);
        $b = Request::body();
        // MERGE với design cũ để KHÔNG mất sectionOrder/field FE không gửi.
        $old = Database::one("SELECT design FROM templates WHERE id=?", [(int)$id]);
        $design = $old && !empty($old['design']) ? (json_decode($old['design'], true) ?: []) : [];
        $design['theme'] = $b['theme'] ?? ($design['theme'] ?? new stdClass());
        $design['decorations'] = $b['decorations'] ?? ($design['decorations'] ?? []);
        if (isset($b['fontset'])) $design['fontset'] = $b['fontset'];   // bộ font theo mẫu
        if (isset($b['spacing'])) $design['spacing'] = $b['spacing'];   // khoảng cách body (sectionGap/headerMin)
        if (isset($b['sectionOrder'])) $design['sectionOrder'] = $b['sectionOrder'];
        if (isset($b['headerStyle'])) $design['headerStyle'] = $b['headerStyle'];   // kiểu header hoamoc
        Database::run("UPDATE templates SET design=? WHERE id=?",
            [json_encode($design, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), (int)$id]);
        Response::ok(null, 'Đã lưu thiết kế mẫu.');
    }

    // ---------- ORDERS ----------
    /** GET /api/admin/orders */
    public static function orders(): void
    {
        Auth::requireAdmin();
        $rows = Database::all(
            "SELECT o.*, u.full_name AS customer_name, u.email AS customer_email,
                    t.name AS template_name, p.name AS plan_name
             FROM orders o
             JOIN users u ON u.id = o.user_id
             JOIN templates t ON t.id = o.template_id
             JOIN pricing_plans p ON p.id = o.plan_id
             ORDER BY o.id DESC"
        );
        Response::ok($rows);
    }

    /** PATCH /api/admin/orders/{id} — đổi payment_status/status (xác nhận thanh toán tay). */
    public static function updateOrder(string $id): void
    {
        Auth::requireAdmin();
        $o = Database::one("SELECT * FROM orders WHERE id = ?", [(int)$id]);
        if (!$o) Response::error('Không tìm thấy đơn.', 404);

        $b = Request::body();
        $pay    = $b['paymentStatus'] ?? $o['payment_status'];
        $status = $b['status'] ?? $o['status'];
        if (!in_array($pay, ['unpaid','paid','refunded'], true)) Response::error('payment_status không hợp lệ.', 422);
        if (!in_array($status, ['pending','active','expired','cancelled'], true)) Response::error('status không hợp lệ.', 422);

        Database::run("UPDATE orders SET payment_status=?, status=? WHERE id=?", [$pay, $status, $o['id']]);
        Response::ok(null, 'Đã cập nhật đơn.');
    }

    // ---------- CONTACTS ----------
    /** GET /api/admin/contacts */
    public static function contacts(): void
    {
        Auth::requireAdmin();
        $rows = Database::all(
            "SELECT c.*, t.name AS template_name FROM contact_requests c
             LEFT JOIN templates t ON t.id = c.template_id ORDER BY c.id DESC"
        );
        Response::ok($rows);
    }

    /** PATCH /api/admin/contacts/{id} */
    public static function updateContact(string $id): void
    {
        Auth::requireAdmin();
        $status = Request::input('status');
        if (!in_array($status, ['new','contacted','done','spam'], true)) Response::error('status không hợp lệ.', 422);
        Database::run("UPDATE contact_requests SET status=? WHERE id=?", [$status, (int)$id]);
        Response::ok(null, 'Đã cập nhật.');
    }

    // ---------- USERS ----------
    /** GET /api/admin/users */
    public static function users(): void
    {
        Auth::requireAdmin();
        $rows = Database::all("SELECT id, full_name, email, phone, role, status, created_at FROM users ORDER BY id DESC");
        Response::ok($rows);
    }

    /** PATCH /api/admin/users/{id} — khoá/mở khoá khách hàng. */
    public static function updateUser(string $id): void
    {
        Auth::requireAdmin();
        $status = Request::input('status');
        if (!in_array($status, ['active','blocked'], true)) Response::error('status không hợp lệ.', 422);
        // không cho tự khoá admin
        Database::run("UPDATE users SET status=? WHERE id=? AND role<>'admin'", [$status, (int)$id]);
        Response::ok(null, 'Đã cập nhật người dùng.');
    }

    // ---------- CHARTS / ANALYTICS ----------
    /** GET /api/admin/charts — dữ liệu cho biểu đồ dashboard. */
    public static function charts(): void
    {
        Auth::requireAdmin();

        // Doanh thu + số đơn 6 tháng gần nhất (chỉ đơn đã thanh toán cho doanh thu)
        $revenue = Database::all(
            "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
                    COUNT(*) AS orders,
                    COALESCE(SUM(CASE WHEN payment_status='paid' THEN amount ELSE 0 END),0) AS revenue
             FROM orders
             WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
             GROUP BY month ORDER BY month ASC"
        );

        // Phân bố mẫu thiệp theo danh mục
        $byCategory = Database::all(
            "SELECT category, COUNT(*) AS count FROM templates WHERE is_active=1 GROUP BY category"
        );

        // Trạng thái đơn
        $byStatus = Database::all(
            "SELECT payment_status AS status, COUNT(*) AS count FROM orders GROUP BY payment_status"
        );

        Response::ok([
            'revenue'    => array_map(fn($r) => ['month' => $r['month'], 'orders' => (int)$r['orders'], 'revenue' => (int)$r['revenue']], $revenue),
            'byCategory' => array_map(fn($r) => ['category' => $r['category'], 'count' => (int)$r['count']], $byCategory),
            'byStatus'   => array_map(fn($r) => ['status' => $r['status'], 'count' => (int)$r['count']], $byStatus),
        ]);
    }

    // ---------- INVITATIONS (thiệp sống) ----------
    /** GET /api/admin/invitations */
    public static function invitations(): void
    {
        Auth::requireAdmin();
        $rows = Database::all(
            "SELECT i.id, i.slug, i.groom_name, i.bride_name, i.wedding_date, i.is_published,
                    i.view_count, i.expires_at, u.full_name AS owner, t.name AS template_name,
                    (SELECT COUNT(*) FROM rsvps r WHERE r.invitation_id=i.id) AS rsvp_count,
                    (SELECT COUNT(*) FROM guestbook g WHERE g.invitation_id=i.id) AS wish_count
             FROM invitations i
             JOIN users u ON u.id=i.user_id
             JOIN templates t ON t.id=i.template_id
             ORDER BY i.id DESC"
        );
        Response::ok($rows);
    }

    /** GET /api/admin/invitations/{id} — chi tiết RSVP + sổ lưu bút. */
    public static function invitationDetail(string $id): void
    {
        Auth::requireAdmin();
        $inv = Database::one("SELECT id, slug, groom_name, bride_name FROM invitations WHERE id=?", [(int)$id]);
        if (!$inv) Response::error('Không tìm thấy thiệp.', 404);
        $inv['rsvps']     = Database::all("SELECT guest_name, attendance, guest_count, message, created_at FROM rsvps WHERE invitation_id=? ORDER BY id DESC", [(int)$id]);
        $inv['guestbook'] = Database::all("SELECT id, guest_name, message, is_approved, created_at FROM guestbook WHERE invitation_id=? ORDER BY id DESC", [(int)$id]);
        Response::ok($inv);
    }

    /** PATCH /api/admin/guestbook/{id} — duyệt/ẩn lời chúc. */
    public static function updateGuestbook(string $id): void
    {
        Auth::requireAdmin();
        $approved = Request::input('isApproved') ? 1 : 0;
        Database::run("UPDATE guestbook SET is_approved=? WHERE id=?", [$approved, (int)$id]);
        Response::ok(null, 'Đã cập nhật lời chúc.');
    }

    // ---------- PLANS ----------
    /** GET /api/admin/plans */
    public static function plans(): void
    {
        Auth::requireAdmin();
        Response::ok(Database::all("SELECT * FROM pricing_plans ORDER BY sort_order ASC"));
    }

    /** PUT /api/admin/plans/{id} — sửa giá/tên/tính năng gói. */
    public static function updatePlan(string $id): void
    {
        Auth::requireAdmin();
        $p = Database::one("SELECT * FROM pricing_plans WHERE id=?", [(int)$id]);
        if (!$p) Response::error('Không tìm thấy gói.', 404);
        $b = Request::body();
        Database::run(
            "UPDATE pricing_plans SET name=?, price=?, duration=?, duration_days=?, description=?,
                features=?, is_recommended=?, is_active=? WHERE id=?",
            [$b['name'] ?? $p['name'], (int)($b['price'] ?? $p['price']), $b['duration'] ?? $p['duration'],
             (int)($b['durationDays'] ?? $p['duration_days']), $b['description'] ?? $p['description'],
             isset($b['features']) ? json_encode($b['features'], JSON_UNESCAPED_UNICODE) : $p['features'],
             isset($b['isRecommended']) ? (int)$b['isRecommended'] : $p['is_recommended'],
             isset($b['isActive']) ? (int)$b['isActive'] : $p['is_active'], $p['id']]
        );
        Response::ok(null, 'Đã cập nhật gói giá.');
    }

    // ---------- TESTIMONIALS ----------
    /** GET /api/admin/testimonials */
    public static function testimonials(): void
    {
        Auth::requireAdmin();
        Response::ok(Database::all("SELECT * FROM testimonials ORDER BY id DESC"));
    }

    /** POST /api/admin/testimonials */
    public static function createTestimonial(): void
    {
        Auth::requireAdmin();
        [$errors, $d] = Request::validate(['name' => 'required|max:120', 'quote' => 'required|max:1000']);
        if ($errors) Response::validation($errors);
        $b = Request::body();
        $id = Database::insert(
            "INSERT INTO testimonials (name, avatar, quote, rating) VALUES (?,?,?,?)",
            [$d['name'], $b['avatar'] ?? '💑', $d['quote'], (int)($b['rating'] ?? 5)]
        );
        Response::created(['id' => $id], 'Đã thêm đánh giá.');
    }

    /** DELETE /api/admin/testimonials/{id} */
    public static function deleteTestimonial(string $id): void
    {
        Auth::requireAdmin();
        Database::run("DELETE FROM testimonials WHERE id=?", [(int)$id]);
        Response::ok(null, 'Đã xóa đánh giá.');
    }

    // ---------- ASSET LIBRARY (ảnh trang trí) ----------
    /** GET /api/admin/assets — liệt kê tất cả ảnh trong public/invitation (đệ quy). */
    public static function assets(): void
    {
        Auth::requireAdmin();
        $cfg = require __DIR__ . '/../config/config.php';
        $base = realpath($cfg['assets_dir']);
        $urlBase = $cfg['assets_url'];
        $out = [];
        if ($base && is_dir($base)) {
            $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($base, FilesystemIterator::SKIP_DOTS));
            foreach ($rii as $file) {
                if ($file->isDir()) continue;
                $ext = strtolower($file->getExtension());
                if (!in_array($ext, ['webp','png','jpg','jpeg','svg','gif'], true)) continue;
                $rel = str_replace('\\', '/', substr($file->getPathname(), strlen($base)));
                $out[] = [
                    'url'   => $urlBase . $rel,                 // vd /invitation/songhy.webp
                    'name'  => $file->getBasename('.' . $ext),
                    'group' => trim(dirname($rel), '/') ?: 'chung',
                ];
            }
        }
        usort($out, fn($a, $b) => strcmp($a['url'], $b['url']));
        Response::ok($out);
    }

    /** POST /api/admin/assets/upload — upload 1 ảnh (multipart field "file") vào uploads/. */
    public static function uploadAsset(): void
    {
        Auth::requireAdmin();
        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            Response::error('Không nhận được file. Vui lòng chọn ảnh.', 422);
        }
        $f = $_FILES['file'];
        $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ['webp','png','jpg','jpeg','svg','gif'], true)) {
            Response::error('Định dạng không hỗ trợ (chỉ webp/png/jpg/svg/gif).', 422);
        }
        if ($f['size'] > 5 * 1024 * 1024) Response::error('Ảnh quá lớn (tối đa 5MB).', 422);

        $cfg = require __DIR__ . '/../config/config.php';
        $dir = $cfg['assets_dir'] . '/uploads';
        if (!is_dir($dir)) @mkdir($dir, 0777, true);

        $safe = preg_replace('/[^a-z0-9._-]/i', '-', pathinfo($f['name'], PATHINFO_FILENAME));
        $fname = $safe . '-' . substr(bin2hex(random_bytes(4)), 0, 6) . '.' . $ext;
        if (!move_uploaded_file($f['tmp_name'], $dir . '/' . $fname)) {
            Response::error('Lưu ảnh thất bại.', 500);
        }
        Response::created(['url' => $cfg['assets_url'] . '/uploads/' . $fname], 'Đã tải ảnh lên.');
    }

    /**
     * POST /api/admin/templates/{id}/preview — chụp lại ảnh coverflow cho 1 mẫu.
     * POST /api/admin/templates/all/preview — chụp lại TẤT CẢ mẫu (id = "all").
     * Chạy Node + Puppeteer (capture-preview.mjs). Cần dev server + API đang chạy.
     */
    public static function regenPreview(string $id): void
    {
        Auth::requireAdmin();
        $cfg = require __DIR__ . '/../config/config.php';
        $pv = $cfg['preview'] ?? null;
        if (!$pv) Response::error('Chưa cấu hình preview trong config.', 500);

        if (!function_exists('proc_open')) {
            Response::error('Máy chủ không cho phép chạy tiến trình (proc_open bị tắt).', 500);
        }

        // id = "all" -> chụp tất cả; ngược lại lấy slug từ template.
        $slug = null;
        $slugArg = '';
        if ($id !== 'all') {
            $t = Database::one("SELECT slug FROM templates WHERE id=?", [(int)$id]);
            if (!$t) Response::error('Không tìm thấy mẫu thiệp.', 404);
            $slug = $t['slug'];
            $slugArg = ' ' . escapeshellarg($slug);
        }

        // Ghi log ra file để theo dõi (vì chạy nền).
        $logFile = sys_get_temp_dir() . '/juntech-preview.log';
        $scriptPath = realpath($pv['script']) ?: $pv['script'];
        $isWin = stripos(PHP_OS, 'WIN') === 0;

        // CHẠY NỀN HOÀN TOÀN TÁCH KHỎI PHP. PHP dev server (Windows) đơn luồng + tiến trình con
        // kế thừa handle của PHP làm trang headless không fetch được API -> render rỗng.
        // Giải pháp chắc chắn: ghi 1 file .cmd tạm rồi `start` detached (cmd con độc lập env/handle).
        if ($isWin) {
            $bat = sys_get_temp_dir() . '\\juntech-preview-' . bin2hex(random_bytes(3)) . '.cmd';
            $slugLine = $id === 'all' ? '' : (' "' . $slug . '"');
            // chcp 65001 + BOM: cmd.exe đọc UTF-8 (đường dẫn dự án có ký tự tiếng Việt).
            $content  = "\xEF\xBB\xBF@echo off\r\n"
                      . "chcp 65001 >nul\r\n"
                      . 'cd /d "' . $pv['project_dir'] . "\"\r\n"
                      . '"' . $pv['node_bin'] . '" "' . $scriptPath . '"' . $slugLine . ' > "' . $logFile . '" 2>&1' . "\r\n";
            file_put_contents($bat, $content);
            // start /B chạy nền, tách hẳn khỏi tiến trình PHP.
            pclose(popen('start "" /B cmd /c "' . $bat . '"', 'r'));
        } else {
            $cmd = escapeshellarg($pv['node_bin']) . ' ' . escapeshellarg($scriptPath) . $slugArg
                 . ' > ' . escapeshellarg($logFile) . ' 2>&1 &';
            exec('cd ' . escapeshellarg($pv['project_dir']) . ' && ' . $cmd);
        }

        Response::ok(
            ['async' => true],
            $id === 'all'
                ? 'Đang tạo lại ảnh tất cả mẫu (chạy nền ~30–60s). Tải lại trang chủ sau khi xong.'
                : 'Đang tạo lại ảnh cho mẫu (chạy nền ~10s). Tải lại trang chủ sau khi xong.'
        );
    }

    // ---------- MUSIC LIBRARY ----------
    /** GET /api/admin/music — liệt kê tất cả nhạc (thư mục public/music kể cả /uploads). */
    public static function musicList(): void
    {
        Auth::requireAdmin();
        $cfg  = require __DIR__ . '/../config/config.php';
        $base = realpath(dirname($cfg['assets_dir']) . '/music');
        $out  = [];
        if ($base && is_dir($base)) {
            $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($base, FilesystemIterator::SKIP_DOTS));
            foreach ($rii as $file) {
                if ($file->isDir()) continue;
                $ext = strtolower($file->getExtension());
                if (!in_array($ext, ['mp3','m4a','ogg','wav'], true)) continue;
                $rel   = str_replace('\\', '/', substr($file->getPathname(), strlen($base)));
                $fname = $file->getBasename('.' . $ext);
                // pretty name: thay - / _ bằng space, ucwords
                $pretty = ucwords(str_replace(['-','_'], ' ', $fname));
                $out[] = ['url' => '/music' . $rel, 'name' => $pretty];
            }
        }
        usort($out, fn($a, $b) => strcmp($a['name'], $b['name']));
        Response::ok($out);
    }

    /** POST /api/admin/music/upload — upload nhạc vào public/music (thư mục gốc). */
    public static function uploadMusic(): void
    {
        Auth::requireAdmin();
        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            Response::error('Không nhận được file.', 422);
        }
        $f   = $_FILES['file'];
        $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ['mp3','m4a','ogg','wav'], true)) {
            Response::error('Định dạng không hỗ trợ (mp3/m4a/ogg/wav).', 422);
        }
        if ($f['size'] > 20 * 1024 * 1024) Response::error('File quá lớn (tối đa 20 MB).', 422);

        $cfg = require __DIR__ . '/../config/config.php';
        $dir = dirname($cfg['assets_dir']) . '/music';
        if (!is_dir($dir)) @mkdir($dir, 0777, true);

        $safe  = preg_replace('/[^a-z0-9._-]/i', '-', pathinfo($f['name'], PATHINFO_FILENAME));
        $fname = $safe . '.' . $ext;
        // tránh ghi đè
        if (file_exists($dir . '/' . $fname)) {
            $fname = $safe . '-' . substr(bin2hex(random_bytes(3)), 0, 5) . '.' . $ext;
        }
        if (!move_uploaded_file($f['tmp_name'], $dir . '/' . $fname)) {
            Response::error('Lưu file thất bại.', 500);
        }
        $pretty = ucwords(str_replace(['-','_'], ' ', $safe));
        Response::created(['url' => '/music/' . $fname, 'name' => $pretty], 'Đã tải nhạc lên.');
    }

    /** PATCH /api/admin/music/rename — đổi tên hiển thị bằng cách rename file. */
    public static function renameMusic(): void
    {
        Auth::requireAdmin();
        $b        = Request::body();
        $filename = basename($b['filename'] ?? '');
        $newName  = trim($b['name'] ?? '');
        if (!$filename || !$newName) Response::error('Thiếu filename hoặc name.', 422);

        $cfg  = require __DIR__ . '/../config/config.php';
        $base = dirname($cfg['assets_dir']) . '/music';
        $old  = $base . '/' . $filename;
        if (!file_exists($old)) Response::error('Không tìm thấy file nhạc.', 404);

        $ext     = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $safeName = preg_replace('/[^a-z0-9._-]/i', '-', $newName);
        $newFile  = $safeName . '.' . $ext;
        if ($newFile === $filename) { Response::ok(null, 'Không thay đổi.'); return; }
        if (file_exists($base . '/' . $newFile)) {
            $newFile = $safeName . '-' . substr(bin2hex(random_bytes(3)), 0, 5) . '.' . $ext;
        }
        rename($old, $base . '/' . $newFile);
        Response::ok(['url' => '/music/' . $newFile, 'name' => $newName], 'Đã đổi tên.');
    }

    /** DELETE /api/admin/music/{filename} — xóa file nhạc. */
    public static function deleteMusic(string $filename): void
    {
        Auth::requireAdmin();
        $filename = basename(rawurldecode($filename)); // ngăn path traversal
        $cfg  = require __DIR__ . '/../config/config.php';
        $base = dirname($cfg['assets_dir']) . '/music';
        $path = $base . '/' . $filename;
        if (!file_exists($path)) Response::error('Không tìm thấy file.', 404);
        unlink($path);
        Response::ok(null, 'Đã xóa bài nhạc.');
    }

    // ---------- SETTINGS ----------
    /** GET /api/admin/settings */
    public static function settings(): void
    {
        Auth::requireAdmin();
        $rows = Database::all("SELECT skey, svalue FROM settings");
        $out = [];
        foreach ($rows as $r) $out[$r['skey']] = $r['svalue'];
        Response::ok($out);
    }

    /** PUT /api/admin/settings — lưu nhiều key cùng lúc. */
    public static function updateSettings(): void
    {
        Auth::requireAdmin();
        $b = Request::body();
        foreach ($b as $k => $v) {
            if (!is_string($k)) continue;
            Database::run(
                "INSERT INTO settings (skey, svalue) VALUES (?, ?) ON DUPLICATE KEY UPDATE svalue=VALUES(svalue)",
                [$k, is_scalar($v) ? (string)$v : json_encode($v, JSON_UNESCAPED_UNICODE)]
            );
        }
        Response::ok(null, 'Đã lưu cài đặt.');
    }
}
