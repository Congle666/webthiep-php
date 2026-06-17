/** Màn "Mở thiệp" — hiện đầu tiên (nền đỏ + phượng + tên khách), bấm để vào thiệp + phát nhạc. */
import { motion } from 'framer-motion';
import type { Invitation } from './types';
import { DecorationLayer } from './DecorationLayer';
import type { DecoConfig } from './decorations';

interface Props {
  inv: Invitation;
  guestName: string | null;   // tên khách từ URL ?khach=
  onOpen: () => void;
  decorations?: DecoConfig[];        // ảnh trang trí vùng bìa
  inline?: boolean;                  // render trong khung admin (position relative)
  editable?: boolean;                // cho phép kéo-thả ảnh bìa
  onDecoChange?: (list: DecoConfig[]) => void;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
}

function fmtShort(d: string | null): string {
  if (!d) return '';
  const dt = new Date(d.replace(' ', 'T'));
  return `${dt.getDate()} tháng ${dt.getMonth() + 1}, ${dt.getFullYear()}`;
}

export function CoverGate({ inv, guestName, onOpen, decorations, inline, editable, onDecoChange, selectedId, onSelect }: Props) {
  return (
    <motion.div className={`gate ${inline ? 'gate--inline' : ''}`}
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <div className="gate-card">
        {(decorations || editable) && (
          <DecorationLayer editable={!!editable} value={decorations ?? []} onChange={onDecoChange}
            selectedId={selectedId} onSelect={onSelect} />
        )}

        <div className="gate-content">
          <h1 className="gate-name">{inv.brideName}</h1>
          <span className="gate-amp">&</span>
          <h1 className="gate-name">{inv.groomName}</h1>

          <div className="gate-mini-divider" />
          <p className="gate-date">{fmtShort(inv.weddingDate)}</p>

          <p className="gate-invite">Thân Mời</p>
          {guestName && <div className="gate-guest">{guestName}</div>}
          <p className="gate-sub">đến dự buổi tiệc chung vui cùng gia đình</p>

          <button className="gate-open-btn" onClick={onOpen}>Mở thiệp</button>
        </div>
      </div>
    </motion.div>
  );
}
