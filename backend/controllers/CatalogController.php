<?php
/** Dữ liệu công khai: mẫu thiệp, gói giá, testimonials. */
class CatalogController
{
    /** GET /api/templates?category=&q= */
    public static function templates(): void
    {
        $sql    = "SELECT * FROM templates WHERE is_active = 1";
        $params = [];

        $cat = Request::query('category');
        if ($cat && $cat !== 'all') {
            $sql .= " AND category = ?";
            $params[] = $cat;
        }
        $q = Request::query('q');
        if ($q) {
            $sql .= " AND (name LIKE ? OR description LIKE ?)";
            $params[] = "%$q%";
            $params[] = "%$q%";
        }
        $sql .= " ORDER BY sort_order ASC, id ASC";

        $rows = array_map('mapTemplate', Database::all($sql, $params));
        Response::ok($rows);
    }

    /** GET /api/templates/{slug} */
    public static function templateBySlug(string $slug): void
    {
        $t = Database::one("SELECT * FROM templates WHERE slug = ? AND is_active = 1", [$slug]);
        if (!$t) Response::error('Không tìm thấy mẫu thiệp.', 404);
        Response::ok(mapTemplate($t));
    }

    /** GET /api/demo/{slug} — dữ liệu thiệp DEMO của 1 mẫu (dữ liệu mẫu + design thật). */
    public static function demo(string $slug): void
    {
        $t = Database::one("SELECT * FROM templates WHERE slug = ? AND is_active = 1", [$slug]);
        if (!$t) Response::error('Không tìm thấy mẫu thiệp.', 404);

        $layout = $t['layout'] ?? 'traditional';

        // Ảnh đôi (chú rể / cô dâu) — chỉ layout hoamoc dùng trong header
        $extra = [
            // Lễ thành hôn riêng (tư gia, sáng) — khác giờ/nơi với tiệc
            'ceremony' => [
                'enabled' => true,
                'datetime' => '2026-05-02 09:00',
                'venue' => 'Tư Gia Nhà Gái',
                'address' => '123 Nguyễn Huệ, Quận 1, TP.HCM',
            ],
            // Tiệc cưới: giờ đón khách + khai tiệc
            'reception' => ['welcomeTime' => '17:30', 'banquetTime' => '18:00'],
            'showLunar' => true,
        ];
        if ($layout === 'hoamoc') {
            $extra['groomPhoto'] = '/invitation/floral/hoamoc-couple-1.webp';
            $extra['bridePhoto'] = '/invitation/floral/hoamoc-couple-2.webp';
        }

        Response::ok([
            'slug' => 'demo-' . $t['slug'],
            'groomName' => 'Minh Quân', 'brideName' => 'Thu Hà',
            'weddingDate' => '2026-05-03 18:00:00', 'receptionTime' => '2026-05-03 17:30:00',
            'venueName' => 'Trung Tâm Tiệc Cưới White Palace',
            'venueAddress' => '194 Hoàng Văn Thụ, Phú Nhuận, TP.HCM',
            'mapUrl' => 'https://maps.google.com/?q=White+Palace',
            'coverPhoto' => null,
            'groomFamily' => ['father' => 'Trần Văn Hùng', 'mother' => 'Phạm Thị Lan'],
            'brideFamily' => ['father' => 'Nguyễn Văn Bình', 'mother' => 'Phan Thị Hương'],
            'giftQrGroom' => null, 'giftQrBride' => null,
            'bankGroom' => ['bank' => 'VCB', 'account' => '1022563248', 'name' => 'TRAN MINH QUAN'],
            'bankBride' => ['bank' => 'MB', 'account' => '1065958943', 'name' => 'NGUYEN THU HA'],
            'gallery' => [],
            'loveStory' => [
                ['date' => '2021', 'title' => 'Lần đầu gặp gỡ', 'text' => 'Một buổi chiều đáng nhớ.'],
                ['date' => '2026', 'title' => 'Về chung một nhà', 'text' => 'Cùng nhau viết tiếp câu chuyện.'],
            ],
            'musicUrl' => null,
            'inviteMessage' => 'Trân trọng kính mời bạn đến chung vui cùng gia đình chúng tôi.',
            'settings' => ['countdown' => true, 'rsvp' => true, 'guestbook' => true],
            'extra' => $extra,
            'isPublished' => true,
            'templateSlug' => $t['slug'],
            'design' => jdec($t['design'] ?? null),
            'layout' => $layout,
            'isDemo' => true,
            'guestbook' => [],
        ]);
    }

    /** GET /api/plans */
    public static function plans(): void
    {
        $rows = Database::all("SELECT * FROM pricing_plans WHERE is_active = 1 ORDER BY sort_order ASC");
        Response::ok(array_map('mapPlan', $rows));
    }

    /** GET /api/testimonials */
    public static function testimonials(): void
    {
        $rows = Database::all("SELECT id, name, avatar, quote, rating, created_at FROM testimonials WHERE is_active = 1 ORDER BY id DESC");
        $out = array_map(fn($r) => [
            'id'     => (string) $r['id'],
            'name'   => $r['name'],
            'avatar' => $r['avatar'],
            'quote'  => $r['quote'],
            'rating' => (int) $r['rating'],
            'date'   => substr($r['created_at'], 0, 10),
        ], $rows);
        Response::ok($out);
    }
}
