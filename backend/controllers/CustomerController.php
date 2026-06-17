<?php
/** Khu vực khách hàng (cần đăng nhập): đặt đơn, quản lý thiệp của mình. */
class CustomerController
{
    /** POST /api/orders — tạo đơn thuê + thiệp nháp. */
    public static function createOrder(): void
    {
        $u = Auth::require();

        $templateId = Request::input('template_id');
        $planCode   = Request::input('plan_code');
        if (!is_numeric($templateId) || !$planCode) {
            Response::validation(['template_id' => 'Bắt buộc', 'plan_code' => 'Bắt buộc']);
        }

        $tpl  = Database::one("SELECT * FROM templates WHERE id = ? AND is_active = 1", [(int)$templateId]);
        if (!$tpl) Response::error('Mẫu thiệp không tồn tại.', 404);
        $plan = Database::one("SELECT * FROM pricing_plans WHERE code = ? AND is_active = 1", [$planCode]);
        if (!$plan) Response::error('Gói dịch vụ không tồn tại.', 404);

        $pdo = Database::conn();
        $pdo->beginTransaction();
        try {
            $orderCode = 'JT' . date('Ymd') . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));
            $orderId = Database::insert(
                "INSERT INTO orders (order_code, user_id, template_id, plan_id, amount)
                 VALUES (?, ?, ?, ?, ?)",
                [$orderCode, $u['id'], $tpl['id'], $plan['id'], $plan['price']]
            );

            // slug thiệp nháp duy nhất
            $slug = 'thiep-' . $orderId . '-' . substr(bin2hex(random_bytes(2)), 0, 4);
            Database::insert(
                "INSERT INTO invitations (order_id, user_id, template_id, slug, groom_name, bride_name, settings)
                 VALUES (?, ?, ?, ?, '', '', ?)",
                [$orderId, $u['id'], $tpl['id'], $slug,
                 json_encode(['countdown' => true, 'rsvp' => true, 'guestbook' => true], JSON_UNESCAPED_UNICODE)]
            );

            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            Response::error('Không tạo được đơn. Vui lòng thử lại.', 500);
        }

        Response::created([
            'orderCode'     => $orderCode,
            'orderId'       => $orderId,
            'invitationSlug'=> $slug,
            'amount'        => (int) $plan['price'],
            'paymentStatus' => 'unpaid',
        ], 'Đã tạo đơn. Tiếp tục chỉnh sửa thiệp của bạn.');
    }

    /** GET /api/orders — đơn của tôi. */
    public static function myOrders(): void
    {
        $u = Auth::require();
        $rows = Database::all(
            "SELECT o.order_code, o.amount, o.payment_status, o.status, o.created_at,
                    t.name AS template_name, p.name AS plan_name, i.slug AS invitation_slug
             FROM orders o
             JOIN templates t ON t.id = o.template_id
             JOIN pricing_plans p ON p.id = o.plan_id
             LEFT JOIN invitations i ON i.order_id = o.id
             WHERE o.user_id = ? ORDER BY o.id DESC",
            [$u['id']]
        );
        Response::ok($rows);
    }

    /** GET /api/my/invitations — thiệp của tôi. */
    public static function myInvitations(): void
    {
        $u = Auth::require();
        $rows = Database::all(
            "SELECT i.*, t.slug AS template_slug FROM invitations i
             JOIN templates t ON t.id = i.template_id
             WHERE i.user_id = ? ORDER BY i.id DESC",
            [$u['id']]
        );
        Response::ok(array_map('mapInvitation', $rows));
    }

    /** GET /api/my/invitations/{slug} — chi tiết (chủ sở hữu). */
    public static function getInvitation(string $slug): void
    {
        $inv = self::ownInvitation($slug);
        $data = mapInvitation($inv);
        $data['rsvps']     = Database::all("SELECT guest_name, attendance, guest_count, message, created_at FROM rsvps WHERE invitation_id = ? ORDER BY id DESC", [$inv['id']]);
        $data['guestbook'] = Database::all("SELECT id, guest_name, message, is_approved, created_at FROM guestbook WHERE invitation_id = ? ORDER BY id DESC", [$inv['id']]);
        $data['viewCount'] = (int) $inv['view_count'];
        $data['expiresAt'] = $inv['expires_at'];
        Response::ok($data);
    }

    /** PUT /api/my/invitations/{slug} — cập nhật nội dung thiệp. */
    public static function updateInvitation(string $slug): void
    {
        $inv = self::ownInvitation($slug);

        $b = Request::body();
        // Các field cho phép cập nhật (whitelist).
        $fields = [
            'groom_name'     => $b['groomName']     ?? $inv['groom_name'],
            'bride_name'     => $b['brideName']     ?? $inv['bride_name'],
            'wedding_date'   => $b['weddingDate']   ?? $inv['wedding_date'],
            'venue_name'     => $b['venueName']     ?? $inv['venue_name'],
            'venue_address'  => $b['venueAddress']  ?? $inv['venue_address'],
            'map_url'        => $b['mapUrl']        ?? $inv['map_url'],
            'cover_photo'    => $b['coverPhoto']    ?? $inv['cover_photo'],
            'music_url'      => $b['musicUrl']      ?? $inv['music_url'],
            'invite_message' => $b['inviteMessage'] ?? $inv['invite_message'],
            'gallery'        => isset($b['gallery'])   ? json_encode($b['gallery'], JSON_UNESCAPED_UNICODE)   : $inv['gallery'],
            'love_story'     => isset($b['loveStory']) ? json_encode($b['loveStory'], JSON_UNESCAPED_UNICODE) : $inv['love_story'],
            'settings'       => isset($b['settings'])  ? json_encode($b['settings'], JSON_UNESCAPED_UNICODE)  : $inv['settings'],
            'groom_family'   => isset($b['groomFamily']) ? json_encode($b['groomFamily'], JSON_UNESCAPED_UNICODE) : $inv['groom_family'],
            'bride_family'   => isset($b['brideFamily']) ? json_encode($b['brideFamily'], JSON_UNESCAPED_UNICODE) : $inv['bride_family'],
            'gift_qr_groom'  => $b['giftQrGroom'] ?? $inv['gift_qr_groom'],
            'gift_qr_bride'  => $b['giftQrBride'] ?? $inv['gift_qr_bride'],
            'reception_time' => $b['receptionTime'] ?? $inv['reception_time'],
            'bank_groom'     => isset($b['bankGroom']) ? json_encode($b['bankGroom'], JSON_UNESCAPED_UNICODE) : $inv['bank_groom'],
            'bank_bride'     => isset($b['bankBride']) ? json_encode($b['bankBride'], JSON_UNESCAPED_UNICODE) : $inv['bank_bride'],
        ];

        Database::run(
            "UPDATE invitations SET groom_name=?, bride_name=?, wedding_date=?, venue_name=?,
                venue_address=?, map_url=?, cover_photo=?, music_url=?, invite_message=?,
                gallery=?, love_story=?, settings=?,
                groom_family=?, bride_family=?, gift_qr_groom=?, gift_qr_bride=?,
                reception_time=?, bank_groom=?, bank_bride=? WHERE id=?",
            [...array_values($fields), $inv['id']]
        );
        Response::ok(null, 'Đã lưu thiệp.');
    }

    /** POST /api/my/invitations/{slug}/publish — đăng thiệp (set slug đẹp + expiry theo plan). */
    public static function publish(string $slug): void
    {
        $inv = self::ownInvitation($slug);
        if (empty($inv['groom_name']) || empty($inv['bride_name'])) {
            Response::error('Vui lòng nhập tên cô dâu & chú rể trước khi đăng.', 422);
        }

        $newSlug = Request::input('slug');
        if ($newSlug) {
            $newSlug = self::slugify($newSlug);
            $dup = Database::one("SELECT id FROM invitations WHERE slug = ? AND id <> ?", [$newSlug, $inv['id']]);
            if ($dup) Response::error('Đường dẫn này đã có người dùng. Chọn tên khác.', 409);
        } else {
            $newSlug = $inv['slug'];
        }

        // expiry theo duration_days của plan trong order
        $days = Database::one(
            "SELECT p.duration_days FROM orders o JOIN pricing_plans p ON p.id = o.plan_id WHERE o.id = ?",
            [$inv['order_id']]
        );
        $durationDays = (int) ($days['duration_days'] ?? 90);

        Database::run(
            "UPDATE invitations SET slug=?, is_published=1,
             expires_at = DATE_ADD(NOW(), INTERVAL ? DAY) WHERE id=?",
            [$newSlug, $durationDays, $inv['id']]
        );
        Database::run("UPDATE orders SET status='active' WHERE id=?", [$inv['order_id']]);

        Response::ok(['slug' => $newSlug, 'url' => "/thiep/$newSlug"], 'Đã đăng thiệp!');
    }

    private static function ownInvitation(string $slug): array
    {
        $u = Auth::require();
        $inv = Database::one("SELECT * FROM invitations WHERE slug = ? AND user_id = ?", [$slug, $u['id']]);
        if (!$inv) Response::error('Không tìm thấy thiệp.', 404);
        return $inv;
    }

    private static function slugify(string $s): string
    {
        $s = mb_strtolower(trim($s), 'UTF-8');
        $map = ['à','á','ạ','ả','ã','â','ầ','ấ','ậ','ẩ','ẫ','ă','ằ','ắ','ặ','ẳ','ẵ','è','é','ẹ','ẻ','ẽ','ê','ề','ế','ệ','ể','ễ','ì','í','ị','ỉ','ĩ','ò','ó','ọ','ỏ','õ','ô','ồ','ố','ộ','ổ','ỗ','ơ','ờ','ớ','ợ','ở','ỡ','ù','ú','ụ','ủ','ũ','ư','ừ','ứ','ự','ử','ữ','ỳ','ý','ỵ','ỷ','ỹ','đ'];
        $rep = ['a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','e','e','e','e','e','e','e','e','e','e','e','i','i','i','i','i','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','u','u','u','u','u','u','u','u','u','u','u','y','y','y','y','y','d'];
        $s = str_replace($map, $rep, $s);
        $s = preg_replace('/[^a-z0-9]+/', '-', $s);
        return trim($s, '-') ?: ('thiep-' . bin2hex(random_bytes(2)));
    }
}
