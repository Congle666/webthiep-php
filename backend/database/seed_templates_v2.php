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

// KHÔNG xóa template (có invitation tham chiếu qua FK). Dùng UPSERT: update nếu tồn tại, insert nếu chưa.
function upsertTemplate(PDO $pdo, int $id, string $name, string $slug, string $layout, string $cat, string $desc, int $price, string $design): void {
  $exists = $pdo->query("SELECT COUNT(*) FROM templates WHERE id = $id")->fetchColumn();
  if ($exists) {
    $st = $pdo->prepare("UPDATE templates SET name=?, slug=?, layout=?, category=?, description=?, price_from=?, is_active=1, design=? WHERE id=?");
    $st->execute([$name, $slug, $layout, $cat, $desc, $price, $design, $id]);
  } else {
    $st = $pdo->prepare("INSERT INTO templates (id,name,slug,layout,category,description,price_from,is_active,design) VALUES (?,?,?,?,?,?,?,1,?)");
    $st->execute([$id, $name, $slug, $layout, $cat, $desc, $price, $design]);
  }
}

// Template 1: Floral Magnolia
$florDeco = json_encode([
  // HEADER decorations — tọa độ % theo .flr-header block (khóa với tên, không trôi)
  ['id'=>'floral-frame','label'=>'Khung hoa oval','src'=>'/invitation/floral/frame-flower.webp','top'=>6,'left'=>15,'width'=>70,'rotate'=>0,'flip'=>false,'z'=>1,'opacity'=>1,'zone'=>'header'],
  ['id'=>'floral-flower-bl','label'=>'Hoa trái dưới','src'=>'/invitation/floral/flower-corner.webp','top'=>58,'left'=>-6,'width'=>40,'rotate'=>0,'flip'=>false,'z'=>3,'opacity'=>0.9,'zone'=>'header'],
  ['id'=>'floral-flower-br','label'=>'Hoa phải dưới','src'=>'/invitation/floral/flower-corner.webp','top'=>52,'left'=>62,'width'=>42,'rotate'=>0,'flip'=>true,'z'=>3,'opacity'=>0.9,'zone'=>'header'],
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

$florDesign = json_encode(['theme'=>json_decode($florTheme),'decorations'=>json_decode($florDeco)], JSON_UNESCAPED_UNICODE);

upsertTemplate($pdo, 1, 'Floral Magnolia', 'floral-magnolia', 'floral', 'floral', 'Thiệp hoa mộc lan thanh lịch, phong cách tự nhiên nhẹ nhàng.', 299000, $florDesign);

// Template 2: Long Phụng Đỏ
$tradDeco = json_encode([
  // BODY
  ['id'=>'phoenix-left','label'=>'Phượng trái','src'=>'/invitation/phoenix-left.webp','top'=>1,'left'=>-2,'width'=>34,'rotate'=>0,'flip'=>false,'z'=>3,'opacity'=>0.95,'zone'=>'body'],
  ['id'=>'phoenix-right','label'=>'Phượng phải','src'=>'/invitation/phoenix-right.webp','top'=>6,'left'=>68,'width'=>34,'rotate'=>0,'flip'=>true,'z'=>3,'opacity'=>0.95,'zone'=>'body'],
  ['id'=>'songhy','label'=>'Song Hỷ','src'=>'/invitation/songhy.webp','top'=>9,'left'=>39,'width'=>22,'rotate'=>0,'flip'=>false,'z'=>4,'opacity'=>1,'zone'=>'body'],
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

// Màu theo spec ChungĐôi Hoa Mộc Xanh: xanh lá đậm #30530F
$hmxTheme = json_encode([
  'red'=>'#30530f','redDeep'=>'#233c0a','redSoft'=>'rgba(48,83,15,0.10)',
  'text'=>'#30530f','heading'=>'#30530f','muted'=>'#6f8a52',
  'bg'=>'#f7f8f2','paper'=>'/invitation/paper-bg.jpg',
], JSON_UNESCAPED_UNICODE);

$hmxDesign = json_encode(['theme'=>json_decode($hmxTheme),'decorations'=>json_decode($hmxDeco)], JSON_UNESCAPED_UNICODE);

upsertTemplate($pdo, 4, 'Hoa Mộc Xanh', 'hoa-moc-xanh', 'hoamoc', 'floral', 'Thiệp hoa mộc xanh lá tươi mát, ảnh cặp đôi nghiêng và dải bar thanh lịch.', 299000, $hmxDesign);

// Template 5: Lâu Đài Xanh — layout laudai, xanh rừng #3A5A2C, khung cảnh lâu đài watercolor (chateau+mây+cây+hoa).
$ldxDeco = json_encode([
  // BODY — lâu đài FULL-WIDTH (chateau đã có sẵn mây+vườn+đài phun+cây) + hoa điểm xuyết 2 bên
  ['id'=>'laudai-chateau','label'=>'Lâu đài (khung cảnh)','src'=>'/invitation/laudai/chateau.webp','top'=>8,'left'=>0,'width'=>100,'rotate'=>0,'flip'=>false,'z'=>2,'opacity'=>1,'zone'=>'body'],
  ['id'=>'laudai-hoa-bl','label'=>'Hoa trái dưới','src'=>'/invitation/laudai/hoanho2-1.webp','top'=>56,'left'=>-6,'width'=>24,'rotate'=>0,'flip'=>false,'z'=>3,'opacity'=>0.92,'zone'=>'body'],
  ['id'=>'laudai-hoa-br','label'=>'Hoa phải dưới','src'=>'/invitation/laudai/hoanho3-1.webp','top'=>56,'left'=>82,'width'=>24,'rotate'=>0,'flip'=>true,'z'=>3,'opacity'=>0.92,'zone'=>'body'],
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

$ldxDesign = json_encode(['theme'=>json_decode($ldxTheme),'decorations'=>json_decode($ldxDeco)], JSON_UNESCAPED_UNICODE);

upsertTemplate($pdo, 5, 'Lâu Đài Xanh', 'lau-dai-xanh', 'laudai', 'luxury', 'Thiệp lâu đài xanh rừng phong cách watercolor, khung cảnh chateau lãng mạn giữa vườn cây.', 349000, $ldxDesign);

echo "Seeded 4 templates OK\n";
