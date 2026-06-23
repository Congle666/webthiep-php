/** Layout FLORAL — cover xanh ô-liu + hoa mộc lan, header khung hoa oval. */
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { DecorationLayer } from '../DecorationLayer';
import type { CoverProps, HeaderProps } from './types';
import { useI18n } from '../i18n';
import './floral.css';

const FRAME = '/invitation/floral/frame-flower.webp';

function fmtShort(d: string | null): string {
  if (!d) return '';
  const dt = new Date(d.replace(' ', 'T'));
  return `${dt.getDate()} tháng ${dt.getMonth() + 1}, ${dt.getFullYear()}`;
}

function FloralCover({ inv, guestName, onOpen, decorations, inline, editable, onDecoChange, selectedId, onSelect, lang = 'vi' }: CoverProps) {
  const t = useI18n(lang);
  return (
    <motion.div className={`flr-gate ${inline ? 'flr-gate--inline' : ''}`}
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <span className="flr-dot flr-dot--1" aria-hidden />
      <span className="flr-dot flr-dot--2" aria-hidden />
      <span className="flr-dot flr-dot--3" aria-hidden />
      <span className="flr-dot flr-dot--4" aria-hidden />

      <div className="flr-gate-card">
        {(decorations || editable) && (
          <DecorationLayer editable={!!editable} value={decorations ?? []} onChange={onDecoChange}
            selectedId={selectedId} onSelect={onSelect} />
        )}

        <div className="flr-badge"><Heart size={16} fill="#fff" strokeWidth={0} /></div>

        <div className="flr-gate-content">
          <h1 className="flr-name">{inv.brideName}</h1>
          <span className="flr-amp">&</span>
          <h1 className="flr-name">{inv.groomName}</h1>

          <div className="flr-divider" />
          <p className="flr-date">{fmtShort(inv.weddingDate)}</p>

          <p className="flr-invite">{t.coverInvite}</p>
          {guestName && <div className="flr-guest">{guestName}</div>}
          <p className="flr-sub">{t.coverSub}</p>

          <button className="flr-open-btn" onClick={onOpen}>{t.coverOpen}</button>
        </div>
      </div>
    </motion.div>
  );
}

function FloralHeader({ inv, editMode, decorations, onDecoChange, selectedId, onSelect }: HeaderProps) {
  return (
    <>
      <header className="flr-header">
        <div className="flr-frame" style={{ backgroundImage: `url('${FRAME}')` }}>
          <div className="flr-frame-inner">
            <span className="flr-frame-label">THE WEDDING OF</span>
            <h1 className="flr-frame-name">{inv.brideName}</h1>
            <span className="flr-frame-amp">&</span>
            <h1 className="flr-frame-name">{inv.groomName}</h1>
          </div>
        </div>
      </header>
      <div className="inv-deco-root">
        <DecorationLayer editable={editMode} value={decorations} onChange={onDecoChange}
          selectedId={selectedId} onSelect={onSelect} />
      </div>
    </>
  );
}

export const floral = { Cover: FloralCover, Header: FloralHeader };
