/** Layout VÂN SƠN — tranh thủy mặc Á Đông. Cover + header phủ ảnh sơn thủy, tên đè vùng trời mờ. */
import { motion } from 'framer-motion';
import { DecorationLayer } from '../DecorationLayer';
import type { DecoConfig } from '../decorations';
import type { CoverProps, HeaderProps } from './types';
import { useI18n } from '../i18n';
import './vanson.css';

function fmtShort(d: string | null): string {
  if (!d) return '';
  const dt = new Date(d.replace(' ', 'T'));
  return `${dt.getDate()} tháng ${dt.getMonth() + 1}, ${dt.getFullYear()}`;
}

function VansonCover({ inv, guestName, onOpen, decorations, inline, editable, onDecoChange, selectedId, onSelect, lang = 'vi' }: CoverProps) {
  const t = useI18n(lang);
  return (
    <motion.div className={`vsn-gate ${inline ? 'vsn-gate--inline' : ''}`}
      initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.15 }} transition={{ duration: 0.8, ease: 'easeInOut' }}>
      <div className="vsn-gate-card">
        {/* Ảnh sơn thủy phủ nền bìa */}
        <div className="vsn-gate-bg" />
        {(decorations || editable) && (
          <DecorationLayer editable={!!editable} value={decorations ?? []} onChange={onDecoChange}
            selectedId={selectedId} onSelect={onSelect} />
        )}

        <div className="vsn-gate-content">
          <p className="vsn-invite-top">{t.coverInvite}</p>
          <h1 className="vsn-name">{inv.brideName}</h1>
          <span className="vsn-amp">&</span>
          <h1 className="vsn-name">{inv.groomName}</h1>
          <div className="vsn-divider" />
          <p className="vsn-date">{fmtShort(inv.weddingDate)}</p>
          {guestName && <div className="vsn-guest">{guestName}</div>}
          <button className="vsn-open-btn" onClick={onOpen}>{t.coverOpen}</button>
        </div>
      </div>
    </motion.div>
  );
}

function VansonHeader({ inv, editMode, decorations, onDecoChange, selectedId, onSelect }: HeaderProps) {
  const bodyDecos = (decorations ?? []).filter((d) => (d.zone ?? 'body') !== 'cover');
  const onBodyChange = onDecoChange ? (next: DecoConfig[]) => onDecoChange(next) : undefined;

  return (
    <>
      <header className="vsn-header">
        {/* Ảnh sơn thủy phủ nền header */}
        <div className="vsn-header-bg" />
        <div className="vsn-names">
          <p className="vsn-welcome">WELCOME TO OUR WEDDING</p>
          <h1 className="vsn-name vsn-name--header">{inv.groomName}</h1>
          <span className="vsn-amp">&</span>
          <h1 className="vsn-name vsn-name--header">{inv.brideName}</h1>
        </div>
      </header>

      {/* Họa tiết (hạc...) phủ toàn trang — kéo-thả được */}
      <div className="inv-deco-root">
        <DecorationLayer editable={editMode} value={bodyDecos} onChange={onBodyChange}
          selectedId={selectedId} onSelect={onSelect} />
      </div>
    </>
  );
}

export const vanson = { Cover: VansonCover, Header: VansonHeader };
