/** Phần thân thiệp dùng CHUNG cho mọi layout (traditional, floral...). */
import { motion } from 'framer-motion';
import { MapPin, Clock, CalendarPlus } from 'lucide-react';
import type { Invitation as Inv } from './types';
import { useCountdown } from './useCountdown';
import { WeddingCalendar } from './WeddingCalendar';
import { GiftQR } from './GiftQR';
import { RsvpForm, GuestbookForm } from './InvitationForms';
import type { InvI18n } from './i18n';
import { splitBi } from './i18n';

/** Render text song ngữ thành 2 dòng: primary (to) + secondary (nhỏ, mờ). */
function BiLine({ text, className }: { text: string; className?: string }) {
  const { primary, secondary } = splitBi(text);
  if (!secondary) return <span className={className}>{primary}</span>;
  return (
    <span className={`inv-biline ${className ?? ''}`}>
      <span className="inv-biline__pri">{primary}</span>
      <span className="inv-biline__sec">{secondary}</span>
    </span>
  );
}

const revealAnim = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};
const revealNone = {};

type LangKey = 'vi' | 'en' | 'zh' | 'ko' | 'ja' | 'fr';

function fmtDate(d: string | null, lang: LangKey = 'vi') {
  if (!d) return { full: '', day: '', month: '', year: '', time: '', dow: '' };
  const dt = new Date(d.replace(' ', 'T'));

  const dowMap: Record<LangKey, string[]> = {
    vi: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    ko: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    ja: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
    fr: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  };

  return {
    full: `${dt.getDate()} tháng ${dt.getMonth() + 1} năm ${dt.getFullYear()}`,
    day: String(dt.getDate()).padStart(2, '0'),
    month: String(dt.getMonth() + 1).padStart(2, '0'),
    year: String(dt.getFullYear()),
    time: `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`,
    dow: (dowMap[lang] ?? dowMap.vi)[dt.getDay()],
  };
}

function hhmm(d: string | null): string {
  if (!d) return '';
  const dt = new Date(d.replace(' ', 'T'));
  return `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
}

function gcalUrl(inv: Inv): string {
  if (!inv.weddingDate) return '#';
  const start = new Date(inv.weddingDate.replace(' ', 'T'));
  const end = new Date(start.getTime() + 3 * 3600000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const text = encodeURIComponent(`Đám cưới ${inv.groomName} & ${inv.brideName}`);
  const loc = encodeURIComponent(inv.venueAddress ?? inv.venueName ?? '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${fmt(start)}/${fmt(end)}&location=${loc}`;
}

interface Props {
  inv: Inv;
  slug: string;
  t: InvI18n;
  staticMode?: boolean;
}

export function InvitationBody({ inv, slug, t, staticMode }: Props) {
  const reveal = staticMode ? revealNone : revealAnim;
  const cd = useCountdown(inv.weddingDate ?? null);
  const date = fmtDate(inv.weddingDate, 'vi');
  const s = inv.settings ?? {};
  const gf = inv.groomFamily ?? {};
  const bf = inv.brideFamily ?? {};
  const gallery = inv.gallery ?? [];
  const hasQr = inv.bankGroom?.account || inv.bankBride?.account || inv.giftQrGroom || inv.giftQrBride;
  const ex = inv.extra ?? {};
  const vis = ex.visible ?? {};
  const show = (k: keyof NonNullable<typeof vis>) => vis[k] !== false;
  const schedule = ex.schedule ?? [];
  const dress = ex.dressCode;

  return (
    <>
      {/* ===== ẢNH ĐÔI ===== */}
      {show('couplePhoto') && (ex.groomPhoto || ex.bridePhoto) && (
        <motion.section className="inv-section inv-couplephoto" {...reveal}>
          <div className="inv-couplephoto-grid">
            <div className="inv-cp-item">
              <div className="inv-cp-img" style={ex.groomPhoto ? { backgroundImage: `url('${ex.groomPhoto}')` } : undefined} role="img" aria-label={t.groomTitle} />
              <span className="inv-cp-cap">{ex.groomTitle || t.groomTitle}</span>
              <span className="inv-cp-name">{inv.groomName}</span>
            </div>
            <div className="inv-cp-item">
              <div className="inv-cp-img" style={ex.bridePhoto ? { backgroundImage: `url('${ex.bridePhoto}')` } : undefined} role="img" aria-label={t.brideTitle} />
              <span className="inv-cp-cap">{ex.brideTitle || t.brideTitle}</span>
              <span className="inv-cp-name">{inv.brideName}</span>
            </div>
          </div>
        </motion.section>
      )}

      {/* ===== LỜI MỞ ĐẦU ===== */}
      {show('intro') && ex.intro && (
        <motion.section className="inv-section inv-intro" {...reveal}>
          <p className="inv-intro-text">{ex.intro}</p>
        </motion.section>
      )}

      {/* ===== THÔNG TIN LỄ CƯỚI ===== */}
      {show('family') && (
        <motion.section className="inv-section" {...reveal}>
          <h2 className="inv-h2"><BiLine text={t.familyTitle} /></h2>
          <div className="inv-mini-divider" />
          <div className="inv-family-grid">
            <div className="inv-family">
              <span className="inv-family-label"><BiLine text={t.groomSide} /></span>
              {gf.title && <p className="inv-family-title">{gf.title}</p>}
              {gf.father && <p>{gf.father}</p>}
              {gf.mother && <p>{gf.mother}</p>}
              {gf.address && <p className="inv-family-addr">{gf.address}</p>}
            </div>
            <div className="inv-family">
              <span className="inv-family-label"><BiLine text={t.brideSide} /></span>
              {bf.title && <p className="inv-family-title">{bf.title}</p>}
              {bf.father && <p>{bf.father}</p>}
              {bf.mother && <p>{bf.mother}</p>}
              {bf.address && <p className="inv-family-addr">{bf.address}</p>}
            </div>
          </div>
        </motion.section>
      )}

      {/* ===== TÊN CÔ DÂU CHÚ RỂ ===== */}
      <motion.section className="inv-section inv-couple" {...reveal}>
        {t.coupleAnnounce.split('\n').map((line, i) => (
          <p key={i} className="inv-couple-pre"><BiLine text={line} /></p>
        ))}
        <h1 className="inv-couple-name">{inv.groomName}</h1>
        <span className="inv-couple-cap"><BiLine text={t.groomTitle} /></span>
        <span className="inv-couple-amp">&</span>
        <h1 className="inv-couple-name">{inv.brideName}</h1>
        <span className="inv-couple-cap"><BiLine text={t.brideTitle} /></span>
      </motion.section>

      {/* ===== THỜI GIAN ===== */}
      <motion.section className="inv-section inv-time" {...reveal}>
        <p className="inv-time-pre"><BiLine text={t.ceremonyAt} />:</p>
        <div className="inv-time-hour">{date.time}</div>
        <div className="inv-time-dmy">
          <div className="inv-time-col"><span className="inv-time-label">{date.dow}</span></div>
          <div className="inv-time-big"><span className="inv-time-num">{date.day}</span></div>
          <div className="inv-time-col"><span className="inv-time-label"><BiLine text={t.monthLabel} /> {date.month}</span></div>
        </div>
        {inv.receptionTime && (
          <div className="inv-two-time">
            <div><span className="inv-tt-label"><BiLine text={t.reception} /></span><span className="inv-tt-val">{hhmm(inv.receptionTime)}</span></div>
            <div><span className="inv-tt-label"><BiLine text={t.banquet} /></span><span className="inv-tt-val">{date.time}</span></div>
          </div>
        )}
      </motion.section>

      {/* ===== LỊCH THÁNG ===== */}
      <motion.section className="inv-section" {...reveal}>
        <WeddingCalendar date={inv.weddingDate} />
        <a className="inv-gcal" href={gcalUrl(inv)} target="_blank" rel="noreferrer">
          <CalendarPlus size={14} /> {t.addToCalendar}
        </a>
      </motion.section>

      {/* ===== COUNTDOWN ===== */}
      {s.countdown !== false && !cd.isPast && (
        <motion.section className="inv-section inv-countdown" {...reveal}>
          <h2 className="inv-h2"><Clock size={18} /> <BiLine text={t.countdownTitle} /></h2>
          <div className="inv-countdown-grid">
            {([[t.days, cd.days], [t.hours, cd.hours], [t.minutes, cd.minutes], [t.seconds, cd.seconds]] as [string, number][]).map(([l, v]) => (
              <div className="inv-cd-box" key={l}>
                <span className="inv-cd-num">{String(v).padStart(2, '0')}</span>
                <span className="inv-cd-label"><BiLine text={l} /></span>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ===== ĐỊA ĐIỂM ===== */}
      <motion.section className="inv-section" {...reveal}>
        <h2 className="inv-h2"><BiLine text={t.venueTitle} /></h2>
        <div className="inv-mini-divider" />
        {inv.venueName && <p className="inv-venue-name">{inv.venueName}</p>}
        {inv.venueAddress && <p className="inv-venue-addr">{inv.venueAddress}</p>}
        {inv.mapUrl && (
          <a className="inv-map-link" href={inv.mapUrl} target="_blank" rel="noreferrer">
            <MapPin size={15} /> {t.openMap}
          </a>
        )}
      </motion.section>

      {/* ===== ALBUM ===== */}
      {show('gallery') && gallery.length > 0 && (
        <motion.section className="inv-section inv-album" {...reveal}>
          <h2 className="inv-h2"><BiLine text={t.galleryTitle} /></h2>
          <div className="inv-mini-divider" />
          <div className="inv-album-grid">
            {gallery.map((src, i) => (
              <div key={i} className="inv-album-item" style={{ backgroundImage: `url('${src}')` }} role="img" aria-label={`${t.galleryTitle} ${i + 1}`} />
            ))}
          </div>
        </motion.section>
      )}

      {/* ===== DRESS CODE ===== */}
      {show('dressCode') && (dress?.note || (dress?.colors?.length ?? 0) > 0) && (
        <motion.section className="inv-section inv-dresscode" {...reveal}>
          <h2 className="inv-h2"><BiLine text={t.dressCodeTitle} /></h2>
          <div className="inv-mini-divider" />
          {dress?.note && <p className="inv-dress-note">{dress.note}</p>}
          {!!dress?.colors?.length && (
            <div className="inv-dress-colors">
              {dress.colors.map((c, i) => <span key={i} className="inv-dress-chip" style={{ background: c }} title={c} />)}
            </div>
          )}
        </motion.section>
      )}

      {/* ===== LỊCH TRÌNH NGÀY CƯỚI ===== */}
      {show('schedule') && schedule.length > 0 && (
        <motion.section className="inv-section inv-schedule" {...reveal}>
          <h2 className="inv-h2"><BiLine text={t.scheduleTitle} /></h2>
          <div className="inv-mini-divider" />
          <ul className="inv-schedule-list">
            {schedule.map((it, i) => (
              <li key={i} className="inv-schedule-item">
                <span className="inv-schedule-time">{it.time}</span>
                <span className="inv-schedule-title">{it.title}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {/* ===== QR MỪNG CƯỚI ===== */}
      {show('gift') && hasQr && (
        <motion.section className="inv-section" {...reveal}>
          <h2 className="inv-h2"><BiLine text={t.giftTitle} /></h2>
          <div className="inv-mini-divider" />
          <div className="inv-qr-grid">
            <GiftQR label={`${t.groomTitle}${inv.groomName ? ' - ' + inv.groomName : ''}`} bank={inv.bankGroom ?? {}} fallbackImg={inv.giftQrGroom} />
            <GiftQR label={`${t.brideTitle}${inv.brideName ? ' - ' + inv.brideName : ''}`} bank={inv.bankBride ?? {}} fallbackImg={inv.giftQrBride} />
          </div>
        </motion.section>
      )}

      {/* ===== RSVP ===== */}
      {s.rsvp !== false && (
        <motion.section className="inv-section" {...reveal}>
          <h2 className="inv-h2"><BiLine text={t.rsvpTitle} /></h2>
          <div className="inv-mini-divider" />
          <RsvpForm slug={slug} t={t} />
        </motion.section>
      )}

      {/* ===== SỔ LƯU BÚT ===== */}
      {s.guestbook !== false && (
        <motion.section className="inv-section" {...reveal}>
          <h2 className="inv-h2"><BiLine text={t.guestbookTitle} /></h2>
          <div className="inv-mini-divider" />
          <GuestbookForm slug={slug} initial={inv.guestbook ?? []} t={t} />
        </motion.section>
      )}

      {/* ===== LỜI CẢM ƠN ===== */}
      {show('thanks') && ex.thanks && (
        <motion.section className="inv-section inv-thanks" {...reveal}>
          <h2 className="inv-h2"><BiLine text={t.thanksTitle} /></h2>
          <div className="inv-mini-divider" />
          <p className="inv-thanks-text">{ex.thanks}</p>
        </motion.section>
      )}

      {/* ===== PHONG BÌ / LỜI MỜI ===== */}
      {show('envelope') && ex.envelope && (
        <motion.section className="inv-section inv-envelope" {...reveal}>
          <p className="inv-envelope-text">{ex.envelope}</p>
        </motion.section>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="inv-footer">
        <p>{ex.thanks || t.footerDefault}</p>
        <p className="inv-footer-brand">{t.footerBrand}</p>
      </footer>
    </>
  );
}
