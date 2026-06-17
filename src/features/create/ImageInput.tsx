/** Ô nhập ảnh: dán URL HOẶC chọn file từ máy (upload -> trả URL). */
import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { customerApi } from '../../api/client';

interface Props {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  onBlurSave?: () => void;
  placeholder?: string;
}

export default function ImageInput({ label, value, onChange, onBlurSave, placeholder = 'Dán URL hoặc chọn ảnh từ máy' }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

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

  return (
    <label className="ci-field">
      {label && <span>{label}</span>}
      <div className="ci-imgin">
        <input value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlurSave} placeholder={placeholder} />
        <button type="button" className="ci-imgin__btn" disabled={busy} onClick={() => fileRef.current?.click()} title="Chọn ảnh từ máy">
          {busy ? <Loader2 size={15} className="ci-spin" /> : <Upload size={15} />}
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />
      </div>
      {err && <span className="ci-imgin__err">{err}</span>}
      {value && <img className="ci-imgin__preview" src={value} alt="" />}
    </label>
  );
}
