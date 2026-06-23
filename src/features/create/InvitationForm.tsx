/** Form chỉnh sửa thiệp — các section collapsible, mỗi section có toggle Hiện/Ẩn. */
import { useState } from 'react';
import { ChevronDown, Plus, Trash2, Globe } from 'lucide-react';
import type {
  Invitation, LoveStoryItem, ScheduleItem, InvitationExtra, SectionVisibility,
} from '../../features/invitation/types';
import ImageInput from './ImageInput';
import MusicPicker from './MusicPicker';
import { LangManager } from '../invitation/LangManager';
import { LANGS, type Lang } from '../invitation/i18n';

export type InvitationForm = Partial<Invitation>;

interface Props {
  data: InvitationForm;
  onChange: (patch: InvitationForm) => void;
  onBlurSave: () => void;
}

/** Hiển thị danh sách ngôn ngữ đã chọn dạng badge nhỏ */
function LangBadges({ langs }: { langs: Lang[] }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
      {langs.map((code, i) => {
        const meta = LANGS.find(l => l.code === code);
        return (
          <span key={code} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 9999,
            background: i === 0 ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
            color: i === 0 ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.75rem', fontWeight: 600,
          }}>
            {meta?.flag} {meta?.label}
            {i === 0 && <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>· Chính</span>}
          </span>
        );
      })}
    </div>
  );
}

/** Khoá hiện/ẩn của các section có thể bật/tắt trên thiệp sống. */
type VisKey = keyof SectionVisibility;

function Section({
  title, children, defaultOpen = false, toggle,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  toggle?: { on: boolean; onToggle: (v: boolean) => void };
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`ci-sec ${open ? 'ci-sec--open' : ''}`}>
      <div className="ci-sec__head">
        <button type="button" className="ci-sec__title" onClick={() => setOpen((o) => !o)}>
          <ChevronDown size={18} className="ci-sec__chev" />
          <span>{title}</span>
        </button>
        {toggle && (
          <label className="ci-switch" title={toggle.on ? 'Đang hiện' : 'Đang ẩn'} onClick={(e) => e.stopPropagation()}>
            <input type="checkbox" checked={toggle.on} onChange={(e) => toggle.onToggle(e.target.checked)} />
            <span className="ci-switch__track"><span className="ci-switch__thumb" /></span>
            <span className="ci-switch__text">{toggle.on ? 'Hiện' : 'Ẩn'}</span>
          </label>
        )}
      </div>
      {open && <div className="ci-sec__body">{children}</div>}
    </div>
  );
}

export default function InvitationFormFields({ data, onChange, onBlurSave }: Props) {
  const set = (k: keyof Invitation, v: any) => onChange({ [k]: v });
  const setNested = (k: 'groomFamily' | 'brideFamily' | 'bankGroom' | 'bankBride', sub: string, v: any) =>
    onChange({ [k]: { ...((data as any)[k] ?? {}), [sub]: v } });

  const extra: InvitationExtra = data.extra ?? {};
  const setExtra = (patch: Partial<InvitationExtra>) => onChange({ extra: { ...extra, ...patch } });
  const vis = extra.visible ?? {};
  const visToggle = (key: VisKey) => ({
    on: vis[key] !== false, // mặc định hiện
    onToggle: (v: boolean) => { setExtra({ visible: { ...vis, [key]: v } }); onBlurSave(); },
  });

  const [showLangManager, setShowLangManager] = useState(false);
  const currentLangs = (data.settings?.langs ?? ['vi']) as Lang[];
  const setLangs = (langs: Lang[]) => {
    onChange({ settings: { ...data.settings, langs } });
    onBlurSave();
  };

  const story = data.loveStory ?? [];
  const gallery = data.gallery ?? [];
  const schedule = extra.schedule ?? [];

  const text = (label: string, k: keyof Invitation, type = 'text') => (
    <label className="ci-field">
      <span>{label}</span>
      <input type={type} value={(data[k] as string) ?? ''} onChange={(e) => set(k, e.target.value)} onBlur={onBlurSave} />
    </label>
  );
  const extraText = (label: string, k: keyof InvitationExtra) => (
    <label className="ci-field">
      <span>{label}</span>
      <input value={(extra[k] as string) ?? ''} onChange={(e) => setExtra({ [k]: e.target.value } as any)} onBlur={onBlurSave} />
    </label>
  );
  const nestedText = (label: string, k: 'groomFamily' | 'brideFamily' | 'bankGroom' | 'bankBride', sub: string) => (
    <label className="ci-field">
      <span>{label}</span>
      <input value={((data as any)[k]?.[sub]) ?? ''} onChange={(e) => setNested(k, sub, e.target.value)} onBlur={onBlurSave} />
    </label>
  );

  return (
    <div className="ci-form">
      <Section title="Thông tin cơ bản" defaultOpen>
        <div className="ci-pair">
          {text('Họ tên chú rể', 'groomName')}
          {text('Họ tên cô dâu', 'brideName')}
        </div>
        <div className="ci-pair">
          {extraText('Tên ngắn chú rể', 'groomShort')}
          {extraText('Tên ngắn cô dâu', 'brideShort')}
        </div>
        <div className="ci-pair">
          {extraText('Danh xưng chú rể (vd: Chú rể)', 'groomTitle')}
          {extraText('Danh xưng cô dâu (vd: Cô dâu)', 'brideTitle')}
        </div>
        <span className="ci-field"><span>Thứ tự hiển thị</span></span>
        <div className="ci-pair">
          <button type="button" className={`ci-radio-btn ${!extra.brideFirst ? 'on' : ''}`} onClick={() => { setExtra({ brideFirst: false }); onBlurSave(); }}>Nhà trai trước</button>
          <button type="button" className={`ci-radio-btn ${extra.brideFirst ? 'on' : ''}`} onClick={() => { setExtra({ brideFirst: true }); onBlurSave(); }}>Nhà gái trước</button>
        </div>
        <p className="ci-hint">Hiển thị tên chú rể và nhà trai trước trên thiệp.</p>
      </Section>

      <Section title="Ảnh đôi" toggle={visToggle('couplePhoto')}>
        <p className="ci-hint">Chọn ảnh chú rể & cô dâu từ máy (hoặc dán URL).</p>
        <ImageInput label="Ảnh chú rể" value={extra.groomPhoto ?? ''} onChange={(u) => setExtra({ groomPhoto: u })} onBlurSave={onBlurSave} />
        <ImageInput label="Ảnh cô dâu" value={extra.bridePhoto ?? ''} onChange={(u) => setExtra({ bridePhoto: u })} onBlurSave={onBlurSave} />
      </Section>

      <Section title="Thông tin gia đình" toggle={visToggle('family')}>
        <strong className="ci-sub">Nhà trai</strong>
        {nestedText('Danh xưng', 'groomFamily', 'title')}
        <div className="ci-pair">
          {nestedText('Ông', 'groomFamily', 'father')}
          {nestedText('Bà', 'groomFamily', 'mother')}
        </div>
        {nestedText('Địa chỉ nhà trai', 'groomFamily', 'address')}
        <strong className="ci-sub">Nhà gái</strong>
        {nestedText('Danh xưng', 'brideFamily', 'title')}
        <div className="ci-pair">
          {nestedText('Ông', 'brideFamily', 'father')}
          {nestedText('Bà', 'brideFamily', 'mother')}
        </div>
        {nestedText('Địa chỉ nhà gái', 'brideFamily', 'address')}
      </Section>

      <Section title="Lời mở đầu thiệp" toggle={visToggle('intro')}>
        <label className="ci-field">
          <span>Lời mở đầu</span>
          <textarea rows={3} value={extra.intro ?? ''} onChange={(e) => setExtra({ intro: e.target.value })} onBlur={onBlurSave} />
        </label>
      </Section>

      <Section title="Thời gian & Tiệc cưới">
        {text('Ngày cưới', 'weddingDate', 'datetime-local')}
        {text('Giờ đón khách', 'receptionTime', 'datetime-local')}
      </Section>

      <Section title="Địa điểm">
        {text('Tên địa điểm', 'venueName')}
        {text('Địa chỉ', 'venueAddress')}
        {text('Link bản đồ (Google Maps)', 'mapUrl')}
      </Section>

      <Section title="Lời mời">
        <label className="ci-field">
          <span>Nội dung lời mời</span>
          <textarea rows={4} value={data.inviteMessage ?? ''} onChange={(e) => set('inviteMessage', e.target.value)} onBlur={onBlurSave} />
        </label>
      </Section>

      <Section title="Câu chuyện tình yêu" toggle={visToggle('story')}>
        {story.map((s, i) => (
          <div className="ci-row" key={i}>
            <input placeholder="Mốc thời gian" value={s.date} onChange={(e) => updateStory(i, { date: e.target.value })} onBlur={onBlurSave} />
            <input placeholder="Tiêu đề" value={s.title} onChange={(e) => updateStory(i, { title: e.target.value })} onBlur={onBlurSave} />
            <input placeholder="Nội dung" value={s.text} onChange={(e) => updateStory(i, { text: e.target.value })} onBlur={onBlurSave} />
            <button type="button" className="ci-icon-btn" onClick={() => removeStory(i)} aria-label="Xoá"><Trash2 size={16} /></button>
          </div>
        ))}
        <button type="button" className="ci-add" onClick={addStory}><Plus size={15} /> Thêm cột mốc</button>
      </Section>

      <Section title="Thư viện ảnh" toggle={visToggle('gallery')}>
        <p className="ci-hint">Tối đa 20 ảnh.</p>
        {gallery.map((url, i) => (
          <div className="ci-row" key={i}>
            <div style={{ flex: 1 }}>
              <ImageInput value={url} onChange={(u) => updateGallery(i, u)} onBlurSave={onBlurSave} placeholder="Dán URL hoặc chọn ảnh" />
            </div>
            <button type="button" className="ci-icon-btn" onClick={() => removeGallery(i)} aria-label="Xoá"><Trash2 size={16} /></button>
          </div>
        ))}
        {gallery.length < 20 && (
          <button type="button" className="ci-add" onClick={() => onChange({ gallery: [...gallery, ''] })}><Plus size={15} /> Thêm ảnh</button>
        )}
      </Section>

      <Section title="Dress Code" toggle={visToggle('dressCode')}>
        <label className="ci-field">
          <span>Ghi chú trang phục</span>
          <input value={extra.dressCode?.note ?? ''} onChange={(e) => setExtra({ dressCode: { ...extra.dressCode, note: e.target.value } })} onBlur={onBlurSave} placeholder="vd: Trang phục lịch sự, tông pastel" />
        </label>
        <label className="ci-field">
          <span>Mã màu (cách nhau bằng dấu phẩy)</span>
          <input
            value={(extra.dressCode?.colors ?? []).join(', ')}
            onChange={(e) => setExtra({ dressCode: { ...extra.dressCode, colors: e.target.value.split(',').map((c) => c.trim()).filter(Boolean) } })}
            onBlur={onBlurSave}
            placeholder="#e6017e, #f8c8dc, #ffffff"
          />
        </label>
        <div className="ci-color-chips">
          {(extra.dressCode?.colors ?? []).map((c, i) => <span key={i} className="ci-color-chip" style={{ background: c }} title={c} />)}
        </div>
      </Section>

      <Section title="Lịch trình ngày cưới" toggle={visToggle('schedule')}>
        {schedule.map((it, i) => (
          <div className="ci-row" key={i}>
            <input placeholder="Giờ (09:00)" value={it.time} onChange={(e) => updateSchedule(i, { time: e.target.value })} onBlur={onBlurSave} style={{ maxWidth: 110 }} />
            <input placeholder="Nội dung (Đón khách)" value={it.title} onChange={(e) => updateSchedule(i, { title: e.target.value })} onBlur={onBlurSave} />
            <button type="button" className="ci-icon-btn" onClick={() => removeSchedule(i)} aria-label="Xoá"><Trash2 size={16} /></button>
          </div>
        ))}
        <button type="button" className="ci-add" onClick={() => setExtra({ schedule: [...schedule, { time: '', title: '' }] })}><Plus size={15} /> Thêm mốc lịch trình</button>
      </Section>

      <Section title="Xác nhận tham dự (RSVP)" toggle={visRsvp()}>
        <p className="ci-hint">Khách điền form để xác nhận tham dự.</p>
      </Section>

      <Section title="Sổ lưu bút" toggle={visGuestbook()}>
        <p className="ci-hint">Khách để lại lời chúc.</p>
      </Section>

      <Section title="Hộp quà cưới" toggle={visToggle('gift')}>
        <p className="ci-hint">Mã ngân hàng VietQR, ví dụ: VCB, MB, TCB, ACB…</p>
        <strong className="ci-sub">Nhà trai</strong>
        {nestedText('Mã ngân hàng', 'bankGroom', 'bank')}
        {nestedText('Số tài khoản', 'bankGroom', 'account')}
        {nestedText('Tên chủ tài khoản', 'bankGroom', 'name')}
        <strong className="ci-sub">Nhà gái</strong>
        {nestedText('Mã ngân hàng', 'bankBride', 'bank')}
        {nestedText('Số tài khoản', 'bankBride', 'account')}
        {nestedText('Tên chủ tài khoản', 'bankBride', 'name')}
      </Section>

      <Section title="Lời cảm ơn" toggle={visToggle('thanks')}>
        <label className="ci-field">
          <span>Lời cảm ơn cuối thiệp</span>
          <textarea rows={3} value={extra.thanks ?? ''} onChange={(e) => setExtra({ thanks: e.target.value })} onBlur={onBlurSave} />
        </label>
      </Section>

      <Section title="🌐 Ngôn ngữ thiệp" defaultOpen>
        <div className="ci-field">
          <span>Ngôn ngữ hiển thị cho khách</span>
          <LangBadges langs={currentLangs} />
          <button
            type="button"
            className="ci-lang-btn"
            onClick={() => setShowLangManager(true)}
          >
            <Globe size={14} /> Quản lý ngôn ngữ
          </button>
        </div>
      </Section>

      <Section title="Nhạc nền">
        <MusicPicker value={data.musicUrl ?? ''} onChange={(u) => { set('musicUrl', u); onBlurSave(); }} />
      </Section>

      <Section title="Phong bì (Lời mời)" toggle={visToggle('envelope')}>
        <label className="ci-field">
          <span>Lời mời hiển thị trên phong bì</span>
          <textarea rows={2} value={extra.envelope ?? ''} onChange={(e) => setExtra({ envelope: e.target.value })} onBlur={onBlurSave} placeholder="Trân trọng kính mời…" />
        </label>
      </Section>

      {showLangManager && (
        <LangManager
          value={currentLangs}
          onChange={setLangs}
          onClose={() => setShowLangManager(false)}
        />
      )}
    </div>
  );

  // RSVP & guestbook vẫn dùng settings cũ để tương thích.
  function visRsvp() {
    const s = data.settings ?? {};
    return { on: s.rsvp !== false, onToggle: (v: boolean) => { onChange({ settings: { ...s, rsvp: v } }); onBlurSave(); } };
  }
  function visGuestbook() {
    const s = data.settings ?? {};
    return { on: s.guestbook !== false, onToggle: (v: boolean) => { onChange({ settings: { ...s, guestbook: v } }); onBlurSave(); } };
  }

  function updateStory(i: number, patch: Partial<LoveStoryItem>) {
    onChange({ loveStory: story.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  }
  function addStory() { onChange({ loveStory: [...story, { date: '', title: '', text: '' }] }); }
  function removeStory(i: number) { onChange({ loveStory: story.filter((_, idx) => idx !== i) }); onBlurSave(); }
  function updateGallery(i: number, v: string) { onChange({ gallery: gallery.map((g, idx) => (idx === i ? v : g)) }); }
  function removeGallery(i: number) { onChange({ gallery: gallery.filter((_, idx) => idx !== i) }); onBlurSave(); }
  function updateSchedule(i: number, patch: Partial<ScheduleItem>) { setExtra({ schedule: schedule.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) }); }
  function removeSchedule(i: number) { setExtra({ schedule: schedule.filter((_, idx) => idx !== i) }); onBlurSave(); }
}
