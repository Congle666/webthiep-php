/** Phần thân thiệp dùng CHUNG cho mọi layout (traditional, floral...). */
import { motion } from 'framer-motion';
import { MapPin, Clock, CalendarPlus } from 'lucide-react';
import type { Invitation as Inv } from './types';
import { useCountdown } from './useCountdown';
import { WeddingCalendar } from './WeddingCalendar';
import { GiftQR } from './GiftQR';
import { RsvpForm, GuestbookForm } from './InvitationForms';

const reveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

function fmtDate(d: string | null) {
  if (!d) return { full: '', day: '', month: '', year: '', time: '', dow: '' };
  const dt = new Date(d.replace(' ', 'T'));
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return {
    full: `Ngày ${dt.getDate()} tháng ${dt.getMonth() + 1} năm ${dt.getFullYear()}`,
    day: String(dt.getDate()).padStart(2, '0'),
    month: String(dt.getMonth() + 1).padStart(2, '0'),
    year: String(dt.getFullYear()),
    time: `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`,
    dow: days[dt.getDay()],
  };
}

function hhmm(d: string | null): string {
  if (!d) return '';
  const dt = new Date(d.replace(' ', 'T'));
  return `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
}

/** Link "Thêm vào Google Calendar". */
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
}

export function InvitationBody({ inv, slug }: Props) {
  const cd = useCountdown(inv.weddingDate ?? null);
  const date = fmtDate(inv.weddingDate);
  const s = inv.settings ?? {};
  const gf = inv.groomFamily ?? {};
  const bf = inv.brideFamily ?? {};
  const gallery = inv.gallery ?? [];
  const hasQr = inv.bankGroom?.account || inv.bankBride?.account || inv.giftQrGroom || inv.giftQrBride;

  return (
    <>
      {/* ===== THÔNG TIN LỄ CƯỚI ===== */}
      <motion.section className="inv-section" {...reveal}>
        <h2 className="inv-h2">THÔNG TIN LỄ CƯỚI</h2>
        <div className="inv-mini-divider" />
        <div className="inv-family-grid">
          <div className="inv-family">
            <span className="inv-family-label">Chú Rể</span>
            <p className="inv-family-name">{inv.groomName}</p>
            {gf.father && <p>Ông: {gf.father}</p>}
            {gf.mother && <p>Bà: {gf.mother}</p>}
            {gf.address && <p className="inv-family-addr">{gf.address}</p>}
          </div>
          <div className="inv-family">
            <span className="inv-family-label">Cô Dâu</span>
            <p className="inv-family-name">{inv.brideName}</p>
            {bf.father && <p>Ông: {bf.father}</p>}
            {bf.mother && <p>Bà: {bf.mother}</p>}
            {bf.address && <p className="inv-family-addr">{bf.address}</p>}
          </div>
        </div>
      </motion.section>

      {/* ===== TÊN CÔ DÂU CHÚ RỂ ===== */}
      <motion.section className="inv-section inv-couple" {...reveal}>
        <p className="inv-couple-pre">TRÂN TRỌNG BÁO TIN<br/>LỄ THÀNH HÔN CỦA CHÚNG TÔI</p>
        <h1 className="inv-couple-name">{inv.groomName}</h1>
        <span className="inv-couple-cap">CHÚ RỂ</span>
        <span className="inv-couple-amp">&</span>
        <h1 className="inv-couple-name">{inv.brideName}</h1>
        <span className="inv-couple-cap">CÔ DÂU</span>
      </motion.section>

      {/* ===== THỜI GIAN ===== */}
      <motion.section className="inv-section inv-time" {...reveal}>
        <p className="inv-time-pre">TIỆC CƯỚI SẼ DIỄN RA VÀO LÚC:</p>
        <div className="inv-time-hour">{date.time}</div>
        <div className="inv-time-dmy">
          <div className="inv-time-col"><span className="inv-time-label">{date.dow}</span></div>
          <div className="inv-time-big"><span className="inv-time-num">{date.day}</span></div>
          <div className="inv-time-col"><span className="inv-time-label">THÁNG {date.month}</span></div>
        </div>
        {inv.receptionTime && (
          <div className="inv-two-time">
            <div><span className="inv-tt-label">ĐÓN KHÁCH</span><span className="inv-tt-val">{hhmm(inv.receptionTime)}</span></div>
            <div><span className="inv-tt-label">KHAI TIỆC</span><span className="inv-tt-val">{date.time}</span></div>
          </div>
        )}
      </motion.section>

      {/* ===== LỊCH THÁNG ===== */}
      <motion.section className="inv-section" {...reveal}>
        <WeddingCalendar date={inv.weddingDate} />
        <a className="inv-gcal" href={gcalUrl(inv)} target="_blank" rel="noreferrer"><CalendarPlus size={14} /> Thêm vào lịch</a>
      </motion.section>

      {/* ===== COUNTDOWN ===== */}
      {s.countdown !== false && !cd.isPast && (
        <motion.section className="inv-section inv-countdown" {...reveal}>
          <h2 className="inv-h2"><Clock size={18} /> Đếm ngược</h2>
          <div className="inv-countdown-grid">
            {[['Ngày', cd.days], ['Giờ', cd.hours], ['Phút', cd.minutes], ['Giây', cd.seconds]].map(([l, v]) => (
              <div className="inv-cd-box" key={l as string}>
                <span className="inv-cd-num">{String(v).padStart(2, '0')}</span><span className="inv-cd-label">{l}</span>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ===== ĐỊA ĐIỂM ===== */}
      <motion.section className="inv-section" {...reveal}>
        <h2 className="inv-h2">TIỆC CƯỚI SẼ TỔ CHỨC TẠI</h2>
        <div className="inv-mini-divider" />
        {inv.venueName && <p className="inv-venue-name">{inv.venueName}</p>}
        {inv.venueAddress && <p className="inv-venue-addr">{inv.venueAddress}</p>}
        {inv.mapUrl && (
          <a className="inv-map-link" href={inv.mapUrl} target="_blank" rel="noreferrer"><MapPin size={15} /> Mở bản đồ</a>
        )}
      </motion.section>

      {/* ===== ALBUM ===== */}
      {gallery.length > 0 && (
        <motion.section className="inv-section inv-album" {...reveal}>
          <h2 className="inv-h2">ALBUM ẢNH CƯỚI</h2>
          <div className="inv-mini-divider" />
          <div className="inv-album-grid">
            {gallery.map((src, i) => (
              <div key={i} className="inv-album-item" style={{ backgroundImage: `url('${src}')` }} role="img" aria-label={`Ảnh cưới ${i + 1}`} />
            ))}
          </div>
        </motion.section>
      )}

      {/* ===== QR MỪNG CƯỚI ===== */}
      {hasQr && (
        <motion.section className="inv-section" {...reveal}>
          <h2 className="inv-h2">QR MỪNG CƯỚI</h2>
          <div className="inv-mini-divider" />
          <div className="inv-qr-grid">
            <GiftQR label={`Chú Rể${inv.groomName ? ' - ' + inv.groomName : ''}`} bank={inv.bankGroom ?? {}} fallbackImg={inv.giftQrGroom} />
            <GiftQR label={`Cô Dâu${inv.brideName ? ' - ' + inv.brideName : ''}`} bank={inv.bankBride ?? {}} fallbackImg={inv.giftQrBride} />
          </div>
        </motion.section>
      )}

      {/* ===== RSVP ===== */}
      {s.rsvp !== false && (
        <motion.section className="inv-section" {...reveal}>
          <h2 className="inv-h2">XÁC NHẬN THAM DỰ</h2>
          <div className="inv-mini-divider" />
          <RsvpForm slug={slug} />
        </motion.section>
      )}

      {/* ===== SỔ LƯU BÚT ===== */}
      {s.guestbook !== false && (
        <motion.section className="inv-section" {...reveal}>
          <h2 className="inv-h2">SỔ LƯU BÚT</h2>
          <div className="inv-mini-divider" />
          <GuestbookForm slug={slug} initial={inv.guestbook ?? []} />
        </motion.section>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="inv-footer">
        <p>Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi.</p>
        <p className="inv-footer-brand">Thiệp tạo bởi JunTech</p>
      </footer>
    </>
  );
}
