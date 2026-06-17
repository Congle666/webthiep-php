/** Form RSVP + Sổ lưu bút cho thiệp sống. Tách riêng để giữ page gọn. */
import { useState, FormEvent } from 'react';
import { Send, Check, Heart } from 'lucide-react';
import { invitationApi } from '../../api/client';
import type { GuestbookEntry } from './types';

export function RsvpForm({ slug }: { slug: string }) {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Vui lòng nhập tên của bạn.'); return; }
    setLoading(true); setErr('');
    const res = await invitationApi.rsvp(slug, {
      guest_name: name.trim(), attendance, guest_count: count, message: message.trim() || undefined,
    });
    setLoading(false);
    if (res.success) setDone(true);
    else setErr(res.message ?? 'Có lỗi xảy ra, thử lại nhé.');
  };

  if (done) {
    return (
      <div className="inv-form-success">
        <Check size={36} />
        <p>Cảm ơn bạn đã xác nhận!<br />Hẹn gặp bạn trong ngày vui của chúng tôi.</p>
      </div>
    );
  }

  return (
    <form className="inv-form" onSubmit={submit}>
      <input className="inv-input" placeholder="Tên của bạn" value={name}
        onChange={(e) => setName(e.target.value)} aria-label="Tên của bạn" />

      <div className="inv-radio-row">
        {([['yes', 'Sẽ tham dự'], ['maybe', 'Chưa chắc'], ['no', 'Không thể đến']] as const).map(([v, label]) => (
          <button type="button" key={v}
            className={`inv-radio ${attendance === v ? 'inv-radio--active' : ''}`}
            onClick={() => setAttendance(v)}>
            {label}
          </button>
        ))}
      </div>

      {attendance !== 'no' && (
        <div className="inv-count">
          <label>Số người tham dự</label>
          <input type="number" min={1} max={20} value={count}
            onChange={(e) => setCount(Math.max(1, +e.target.value || 1))} className="inv-input inv-input--sm" />
        </div>
      )}

      <textarea className="inv-input" rows={2} placeholder="Lời nhắn (không bắt buộc)"
        value={message} onChange={(e) => setMessage(e.target.value)} aria-label="Lời nhắn" />

      {err && <p className="inv-form-err">{err}</p>}
      <button className="inv-submit" disabled={loading}>
        {loading ? 'Đang gửi...' : <>Xác nhận <Send size={15} /></>}
      </button>
    </form>
  );
}

export function GuestbookForm({ slug, initial }: { slug: string; initial: GuestbookEntry[] }) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initial);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) { setErr('Nhập tên và lời chúc nhé.'); return; }
    setLoading(true); setErr('');
    const res = await invitationApi.guestbook(slug, { guest_name: name.trim(), message: message.trim() });
    setLoading(false);
    if (res.success) {
      setEntries([{ guest_name: name.trim(), message: message.trim(), created_at: 'Vừa xong' }, ...entries]);
      setName(''); setMessage('');
    } else setErr(res.message ?? 'Có lỗi xảy ra.');
  };

  return (
    <div className="inv-guestbook">
      <form className="inv-form" onSubmit={submit}>
        <input className="inv-input" placeholder="Tên của bạn" value={name}
          onChange={(e) => setName(e.target.value)} aria-label="Tên của bạn" />
        <textarea className="inv-input" rows={2} placeholder="Gửi lời chúc tới cô dâu chú rể..."
          value={message} onChange={(e) => setMessage(e.target.value)} aria-label="Lời chúc" />
        {err && <p className="inv-form-err">{err}</p>}
        <button className="inv-submit" disabled={loading}>
          {loading ? 'Đang gửi...' : <>Gửi lời chúc <Heart size={15} /></>}
        </button>
      </form>

      <div className="inv-wishes">
        {entries.length === 0 && <p className="inv-wishes-empty">Hãy là người đầu tiên gửi lời chúc!</p>}
        {entries.map((w, i) => (
          <div className="inv-wish" key={i}>
            <Heart size={13} className="inv-wish-icon" />
            <div>
              <strong>{w.guest_name}</strong>
              <p>{w.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
