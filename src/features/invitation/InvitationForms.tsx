/** Form RSVP + Sổ lưu bút cho thiệp sống. Tách riêng để giữ page gọn. */
import { useState, FormEvent } from 'react';
import { Send, Check, Heart } from 'lucide-react';
import { invitationApi } from '../../api/client';
import type { GuestbookEntry } from './types';
import type { InvI18n } from './i18n';

export function RsvpForm({ slug, t, guestToken, defaultName }: { slug: string; t: InvI18n; guestToken?: string | null; defaultName?: string }) {
  const [name, setName] = useState(defaultName ?? '');
  const [attendance, setAttendance] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErr(t.rsvpErrName); return; }
    setLoading(true); setErr('');
    const res = await invitationApi.rsvp(slug, {
      guest_name: name.trim(), attendance, guest_count: count, message: message.trim() || undefined,
      token: guestToken ?? undefined,
    });
    setLoading(false);
    if (res.success) setDone(true);
    else setErr(res.message ?? t.rsvpErrGeneric);
  };

  if (done) {
    return (
      <div className="inv-form-success">
        <Check size={36} />
        <p>{t.rsvpSuccess}<br />{t.rsvpSuccessSub}</p>
      </div>
    );
  }

  return (
    <form className="inv-form" onSubmit={submit}>
      <input className="inv-input" placeholder={t.rsvpNamePlaceholder} value={name}
        onChange={(e) => setName(e.target.value)} aria-label={t.rsvpNamePlaceholder} />

      <div className="inv-radio-row">
        {([['yes', t.rsvpAttendYes], ['maybe', t.rsvpAttendMaybe], ['no', t.rsvpAttendNo]] as const).map(([v, label]) => (
          <button type="button" key={v}
            className={`inv-radio ${attendance === v ? 'inv-radio--active' : ''}`}
            onClick={() => setAttendance(v)}>
            {label}
          </button>
        ))}
      </div>

      {attendance !== 'no' && (
        <div className="inv-count">
          <label>{t.rsvpGuestCount}</label>
          <input type="number" min={1} max={20} value={count}
            onChange={(e) => setCount(Math.max(1, +e.target.value || 1))} className="inv-input inv-input--sm" />
        </div>
      )}

      <textarea className="inv-input" rows={2} placeholder={t.rsvpMessagePlaceholder}
        value={message} onChange={(e) => setMessage(e.target.value)} aria-label={t.rsvpMessagePlaceholder} />

      {err && <p className="inv-form-err">{err}</p>}
      <button className="inv-submit" disabled={loading}>
        {loading ? t.rsvpSubmitting : <>{t.rsvpSubmit} <Send size={15} /></>}
      </button>
    </form>
  );
}

export function GuestbookForm({ slug, initial, t }: { slug: string; initial: GuestbookEntry[]; t: InvI18n }) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initial);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) { setErr(t.guestbookErrFields); return; }
    setLoading(true); setErr('');
    const res = await invitationApi.guestbook(slug, { guest_name: name.trim(), message: message.trim() });
    setLoading(false);
    if (res.success) {
      setEntries([{ guest_name: name.trim(), message: message.trim(), created_at: t.guestbookJustNow }, ...entries]);
      setName(''); setMessage('');
    } else setErr(res.message ?? t.guestbookErrGeneric);
  };

  return (
    <div className="inv-guestbook">
      <form className="inv-form" onSubmit={submit}>
        <input className="inv-input" placeholder={t.guestbookNamePlaceholder} value={name}
          onChange={(e) => setName(e.target.value)} aria-label={t.guestbookNamePlaceholder} />
        <textarea className="inv-input" rows={2} placeholder={t.guestbookMsgPlaceholder}
          value={message} onChange={(e) => setMessage(e.target.value)} aria-label={t.guestbookMsgPlaceholder} />
        {err && <p className="inv-form-err">{err}</p>}
        <button className="inv-submit" disabled={loading}>
          {loading ? t.guestbookSubmitting : <>{t.guestbookSubmit} <Heart size={15} /></>}
        </button>
      </form>

      <div className="inv-wishes">
        {entries.length === 0 && <p className="inv-wishes-empty">{t.guestbookEmpty}</p>}
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
