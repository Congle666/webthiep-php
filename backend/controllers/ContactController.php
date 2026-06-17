<?php
/** Form liên hệ / đặt thuê (public submit). */
class ContactController
{
    /** POST /api/contact */
    public static function create(): void
    {
        [$errors, $d] = Request::validate([
            'full_name' => 'required|max:120',
            'phone'     => 'required|phone',
            'email'     => 'email|max:160',
            'note'      => 'max:2000',
        ]);
        if ($errors) Response::validation($errors);

        $templateId = Request::input('template_id');
        $templateId = is_numeric($templateId) ? (int) $templateId : null;

        $id = Database::insert(
            "INSERT INTO contact_requests (full_name, phone, email, template_id, note)
             VALUES (?, ?, ?, ?, ?)",
            [$d['full_name'], $d['phone'], $d['email'] ?? null, $templateId, $d['note'] ?? null]
        );

        Response::created(['id' => $id], 'Đã gửi yêu cầu. Chúng tôi sẽ liên hệ sớm nhất!');
    }
}
