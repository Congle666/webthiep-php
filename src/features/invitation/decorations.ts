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
  zone?: 'cover' | 'body';  // vùng đặt ảnh: bìa thiệp (cover) hoặc nội dung/header (body). Mặc định 'body'.
}

/** Vị trí mặc định cho header thiệp (vùng nội dung/body). */
export const DEFAULT_DECORATIONS: DecoConfig[] = [
  { id: 'phoenix-left',  label: 'Phượng trái',  src: '/invitation/phoenix-left.webp',  top: 1,  left: -2, width: 34, rotate: 0, flip: false, z: 3, opacity: 0.95, zone: 'body' },
  { id: 'phoenix-right', label: 'Phượng phải',  src: '/invitation/phoenix-right.webp', top: 6,  left: 68, width: 34, rotate: 0, flip: true,  z: 3, opacity: 0.95, zone: 'body' },
  { id: 'songhy',        label: 'Song Hỷ',      src: '/invitation/songhy.webp',        top: 9,  left: 39, width: 22, rotate: 0, flip: false, z: 4, opacity: 1, zone: 'body' },
  { id: 'flower',        label: 'Hoa',          src: '/invitation/flower.webp',        top: 33, left: 60, width: 26, rotate: 0, flip: false, z: 2, opacity: 0.85, zone: 'body' },
  { id: 'watermark',     label: 'Watermark phượng', src: '/invitation/phoenix-watermark.webp', top: 50, left: -8, width: 40, rotate: 0, flip: false, z: 0, opacity: 0.06, zone: 'body' },
];

/** Vị trí mặc định cho BÌA thiệp (vùng cover/gate). Dùng khi seed thiết kế mới. */
export const DEFAULT_COVER_DECORATIONS: DecoConfig[] = [
  { id: 'cover-phoenix-left',  label: 'Phượng trái',  src: '/invitation/phoenix-left.webp',  top: -2, left: -6, width: 42, rotate: 0, flip: false, z: 1, opacity: 0.9, zone: 'cover' },
  { id: 'cover-phoenix-right', label: 'Phượng phải',  src: '/invitation/phoenix-right.webp', top: -2, left: 64, width: 42, rotate: 0, flip: true,  z: 1, opacity: 0.9, zone: 'cover' },
  { id: 'cover-songhy',        label: 'Song Hỷ',      src: '/invitation/songhy.webp',        top: 4,  left: 42, width: 16, rotate: 0, flip: false, z: 3, opacity: 1, zone: 'cover' },
  { id: 'cover-flower',        label: 'Hoa',          src: '/invitation/flower.webp',        top: 70, left: -4, width: 28, rotate: 0, flip: false, z: 1, opacity: 0.75, zone: 'cover' },
];

/** Lọc danh sách trang trí theo vùng. Ảnh không có `zone` coi như 'body' (tương thích cũ). */
export function decosByZone(list: DecoConfig[] | undefined, zone: 'cover' | 'body'): DecoConfig[] | undefined {
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
