<?php
/** Xem thiệp sống công khai + RSVP + sổ lưu bút (không cần đăng nhập). */
class InvitationPublicController
{
    /** GET /api/thiep/{slug} — chỉ thiệp đã publish & chưa hết hạn. */
    public static function view(string $slug): void
    {
        $inv = Database::one(
            "SELECT i.*, t.slug AS template_slug, t.design AS template_design, t.layout AS template_layout
             FROM invitations i
             JOIN templates t ON t.id = i.template_id
             WHERE i.slug = ? AND i.is_published = 1
               AND (i.expires_at IS NULL OR i.expires_at > NOW())",
            [$slug]
        );
        if (!$inv) Response::error('Thiệp không tồn tại hoặc đã hết hạn.', 404);

        Database::run("UPDATE invitations SET view_count = view_count + 1 WHERE id = ?", [$inv['id']]);

        $data = mapInvitation($inv);
        $data['guestbook'] = Database::all(
            "SELECT guest_name, message, created_at FROM guestbook
             WHERE invitation_id = ? AND is_approved = 1 ORDER BY id DESC LIMIT 100",
            [$inv['id']]
        );

        // Link riêng ?g=token: resolve khách, ghi opened_at (1 lần), trả tên khách.
        // KHÔNG lộ danh sách khách khác — chỉ tên của token này.
        $token = $_GET['g'] ?? null;
        if ($token) {
            $g = Database::one(
                "SELECT id, name FROM guests WHERE token = ? AND invitation_id = ?",
                [$token, $inv['id']]
            );
            if ($g) {
                Database::run("UPDATE guests SET opened_at = NOW() WHERE id = ? AND opened_at IS NULL", [$g['id']]);
                $data['guestName'] = $g['name'];
            }
        }

        Response::ok($data);
    }

    /** POST /api/thiep/{slug}/rsvp */
    public static function rsvp(string $slug): void
    {
        $inv = self::activeInvitation($slug);

        [$errors, $d] = Request::validate([
            'guest_name'  => 'required|max:120',
            'attendance'  => 'required|in:yes,no,maybe',
            'guest_count' => 'int',
            'message'     => 'max:1000',
        ]);
        if ($errors) Response::validation($errors);

        $count = Request::input('guest_count');
        $count = is_numeric($count) ? max(1, (int) $count) : 1;

        // Link riêng: nếu có token hợp lệ thuộc thiệp này -> gắn guest_id + cập nhật trạng thái guest.
        $guestId = null;
        $token = Request::input('token');
        if ($token) {
            $g = Database::one("SELECT id FROM guests WHERE token = ? AND invitation_id = ?", [$token, $inv['id']]);
            if ($g) {
                $guestId = (int) $g['id'];
                Database::run(
                    "UPDATE guests SET rsvp_status = ?, rsvp_count = ? WHERE id = ?",
                    [$d['attendance'], $count, $guestId]
                );
            }
        }

        Database::insert(
            "INSERT INTO rsvps (invitation_id, guest_id, guest_name, attendance, guest_count, message)
             VALUES (?, ?, ?, ?, ?, ?)",
            [$inv['id'], $guestId, $d['guest_name'], $d['attendance'], $count, $d['message'] ?? null]
        );
        Response::created(null, 'Cảm ơn bạn đã xác nhận!');
    }

    /** POST /api/thiep/{slug}/guestbook */
    public static function guestbook(string $slug): void
    {
        $inv = self::activeInvitation($slug);

        [$errors, $d] = Request::validate([
            'guest_name' => 'required|max:120',
            'message'    => 'required|max:1000',
        ]);
        if ($errors) Response::validation($errors);

        Database::insert(
            "INSERT INTO guestbook (invitation_id, guest_name, message) VALUES (?, ?, ?)",
            [$inv['id'], $d['guest_name'], $d['message']]
        );
        Response::created(null, 'Đã gửi lời chúc!');
    }

    private static function activeInvitation(string $slug): array
    {
        $inv = Database::one(
            "SELECT id FROM invitations WHERE slug = ? AND is_published = 1
             AND (expires_at IS NULL OR expires_at > NOW())",
            [$slug]
        );
        if (!$inv) Response::error('Thiệp không tồn tại hoặc đã hết hạn.', 404);
        return $inv;
    }
}
