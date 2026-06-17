<?php
/**
 * Bootstrap chung: load core, bật CORS, helper JSON cho cột JSON của MySQL.
 */
error_reporting(E_ALL);

require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Request.php';
require_once __DIR__ . '/Auth.php';

Response::cors();

/** Decode cột JSON an toàn (trả [] nếu null/lỗi). */
function jdec($value): array
{
    if (is_array($value)) return $value;
    if ($value === null || $value === '') return [];
    $d = json_decode($value, true);
    return is_array($d) ? $d : [];
}

/** Map 1 row template (DB snake_case) -> shape frontend (camelCase). */
function mapTemplate(array $t): array
{
    return [
        'id'          => (string) $t['id'],
        'slug'        => $t['slug'],
        'name'        => $t['name'],
        'category'    => $t['category'],
        'layout'      => $t['layout'] ?? 'traditional',
        'description' => $t['description'],
        'thumbnail'   => $t['thumbnail'] ?? '',
        'gallery'     => jdec($t['gallery'] ?? null),
        'features'    => jdec($t['features'] ?? null),
        'priceFrom'   => (int) $t['price_from'],
        'rating'      => (float) $t['rating'],
        'reviewCount' => (int) $t['review_count'],
        'isNew'       => (bool) $t['is_new'],
        'isHot'       => (bool) $t['is_hot'],
    ];
}

/** Map row pricing_plans -> shape frontend. */
function mapPlan(array $p): array
{
    return [
        'id'            => $p['code'],
        'name'          => $p['name'],
        'price'         => (int) $p['price'],
        'duration'      => $p['duration'],
        'description'   => $p['description'],
        'features'      => jdec($p['features'] ?? null),
        'isRecommended' => (bool) $p['is_recommended'],
        'ctaText'       => $p['cta_text'],
    ];
}

/** Map row invitation -> shape public (thiệp sống). */
function mapInvitation(array $i): array
{
    return [
        'slug'          => $i['slug'],
        'groomName'     => $i['groom_name'],
        'brideName'     => $i['bride_name'],
        'weddingDate'   => $i['wedding_date'],
        'venueName'     => $i['venue_name'],
        'venueAddress'  => $i['venue_address'],
        'mapUrl'        => $i['map_url'],
        'coverPhoto'    => $i['cover_photo'],
        'groomFamily'   => jdec($i['groom_family'] ?? null),
        'brideFamily'   => jdec($i['bride_family'] ?? null),
        'giftQrGroom'   => $i['gift_qr_groom'] ?? null,
        'giftQrBride'   => $i['gift_qr_bride'] ?? null,
        'receptionTime' => $i['reception_time'] ?? null,
        'bankGroom'     => jdec($i['bank_groom'] ?? null),
        'bankBride'     => jdec($i['bank_bride'] ?? null),
        'gallery'       => jdec($i['gallery'] ?? null),
        'loveStory'     => jdec($i['love_story'] ?? null),
        'musicUrl'      => $i['music_url'],
        'inviteMessage' => $i['invite_message'],
        'settings'      => jdec($i['settings'] ?? null),
        'extra'         => jdec($i['extra'] ?? null),
        'isPublished'   => (bool) $i['is_published'],
        'templateSlug'  => $i['template_slug'] ?? null,
        'design'        => jdec($i['template_design'] ?? null),
        'layout'        => $i['template_layout'] ?? 'traditional',
    ];
}
