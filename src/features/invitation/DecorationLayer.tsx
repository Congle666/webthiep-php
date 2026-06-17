/**
 * Lớp ảnh trang trí (rồng/phượng/hoa/song hỷ) — lớp KÉO-THẢ thuần.
 * - Bình thường: render theo config (pointer-events none, nằm sau chữ).
 * - editable: kéo chuột để di chuyển; chọn ảnh báo ra ngoài qua onSelect.
 * - Khi kéo có ĐƯỜNG GIÓNG (snap) căn giữa ngang/dọc giống Canva.
 * Bảng chỉnh slider được nâng ra component cha (AdminDesigner).
 * Controlled khi truyền `value` + `onChange`. Public ?edit: dùng nội bộ + lưu localStorage.
 *
 * Toạ độ: top/left tính theo % HỘP của chính lớp này (getBoundingClientRect).
 * Trong admin, lớp edit vẫn khớp đúng hộp như live (header / gate-card) nên live không đổi.
 */
import { useEffect, useRef, useState, CSSProperties } from 'react';
import { DecoConfig, loadDecorations, saveDecorations } from './decorations';
import './DecorationLayer.css';

const SNAP = 2; // ngưỡng hút (% so với hộp lớp)

function decoStyle(d: DecoConfig, editable: boolean): CSSProperties {
  return {
    position: 'absolute',
    top: `${d.top}%`,
    left: `${d.left}%`,
    width: `${d.width}%`,
    transform: `rotate(${d.rotate}deg) scaleX(${d.flip ? -1 : 1})`,
    zIndex: d.z,
    opacity: d.opacity,
    pointerEvents: editable ? 'auto' : 'none',
    cursor: editable ? 'move' : 'default',
  };
}

interface DecorationLayerProps {
  editable: boolean;
  value?: DecoConfig[];
  onChange?: (list: DecoConfig[]) => void;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
}

export function DecorationLayer({ editable, value, onChange, selectedId, onSelect }: DecorationLayerProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<DecoConfig[]>(() => value ?? loadDecorations());
  const list = controlled ? (value as DecoConfig[]) : internal;
  const [internalSel, setInternalSel] = useState<string | null>(null);
  const sel = selectedId !== undefined ? selectedId : internalSel;
  const layerRef = useRef<HTMLDivElement>(null);
  const [guides, setGuides] = useState<{ v: boolean; h: boolean }>({ v: false, h: false });

  const listRef = useRef(list);
  listRef.current = list;

  const commit = (next: DecoConfig[]) => {
    if (onChange) onChange(next);
    if (!controlled) setInternal(next);
  };

  const select = (id: string | null) => {
    if (onSelect) onSelect(id);
    if (selectedId === undefined) setInternalSel(id);
  };

  const update = (id: string, patch: Partial<DecoConfig>) =>
    commit(listRef.current.map((d) => (d.id === id ? { ...d, ...patch } : d)));

  useEffect(() => {
    if (editable && !controlled && !onChange) saveDecorations(internal);
  }, [internal, editable, controlled, onChange]);

  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; w: number } | null>(null);

  const onDown = (e: React.MouseEvent, id: string) => {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    select(id);
    const d = listRef.current.find((x) => x.id === id);
    if (!d) return;
    drag.current = { id, sx: e.clientX, sy: e.clientY, ox: d.left, oy: d.top, w: d.width };

    const move = (ev: MouseEvent) => {
      const g = drag.current;
      if (!g || !layerRef.current) return;
      const rect = layerRef.current.getBoundingClientRect();
      const dx = ((ev.clientX - g.sx) / rect.width) * 100;
      const dy = ((ev.clientY - g.sy) / rect.height) * 100;
      // Cho ảnh TRÀN ra ngoài nhưng luôn còn >= KEEP_FRAC thân ảnh trong khung.
      // Cận tính theo CHÍNH bề rộng/cao của ảnh (không phải % trang) -> không bị nhảy.
      const KEEP_FRAC = 0.35;
      const hImg = (g.w * rect.width) / rect.height; // chiều cao ảnh quy ra % của hộp
      let left = Math.max(-g.w * (1 - KEEP_FRAC), Math.min(100 - g.w * KEEP_FRAC, g.ox + dx));
      let top = Math.max(-hImg * (1 - KEEP_FRAC), Math.min(100 - hImg * KEEP_FRAC, g.oy + dy));
      // snap tâm (Canva-style)
      const showV = Math.abs(left + g.w / 2 - 50) <= SNAP;
      if (showV) left = 50 - g.w / 2;
      const showH = Math.abs(top + hImg / 2 - 50) <= SNAP;
      if (showH) top = 50 - hImg / 2;
      setGuides({ v: showV, h: showH });
      update(g.id, { left: +left.toFixed(1), top: +top.toFixed(1) });
    };
    const up = () => {
      drag.current = null;
      setGuides({ v: false, h: false });
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  return (
    <div ref={layerRef} className={`deco-layer ${editable ? 'deco-layer--edit' : ''}`}>
      {editable && guides.v && <span className="deco-guide deco-guide--v" aria-hidden />}
      {editable && guides.h && <span className="deco-guide deco-guide--h" aria-hidden />}
      {list.map((d) => (
        <img
          key={d.id} src={d.src} alt="" aria-hidden
          className={`deco-img ${editable ? 'deco-img--edit' : ''} ${sel === d.id ? 'deco-img--sel' : ''}`}
          style={decoStyle(d, editable)}
          onMouseDown={(e) => onDown(e, d.id)}
          draggable={false}
        />
      ))}
    </div>
  );
}
