/** Vùng tải ảnh đẹp (tròn/oval): preview + nút Tải lên / Đổi / Xoá / Điều chỉnh. */
import { useRef, useState } from 'react';
import { Upload, Loader2, Trash2, SlidersHorizontal, ImageIcon } from 'lucide-react';
import { customerApi } from '../../api/client';
import type { PhotoAdjust } from '../invitation/types';
import ImageAdjustModal from './ImageAdjustModal';

type Shape = 'oval' | 'circle' | 'rect';

interface Props {
  label: string;
  value: string;
  adjust?: PhotoAdjust;
  shape?: Shape;
  onChange: (url: string) => void;
  onAdjust?: (adj: PhotoAdjust) => void;
  onBlurSave?: () => void;
}

const FORMATS = 'JPG, PNG, GIF, WebP, HEIC';

export default function PhotoUploader({ label, value, adjust, shape = 'circle', onChange, onAdjust, onBlurSave }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [showAdjust, setShowAdjust] = useState(false);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true); setErr('');
    const r = await customerApi.uploadImage(f);
    setBusy(false);
    if (r.success && r.data) { onChange(r.data.url); onBlurSave?.(); }
    else setErr(r.message ?? 'Tải ảnh thất bại');
    if (fileRef.current) fileRef.current.value = '';
  }

  const x = adjust?.x ?? 50, y = adjust?.y ?? 50, scale = adjust?.scale ?? 1;
  const radius = shape === 'circle' ? '50%' : shape === 'oval' ? '50% / 60%' : '12px';

  return (
    <div className="ci-uploader">
      <span className="ci-uploader__label">{label}</span>
      <div
        className={`ci-uploader__spot ${value ? 'has-img' : ''}`}
        style={{ borderRadius: radius }}
        onClick={() => !value && fileRef.current?.click()}
      >
        {value ? (
          <div
            className="ci-uploader__img"
            style={{
              backgroundImage: `url('${value}')`,
              backgroundPosition: `${x}% ${y}%`,
              backgroundSize: `${Math.round(scale * 100)}%`,
            }}
          />
        ) : (
          <ImageIcon size={34} className="ci-uploader__ph" />
        )}
        {busy && <div className="ci-uploader__busy"><Loader2 size={22} className="ci-spin" /></div>}
      </div>

      {value ? (
        <div className="ci-uploader__acts">
          <button type="button" className="ci-uploader__act" onClick={() => fileRef.current?.click()} disabled={busy}>
            <Upload size={13} /> Đổi
          </button>
          {onAdjust && (
            <button type="button" className="ci-uploader__act" onClick={() => setShowAdjust(true)}>
              <SlidersHorizontal size={13} /> Điều chỉnh
            </button>
          )}
          <button type="button" className="ci-uploader__act ci-uploader__act--del" onClick={() => { onChange(''); onBlurSave?.(); }}>
            <Trash2 size={13} /> Xoá
          </button>
        </div>
      ) : (
        <button type="button" className="ci-uploader__upload" onClick={() => fileRef.current?.click()} disabled={busy}>
          <Upload size={14} /> Tải lên
        </button>
      )}
      <span className="ci-uploader__formats">{FORMATS}</span>
      {err && <span className="ci-imgin__err">{err}</span>}

      <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />

      {showAdjust && value && onAdjust && (
        <ImageAdjustModal
          url={value}
          value={adjust}
          shape={shape}
          title={`Điều chỉnh ${label.toLowerCase()}`}
          onApply={(a) => { onAdjust(a); onBlurSave?.(); }}
          onClose={() => setShowAdjust(false)}
        />
      )}
    </div>
  );
}
