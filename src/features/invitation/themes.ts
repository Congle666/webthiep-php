/**
 * THEME TOKENS cho thiệp cưới. Mặc định: ĐỎ TRUYỀN THỐNG (nền kem + đỏ đô,
 * rồng phượng + Song Hỷ) — phong cách thiệp cưới VN giống chungdoi.
 *
 * Thả SVG họa tiết vào assets/svg/ với tên khai báo ở `ornaments` để nâng cấp.
 */
export type LayoutKey = 'traditional';

export interface InvitationTheme {
  bg: string;
  bgGradient: string;
  accent: string;        // đỏ đô chính
  accentDeep: string;    // đỏ đậm (banner/footer)
  accentSoft: string;    // đỏ nhạt / watermark
  text: string;
  heading: string;
  muted: string;
  headingFont: string;
  layout: LayoutKey;
  ornaments: {
    dragon?: string;     // rồng (góc trái header)
    phoenix?: string;    // phượng (góc phải header)
    songhy?: string;     // chữ Song Hỷ 囍 (giữa) — để trống dùng Unicode
    divider?: string;    // hoa chia section
    watermark?: string;  // họa tiết nền mờ
  };
}

/** Theme đỏ truyền thống — dùng cho TẤT CẢ mẫu hiện tại. */
const TRADITIONAL_RED: InvitationTheme = {
  bg: '#f7efe2',
  bgGradient: 'linear-gradient(180deg, #f9f2e6 0%, #f4ead7 100%)',
  accent: '#9e2b25',
  accentDeep: '#7a1f1b',
  accentSoft: 'rgba(158,43,37,0.08)',
  text: '#5a4a3a',
  heading: '#9e2b25',
  muted: '#9c8b76',
  headingFont: "'Playfair Display', serif",
  layout: 'traditional',
  ornaments: {
    dragon: 'dragon',
    phoenix: 'phoenix',
    divider: 'floral-divider',
    watermark: 'watermark',
  },
};

export const THEMES: Record<string, InvitationTheme> = {
  default: TRADITIONAL_RED,
};

export function getTheme(_templateSlug: string | null | undefined): InvitationTheme {
  // Hiện chỉ 1 phong cách đỏ truyền thống cho mọi mẫu.
  return TRADITIONAL_RED;
}
