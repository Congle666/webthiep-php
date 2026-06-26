/** Admin "Thiết kế mẫu" — chọn mẫu, kéo-thả trang trí + chỉnh màu, lưu vào DB. */
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Plus, Trash2, Save, Upload, Camera } from 'lucide-react';
import { catalogApi, adminApi } from '../../api/client';
import type { Template } from '../../data/types';
import { DecoConfig, DEFAULT_DECORATIONS, defaultDecosByLayout } from '../invitation/decorations';
import { DesignerPreview, type Zone } from './DesignerPreview';
import { useToast } from '../../components/common/Toast';
import '../invitation/Invitation.css';
import '../invitation/DecorationLayer.css';
import './AdminDesigner.css';

type Theme = Record<string, string>;

const DEFAULT_THEME: Theme = {
  red: '#9e2b25', redDeep: '#7a1f1b', redSoft: 'rgba(158,43,37,0.10)',
  text: '#5a4a3a', heading: '#8a241f', muted: '#9c8b76',
  bg: '#f5ead7', paper: '/invitation/paper-bg.jpg',
};

const COLOR_FIELDS: { key: keyof Theme; label: string }[] = [
  { key: 'red', label: 'Đỏ chính' },
  { key: 'redDeep', label: 'Đỏ đậm' },
  { key: 'text', label: 'Chữ' },
  { key: 'heading', label: 'Tiêu đề' },
  { key: 'bg', label: 'Nền' },
];

export default function AdminDesigner() {
  const { id: idParam } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeId, setActiveId] = useState<number | null>(idParam ? Number(idParam) : null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenMsg, setRegenMsg] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [decos, setDecos] = useState<DecoConfig[]>(DEFAULT_DECORATIONS);
  const [layout, setLayout] = useState<string>('traditional');
  const [zone, setZone] = useState<Zone>('body');
  const [selId, setSelId] = useState<string | null>(null);
  const [library, setLibrary] = useState<{ url: string; name: string; group: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    catalogApi.templates().then((res) => {
      if (res.success && res.data) {
        setTemplates(res.data);
        // Auto-select từ URL nếu có
        if (idParam) selectTemplate(Number(idParam));
      }
    });
    loadLibrary();
  }, []);

  const loadLibrary = () => adminApi.assets().then((r) => { if (r.success && r.data) setLibrary(r.data); });

  /** Thêm 1 ảnh từ thư viện vào thiết kế (vị trí mặc định giữa). */
  const addFromLibrary = (url: string, name: string) => {
    const n = decos.length + 1;
    const id = `deco-${Date.now()}`;
    setDecos([...decos, { id, label: name || `Ảnh ${n}`, src: url, top: 20, left: 40, width: 20, rotate: 0, flip: false, z: 2, opacity: 1, zone }]);
    setSelId(id);
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await adminApi.uploadAsset(file);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    if (res.success && res.data) {
      await loadLibrary();
      addFromLibrary(res.data.url, file.name);   // thêm luôn vào thiết kế
    } else {
      toast(res.message ?? 'Tải ảnh thất bại.', 'error');
    }
  };

  const selectTemplate = async (id: number) => {
    setActiveId(id);
    navigate(`/admin/thiet-ke-mau/${id}`, { replace: true });
    setLoading(true);
    const res = await adminApi.templateDetail(id);
    setLoading(false);
    const detail = res.success && res.data ? res.data : null;
    const d = detail?.design ?? null;
    const tplLayout = detail?.layout ?? 'traditional';
    setLayout(tplLayout);
    setTheme({ ...DEFAULT_THEME, ...(d?.theme ?? {}) });
    setDecos(Array.isArray(d?.decorations) && d.decorations.length ? d.decorations : defaultDecosByLayout(tplLayout));
    setSelId(null);
  };

  const switchZone = (z: Zone) => { setZone(z); setSelId(null); };

  const removeDeco = (id: string) => {
    setDecos((l) => l.filter((d) => d.id !== id));
    if (selId === id) setSelId(null);
  };

  /** Cập nhật ảnh đang chọn. */
  const patchSel = (patch: Partial<DecoConfig>) =>
    setDecos((l) => l.map((d) => (d.id === selId ? { ...d, ...patch } : d)));

  /** Đối xứng: nếu vùng có đúng 1 ảnh khác, soi gương ảnh đang chọn sang phía đối diện. */
  const mirrorSel = () => {
    const sel = decos.find((d) => d.id === selId);
    if (!sel) return;
    patchSel({ left: +(100 - sel.left - sel.width).toFixed(1) });
  };

  const save = async () => {
    if (activeId == null) return;
    setSaving(true);
    setRegenMsg(null);
    const designPayload: { theme: Theme; decorations: DecoConfig[] } = { theme, decorations: decos };
    const res = await adminApi.updateDesign(activeId, designPayload);
    if (!res.success) {
      setSaving(false);
      toast(res.message ?? 'Lưu thất bại.', 'error');
      return;
    }
    // Tự động tạo lại ảnh preview sau khi lưu
    setRegenMsg('Đang tạo lại ảnh preview...');
    const regen = await adminApi.regenPreview(activeId);
    setSaving(false);
    setRegenMsg(null);
    if (regen.success) toast('Đã lưu & tạo lại ảnh xong!', 'success');
    else toast('Đã lưu. Tạo ảnh thất bại: ' + (regen.message ?? ''), 'error');
  };

  const zoneDecos = decos.filter((d) => (d.zone ?? 'body') === zone);
  const selected = decos.find((d) => d.id === selId && (d.zone ?? 'body') === zone) ?? null;

  return (
    <div className="dsn-root">
      <aside className="dsn-list">
        <h3>Chọn mẫu thiệp</h3>
        {templates.map((t) => (
          <button
            key={t.id}
            className={activeId === Number(t.id) ? 'dsn-tpl on' : 'dsn-tpl'}
            onClick={() => selectTemplate(Number(t.id))}
          >
            {t.name}
          </button>
        ))}
      </aside>

      {activeId == null ? (
        <div className="dsn-empty">Chọn một mẫu để bắt đầu thiết kế.</div>
      ) : loading ? (
        <div className="dsn-empty"><Loader2 className="adm-spin" /> Đang tải...</div>
      ) : (
        <div className="dsn-editor">
          <div className="dsn-panel">
            <h3>Màu sắc</h3>
            <div className="dsn-colors">
              {COLOR_FIELDS.map((f) => (
                <label key={f.key as string}>
                  {f.label}
                  <input
                    type="color"
                    value={/^#/.test(theme[f.key] ?? '') ? theme[f.key] : '#9e2b25'}
                    onChange={(e) => setTheme((th) => ({ ...th, [f.key]: e.target.value }))}
                  />
                </label>
              ))}
            </div>

            {selected && (
              <div className="dsn-edit">
                <h3>Chỉnh ảnh đang chọn</h3>
                <p className="dsn-edit-name">{selected.label ?? selected.id}</p>
                <label>Kích thước: {selected.width}%
                  <input type="range" min={3} max={90} value={selected.width} onChange={(e) => patchSel({ width: +e.target.value })} />
                </label>
                <label>Xoay: {selected.rotate}°
                  <input type="range" min={-180} max={180} value={selected.rotate} onChange={(e) => patchSel({ rotate: +e.target.value })} />
                </label>
                <label>Trong suốt: {selected.opacity}
                  <input type="range" min={0.1} max={1} step={0.05} value={selected.opacity} onChange={(e) => patchSel({ opacity: +e.target.value })} />
                </label>
                <label>Thứ tự lớp: {selected.z}
                  <input type="range" min={0} max={20} value={selected.z} onChange={(e) => patchSel({ z: +e.target.value })} />
                </label>
                <div className="dsn-edit-row">
                  <button onClick={() => patchSel({ z: 9 })}>⬆ Đưa lên trên cùng</button>
                  <button onClick={() => patchSel({ z: 0 })}>⬇ Đưa xuống dưới cùng</button>
                </div>
                <div className="dsn-edit-row">
                  <button onClick={() => patchSel({ left: +(50 - selected.width / 2).toFixed(1) })}>⊹ Căn giữa ngang</button>
                  <button onClick={() => patchSel({ top: +(50 - selected.width / 2).toFixed(1) })}>⊹ Căn giữa dọc</button>
                  <button onClick={mirrorSel}>⇄ Đối xứng</button>
                </div>
                <div className="dsn-edit-row">
                  <button onClick={() => patchSel({ flip: !selected.flip })}>↔ Lật</button>
                  <button onClick={() => patchSel({ top: +(selected.top - 1).toFixed(1) })} aria-label="Lên">↑</button>
                  <button onClick={() => patchSel({ top: +(selected.top + 1).toFixed(1) })} aria-label="Xuống">↓</button>
                  <button onClick={() => patchSel({ left: +(selected.left - 1).toFixed(1) })} aria-label="Trái">←</button>
                  <button onClick={() => patchSel({ left: +(selected.left + 1).toFixed(1) })} aria-label="Phải">→</button>
                </div>
              </div>
            )}

            <h3>Ảnh ở {zone === 'cover' ? 'bìa thiệp' : 'nội dung'}</h3>
            <ul className="dsn-decolist">
              {zoneDecos.length === 0 && <li className="dsn-deco-empty">Chưa có ảnh ở vùng này. Chọn từ thư viện bên dưới.</li>}
              {zoneDecos.map((d) => (
                <li key={d.id} className={selId === d.id ? 'on' : ''} onClick={() => setSelId(d.id)}>
                  <img className="dsn-deco-thumb" src={d.src} alt="" />
                  <span>{d.label ?? d.id}</span>
                  <button onClick={(e) => { e.stopPropagation(); removeDeco(d.id); }} aria-label="Xóa"><Trash2 size={14} /></button>
                </li>
              ))}
            </ul>

            <h3>
              Thư viện ảnh
              <button className="dsn-upload" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 size={13} className="adm-spin" /> : <Upload size={13} />} Tải ảnh lên
              </button>
            </h3>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onUpload} />
            <p className="dsn-lib-hint">Bấm ảnh để thêm vào thiết kế.</p>
            <div className="dsn-library">
              {library.map((a) => (
                <button key={a.url} className="dsn-lib-item" title={a.name} onClick={() => addFromLibrary(a.url, a.name)}>
                  <img src={a.url} alt={a.name} />
                  <span><Plus size={11} /></span>
                </button>
              ))}
            </div>

            <button className="dsn-save" onClick={save} disabled={saving}>
              {saving
                ? <><Loader2 size={16} className="adm-spin" /> {regenMsg ?? 'Đang lưu...'}</>
                : <><Save size={16} /><Camera size={14} /> Lưu & tạo lại ảnh</>}
            </button>
            {regenMsg && !saving && <p className="dsn-regen-msg">{regenMsg}</p>}
          </div>

          <div className="dsn-preview">
            <div className="dsn-zone-toggle" role="tablist">
              <button role="tab" className={zone === 'cover' ? 'on' : ''} onClick={() => switchZone('cover')}>Bìa thiệp</button>
              <button role="tab" className={zone === 'body' ? 'on' : ''} onClick={() => switchZone('body')}>Nội dung</button>
            </div>
            <p className="dsn-hint">
              Kéo ảnh để di chuyển. Bấm ảnh để chọn rồi chỉnh ở bảng <b>bên trái</b>. Đang chỉnh vùng <b>{zone === 'cover' ? 'Bìa thiệp' : 'Nội dung'}</b>.
            </p>
            <div className="dsn-stage">
              <DesignerPreview layout={layout} theme={theme} decos={decos} zone={zone} onChange={setDecos}
                selectedId={selId} onSelect={setSelId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
