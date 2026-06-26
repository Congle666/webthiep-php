/** Layout HOA MỘC XANH — cover xanh đậm #30530F, header 2 ảnh đôi nghiêng + dải bar xanh + tên, body hoa watercolor 2 bên. */
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { DecorationLayer } from '../DecorationLayer';
import type { DecoConfig } from '../decorations';
import type { CoverProps, HeaderProps } from './types';
import { useI18n } from '../i18n';
import './hoamoc.css';

function fmtShort(d: string | null): string {
  if (!d) return '';
  const dt = new Date(d.replace(' ', 'T'));
  return `${dt.getDate()} tháng ${dt.getMonth() + 1}, ${dt.getFullYear()}`;
}

function HoamocCover({ inv, guestName, onOpen, decorations, inline, editable, onDecoChange, selectedId, onSelect, lang = 'vi' }: CoverProps) {
  const t = useI18n(lang);
  return (
    <motion.div className={`hmx-gate ${inline ? 'hmx-gate--inline' : ''}`}
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <div className="hmx-gate-card">
        {(decorations || editable) && (
          <DecorationLayer editable={!!editable} value={decorations ?? []} onChange={onDecoChange}
            selectedId={selectedId} onSelect={onSelect} />
        )}

        <div className="hmx-badge"><Heart size={16} fill="#fff" strokeWidth={0} /></div>

        <div className="hmx-gate-content">
          <h1 className="hmx-name">{inv.brideName}</h1>
          <span className="hmx-amp">&</span>
          <h1 className="hmx-name">{inv.groomName}</h1>

          <div className="hmx-divider" />
          <p className="hmx-date">{fmtShort(inv.weddingDate)}</p>

          <p className="hmx-invite">{t.coverInvite}</p>
          {guestName && <div className="hmx-guest">{guestName}</div>}
          <p className="hmx-sub">{t.coverSub}</p>

          <button className="hmx-open-btn" onClick={onOpen}>{t.coverOpen}</button>
        </div>
      </div>
    </motion.div>
  );
}

function HoamocHeader({ inv, editMode, decorations, onDecoChange, selectedId, onSelect }: HeaderProps) {
  // Decoration của hoamoc ở zone body (hoa flower + dải bar, % toàn trang, kéo-thả được). Chỉ ẢNH ĐÔI là phần cố định layout.
  const bodyDecos = (decorations ?? []).filter((d) => (d.zone ?? 'body') !== 'cover');
  const onBodyChange = onDecoChange
    ? (next: DecoConfig[]) => onDecoChange(next)
    : undefined;

  const ex = inv.extra ?? {};
  const groomTitle = ex.groomShort || 'Trưởng Nam';
  const brideTitle = ex.brideShort || 'Út Nữ';
  const hasPhotos = !!(ex.groomPhoto || ex.bridePhoto);

  return (
    <>
      <header className={`hmx-header ${hasPhotos ? 'hmx-header--photos' : 'hmx-header--plain'}`}>
        {hasPhotos ? (
          <>
            {/* Hàng chú rể: ảnh trái + caption phải */}
            <div className="hmx-person hmx-person--groom">
              {ex.groomPhoto && (
                <img className="hmx-photo" src={ex.groomPhoto} alt={inv.groomName} />
              )}
              <div className="hmx-person-cap">
                <span className="hmx-person-role">{groomTitle}</span>
                <span className="hmx-name hmx-person-name">{inv.groomName}</span>
              </div>
            </div>

            {/* Khoảng trống giữa cho dải bar (bar nay là decoration kéo-thả) */}
            <div className="hmx-bar-gap" aria-hidden />

            {/* Hàng cô dâu: caption trái + ảnh phải */}
            <div className="hmx-person hmx-person--bride">
              <div className="hmx-person-cap">
                <span className="hmx-person-role">{brideTitle}</span>
                <span className="hmx-name hmx-person-name">{inv.brideName}</span>
              </div>
              {ex.bridePhoto && (
                <img className="hmx-photo" src={ex.bridePhoto} alt={inv.brideName} />
              )}
            </div>
          </>
        ) : (
          <>
            {/* Fallback không ảnh: tên gọn (bar là decoration phủ trang) */}
            <div className="hmx-names">
              <h1 className="hmx-name hmx-name--header">{inv.groomName}</h1>
              <span className="hmx-amp">&</span>
              <h1 className="hmx-name hmx-name--header">{inv.brideName}</h1>
            </div>
          </>
        )}
      </header>

      {/* Hoa flower (decoration) phủ TOÀN trang — tọa độ % theo inv-root */}
      <div className="inv-deco-root">
        <DecorationLayer editable={editMode} value={bodyDecos} onChange={onBodyChange}
          selectedId={selectedId} onSelect={onSelect} />
      </div>
    </>
  );
}

export const hoamoc = { Cover: HoamocCover, Header: HoamocHeader };
