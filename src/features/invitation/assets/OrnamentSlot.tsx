/**
 * OrnamentSlot — render họa tiết SVG theo TÊN file (từ theme.ornaments).
 * - Có file trong assets/svg/  -> render file đó, tô màu theo theme (CSS mask).
 * - Không có file              -> fallback họa tiết code (TraditionalOrnaments).
 * Thả dragon.svg / phoenix.svg / songhy.svg ... vào assets/svg/ là tự thay.
 */
import { CSSProperties } from 'react';
import { Dragon, Phoenix, SongHy, FloralDivider, Watermark } from './TraditionalOrnaments';

const svgFiles = import.meta.glob('./svg/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

function findSvg(name?: string): string | null {
  if (!name) return null;
  const key = Object.keys(svgFiles).find((k) => k.endsWith(`/${name}.svg`));
  return key ? svgFiles[key] : null;
}

type Slot = 'dragon' | 'phoenix' | 'songhy' | 'divider' | 'watermark';

interface Props {
  name?: string;
  slot: Slot;
  color?: string;
  className?: string;
  style?: CSSProperties;
  flip?: boolean;
}

export function OrnamentSlot({ name, slot, color = '#9e2b25', className, style, flip }: Props) {
  const url = findSvg(name);
  const transform = flip ? 'scaleX(-1)' : undefined;

  if (url) {
    return (
      <span
        className={className}
        aria-hidden="true"
        style={{
          display: 'inline-block',
          backgroundColor: color,
          WebkitMaskImage: `url(${url})`, maskImage: `url(${url})`,
          WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain', maskSize: 'contain',
          WebkitMaskPosition: 'center', maskPosition: 'center',
          transform, ...style,
        }}
      />
    );
  }

  const common = { className, style: { ...style, transform }, color };
  switch (slot) {
    case 'dragon': return <Dragon {...common} />;
    case 'phoenix': return <Phoenix {...common} />;
    case 'songhy': return <SongHy {...common} />;
    case 'divider': return <FloralDivider {...common} />;
    case 'watermark': return <Watermark {...common} />;
    default: return <FloralDivider {...common} />;
  }
}
