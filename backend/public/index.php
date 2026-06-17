<?php
/**
 * Entry point + router.  Mọi request /api/* đi qua đây.
 * Cấu trúc route: [METHOD, regex pattern, [Controller, method]]
 * Pattern dùng {param} -> bắt segment, truyền vào controller theo thứ tự.
 */

require_once __DIR__ . '/../src/bootstrap.php';

// Autoload controllers
spl_autoload_register(function ($class) {
    $f = __DIR__ . '/../controllers/' . $class . '.php';
    if (is_file($f)) require_once $f;
});

$method = $_SERVER['REQUEST_METHOD'];

// Lấy path sau /api  (hỗ trợ cả khi đặt trong subfolder htdocs)
$uri  = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri  = rawurldecode($uri);
$pos  = strpos($uri, '/api');
$path = $pos !== false ? substr($uri, $pos + 4) : $uri;   // bỏ tiền tố .../api
$path = '/' . trim($path, '/');

$routes = [
    // ---- Public catalog ----
    ['GET',  '/templates',                 ['CatalogController', 'templates']],
    ['GET',  '/templates/{slug}',          ['CatalogController', 'templateBySlug']],
    ['GET',  '/demo/{slug}',               ['CatalogController', 'demo']],
    ['GET',  '/plans',                     ['CatalogController', 'plans']],
    ['GET',  '/testimonials',              ['CatalogController', 'testimonials']],
    ['POST', '/contact',                   ['ContactController', 'create']],

    // ---- Public invitation (thiệp sống) ----
    ['GET',  '/thiep/{slug}',              ['InvitationPublicController', 'view']],
    ['POST', '/thiep/{slug}/rsvp',         ['InvitationPublicController', 'rsvp']],
    ['POST', '/thiep/{slug}/guestbook',    ['InvitationPublicController', 'guestbook']],

    // ---- Auth ----
    ['POST', '/auth/register',             ['AuthController', 'register']],
    ['POST', '/auth/login',                ['AuthController', 'login']],
    ['POST', '/auth/logout',               ['AuthController', 'logout']],
    ['GET',  '/auth/me',                   ['AuthController', 'me']],

    // ---- Customer ----
    ['POST', '/orders',                    ['CustomerController', 'createOrder']],
    ['GET',  '/orders',                    ['CustomerController', 'myOrders']],
    ['GET',  '/my/invitations',            ['CustomerController', 'myInvitations']],
    ['GET',  '/my/invitations/{slug}',     ['CustomerController', 'getInvitation']],
    ['PUT',  '/my/invitations/{slug}',     ['CustomerController', 'updateInvitation']],
    ['POST', '/my/invitations/{slug}/publish', ['CustomerController', 'publish']],

    // ---- Admin ----
    ['GET',    '/admin/stats',             ['AdminController', 'stats']],
    ['POST',   '/admin/templates',         ['AdminController', 'createTemplate']],
    ['GET',    '/admin/templates/{id}',    ['AdminController', 'templateDetail']],
    ['PUT',    '/admin/templates/{id}/design', ['AdminController', 'updateDesign']],
    ['PUT',    '/admin/templates/{id}',    ['AdminController', 'updateTemplate']],
    ['DELETE', '/admin/templates/{id}',    ['AdminController', 'deleteTemplate']],
    ['GET',    '/admin/orders',            ['AdminController', 'orders']],
    ['PATCH',  '/admin/orders/{id}',       ['AdminController', 'updateOrder']],
    ['GET',    '/admin/contacts',          ['AdminController', 'contacts']],
    ['PATCH',  '/admin/contacts/{id}',     ['AdminController', 'updateContact']],
    ['GET',    '/admin/users',             ['AdminController', 'users']],
    ['PATCH',  '/admin/users/{id}',        ['AdminController', 'updateUser']],
    ['GET',    '/admin/charts',            ['AdminController', 'charts']],
    ['GET',    '/admin/invitations',       ['AdminController', 'invitations']],
    ['GET',    '/admin/invitations/{id}',  ['AdminController', 'invitationDetail']],
    ['PATCH',  '/admin/guestbook/{id}',    ['AdminController', 'updateGuestbook']],
    ['GET',    '/admin/plans',             ['AdminController', 'plans']],
    ['PUT',    '/admin/plans/{id}',        ['AdminController', 'updatePlan']],
    ['GET',    '/admin/testimonials',      ['AdminController', 'testimonials']],
    ['POST',   '/admin/testimonials',      ['AdminController', 'createTestimonial']],
    ['DELETE', '/admin/testimonials/{id}', ['AdminController', 'deleteTestimonial']],
    ['GET',    '/admin/assets',            ['AdminController', 'assets']],
    ['POST',   '/admin/assets/upload',     ['AdminController', 'uploadAsset']],
    ['GET',    '/admin/settings',          ['AdminController', 'settings']],
    ['PUT',    '/admin/settings',          ['AdminController', 'updateSettings']],
];

if ($path === '/' || $path === '') {
    Response::ok(['service' => 'JunTech API', 'version' => '1.0', 'status' => 'ok']);
}

foreach ($routes as [$rMethod, $pattern, $handler]) {
    if ($rMethod !== $method) continue;

    $regex = '#^' . preg_replace('#\{[a-z]+\}#', '([^/]+)', $pattern) . '$#u';
    if (preg_match($regex, $path, $m)) {
        array_shift($m);
        [$ctrl, $fn] = $handler;
        try {
            $ctrl::$fn(...$m);
        } catch (Throwable $e) {
            $cfg = require __DIR__ . '/../config/config.php';
            Response::error('Lỗi máy chủ.', 500, $cfg['app_env'] === 'development' ? $e->getMessage() : null);
        }
        exit;
    }
}

Response::error("Không tìm thấy endpoint: $method $path", 404);
