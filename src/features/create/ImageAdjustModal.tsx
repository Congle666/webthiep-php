/** Modal điều chỉnh ảnh: kéo để đổi vị trí + slider phóng to. Bản đơn giản (KHÔNG canvas crop). */
import { useRef, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import type { PhotoAdjust } from '../invitation/types';

type Shape = 'oval' | 'circle' | 'rect';

interface Props {
  url: string;
  value?: PhotoAdjust;
  shape?: Shape;
  title?: string;
  onApply: (adj: PhotoAdjust) => void;
  onClose: () => void;
}

const DEF: PhotoAdjust = { x: 50, y: 50, scale: 1 };

export default function ImageAdjustModal({ url, value, shape = 'oval', title = 'Điều chỉnh ảnh', onApply, onClose }: Props) {
  const [adj, setAdj] = useState<PhotoAdjust>({ ...DEF, ...value });
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  function onDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, ox: adj.x, oy: adj.y };
  }
  function onMove(e: React.PointerEvent) {
    if (!drag.current || !frameRef.current) return;
    const r = frameRef.current.getBoundingClientRect();
    // Kéo phải -> ảnh dịch phải -> giảm position X. Hệ số theo kích thước khung.
    const dx = ((e.clientX - drag.current.sx) / r.width) * 100;
    const dy = ((e.clientY - drag.current.sy) / r.height) * 100;
    setAdj((a) => ({
      ...a,
      x: clamp(drag.current!.ox - dx),
      y: clamp(drag.current!.oy - dy),
    }));
  }
  function onUp() { drag.current = null; }

  const radius = shape === 'circle' ? '50%' : shape === 'oval' ? '50% / 60%' : '12px';
  const aspect = shape === 'circle' ? '1 / 1' : shape === 'oval' ? '5 / 6' : '4 / 3';

  return (
    <div className="ci-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="ci-modal__box" onClick={(e) => e.stopPropagation()}>
        <div className="ci-modal__head">
          <strong>{title}</strong>
          <button type="button" className="ci-modal__x" onClick={onClose} aria-label="Đóng"><X size={18} /></button>
        </div>
        <p className="ci-hint">Kéo ảnh để chọn vùng hiển thị, dùng thanh trượt để phóng to.</p>
        <div
          ref={frameRef}
          className="ci-adjust-frame"
          style={{ borderRadius: radius, aspectRatio: aspect }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <div
            className="ci-adjust-img"
            style={{
              backgroundImage: `url('${url}')`,
              backgroundPosition: `${adj.x}% ${adj.y}%`,
              backgroundSize: `${Math.round(adj.scale * 100)}%`,
            }}
          />
        </div>
        <label className="ci-adjust-zoom">
          <ZoomIn size={16} />
          <input
            type="range" min={1} max={3} step={0.05}
            value={adj.scale}
            onChange={(e) => setAdj((a) => ({ ...a, scale: Number(e.target.value) }))}
          />
          <span>{adj.scale.toFixed(1)}x</span>
        </label>
        <div className="ci-modal__foot">
          <button type="button" className="ci-btn ci-btn--ghost" onClick={onClose}>Huỷ</button>
          <button type="button" className="ci-btn ci-btn--primary" onClick={() => { onApply(adj); onClose(); }}>Áp dụng</button>
        </div>
      </div>
    </div>
  );
}

function clamp(v: number) { return Math.max(0, Math.min(100, v)); }
