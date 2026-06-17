/** Shared helpers + types cho admin dashboard. */
export const PINK = '#e6017e';
export const CHART_COLORS = ['#e6017e', '#ff6bb3', '#a855f7', '#38bdf8', '#22c55e', '#f59e0b'];

export const CATEGORY_VI: Record<string, string> = {
  luxury: 'Sang trọng',
  modern: 'Hiện đại',
  classic: 'Cổ điển',
  minimalist: 'Tối giản',
  floral: 'Hoa lá',
  vintage: 'Vintage',
};

/** Format VND ngắn gọn cho trục biểu đồ: 699000 -> "699k", 12000000 -> "12tr". */
export function formatVNDShort(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}tr`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}k`;
  return String(v);
}

export const STATUS_VI: Record<string, string> = {
  new: 'Mới',
  contacted: 'Đã liên hệ',
  done: 'Hoàn tất',
  spam: 'Spam',
  paid: 'Đã trả',
  unpaid: 'Chưa trả',
  pending: 'Chờ',
  active: 'Hoạt động',
  blocked: 'Đã khoá',
  admin: 'Quản trị',
  customer: 'Khách',
};

export const fmtDate = (s?: string) => (s ? new Date(s).toLocaleDateString('vi-VN') : '—');
