/**
 * Cấu hình vị trí các ảnh trang trí (rồng/phượng/hoa/song hỷ).
 * Mỗi ảnh: vị trí (top/left theo %), kích thước (width %), xoay, lật.
 * Edit mode (?edit) cho phép kéo-thả chỉnh rồi lưu vào localStorage / copy ra đây.
 */
export interface DecoConfig {
  id: string;
  label?: string;      // tên hiển thị trong edit panel
  src: string;         // ảnh trong /invitation
  top: number;         // % so với .inv-header (hoặc container)
  left: number;        // %
  width: number;       // % chiều rộng container
  rotate: number;      // độ
  flip: boolean;       // lật ngang
  z: number;           // z-index
  opacity: number;
  zone?: 'cover' | 'body' | 'header';  // vùng đặt ảnh: bìa (cover), nội dung (body), hoặc header floral (header — tọa độ % theo .flr-header block). Mặc định 'body'.
}

/** Vị trí mặc định cho header thiệp (vùng nội dung/body). */
export const DEFAULT_DECORATIONS: DecoConfig[] = [
  { id: 'phoenix-left',  label: 'Phượng trái',  src: '/invitation/phoenix-left.webp',  top: 1,  left: -2, width: 34, rotate: 0, flip: false, z: 3, opacity: 0.95, zone: 'body' },
  { id: 'phoenix-right', label: 'Phượng phải',  src: '/invitation/phoenix-right.webp', top: 6,  left: 68, width: 34, rotate: 0, flip: true,  z: 3, opacity: 0.95, zone: 'body' },
  { id: 'songhy',        label: 'Song Hỷ',      src: '/invitation/songhy.webp',        top: 9,  left: 39, width: 22, rotate: 0, flip: false, z: 4, opacity: 1, zone: 'body' },
  { id: 'flower',        label: 'Hoa',          src: '/invitation/flower.webp',        top: 33, left: 60, width: 26, rotate: 0, flip: false, z: 2, opacity: 0.85, zone: 'body' },
  { id: 'watermark',     label: 'Watermark phượng', src: '/invitation/phoenix-watermark.webp', top: 50, left: -8, width: 40, rotate: 0, flip: false, z: 0, opacity: 0.06, zone: 'body' },
];

/** Vị trí mặc định cho thiệp FLORAL (hoa mộc lan).
 *  Tọa độ tính theo .flr-header BLOCK (zone='header') — khung + hoa khóa tương đối với tên, KHÔNG trôi theo trang. */
export const DEFAULT_FLORAL_DECORATIONS: DecoConfig[] = [
  // Khung oval — % theo .flr-header block (width 70% giống ChungĐôi, căn giữa)
  { id: 'floral-frame', label: 'Khung hoa oval', src: '/invitation/floral/frame-flower.webp',
    top: 6, left: 15, width: 70, rotate: 0, flip: false, z: 1, opacity: 1, zone: 'header' },
  // Hoa trái dưới — nằm đáy khung (dưới tên), không đè
  { id: 'floral-flower-bl', label: 'Hoa trái dưới', src: '/invitation/floral/flower-corner.webp',
    top: 58, left: -6, width: 40, rotate: 0, flip: false, z: 3, opacity: 0.9, zone: 'header' },
  // Hoa phải dưới — đáy khung phải
  { id: 'floral-flower-br', label: 'Hoa phải dưới', src: '/invitation/floral/flower-corner.webp',
    top: 52, left: 62, width: 42, rotate: 0, flip: true, z: 3, opacity: 0.9, zone: 'header' },
];

export const DEFAULT_FLORAL_COVER_DECORATIONS: DecoConfig[] = [
  { id: 'floral-cover-bl', label: 'Hoa bìa trái dưới', src: '/invitation/floral/flower-corner.webp', top: 42, left: -12, width: 52, rotate: 0,   flip: false, z: 2, opacity: 0.92, zone: 'cover' },
  { id: 'floral-cover-tr', label: 'Hoa bìa phải trên', src: '/invitation/floral/flower-corner.webp', top: -8, left: 60,  width: 52, rotate: 180, flip: true,  z: 2, opacity: 0.88, zone: 'cover' },
];

/** Vị trí mặc định cho thiệp HOA MỘC XANH.
 *  Hoa watercolor (flower.webp) rải 2 bên, zone body (% TOÀN trang), KHÔNG che giữa. */
export const DEFAULT_HOAMOC_DECORATIONS: DecoConfig[] = [
  { id: 'hoamoc-bar', label: 'Dải bar xanh', src: '/invitation/floral/hoamoc-bar.webp', top: 18, left: 0, width: 100, rotate: 0, flip: false, z: 2, opacity: 1, zone: 'body' },
  { id: 'hoamoc-flower-tl', label: 'Hoa trái trên',  src: '/invitation/floral/hoamoc-flower.webp', top: 5,  left: -8, width: 32, rotate: 0, flip: false, z: 2, opacity: 0.95, zone: 'body' },
  { id: 'hoamoc-flower-mr', label: 'Hoa phải giữa',  src: '/invitation/floral/hoamoc-flower.webp', top: 30, left: 72, width: 30, rotate: 0, flip: true,  z: 2, opacity: 0.95, zone: 'body' },
  { id: 'hoamoc-flower-bl', label: 'Hoa trái dưới',  src: '/invitation/floral/hoamoc-flower.webp', top: 60, left: -6, width: 28, rotate: 0, flip: false, z: 2, opacity: 0.95, zone: 'body' },
];

export const DEFAULT_HOAMOC_COVER_DECORATIONS: DecoConfig[] = [
  { id: 'hoamoc-cover-tl', label: 'Hoa bìa trái trên', src: '/invitation/floral/hoamoc-flower.webp', top: -6, left: -10, width: 42, rotate: 0,   flip: false, z: 2, opacity: 0.95, zone: 'cover' },
  { id: 'hoamoc-cover-br', label: 'Hoa bìa phải dưới', src: '/invitation/floral/hoamoc-flower.webp', top: 64, left: 62,  width: 44, rotate: 180, flip: true,  z: 2, opacity: 0.95, zone: 'cover' },
];

/** Vị trí mặc định cho thiệp LÂU ĐÀI XANH.
 *  Khung cảnh watercolor: lâu đài (chateau) lớn giữa header, mây rải nền trên, cây 2 bên, hoa nhỏ.
 *  Zone body (% TOÀN trang). Tên + WELCOME ở header z=30 nên không bị che. */
export const DEFAULT_LAUDAI_DECORATIONS: DecoConfig[] = [
  // Lâu đài FULL-WIDTH (ảnh chateau đã có sẵn mây + vườn + đài phun + cây) — phủ ngang thiệp.
  // top âm để khung cảnh phủ lên cả vùng tên (tên z=30 nổi trên ảnh, như ChungĐôi).
  { id: 'laudai-chateau', label: 'Lâu đài (khung cảnh)', src: '/invitation/laudai/chateau.webp', top: 30, left: 0, width: 100, rotate: 0, flip: false, z: 1, opacity: 1, zone: 'header' },
  // Hoa nhỏ rải 2 bên (điểm xuyết, KHÔNG che giữa)
  { id: 'laudai-hoa-bl',  label: 'Hoa trái dưới', src: '/invitation/laudai/hoanho2-1.webp', top: 56, left: -6, width: 24, rotate: 0, flip: false, z: 3, opacity: 0.92, zone: 'body' },
  { id: 'laudai-hoa-br',  label: 'Hoa phải dưới', src: '/invitation/laudai/hoanho3-1.webp', top: 56, left: 82, width: 24, rotate: 0, flip: true,  z: 3, opacity: 0.92, zone: 'body' },
];

export const DEFAULT_LAUDAI_COVER_DECORATIONS: DecoConfig[] = [
  { id: 'laudai-cover-orn', label: 'Hoa văn bìa', src: '/invitation/laudai/ornament.webp', top: -4, left: 30,  width: 40, rotate: 0,   flip: false, z: 2, opacity: 0.95, zone: 'cover' },
  { id: 'laudai-cover-tl',  label: 'Hoa bìa trái', src: '/invitation/laudai/hoanho2-1.webp', top: 70, left: -10, width: 34, rotate: 0,   flip: false, z: 2, opacity: 0.9,  zone: 'cover' },
  { id: 'laudai-cover-br',  label: 'Hoa bìa phải', src: '/invitation/laudai/hoanho3-1.webp', top: 70, left: 76,  width: 34, rotate: 0,   flip: true,  z: 2, opacity: 0.9,  zone: 'cover' },
];

/** Trả về decorations mặc định theo layout. */
export function defaultDecosByLayout(layout: string): DecoConfig[] {
  if (layout === 'floral') return [...DEFAULT_FLORAL_DECORATIONS, ...DEFAULT_FLORAL_COVER_DECORATIONS];
  if (layout === 'hoamoc') return [...DEFAULT_HOAMOC_DECORATIONS, ...DEFAULT_HOAMOC_COVER_DECORATIONS];
  if (layout === 'laudai') return [...DEFAULT_LAUDAI_DECORATIONS, ...DEFAULT_LAUDAI_COVER_DECORATIONS];
  return [...DEFAULT_DECORATIONS, ...DEFAULT_COVER_DECORATIONS];
}

/** Vị trí mặc định cho BÌA thiệp (vùng cover/gate). Dùng khi seed thiết kế mới. */
export const DEFAULT_COVER_DECORATIONS: DecoConfig[] = [
  { id: 'cover-phoenix-left',  label: 'Phượng trái',  src: '/invitation/phoenix-left.webp',  top: -2, left: -6, width: 42, rotate: 0, flip: false, z: 1, opacity: 0.9, zone: 'cover' },
  { id: 'cover-phoenix-right', label: 'Phượng phải',  src: '/invitation/phoenix-right.webp', top: -2, left: 64, width: 42, rotate: 0, flip: true,  z: 1, opacity: 0.9, zone: 'cover' },
  { id: 'cover-songhy',        label: 'Song Hỷ',      src: '/invitation/songhy.webp',        top: 4,  left: 42, width: 16, rotate: 0, flip: false, z: 3, opacity: 1, zone: 'cover' },
  { id: 'cover-flower',        label: 'Hoa',          src: '/invitation/flower.webp',        top: 70, left: -4, width: 28, rotate: 0, flip: false, z: 1, opacity: 0.75, zone: 'cover' },
];

/** Lọc danh sách trang trí theo vùng. Ảnh không có `zone` coi như 'body' (tương thích cũ). */
export function decosByZone(list: DecoConfig[] | undefined, zone: 'cover' | 'body' | 'header'): DecoConfig[] | undefined {
  if (!list) return undefined;
  const filtered = list.filter((d) => (d.zone ?? 'body') === zone);
  return filtered.length ? filtered : undefined;
}

const LS_KEY = 'inv-decorations-v1';

/** Đọc config (ưu tiên localStorage nếu user đã chỉnh). */
export function loadDecorations(): DecoConfig[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as DecoConfig[];
      // merge theo id để không mất ảnh mới
      return DEFAULT_DECORATIONS.map((d) => saved.find((s) => s.id === d.id) ?? d);
    }
  } catch { /* ignore */ }
  return DEFAULT_DECORATIONS;
}

export function saveDecorations(list: DecoConfig[]): void {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

export function resetDecorations(): void {
  try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
}
