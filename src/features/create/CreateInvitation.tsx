/** Luồng tạo/chỉnh sửa thiệp cưới: xác thực -> tạo đơn nháp -> editor + preview -> đăng. */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Send, Save, Check, Copy, Globe, ChevronDown, Pencil } from 'lucide-react';
import { catalogApi, customerApi } from '../../api/client';
import type { Template } from '../../data/types';
import { useAuth } from '../../context/AuthContext';
import InvitationFormFields, { type InvitationForm } from './InvitationForm';
import { InvitationView } from '../invitation/InvitationView';
import { buildPreviewInv } from './buildPreviewInv';
import '../invitation/Invitation.css';
import './CreateInvitation.css';

export default function CreateInvitation() {
  const { templateSlug = '' } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, openLogin } = useAuth();

  const [template, setTemplate] = useState<Template | null>(null);
  const [slug, setSlug] = useState<string>('');
  const [form, setForm] = useState<InvitationForm>({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [err, setErr] = useState('');
  const [published, setPublished] = useState<{ slug: string; url: string } | null>(null);
  const [prettySlug, setPrettySlug] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit'); // mobile: chọn xem form hay preview
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [langOpen, setLangOpen] = useState(false);

  // 1. Tải template
  useEffect(() => {
    catalogApi.template(templateSlug).then((tpl) => { if (tpl.success && tpl.data) setTemplate(tpl.data); });
  }, [templateSlug]);

  // 2. Auth đã resolve mà chưa login -> mở popup đăng nhập (sau login user tự cập nhật).
  useEffect(() => {
    if (!authLoading && !user) openLogin();
  }, [authLoading, user, openLogin]);

  // 3. Có user + template -> tạo đơn nháp
  useEffect(() => {
    if (!user || !template || slug) return;
    (async () => {
      const res = await customerApi.createOrder(Number(template.id), 'premium');
      if (res.success && res.data) {
        setSlug(res.data.invitationSlug);
        const inv = await customerApi.getInvitation(res.data.invitationSlug);
        if (inv.success && inv.data) setForm(inv.data);
      } else { setErr(res.message ?? 'Không tạo được thiệp nháp'); }
    })();
  }, [user, template, slug]);

  const onChange = (patch: InvitationForm) => setForm((f) => ({ ...f, ...patch }));

  async function save() {
    if (!slug) return;
    setSaving(true);
    const res = await customerApi.updateInvitation(slug, form);
    setSaving(false);
    if (res.success) { setSavedAt(Date.now()); }
    else setErr(res.message ?? 'Lưu thất bại');
  }

  async function publish() {
    if (!slug) return;
    const res = await customerApi.publish(slug, prettySlug.trim() || undefined);
    if (res.success && res.data) setPublished(res.data);
    else setErr(res.message ?? 'Đăng thiệp thất bại');
  }

  if (authLoading) return <div className="ci-center">Đang tải…</div>;
  if (!user) return (
    <div className="ci-center ci-gate">
      <h1 className="ci-auth__title">Tạo thiệp cưới của bạn</h1>
      <p className="ci-auth__sub">Vui lòng đăng nhập để bắt đầu tuỳ chỉnh thiệp.</p>
      <button className="ci-btn ci-btn--primary" onClick={() => openLogin()}>Đăng nhập / Đăng ký</button>
    </div>
  );

  // Xem trước render TRỰC TIẾP từ state (fill real-time, không iframe, không auto-scroll).
  const previewInv = buildPreviewInv(form, templateSlug);
  const publicUrl = published ? `${window.location.origin}/thiep/${published.slug}` : '';

  return (
    <div className={`ci ci--mode-${mode}`}>
      <header className="ci-top">
        <button className="ci-back" onClick={() => navigate(-1)} aria-label="Quay lại"><ArrowLeft size={20} /></button>
        <span className="ci-top__brand">JunTech</span>
        <nav className="ci-top__nav">
          <button className="is-active" type="button">Mẫu Thiệp</button>
          <button type="button" onClick={() => navigate('/tai-khoan')}>Thiệp Của Tôi</button>
        </nav>
        {template?.name && <span className="ci-top__chip">{template.name}</span>}

        <span className="ci-top__spacer" />

        <div className="ci-segment" role="group" aria-label="Chế độ hiển thị">
          <button type="button" className={mode === 'edit' ? 'on' : ''} onClick={() => setMode('edit')}><Pencil size={14} /> Chỉnh sửa</button>
          <button type="button" className={mode === 'preview' ? 'on' : ''} onClick={() => setMode('preview')}><Eye size={14} /> Xem trước</button>
        </div>

        <span className="ci-top__spacer" />

        <div className="ci-lang">
          <button type="button" className="ci-lang__btn" onClick={() => setLangOpen((o) => !o)} aria-haspopup="listbox">
            <Globe size={15} /> {lang === 'vi' ? 'Tiếng Việt' : 'English'} <ChevronDown size={14} />
          </button>
          {langOpen && (
            <div className="ci-lang__menu" role="listbox">
              <button className={lang === 'vi' ? 'on' : ''} onClick={() => { setLang('vi'); setLangOpen(false); }}>Tiếng Việt</button>
              <button className={lang === 'en' ? 'on' : ''} onClick={() => { setLang('en'); setLangOpen(false); }}>English</button>
            </div>
          )}
        </div>

        <div className="ci-top__actions">
          <button className="ci-btn ci-btn--ghost" onClick={save} disabled={saving}><Save size={16} /> {saving ? 'Đang lưu…' : 'Lưu'}</button>
          <button className="ci-btn ci-btn--primary" onClick={publish}><Send size={16} /> Đăng thiệp</button>
        </div>
      </header>

      {err && <div className="ci-err">{err}</div>}
      {savedAt && <div className="ci-saved"><Check size={14} /> Đã lưu</div>}

      {/* 1 cột full-width. Tab quyết định vùng giữa: Chỉnh sửa -> form; Xem trước -> thiệp. */}
      <main className="ci-main">
        {mode === 'edit' ? (
          <div className="ci-formwrap">
            <InvitationFormFields data={form} onChange={onChange} onBlurSave={save} />

            <div className="ci-publish">
              <label className="ci-field">
                <span>Đường dẫn đẹp (tuỳ chọn)</span>
                <input placeholder="vd: an-binh-2026" value={prettySlug} onChange={(e) => setPrettySlug(e.target.value)} />
              </label>
              <button className="ci-btn ci-btn--primary ci-btn--block" onClick={publish}><Send size={16} /> Đăng thiệp ngay</button>
              {published && (
                <div className="ci-success">
                  <strong>Thiệp đã được đăng!</strong>
                  <div className="ci-success__link">
                    <a href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a>
                    <button className="ci-icon-btn" onClick={() => { navigator.clipboard.writeText(publicUrl); setCopied(true); }} aria-label="Sao chép">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <a className="ci-btn ci-btn--primary ci-btn--block" href={publicUrl} target="_blank" rel="noreferrer">Mở thiệp</a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="ci-canvas" aria-label="Xem trước thiệp">
            <InvitationView inv={previewInv} slug={previewInv.slug} opened staticMode />
          </div>
        )}
      </main>
    </div>
  );
}
