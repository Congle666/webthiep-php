/** Khung xem trước thiệp THẬT trong Admin Designer: bìa (cover) hoặc nội dung (body). */
import { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LAYOUTS } from '../invitation/layouts';
import { InvitationBody } from '../invitation/InvitationBody';
import { DecoConfig, decosByZone } from '../invitation/decorations';
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
}

function themeVars(theme: Theme): CSSProperties {
  return {
    '--red': theme.red, '--red-deep': theme.redDeep, '--red-soft': theme.redSoft,
    '--text': theme.text, '--heading': theme.heading, '--muted': theme.muted,
    background: theme.paper ? `${theme.bg} url('${theme.paper}')` : theme.bg,
  } as CSSProperties;
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

export function DesignerPreview({ layout, theme, decos, zone, onChange, selectedId, onSelect }: Props) {
  const L = LAYOUTS[layout] ?? LAYOUTS.traditional;
  const inv = sampleInvitation(layout);
  // Tab "Nội dung" (body) hiển thị + chỉnh cả zone 'body' và 'header' (floral) — L.Header tự tách.
  const zoneDecos =
    zone === 'body'
      ? (decos.filter((d) => (d.zone ?? 'body') !== 'cover'))
      : (decosByZone(decos, zone) ?? []);

  /** Ghép danh sách của zone hiện tại trở lại mảng đầy đủ (giữ nguyên zone kia). */
  const handleZoneChange = (next: DecoConfig[]) => {
    if (zone === 'body') {
      // 'next' đã giữ zone gốc ('body' hoặc 'header') của từng ảnh — chỉ cần ghép lại với cover.
      const cover = decos.filter((d) => (d.zone ?? 'body') === 'cover');
      onChange([...cover, ...next]);
      return;
    }
    const others = decos.filter((d) => (d.zone ?? 'body') !== zone);
    onChange([...others, ...next.map((d) => ({ ...d, zone }))]);
  };

  if (zone === 'cover') {
    return (
      <ScaledFrame frameClass="dsn-frame dsn-frame--cover" style={themeVars(theme)}>
        <L.Cover
          inv={inv}
          guestName="Nguyễn Văn A"
          onOpen={() => {}}
          inline
          editable
          decorations={zoneDecos}
          onDecoChange={handleZoneChange}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </ScaledFrame>
    );
  }

  return (
    <ScaledFrame frameClass={`dsn-frame inv-root inv-${layout}`} style={themeVars(theme)}>
      <L.Header inv={inv} editMode decorations={zoneDecos} onDecoChange={handleZoneChange}
        selectedId={selectedId} onSelect={onSelect} />
      <InvitationBody inv={inv} slug="preview" t={TRANSLATIONS.vi} />
    </ScaledFrame>
  );
}
