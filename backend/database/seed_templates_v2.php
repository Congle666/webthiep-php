<?php
// Load .env
$envFile = __DIR__ . '/../../.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        if (!str_contains($line, '=')) continue;
        [$k, $v] = explode('=', $line, 2);
        putenv(trim($k) . '=' . trim($v));
    }
}

$cfg = require __DIR__ . '/../config/config.php';
$dsn = "mysql:host={$cfg['db']['host']};port={$cfg['db']['port']};dbname={$cfg['db']['name']};charset=utf8mb4";
$pdo = new PDO($dsn, $cfg['db']['user'], $cfg['db']['pass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

// CHỈ INSERT mẫu MỚI — mẫu đã có trong DB thì BỎ QUA (KHÔNG đè).
// → Chỉnh sửa trong Admin (design/màu/ảnh/spacing) được GIỮ NGUYÊN, seed không phá.
// Muốn ép seed lại 1 mẫu đã có: đặt biến môi trường FORCE_RESEED=1 trước khi chạy.
function upsertTemplate(PDO $pdo, int $id, string $name, string $slug, string $layout, string $cat, string $desc, int $price, string $design): void {
  $exists = $pdo->query("SELECT COUNT(*) FROM templates WHERE id = $id")->fetchColumn();
  $force = getenv('FORCE_RESEED') === '1';
  if ($exists && !$force) {
    echo "  - Bỏ qua (đã có, giữ chỉnh sửa admin): #$id $name\n";
    return;
  }
  if ($exists) {
    $st = $pdo->prepare("UPDATE templates SET name=?, slug=?, layout=?, category=?, description=?, price_from=?, is_active=1, design=? WHERE id=?");
    $st->execute([$name, $slug, $layout, $cat, $desc, $price, $design, $id]);
    echo "  - GHI ĐÈ (FORCE_RESEED): #$id $name\n";
  } else {
    $st = $pdo->prepare("INSERT INTO templates (id,name,slug,layout,category,description,price_from,is_active,design) VALUES (?,?,?,?,?,?,?,1,?)");
    $st->execute([$id, $name, $slug, $layout, $cat, $desc, $price, $design]);
    echo "  + Thêm mẫu mới: #$id $name\n";
  }
}

// Template 1: Floral Magnolia
$florDeco = json_encode([
  // HEADER decorations — tọa độ % theo .flr-header block (khóa với tên, không trôi)
  ['id'=>'floral-frame','label'=>'Khung hoa oval','src'=>'/invitation/floral/frame-flower.webp','top'=>3,'left'=>21,'width'=>58,'rotate'=>0,'flip'=>false,'z'=>1,'opacity'=>1,'zone'=>'header'],
  ['id'=>'floral-flower-bl','label'=>'Hoa trái dưới','src'=>'/invitation/floral/flower-corner.webp','top'=>44,'left'=>-4,'width'=>34,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.9,'zone'=>'header'],
  ['id'=>'floral-flower-br','label'=>'Hoa phải dưới','src'=>'/invitation/floral/flower-corner.webp','top'=>40,'left'=>68,'width'=>36,'rotate'=>0,'flip'=>true,'z'=>2,'opacity'=>0.9,'zone'=>'header'],
  // COVER decorations
  ['id'=>'floral-cover-bl','label'=>'Hoa bìa trái','src'=>'/invitation/floral/flower-corner.webp','top'=>42,'left'=>-12,'width'=>52,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.92,'zone'=>'cover'],
  ['id'=>'floral-cover-tr','label'=>'Hoa bìa phải','src'=>'/invitation/floral/flower-corner.webp','top'=>-8,'left'=>60,'width'=>52,'rotate'=>180,'flip'=>true,'z'=>2,'opacity'=>0.88,'zone'=>'cover'],
], JSON_UNESCAPED_UNICODE);

// Màu theo spec ChungĐôi Mai Lan: olive #404A1D
$florTheme = json_encode([
  'red'=>'#404a1d','redDeep'=>'#2f3815','redSoft'=>'rgba(64,74,29,0.10)',
  'text'=>'#404a1d','heading'=>'#404a1d','muted'=>'#7c8a5a',
  'bg'=>'#f7f2ea','paper'=>'/invitation/paper-bg.jpg',
], JSON_UNESCAPED_UNICODE);

// Bố cục body khớp ChungĐôi mai-lan-trang: family (block lễ đầy đủ) → album → tiệc → venue → lịch trình → sổ lưu bút → QR
$florOrder = ['family','album','reception','venue','countdown','schedule','guestbook','gift','rsvp','thanks','envelope'];

$florDesign = json_encode(['theme'=>json_decode($florTheme),'fontset'=>'elegant','decorations'=>json_decode($florDeco),'sectionOrder'=>$florOrder], JSON_UNESCAPED_UNICODE);

upsertTemplate($pdo, 1, 'Mai Lan Trắng', 'mai-lan-trang', 'floral', 'floral', 'Thiệp hoa mai lan trắng thanh lịch, tông olive nhẹ nhàng, phong cách ChungĐôi.', 299000, $florDesign);

// Template 2: Long Phụng Đỏ
$tradDeco = json_encode([
  // BODY
  ['id'=>'phoenix-left','label'=>'Phượng trái','src'=>'/invitation/phoenix-left.webp','top'=>1,'left'=>-2,'width'=>34,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.95,'zone'=>'body'],
  ['id'=>'phoenix-right','label'=>'Phượng phải','src'=>'/invitation/phoenix-right.webp','top'=>6,'left'=>68,'width'=>34,'rotate'=>0,'flip'=>true,'z'=>2,'opacity'=>0.95,'zone'=>'body'],
  ['id'=>'songhy','label'=>'Song Hỷ','src'=>'/invitation/songhy.webp','top'=>9,'left'=>39,'width'=>22,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>1,'zone'=>'body'],
  ['id'=>'flower','label'=>'Hoa','src'=>'/invitation/flower.webp','top'=>33,'left'=>60,'width'=>26,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.85,'zone'=>'body'],
  ['id'=>'watermark','label'=>'Watermark phượng','src'=>'/invitation/phoenix-watermark.webp','top'=>50,'left'=>-8,'width'=>40,'rotate'=>0,'flip'=>false,'z'=>0,'opacity'=>0.06,'zone'=>'body'],
  // COVER
  ['id'=>'cover-phoenix-left','label'=>'Phượng bìa trái','src'=>'/invitation/phoenix-left.webp','top'=>-2,'left'=>-6,'width'=>42,'rotate'=>0,'flip'=>false,'z'=>1,'opacity'=>0.9,'zone'=>'cover'],
  ['id'=>'cover-phoenix-right','label'=>'Phượng bìa phải','src'=>'/invitation/phoenix-right.webp','top'=>-2,'left'=>64,'width'=>42,'rotate'=>0,'flip'=>true,'z'=>1,'opacity'=>0.9,'zone'=>'cover'],
  ['id'=>'cover-songhy','label'=>'Song Hỷ bìa','src'=>'/invitation/songhy.webp','top'=>4,'left'=>42,'width'=>16,'rotate'=>0,'flip'=>false,'z'=>3,'opacity'=>1,'zone'=>'cover'],
  ['id'=>'cover-flower','label'=>'Hoa bìa','src'=>'/invitation/flower.webp','top'=>70,'left'=>-4,'width'=>28,'rotate'=>0,'flip'=>false,'z'=>1,'opacity'=>0.75,'zone'=>'cover'],
], JSON_UNESCAPED_UNICODE);

// Màu theo spec ChungĐôi Song Phụng: đỏ thẫm #710001
$tradTheme = json_encode([
  'red'=>'#710001','redDeep'=>'#560001','redSoft'=>'rgba(113,0,1,0.10)',
  'text'=>'#710001','heading'=>'#710001','muted'=>'#a05a52',
  'bg'=>'#f5ead7','paper'=>'/invitation/paper-bg.jpg',
], JSON_UNESCAPED_UNICODE);

$tradDesign = json_encode(['theme'=>json_decode($tradTheme),'decorations'=>json_decode($tradDeco)], JSON_UNESCAPED_UNICODE);

upsertTemplate($pdo, 2, 'Long Phụng Đỏ', 'long-phung-do', 'traditional', 'classic', 'Thiệp truyền thống Song Phụng đỏ, phong cách Á Đông sang trọng.', 299000, $tradDesign);

// Template 4: Hoa Mộc Xanh — layout hoamoc, xanh lá đậm #30530F, hoa watercolor 2 bên.
$hmxDeco = json_encode([
  // BODY — dải bar xanh giữa 2 ảnh đôi + hoa flower rải 2 bên, % toàn trang (kéo-thả được)
  ['id'=>'hoamoc-bar','label'=>'Dải bar xanh','src'=>'/invitation/floral/hoamoc-bar.webp','top'=>18,'left'=>0,'width'=>100,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>1,'zone'=>'body'],
  ['id'=>'hoamoc-flower-tl','label'=>'Hoa trái trên','src'=>'/invitation/floral/hoamoc-flower.webp','top'=>5,'left'=>-8,'width'=>32,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.95,'zone'=>'body'],
  ['id'=>'hoamoc-flower-mr','label'=>'Hoa phải giữa','src'=>'/invitation/floral/hoamoc-flower.webp','top'=>30,'left'=>72,'width'=>30,'rotate'=>0,'flip'=>true,'z'=>2,'opacity'=>0.95,'zone'=>'body'],
  ['id'=>'hoamoc-flower-bl','label'=>'Hoa trái dưới','src'=>'/invitation/floral/hoamoc-flower.webp','top'=>60,'left'=>-6,'width'=>28,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.95,'zone'=>'body'],
  // COVER — 2 hoa góc card
  ['id'=>'hoamoc-cover-tl','label'=>'Hoa bìa trái trên','src'=>'/invitation/floral/hoamoc-flower.webp','top'=>-6,'left'=>-10,'width'=>42,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.95,'zone'=>'cover'],
  ['id'=>'hoamoc-cover-br','label'=>'Hoa bìa phải dưới','src'=>'/invitation/floral/hoamoc-flower.webp','top'=>64,'left'=>62,'width'=>44,'rotate'=>180,'flip'=>true,'z'=>2,'opacity'=>0.95,'zone'=>'cover'],
], JSON_UNESCAPED_UNICODE);

// Màu theo spec ChungĐôi Hoa Mộc Xanh: xanh lá đậm #30530F — nền trắng trơn (KHÔNG nền giấy)
$hmxTheme = json_encode([
  'red'=>'#30530f','redDeep'=>'#233c0a','redSoft'=>'rgba(48,83,15,0.10)',
  'text'=>'#30530f','heading'=>'#30530f','muted'=>'#6f8a52',
  'bg'=>'#ffffff',
], JSON_UNESCAPED_UNICODE);

$hmxDesign = json_encode(['theme'=>json_decode($hmxTheme),'decorations'=>json_decode($hmxDeco)], JSON_UNESCAPED_UNICODE);

upsertTemplate($pdo, 4, 'Hoa Mộc Xanh', 'hoa-moc-xanh', 'hoamoc', 'floral', 'Thiệp hoa mộc xanh lá tươi mát, ảnh cặp đôi nghiêng và dải bar thanh lịch.', 299000, $hmxDesign);

// Template 5: Lâu Đài Xanh — layout laudai, xanh rừng #3A5A2C, khung cảnh lâu đài watercolor (chateau+mây+cây+hoa).
$ldxDeco = json_encode([
  // BODY — lâu đài FULL-WIDTH (chateau đã có sẵn mây+vườn+đài phun+cây) + hoa điểm xuyết 2 bên
  ['id'=>'laudai-chateau','label'=>'Lâu đài (khung cảnh)','src'=>'/invitation/laudai/chateau-crop.webp','top'=>40,'left'=>-4,'width'=>108,'rotate'=>0,'flip'=>false,'z'=>1,'opacity'=>1,'zone'=>'header'],
  ['id'=>'laudai-hoa-bl','label'=>'Hoa trái dưới','src'=>'/invitation/laudai/hoanho2-1.webp','top'=>56,'left'=>-6,'width'=>24,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.92,'zone'=>'body'],
  ['id'=>'laudai-hoa-br','label'=>'Hoa phải dưới','src'=>'/invitation/laudai/hoanho3-1.webp','top'=>56,'left'=>82,'width'=>24,'rotate'=>0,'flip'=>true,'z'=>2,'opacity'=>0.92,'zone'=>'body'],
  // Đài phun nước CUỐI trang (trên footer) — khớp ChungĐôi. Kéo-thả/chỉnh kích thước được trong admin.
  ['id'=>'laudai-fountain','label'=>'Đài phun nước (cuối)','src'=>'/invitation/laudai/fountain.webp','top'=>2,'left'=>22,'width'=>56,'rotate'=>0,'flip'=>false,'z'=>1,'opacity'=>1,'zone'=>'footer'],
  // COVER — ornament + 2 hoa góc card
  ['id'=>'laudai-cover-orn','label'=>'Hoa văn bìa','src'=>'/invitation/laudai/ornament.webp','top'=>-4,'left'=>30,'width'=>40,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.95,'zone'=>'cover'],
  ['id'=>'laudai-cover-tl','label'=>'Hoa bìa trái','src'=>'/invitation/laudai/hoanho2-1.webp','top'=>70,'left'=>-10,'width'=>34,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.9,'zone'=>'cover'],
  ['id'=>'laudai-cover-br','label'=>'Hoa bìa phải','src'=>'/invitation/laudai/hoanho3-1.webp','top'=>70,'left'=>76,'width'=>34,'rotate'=>0,'flip'=>true,'z'=>2,'opacity'=>0.9,'zone'=>'cover'],
], JSON_UNESCAPED_UNICODE);

// Màu theo spec ChungĐôi Lâu Đài Xanh: xanh rừng #3A5A2C, nền TRẮNG (không nền giấy)
$ldxTheme = json_encode([
  'red'=>'#3a5a2c','redDeep'=>'#2c4520','redSoft'=>'rgba(58,90,44,0.10)',
  'text'=>'#3a5a2c','heading'=>'#3a5a2c','muted'=>'#7c9466',
  'bg'=>'#ffffff','paper'=>null,
], JSON_UNESCAPED_UNICODE);

// Bố cục chữ ĐO THẬT từ ChungĐôi lau-dai-xanh (Puppeteer click "Mở thiệp" + đọc DOM):
// family (Thông tin lễ + tên CD/CR) → album → reception (Thông tin tiệc) → venue (tổ chức tại) → schedule (Lịch trình) → guestbook (Sổ lưu bút) → gift (Hộp mừng cưới).
// KHÔNG có couple/ceremony/calendar riêng; countdown giữ trước schedule (feature của mình).
$ldxOrder = ['family','album','reception','venue','countdown','schedule','guestbook','gift','rsvp','thanks','envelope'];

$ldxDesign = json_encode(['theme'=>json_decode($ldxTheme),'decorations'=>json_decode($ldxDeco),'sectionOrder'=>$ldxOrder], JSON_UNESCAPED_UNICODE);

upsertTemplate($pdo, 5, 'Lâu Đài Xanh', 'lau-dai-xanh', 'laudai', 'luxury', 'Thiệp lâu đài xanh rừng phong cách watercolor, khung cảnh chateau lãng mạn giữa vườn cây.', 349000, $ldxDesign);

// Template 6: Hoa Mộc Hồng — khớp ChungĐôi hoa-moc-hong (hồng nâu #9d6d63, hoa hồng watercolor + block lễ đầy đủ).
$hmhDeco = json_encode([
  // BODY — hoa hồng watercolor rải 2 bên thân (% toàn trang, kéo-thả được)
  ['id'=>'hh-flower-tl','label'=>'Hoa trái trên','src'=>'/invitation/hoahong/hoa-goc.webp','top'=>4,'left'=>-8,'width'=>34,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.95,'zone'=>'body'],
  ['id'=>'hh-flower-mr','label'=>'Hoa phải giữa','src'=>'/invitation/hoahong/hoa-doc.webp','top'=>32,'left'=>74,'width'=>26,'rotate'=>0,'flip'=>true,'z'=>2,'opacity'=>0.95,'zone'=>'body'],
  ['id'=>'hh-flower-bl','label'=>'Hoa trái dưới','src'=>'/invitation/hoahong/hoa-doc.webp','top'=>62,'left'=>-6,'width'=>26,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.95,'zone'=>'body'],
  // COVER — 2 hoa góc card
  ['id'=>'hh-cover-tl','label'=>'Hoa bìa trái trên','src'=>'/invitation/hoahong/hoa-goc.webp','top'=>-4,'left'=>-10,'width'=>44,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.95,'zone'=>'cover'],
  ['id'=>'hh-cover-br','label'=>'Hoa bìa phải dưới','src'=>'/invitation/hoahong/hoa-goc.webp','top'=>62,'left'=>64,'width'=>46,'rotate'=>180,'flip'=>true,'z'=>2,'opacity'=>0.95,'zone'=>'cover'],
  // FOOTER — cụm hoa cuối trang
  ['id'=>'hh-footer','label'=>'Hoa cuối','src'=>'/invitation/hoahong/hoa-goc.webp','top'=>6,'left'=>30,'width'=>40,'rotate'=>0,'flip'=>false,'z'=>1,'opacity'=>0.95,'zone'=>'footer'],
], JSON_UNESCAPED_UNICODE);
// Màu hồng nâu khớp ChungĐôi: rgb(157,109,99) = #9d6d63, nền trắng
$hmhTheme = json_encode([
  'red'=>'#9d6d63','redDeep'=>'#7d5249','redSoft'=>'rgba(157,109,99,0.10)',
  'text'=>'#9d6d63','heading'=>'#9d6d63','muted'=>'#bb9a92',
  'bg'=>'#ffffff',
], JSON_UNESCAPED_UNICODE);
// Bố cục body khớp ChungĐôi: family (block lễ đầy đủ) → album → tiệc → venue → lịch trình → sổ lưu bút → QR
$hmhOrder = ['family','album','reception','venue','countdown','schedule','guestbook','gift','rsvp','thanks','envelope'];
$hmhDesign = json_encode(['theme'=>json_decode($hmhTheme),'fontset'=>'elegant','headerStyle'=>'stack','decorations'=>json_decode($hmhDeco),'sectionOrder'=>$hmhOrder], JSON_UNESCAPED_UNICODE);
upsertTemplate($pdo, 6, 'Hoa Mộc Hồng', 'hoa-moc-hong', 'hoamoc', 'floral', 'Thiệp hoa hồng watercolor tông hồng nâu ngọt ngào, phong cách ChungĐôi.', 299000, $hmhDesign);

// Template 7: Vân Sơn — layout vanson, tranh thủy mặc Á Đông, chữ xanh rêu #3a4a3a.
$vsnDeco = json_encode([
  // BODY — hạc bay điểm xuyết (nền trong), kéo-thả được
  ['id'=>'vsn-hac-1','label'=>'Hạc bay trên','src'=>'/invitation/vanson/hac.webp','top'=>14,'left'=>-4,'width'=>30,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.9,'zone'=>'body'],
  ['id'=>'vsn-hac-2','label'=>'Hạc bay dưới','src'=>'/invitation/vanson/hac.webp','top'=>52,'left'=>72,'width'=>28,'rotate'=>0,'flip'=>true,'z'=>2,'opacity'=>0.9,'zone'=>'body'],
], JSON_UNESCAPED_UNICODE);
// Màu xanh rêu thủy mặc, nền kem giấy
$vsnTheme = json_encode([
  'red'=>'#3a4a3a','redDeep'=>'#2a382a','redSoft'=>'rgba(58,74,58,0.10)',
  'text'=>'#3a4a3a','heading'=>'#3a4a3a','muted'=>'#6b7a6b',
  'bg'=>'#f3efe4',
], JSON_UNESCAPED_UNICODE);
$vsnOrder = ['family','album','reception','venue','countdown','schedule','guestbook','gift','rsvp','thanks','envelope'];
$vsnDesign = json_encode(['theme'=>json_decode($vsnTheme),'fontset'=>'elegant','decorations'=>json_decode($vsnDeco),'sectionOrder'=>$vsnOrder,'spacing'=>['sectionGap'=>64,'headerMin'=>560]], JSON_UNESCAPED_UNICODE);
upsertTemplate($pdo, 7, 'Vân Sơn', 'van-son', 'vanson', 'luxury', 'Thiệp tranh thủy mặc Á Đông, sơn thủy hữu tình, hạc bay, tông xanh rêu thanh tịnh.', 349000, $vsnDesign);

// Template 8: Bạch Ly — layout hoamoc, hoa ly calla + linh lan watercolor, tông trắng-xanh lá.
$blDeco = json_encode([
  // BODY — cụm hoa linh lan/ly rải 2 bên thân (% toàn trang, kéo-thả được)
  ['id'=>'bl-goc-tl','label'=>'Cụm góc trái trên','src'=>'/invitation/linhlan/cum-goc.webp','top'=>4,'left'=>-8,'width'=>34,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.97,'zone'=>'body'],
  ['id'=>'bl-doc-mr','label'=>'Cụm dọc phải','src'=>'/invitation/linhlan/cum-doc.webp','top'=>30,'left'=>76,'width'=>24,'rotate'=>0,'flip'=>true,'z'=>2,'opacity'=>0.97,'zone'=>'body'],
  ['id'=>'bl-doc-bl','label'=>'Cụm dọc trái dưới','src'=>'/invitation/linhlan/cum-doc.webp','top'=>62,'left'=>-6,'width'=>24,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.97,'zone'=>'body'],
  // COVER — cụm rậm góc trên + cụm góc dưới
  ['id'=>'bl-cover-tl','label'=>'Hoa bìa trái trên','src'=>'/invitation/linhlan/cum-ram.webp','top'=>-6,'left'=>-12,'width'=>46,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>0.97,'zone'=>'cover'],
  ['id'=>'bl-cover-br','label'=>'Hoa bìa phải dưới','src'=>'/invitation/linhlan/cum-goc.webp','top'=>60,'left'=>62,'width'=>46,'rotate'=>0,'flip'=>true,'z'=>2,'opacity'=>0.97,'zone'=>'cover'],
  // FOOTER — cụm ngang cuối trang
  ['id'=>'bl-footer','label'=>'Hoa cuối','src'=>'/invitation/linhlan/cum-ngang.webp','top'=>8,'left'=>28,'width'=>44,'rotate'=>0,'flip'=>false,'z'=>1,'opacity'=>0.97,'zone'=>'footer'],
], JSON_UNESCAPED_UNICODE);
// Tông trắng-xanh lá thanh khiết
$blTheme = json_encode([
  'red'=>'#5a7052','redDeep'=>'#43543d','redSoft'=>'rgba(90,112,82,0.10)',
  'text'=>'#5a7052','heading'=>'#5a7052','muted'=>'#90a088',
  'bg'=>'#ffffff',
], JSON_UNESCAPED_UNICODE);
$blOrder = ['family','album','reception','venue','countdown','schedule','guestbook','gift','rsvp','thanks','envelope'];
$blDesign = json_encode(['theme'=>json_decode($blTheme),'fontset'=>'elegant','headerStyle'=>'stack','decorations'=>json_decode($blDeco),'sectionOrder'=>$blOrder,'spacing'=>['sectionGap'=>64,'headerMin'=>760]], JSON_UNESCAPED_UNICODE);
upsertTemplate($pdo, 8, 'Bạch Ly', 'bach-ly', 'hoamoc', 'floral', 'Thiệp hoa ly calla và linh lan trắng tinh khôi, tông trắng xanh lá thanh khiết.', 329000, $blDesign);

echo "Seeded templates OK\n";
