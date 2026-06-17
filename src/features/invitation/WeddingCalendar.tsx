/** Lịch tháng cưới — highlight ngày cưới bằng trái tim đỏ. */
import { Heart } from 'lucide-react';

const DOW = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export function WeddingCalendar({ date }: { date: string | null }) {
  if (!date) return null;
  const dt = new Date(date.replace(' ', 'T'));
  const year = dt.getFullYear();
  const month = dt.getMonth();
  const weddingDay = dt.getDate();

  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="inv-cal">
      <div className="inv-cal-title">Tháng {month + 1}, {year}</div>
      <div className="inv-cal-grid">
        {DOW.map((d) => <span key={d} className="inv-cal-dow">{d}</span>)}
        {cells.map((d, i) => (
          <span key={i} className={`inv-cal-day ${d === weddingDay ? 'inv-cal-day--wed' : ''} ${d === null ? 'inv-cal-day--empty' : ''}`}>
            {d === weddingDay ? <Heart className="inv-cal-heart" size={28} /> : null}
            <span className="inv-cal-num">{d ?? ''}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
