/** Tab Mẫu thiệp — bảng + modal thêm/sửa. */
import { useEffect, useState } from 'react';
import { Loader2, Plus, X, Camera } from 'lucide-react';
import { adminApi, catalogApi } from '../../api/client';
import { formatPrice } from '../../data';
import type { Template } from '../../data/types';
import { CATEGORY_VI } from './shared';

const CATS = ['luxury', 'modern', 'classic', 'minimalist', 'floral', 'vintage'] as const;

type Form = {
  id?: string; name: string; slug: string; category: string;
  priceFrom: number; description: string; isNew: boolean; isHot: boolean; isActive: boolean;
};
const empty: Form = { name: '', slug: '', category: 'modern', priceFrom: 199000, description: '', isNew: false, isHot: false, isActive: true };

export default function AdminTemplates() {
  const [rows, setRows] = useState<Template[] | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [shooting, setShooting] = useState<string | null>(null); // id mẫu (hoặc 'all') đang chụp
  const [msg, setMsg] = useState<string>('');

  // Chụp lại ảnh preview coverflow. Cần dev server (5173) đang chạy.
  const regen = async (id: number | 'all') => {
    setShooting(String(id)); setMsg('');
    const r = await adminApi.regenPreview(id);
    setShooting(null);
    setMsg(r.success ? (r.message ?? 'Đã tạo lại ảnh.') : (r.message ?? 'Tạo ảnh thất bại.'));
    setTimeout(() => setMsg(''), 6000);
  };

  const load = () => catalogApi.templates().then((r) => r.success && setRows(r.data ?? []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form) return;
    setSaving(true);
    const data = { name: form.name, slug: form.slug, category: form.category, description: form.description, priceFrom: form.priceFrom, isNew: form.isNew, isHot: form.isHot, isActive: form.isActive };
    if (form.id) await adminApi.updateTemplate(+form.id, data);
    else await adminApi.createTemplate(data);
    setSaving(false); setForm(null); load();
  };

  const hide = async (id: string) => { if (confirm('Ẩn mẫu này?')) { await adminApi.deleteTemplate(+id); load(); } };

  if (!rows) return <div className="adm-center" style={{ minHeight: 160 }}><Loader2 className="adm-spin" /></div>;

  return (
    <>
      <div className="adm-toolbar">
        <button className="adm-mini-btn" onClick={() => setForm({ ...empty })}><Plus size={15} /> Thêm mẫu</button>
        <button className="adm-mini-btn adm-mini-btn--ghost" disabled={shooting !== null} onClick={() => regen('all')} title="Chụp lại ảnh coverflow cho tất cả mẫu (cần dev server đang chạy)">
          {shooting === 'all' ? <Loader2 size={15} className="adm-spin" /> : <Camera size={15} />} Tạo lại ảnh tất cả
        </button>
        {msg && <span className="adm-sub" style={{ marginLeft: 'auto' }}>{msg}</span>}
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead><tr><th>Tên</th><th>Slug</th><th>Danh mục</th><th>Giá từ</th><th>Cờ</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="adm-empty">Chưa có mẫu thiệp.</td></tr>}
            {rows.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td><td><span className="adm-sub">{t.slug}</span></td>
                <td>{CATEGORY_VI[t.category] ?? t.category}</td>
                <td>{formatPrice(t.priceFrom)}</td>
                <td>{t.isNew && <span className="adm-badge adm-badge--new">MỚI</span>} {t.isHot && <span className="adm-badge adm-badge--hot">HOT</span>}</td>
                <td>
                  <button className="adm-mini-btn adm-mini-btn--ghost" onClick={() => setForm({ id: t.id, name: t.name, slug: t.slug, category: t.category, priceFrom: t.priceFrom, description: t.description, isNew: t.isNew, isHot: t.isHot, isActive: true })}>Sửa</button>
                  <button className="adm-mini-btn adm-mini-btn--ghost" disabled={shooting !== null} title="Tạo lại ảnh preview coverflow" onClick={() => regen(+t.id)}>
                    {shooting === t.id ? <Loader2 size={13} className="adm-spin" /> : <Camera size={13} />} Ảnh
                  </button>
                  <button className="adm-mini-btn adm-mini-btn--danger" onClick={() => hide(t.id)}>Ẩn</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="adm-modal-overlay" onClick={() => setForm(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-head"><h3>{form.id ? 'Sửa mẫu' : 'Thêm mẫu'}</h3><button onClick={() => setForm(null)}><X size={18} /></button></div>
            <label className="adm-field">Tên<input className="adm-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label className="adm-field">Slug<input className="adm-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></label>
            <label className="adm-field">Danh mục
              <select className="adm-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATS.map((c) => <option key={c} value={c}>{CATEGORY_VI[c]}</option>)}
              </select>
            </label>
            <label className="adm-field">Giá từ (VNĐ)<input className="adm-input" type="number" value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: +e.target.value })} /></label>
            <label className="adm-field">Mô tả<textarea className="adm-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <div className="adm-checks">
              <label><input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} /> Mới</label>
              <label><input type="checkbox" checked={form.isHot} onChange={(e) => setForm({ ...form, isHot: e.target.checked })} /> Hot</label>
            </div>
            <button className="adm-btn" disabled={saving} onClick={save}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
          </div>
        </div>
      )}
    </>
  );
}
