/** Khung xem trước thiệp THẬT trong Admin Designer: bìa (cover) hoặc nội dung (body). */
import { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LAYOUTS } from '../invitation/layouts';
import { InvitationBody } from '../invitation/InvitationBody';
import { DecoConfig, decosByZone } from '../invitation/decorations';
import { fontsetVars } from '../invitation/fontsets';
import { sampleInvitation } from './sampleInvitation';
import { TRANSLATIONS } from '../invitation/i18n';

type Theme = Record<string, string>;
export type Zone = 'cover' | 'body';

interface Props {
  layout: string;
  theme: Theme;
  decos: DecoConfig[];
  zone: Zone;
  onChange: (list: DecoConfig[]) => void;   // nhận danh sách ĐẦY ĐỦ (cả 2 zone)
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  fontset?: string;
  spacing?: { sectionGap?: number; headerMin?: number };
  sectionOrder?: string[];
  headerStyle?: string;
}

function themeVars(theme: Theme, fontset?: string, spacing?: { sectionGap?: number; headerMin?: number }): CSSProperties {
  const v: Record<string, string> = {
    ...fontsetVars(fontset),
    '--red': theme.red, '--red-deep': theme.redDeep, '--red-soft': theme.redSoft,
    '--text': theme.text, '--heading': theme.heading, '--muted': theme.muted,
    background: theme.paper ? `${theme.bg} url('${theme.paper}')` : theme.bg,
  };
  if (spacing?.sectionGap != null) v['--inv-section-gap'] = `${spacing.sectionGap}px`;
  if (spacing?.headerMin != null) v['--inv-header-min'] = `${spacing.headerMin}px`;
  return v as CSSProperties;
}

const FRAME_W = 760; // width thật của .inv-root — render cố định rồi scale thu nhỏ

/**
 * Bọc frame (render ở 760px) trong wrapper scale vừa cột.
 * - Đo width khả dụng của wrapper → scale = min(1, width/760).
 * - Đo chiều cao thật của frame → set height wrapper = frameH*scale (không dư/thiếu).
 * Kéo-thả vẫn đúng: DecorationLayer dùng getBoundingClientRect() (đã scale) + clientX (đã scale)
 * nên phép tính %/rect.width tự nhất quán.
 */
function ScaledFrame({ children, frameClass, style }: { children: React.ReactNode; frameClass: string; style: CSSProperties }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [wrapH, setWrapH] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const frame = frameRef.current;
    if (!wrap || !frame) return;
    const measure = () => {
      const avail = wrap.clientWidth;
      const s = Math.min(1, avail / FRAME_W);
      setScale(s);
      // offsetHeight = chiều cao bố cục TRƯỚC transform (transform không ảnh hưởng offsetHeight)
      setWrapH(frame.offsetHeight * s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    ro.observe(frame); // nội dung đổi (đổi mẫu/zone) → đo lại chiều cao
    return () => ro.disconnect();
  }, []);

  // Đo lại khi children đổi (đổi mẫu / decoration) — ResizeObserver bắt frame cũng xử lý phần lớn.
  useEffect(() => {
    const frame = frameRef.current, wrap = wrapRef.current;
    if (!frame || !wrap) return;
    const s = Math.min(1, wrap.clientWidth / FRAME_W);
    setScale(s);
    setWrapH(frame.offsetHeight * s);
  });

  return (
    <div className="dsn-scale-wrap" ref={wrapRef} style={{ height: wrapH }}>
      <div ref={frameRef} className={frameClass} style={{ ...style, '--dsn-scale': scale } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}

export function DesignerPreview({ layout, theme, decos, zone, onChange, selectedId, onSelect, fontset, spacing, sectionOrder, headerStyle }: Props) {
  const L = LAYOUTS[layout] ?? LAYOUTS.traditional;
  const base = sampleInvitation(layout);
  // Gắn sectionOrder + headerStyle (từ DB) vào inv.design → preview render ĐÚNG như demo/user, không lệch.
  const inv = { ...base, design: { ...(base.design ?? {}), ...(sectionOrder ? { sectionOrder } : {}), ...(headerStyle ? { headerStyle: headerStyle as 'split' | 'stack' } : {}) } };
  // Tab "Nội dung" (body): header nhận zone 'body'+'header' (L.Header tự tách); footer tách riêng → InvitationBody.
  const headerDecos =
    zone === 'body'
      ? decos.filter((d) => { const z = d.zone ?? 'body'; return z !== 'cover' && z !== 'footer'; })
      : (decosByZone(decos, zone) ?? []);
  const footerDecos = zone === 'body' ? decos.filter((d) => d.zone === 'footer') : [];

  /** Ghép footer-deco đã sửa lại mảng đầy đủ. */
  const handleFooterChange = (next: DecoConfig[]) => {
    const others = decos.filter((d) => d.zone !== 'footer');
    onChange([...others, ...next.map((d) => ({ ...d, zone: 'footer' as const }))]);
  };

  /** Ghép danh sách header của zone hiện tại trở lại mảng đầy đủ (giữ nguyên zone kia). */
  const handleZoneChange = (next: DecoConfig[]) => {
    if (zone === 'body') {
      // header-change KHÔNG đụng cover & footer; 'next' giữ zone gốc body/header.
      const keep = decos.filter((d) => { const z = d.zone ?? 'body'; return z === 'cover' || z === 'footer'; });
      onChange([...keep, ...next]);
      return;
    }
    const others = decos.filter((d) => (d.zone ?? 'body') !== zone);
    onChange([...others, ...next.map((d) => ({ ...d, zone }))]);
  };

  if (zone === 'cover') {
    return (
      <ScaledFrame frameClass="dsn-frame dsn-frame--cover" style={themeVars(theme, fontset, spacing)}>
        <L.Cover
          inv={inv}
          guestName="Nguyễn Văn A"
          onOpen={() => {}}
          inline
          editable
          decorations={headerDecos}
          onDecoChange={handleZoneChange}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </ScaledFrame>
    );
  }

  return (
    <ScaledFrame frameClass={`dsn-frame inv-root inv-opened inv-${layout}`} style={themeVars(theme, fontset, spacing)}>
      <L.Header inv={inv} editMode decorations={headerDecos} onDecoChange={handleZoneChange}
        selectedId={selectedId} onSelect={onSelect} />
      <InvitationBody inv={inv} slug="preview" t={TRANSLATIONS.vi}
        footerDecos={footerDecos} editMode onFooterDecoChange={handleFooterChange}
        selectedDecoId={selectedId} onSelectDeco={onSelect} />
    </ScaledFrame>
  );
}
