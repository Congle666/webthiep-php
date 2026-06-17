/**
 * Họa tiết SVG truyền thống (rồng, phượng, song hỷ, hoa chia) — code sẵn.
 * Dùng currentColor để tô màu theo theme. Đây là FALLBACK; khi bạn thả file
 * dragon.svg/phoenix.svg vào assets/svg/ thì OrnamentSlot sẽ ưu tiên file đó.
 */
import { CSSProperties } from 'react';

interface P { className?: string; style?: CSSProperties; color?: string; }
const RED = '#9e2b25';

/** Chữ Song Hỷ 囍 — dùng Unicode trong khung tròn cách điệu. */
export function SongHy({ className, style, color = RED }: P) {
  return (
    <svg viewBox="0 0 160 160" className={className} style={style} aria-hidden="true">
      <circle cx="80" cy="80" r="76" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
      <circle cx="80" cy="80" r="66" fill={color} />
      <text x="80" y="80" dominantBaseline="central" textAnchor="middle"
        fontSize="78" fill="#f7efe2" fontFamily="serif" fontWeight="700">囍</text>
    </svg>
  );
}

/** Rồng cách điệu (silhouette uốn lượn) — góc trái. */
export function Dragon({ className, style, color = RED }: P) {
  return (
    <svg viewBox="0 0 200 120" className={className} style={style} fill={color} aria-hidden="true">
      <path d="M10 60 C 20 30, 50 20, 70 35 C 80 42, 78 55, 68 58 C 60 60, 55 54, 58 48
        C 50 50, 52 64, 66 68 C 90 76, 110 60, 120 40 C 128 24, 150 18, 168 28
        C 182 36, 184 52, 174 60 C 188 58, 196 44, 192 30 C 190 50, 178 66, 160 70
        C 140 74, 122 66, 112 50 C 104 70, 84 86, 60 84 C 34 82, 14 74, 10 60 Z"
        opacity="0.92" />
      {/* vảy/râu gợi ý */}
      <circle cx="64" cy="40" r="3" fill="#f7efe2" />
      <path d="M168 28 q 10 -6 18 -2" stroke={color} strokeWidth="2" fill="none" />
    </svg>
  );
}

/** Phượng cách điệu (đuôi xòe) — góc phải. */
export function Phoenix({ className, style, color = RED }: P) {
  return (
    <svg viewBox="0 0 200 120" className={className} style={style} fill={color} aria-hidden="true">
      <path d="M40 70 C 60 50, 70 30, 95 28 C 88 38, 86 48, 92 56 C 100 46, 116 44, 128 52
        C 120 56, 116 64, 120 72 C 134 60, 156 60, 170 74 C 150 72, 138 80, 134 94
        C 128 80, 112 76, 100 84 C 104 72, 98 62, 88 64 C 92 78, 80 92, 62 92
        C 48 92, 40 82, 40 70 Z" opacity="0.92" />
      {/* mào + mắt */}
      <circle cx="92" cy="40" r="3" fill="#f7efe2" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${150 + i * 8} ${74 + i * 4} q 12 4 18 14`} stroke={color} strokeWidth="2" fill="none" opacity="0.7" />
      ))}
    </svg>
  );
}

/** Hoa chia section (đào/mai cách điệu). */
export function FloralDivider({ className, style, color = RED }: P) {
  return (
    <svg viewBox="0 0 220 28" className={className} style={style} fill="none" aria-hidden="true">
      <line x1="6" y1="14" x2="86" y2="14" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="134" y1="14" x2="214" y2="14" stroke={color} strokeWidth="1" opacity="0.5" />
      <g transform="translate(110 14)" fill={color}>
        {[...Array(5)].map((_, i) => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
          return <ellipse key={i} cx={Math.cos(a) * 7} cy={Math.sin(a) * 7} rx="4.5" ry="2.2"
            transform={`rotate(${(a * 180) / Math.PI + 90})`} opacity="0.9" />;
        })}
        <circle r="2.6" fill="#f4ead7" />
      </g>
    </svg>
  );
}

/** Watermark họa tiết nền mờ (rồng lớn) — đặt sau nội dung. */
export function Watermark({ className, style, color = RED }: P) {
  return (
    <svg viewBox="0 0 300 600" className={className} style={style} fill={color} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <g opacity="0.05">
        <path d="M150 40 C 100 120, 200 180, 150 260 C 100 340, 200 400, 150 480 C 120 530, 160 560, 150 580" stroke={color} strokeWidth="40" fill="none" strokeLinecap="round" />
        <circle cx="150" cy="40" r="28" />
      </g>
    </svg>
  );
}
