/**
 * FONTSET — bộ font cho thiệp. Đòn bẩy ĐA DẠNG lớn nhất: cùng 1 body, đổi fontset
 * là mẫu trông khác hẳn (như ChungĐôi đổi Times / Baskerville / script).
 *
 * Mỗi fontset map 3 CSS var (đọc trong các layout/InvitationBody):
 *   --font-heading : tiêu đề section (THÔNG TIN LỄ CƯỚI...)
 *   --font-name    : tên cô dâu chú rể (chữ TO, điểm nhấn)
 *   --font-body    : nội dung thường
 *
 * Lưu ở DB: design.fontset = '<key>'. Mặc định 'classic-serif' (giữ nguyên cảm giác cũ).
 * Mọi font đã khai báo ở index.html (có Vietnamese subset).
 */
export interface Fontset {
  key: string;
  label: string;        // tên hiển thị trong admin
  heading: string;
  name: string;
  body: string;
}

export const FONTSETS: Record<string, Fontset> = {
  'classic-serif': {
    key: 'classic-serif', label: 'Cổ điển (Times/Playfair)',
    heading: "'Playfair Display', 'Times New Roman', serif",
    name: "'Playfair Display', 'Times New Roman', serif",
    body: "'Inter', sans-serif",
  },
  'elegant': {
    key: 'elegant', label: 'Thanh lịch (Cormorant/Garamond)',
    heading: "'Cormorant', 'EB Garamond', serif",
    name: "'Cormorant', 'EB Garamond', serif",
    body: "'EB Garamond', serif",
  },
  'script-soft': {
    key: 'script-soft', label: 'Bay bổng (script)',
    heading: "'Cormorant', serif",
    name: "'Dancing Script', cursive",
    body: "'EB Garamond', serif",
  },
  'romantic': {
    key: 'romantic', label: 'Lãng mạn (Great Vibes)',
    heading: "'Cormorant SC', serif",
    name: "'Great Vibes', cursive",
    body: "'Cormorant', serif",
  },
  'modern-sans': {
    key: 'modern-sans', label: 'Hiện đại (sans)',
    heading: "'Be Vietnam Pro', sans-serif",
    name: "'Be Vietnam Pro', sans-serif",
    body: "'Be Vietnam Pro', sans-serif",
  },
};

export const DEFAULT_FONTSET = 'classic-serif';

/** Trả CSS var cho 1 fontset key. Key sai/thiếu → mặc định. */
export function fontsetVars(key?: string): Record<string, string> {
  const fs = FONTSETS[key ?? ''] ?? FONTSETS[DEFAULT_FONTSET];
  return {
    '--font-heading': fs.heading,
    '--font-name': fs.name,
    '--font-body': fs.body,
  };
}
