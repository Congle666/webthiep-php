/** Tab Gói giá / Đánh giá / Cài đặt. */
import { useEffect, useState } from 'react';
import { Loader2, Trash2, Plus, Star, Check } from 'lucide-react';
import { adminApi } from '../../api/client';
import { formatPrice } from '../../data';

const Spinner = () => <div className="adm-center" style={{ minHeight: 160 }}><Loader2 className="adm-spin" /></div>;

/* ---------- Gói giá ---------- */
export function AdminPlans() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const load = () => adminApi.plans().then((r) => r.success && setRows(r.data ?? []));
  useEffect(() => { load(); }, []);

  const set = (id: number, patch: any) => setRows((rs) => rs!.map((p) => p.id === id ? { ...p, ...patch } : p));
  const save = async (p: any) => {
    setSavingId(p.id);
    await adminApi.updatePlan(p.id, { name: p.name, price: +p.price, duration: p.duration, isRecommended: !!p.is_recommended, isActive: !!p.is_active });
    setSavingId(null);
  };

  if (!rows) return <Spinner />;
  return (
    <div className="adm-plans">
      {rows.length === 0 && <p className="adm-empty">Chưa có gói giá.</p>}
      {rows.map((p) => (
        <div className={`adm-card adm-plan ${p.is_recommended ? 'adm-plan--rec' : ''}`} key={p.id}>
          <input className="adm-input" value={p.name} onChange={(e) => set(p.id, { name: e.target.value })} />
          <label className="adm-field">Giá<input className="adm-input" type="number" value={p.price} onChange={(e) => set(p.id, { price: e.target.value })} /></label>
          <span className="adm-sub">{formatPrice(+p.price)}</span>
          <label className="adm-field">Thời hạn<input className="adm-input" value={p.duration} onChange={(e) => set(p.id, { duration: e.target.value })} /></label>
          <div className="adm-checks">
            <label><input type="checkbox" checked={!!p.is_recommended} onChange={(e) => set(p.id, { is_recommended: e.target.checked })} /> Đề xuất</label>
            <label><input type="checkbox" checked={!!p.is_active} onChange={(e) => set(p.id, { is_active: e.target.checked })} /> Hiển thị</label>
          </div>
          <button className="adm-mini-btn" disabled={savingId === p.id} onClick={() => save(p)}>{savingId === p.id ? 'Đang lưu...' : <><Check size={14} /> Lưu</>}</button>
        </div>
      ))}
    </div>
  );
}

/* ---------- Đánh giá ---------- */
export function AdminTestimonials() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [form, setForm] = useState({ name: '', avatar: '😊', quote: '', rating: 5 });
  const load = () => adminApi.testimonials().then((r) => r.success && setRows(r.data ?? []));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name || !form.quote) return;
    await adminApi.createTestimonial(form);
    setForm({ name: '', avatar: '😊', quote: '', rating: 5 }); load();
  };
  const del = async (id: number) => { if (confirm('Xoá đánh giá?')) { await adminApi.deleteTestimonial(id); load(); } };

  if (!rows) return <Spinner />;
  return (
    <div className="adm-tm">
      <div className="adm-card adm-tm-form">
        <h3 className="adm-chart-title">Thêm đánh giá</h3>
        <div className="adm-tm-grid">
          <input className="adm-input" placeholder="Tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="adm-input" placeholder="Avatar (emoji)" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
          <select className="adm-input" value={form.rating} onChange={(e) => setForm({ ...form, rating: +e.target.value })}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} sao</option>)}
          </select>
        </div>
        <textarea className="adm-input" rows={2} placeholder="Nội dung" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
        <button className="adm-mini-btn" onClick={add}><Plus size={15} /> Thêm</button>
      </div>
      <div className="adm-tm-list">
        {rows.length === 0 && <p className="adm-empty">Chưa có đánh giá.</p>}
        {rows.map((t) => (
          <div className="adm-card adm-tm-item" key={t.id}>
            <div className="adm-tm-head"><span className="adm-tm-avatar">{t.avatar || '🙂'}</span><strong>{t.name}</strong>
              <span className="adm-stars">{Array.from({ length: t.rating || 0 }).map((_, i) => <Star key={i} size={13} fill="#e6017e" stroke="#e6017e" />)}</span>
              <button className="adm-icon-link adm-icon-link--danger" onClick={() => del(t.id)} aria-label="Xoá"><Trash2 size={15} /></button>
            </div>
            <p className="adm-sub">{t.quote}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Cài đặt ---------- */
const FIELDS: [string, string][] = [['hotline', 'Hotline'], ['zalo', 'Zalo'], ['email', 'Email'], ['facebook', 'Facebook'], ['address', 'Địa chỉ']];
export function AdminSettings() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => { adminApi.settings().then((r) => r.success && setData(r.data ?? {})); }, []);

  const save = async () => { if (!data) return; setSaving(true); setSaved(false); await adminApi.updateSettings(data); setSaving(false); setSaved(true); };
  if (!data) return <Spinner />;
  return (
    <div className="adm-card adm-settings">
      {FIELDS.map(([k, label]) => (
        <label className="adm-field" key={k}>{label}
          <input className="adm-input" value={data[k] ?? ''} onChange={(e) => { setData({ ...data, [k]: e.target.value }); setSaved(false); }} />
        </label>
      ))}
      <div className="adm-settings-actions">
        <button className="adm-btn" disabled={saving} onClick={save}>{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</button>
        {saved && <span className="adm-saved"><Check size={15} /> Đã lưu</span>}
      </div>
    </div>
  );
}
