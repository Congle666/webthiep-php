/** Layout LÂU ĐÀI XANH — cover xanh rừng #3A5A2C, header khung cảnh lâu đài watercolor (chateau + mây + cây = decoration), tên cặp đôi script + WELCOME TO OUR WEDDING + ornament. */
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { DecorationLayer } from '../DecorationLayer';
import type { DecoConfig } from '../decorations';
import type { CoverProps, HeaderProps } from './types';
import { useI18n } from '../i18n';
import './laudai.css';

function fmtShort(d: string | null): string {
  if (!d) return '';
  const dt = new Date(d.replace(' ', 'T'));
  return `${dt.getDate()} tháng ${dt.getMonth() + 1}, ${dt.getFullYear()}`;
}

function LaudaiCover({ inv, guestName, onOpen, decorations, inline, editable, onDecoChange, selectedId, onSelect, lang = 'vi' }: CoverProps) {
  const t = useI18n(lang);
  return (
    <motion.div className={`ldx-gate ${inline ? 'ldx-gate--inline' : ''}`}
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <div className="ldx-gate-card">
        {(decorations || editable) && (
          <DecorationLayer editable={!!editable} value={decorations ?? []} onChange={onDecoChange}
            selectedId={selectedId} onSelect={onSelect} />
        )}

        <div className="ldx-badge"><Heart size={16} fill="#fff" strokeWidth={0} /></div>

        <div className="ldx-gate-content">
          <h1 className="ldx-name">{inv.brideName}</h1>
          <span className="ldx-amp">&</span>
          <h1 className="ldx-name">{inv.groomName}</h1>

          <div className="ldx-divider" />
          <p className="ldx-date">{fmtShort(inv.weddingDate)}</p>

          <p className="ldx-invite">{t.coverInvite}</p>
          {guestName && <div className="ldx-guest">{guestName}</div>}
          <p className="ldx-sub">{t.coverSub}</p>

          <button className="ldx-open-btn" onClick={onOpen}>{t.coverOpen}</button>
        </div>
      </div>
    </motion.div>
  );
}

function LaudaiHeader({ inv, editMode, decorations, onDecoChange, selectedId, onSelect }: HeaderProps) {
  // Khung cảnh (lâu đài/mây/cây) = decoration zone body, % toàn trang, kéo-thả được.
  const bodyDecos = (decorations ?? []).filter((d) => (d.zone ?? 'body') !== 'cover');
  const onBodyChange = onDecoChange ? (next: DecoConfig[]) => onDecoChange(next) : undefined;

  return (
    <>
      <header className="ldx-header">
        {/* WELCOME + ornament + divider — Ở TRÊN tên (giống ChungĐôi).
            ornament/divider là ảnh nhưng đặt trong header (phần cố định trên cùng).
            Vị trí khung cảnh (lâu đài/mây/cây) kéo-thả được qua DecorationLayer bên dưới. */}
        <div className="ldx-welcome">
          <img className="ldx-ornament" src="/invitation/laudai/ornament.webp" alt="" aria-hidden />
          <div className="ldx-welcome-row">
            <img className="ldx-arrow ldx-arrow--l" src="/invitation/laudai/divider-arrow.webp" alt="" aria-hidden />
            <span className="ldx-welcome-text">WELCOME TO OUR WEDDING</span>
            <img className="ldx-arrow ldx-arrow--r" src="/invitation/laudai/divider-arrow.webp" alt="" aria-hidden />
          </div>
        </div>

        {/* Tên cặp đôi script — DƯỚI welcome, z=30 luôn trên khung cảnh */}
        <div className="ldx-names">
          <h1 className="ldx-name ldx-name--header">{inv.groomName}</h1>
          <span className="ldx-amp">&</span>
          <h1 className="ldx-name ldx-name--header">{inv.brideName}</h1>
        </div>
      </header>

      {/* Khung cảnh lâu đài (decoration) phủ TOÀN trang — tọa độ % theo inv-root */}
      <div className="inv-deco-root">
        <DecorationLayer editable={editMode} value={bodyDecos} onChange={onBodyChange}
          selectedId={selectedId} onSelect={onSelect} />
      </div>
    </>
  );
}

export const laudai = { Cover: LaudaiCover, Header: LaudaiHeader };
