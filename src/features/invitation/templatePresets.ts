/**
 * TEMPLATE FACTORY — Phase 1: Asset helper + Position presets + deco() builder.
 *
 * Mục tiêu: tạo mẫu thiệp NHANH bằng cách ghép preset thay vì gõ tay top/left/width từng ảnh.
 * KHÔNG thay DecoConfig hiện có — chỉ là lớp HELPER sinh ra DecoConfig[].
 *
 * Dùng:
 *   deco('flower-tl', asset('flower','moc-1'), 'cornerTL', { z: 3 })
 *   → { id:'flower-tl', src:'/invitation/flower/moc-1.webp', top:-4, left:-8, width:36, ... }
 */
import type { DecoConfig } from './decorations';

/* ─────────────────────────────────────────────────────────
   1) ASSET HELPER — chống gõ sai path, nhóm ảnh theo loại
   ───────────────────────────────────────────────────────── */

/** Nhóm asset (thư mục con trong public/invitation).
 *  Gồm: nhóm theo LOẠI (flower/castle/cloud...) cho asset registry tương lai,
 *  và nhóm theo MẪU (laudai/floral) cho ảnh riêng từng mẫu hiện có. */
export type AssetGroup =
  | 'flower' | 'castle' | 'cloud' | 'frame' | 'phoenix'
  | 'songhy' | 'tree' | 'light' | 'ornament' | 'bar'
  | 'laudai' | 'floral';   // nhóm theo mẫu (ảnh đã có sẵn)

/** Trả path ảnh chuẩn: asset('flower','moc-1') → '/invitation/flower/moc-1.webp' */
export function asset(group: AssetGroup, name: string): string {
  return `/invitation/${group}/${name}.webp`;
}

/* ─────────────────────────────────────────────────────────
   2) POSITION PRESETS — vị trí composition tái dùng (KHÔNG gõ pixel)
   Mỗi preset = { top, left, width } (+ flip nếu cần). Đơn vị %.
   ───────────────────────────────────────────────────────── */

export type PresetName =
  | 'cornerTL' | 'cornerTR' | 'cornerBL' | 'cornerBR'
  | 'sideL' | 'sideR'
  | 'fullScene' | 'frameCenter' | 'bannerTop'
  | 'heroTop' | 'atmosphereTop';

type PresetBox = { top: number; left: number; width: number; flip?: boolean };

/** Bảng preset vị trí — chỉnh 1 chỗ, mọi mẫu hưởng. */
export const PRESETS: Record<PresetName, PresetBox> = {
  // 4 góc (hoa trang trí)
  cornerTL: { top: -4, left: -8, width: 36 },
  cornerTR: { top: -4, left: 64, width: 36, flip: true },
  cornerBL: { top: 60, left: -8, width: 36 },
  cornerBR: { top: 56, left: 70, width: 36, flip: true },
  // 2 bên (cây / phượng)
  sideL: { top: 28, left: -6, width: 28 },
  sideR: { top: 28, left: 76, width: 28, flip: true },
  // khung cảnh / khung
  fullScene: { top: 6, left: 0, width: 100 },      // ảnh khung cảnh full-width (laudai)
  frameCenter: { top: 4, left: 12, width: 76 },    // khung oval/border giữa (floral)
  bannerTop: { top: 18, left: 0, width: 100 },      // dải bar ngang (hoamoc)
  // hero / atmosphere
  heroTop: { top: 8, left: 10, width: 80 },         // vật thể chính trên
  atmosphereTop: { top: 4, left: 20, width: 60 },   // mây/hiệu ứng nền trên
};

/* ─────────────────────────────────────────────────────────
   3) deco() BUILDER — ghép preset + asset + override thành DecoConfig
   ───────────────────────────────────────────────────────── */

interface DecoOpts {
  z?: number;
  opacity?: number;
  rotate?: number;
  zone?: DecoConfig['zone'];
  label?: string;
  /** Ghi đè top/left/width/flip nếu cần lệch preset (tuỳ chọn, hiếm dùng). */
  override?: Partial<PresetBox>;
}

/**
 * Tạo 1 DecoConfig từ preset + ảnh. Nhanh, nhất quán.
 * @param id    id duy nhất
 * @param src   path ảnh (dùng asset(...) cho chuẩn)
 * @param preset tên vị trí composition
 */
export function deco(id: string, src: string, preset: PresetName, opts: DecoOpts = {}): DecoConfig {
  const box = { ...PRESETS[preset], ...opts.override };
  return {
    id,
    label: opts.label ?? id,
    src,
    top: box.top,
    left: box.left,
    width: box.width,
    rotate: opts.rotate ?? 0,
    flip: box.flip ?? false,
    z: opts.z ?? 2,
    opacity: opts.opacity ?? 1,
    zone: opts.zone ?? 'body',
  };
}
