/**
 * Bộ họa tiết SVG hoa lá / ornament cho thiệp cưới.
 * Vector thuần → sắc nét mọi kích thước, đổi màu qua prop `color` (mặc định gold).
 * Dùng currentColor để kế thừa màu CSS khi cần.
 */
import { CSSProperties } from 'react';

interface OrnamentProps {
  className?: string;
  style?: CSSProperties;
  color?: string;
}

const GOLD = '#d4a853';

/** Nhánh lá cong — dùng ở 4 góc cover, 2 bên tiêu đề section. */
export function LeafBranch({ className, style, color = GOLD }: OrnamentProps) {
  return (
    <svg viewBox="0 0 120 60" className={className} style={style} fill="none" aria-hidden="true">
      <path d="M5 55 C 35 50, 55 35, 70 5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      {[...Array(7)].map((_, i) => {
        const t = i / 6;
        const x = 5 + t * 65;
        const y = 55 - t * 50 - Math.sin(t * Math.PI) * 4;
        const rot = -40 - t * 30;
        return (
          <ellipse
            key={i}
            cx={x} cy={y} rx="9" ry="3.4"
            fill={color} opacity={0.55 - t * 0.1}
            transform={`rotate(${rot} ${x} ${y})`}
          />
        );
      })}
    </svg>
  );
}

/** Vòng hoa tròn — khung quanh chữ cái đầu / monogram. */
export function FloralWreath({ className, style, color = GOLD }: OrnamentProps) {
  const petals = 18;
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} fill="none" aria-hidden="true">
      <circle cx="100" cy="100" r="78" stroke={color} strokeWidth="0.8" opacity="0.4" />
      {[...Array(petals)].map((_, i) => {
        const a = (i / petals) * Math.PI * 2;
        const cx = 100 + Math.cos(a) * 78;
        const cy = 100 + Math.sin(a) * 78;
        const deg = (a * 180) / Math.PI;
        return (
          <g key={i} transform={`rotate(${deg} ${cx} ${cy})`} opacity="0.65">
            <ellipse cx={cx} cy={cy} rx="11" ry="4" fill={color} />
            <ellipse cx={cx - 7} cy={cy} rx="7" ry="2.6" fill={color} opacity="0.7" />
          </g>
        );
      })}
    </svg>
  );
}

/** Đường phân cách thanh mảnh có hoa ở giữa — chia các section. */
export function Divider({ className, style, color = GOLD }: OrnamentProps) {
  return (
    <svg viewBox="0 0 240 24" className={className} style={style} fill="none" aria-hidden="true">
      <line x1="10" y1="12" x2="95" y2="12" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="145" y1="12" x2="230" y2="12" stroke={color} strokeWidth="1" opacity="0.5" />
      <g transform="translate(120 12)">
        {[...Array(8)].map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <ellipse key={i} cx={Math.cos(a) * 6} cy={Math.sin(a) * 6}
              rx="3.4" ry="1.4" fill={color}
              transform={`rotate(${(a * 180) / Math.PI})`} />
          );
        })}
        <circle r="2" fill={color} />
      </g>
    </svg>
  );
}

/** Khung góc ornament — đặt ở 4 góc khung ảnh / khung thiệp. */
export function CornerFlourish({ className, style, color = GOLD }: OrnamentProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} fill="none" aria-hidden="true">
      <path d="M2 2 L40 2 M2 2 L2 40" stroke={color} strokeWidth="1" opacity="0.7" />
      <path d="M2 14 C 22 14, 30 22, 30 42" stroke={color} strokeWidth="0.9" opacity="0.6" />
      <path d="M14 2 C 14 22, 22 30, 42 30" stroke={color} strokeWidth="0.9" opacity="0.6" />
      <circle cx="30" cy="30" r="2.4" fill={color} />
      {[...Array(3)].map((_, i) => (
        <ellipse key={i} cx={8 + i * 6} cy={8 + i * 6} rx="4" ry="1.6" fill={color}
          opacity={0.5 - i * 0.1} transform={`rotate(45 ${8 + i * 6} ${8 + i * 6})`} />
      ))}
    </svg>
  );
}

/** Cánh hoa rơi (dùng cho hiệu ứng nền). 1 cánh đơn. */
export function Petal({ className, style, color = GOLD }: OrnamentProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} style={style} fill="none" aria-hidden="true">
      <path d="M10 1 C 16 6, 16 14, 10 19 C 4 14, 4 6, 10 1 Z" fill={color} opacity="0.5" />
    </svg>
  );
}
