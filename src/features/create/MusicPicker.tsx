/** Chọn nhạc nền: thư viện có sẵn (nghe thử + chọn) HOẶC upload mp3 từ máy. */
import { useEffect, useRef, useState } from 'react';
import { Upload, Loader2, Play, Pause, Check } from 'lucide-react';
import { customerApi, musicApi, type MusicTrack } from '../../api/client';

interface Props { value: string; onChange: (url: string) => void; }

export default function MusicPicker({ value, onChange }: Props) {
  const [lib, setLib] = useState<MusicTrack[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { musicApi.library().then((r) => r.success && setLib(r.data ?? [])); }, []);

  const preview = (url: string) => {
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    if (playing === url) { a.pause(); setPlaying(null); return; }
    a.src = url; a.play().then(() => setPlaying(url)).catch(() => {});
    a.onended = () => setPlaying(null);
  };

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true); setErr('');
    const r = await customerApi.uploadMusic(f);
    setBusy(false);
    if (r.success && r.data) onChange(r.data.url);
    else setErr(r.message ?? 'Tải nhạc thất bại');
    if (fileRef.current) fileRef.current.value = '';
  }

  // tên hiển thị nhạc đang chọn (nếu là 1 track trong lib)
  const current = lib.find((t) => t.url === value);

  return (
    <div className="ci-music">
      <p className="ci-hint">Chọn từ thư viện nhạc cưới có sẵn, hoặc tải nhạc của bạn (mp3, tối đa 15MB).</p>

      <ul className="ci-music-list">
        {lib.map((t) => {
          const active = value === t.url;
          return (
            <li key={t.url} className={`ci-music-item ${active ? 'on' : ''}`}>
              <button type="button" className="ci-music-play" onClick={() => preview(t.url)} aria-label="Nghe thử">
                {playing === t.url ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <span className="ci-music-name">{t.name}</span>
              <button type="button" className="ci-music-pick" onClick={() => onChange(t.url)}>
                {active ? <><Check size={14} /> Đang chọn</> : 'Chọn'}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="ci-music-upload">
        <button type="button" className="ci-add" disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? <Loader2 size={15} className="ci-spin" /> : <Upload size={15} />} Tải nhạc từ máy
        </button>
        <input ref={fileRef} type="file" accept="audio/*" hidden onChange={upload} />
        {value && !current && <span className="ci-music-custom">Đã chọn: {value.split('/').pop()}</span>}
        {value && <button type="button" className="ci-music-clear" onClick={() => onChange('')}>Bỏ nhạc</button>}
      </div>
      {err && <span className="ci-imgin__err">{err}</span>}
    </div>
  );
}
