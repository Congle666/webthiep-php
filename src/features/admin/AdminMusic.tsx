/** Quản lý thư viện nhạc cưới: upload, nghe thử, đổi tên, xóa. */
import { useEffect, useRef, useState } from 'react';
import { Upload, Loader2, Play, Pause, Pencil, Trash2, Check, X, Music2 } from 'lucide-react';
import { adminApi, type MusicTrack } from '../../api/client';
import { useToast } from '../../components/common/Toast';

export default function AdminMusic() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const load = () =>
    adminApi.musicList().then((r) => {
      if (r.success && r.data) setTracks(r.data);
      setLoading(false);
    });

  useEffect(() => { load(); }, []);

  const flash = (text: string, ok = true) => toast(text, ok ? 'success' : 'error');

  const togglePlay = (url: string) => {
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    if (playing === url) { a.pause(); setPlaying(null); return; }
    a.src = url;
    a.play().then(() => setPlaying(url)).catch(() => flash('Không phát được nhạc.', false));
    a.onended = () => setPlaying(null);
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { flash('File quá lớn (tối đa 20 MB).', false); return; }
    setUploading(true);
    const r = await adminApi.uploadMusic(file);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    if (r.success) { flash('Đã tải lên: ' + (r.data?.name ?? file.name)); load(); }
    else flash(r.message ?? 'Tải nhạc thất bại.', false);
  };

  const startEdit = (t: MusicTrack) => { setEditUrl(t.url); setEditName(t.name); };
  const cancelEdit = () => { setEditUrl(null); setEditName(''); };

  const saveEdit = async (t: MusicTrack) => {
    const filename = t.url.split('/').pop() ?? '';
    const r = await adminApi.renameMusic(filename, editName.trim() || t.name);
    cancelEdit();
    if (r.success) { flash('Đã đổi tên.'); load(); }
    else flash(r.message ?? 'Đổi tên thất bại.', false);
  };

  const del = async (t: MusicTrack) => {
    if (!confirm(`Xóa "${t.name}"? Thiệp đang dùng bài này sẽ mất nhạc.`)) return;
    if (playing === t.url) { audioRef.current?.pause(); setPlaying(null); }
    const filename = t.url.split('/').pop() ?? '';
    const r = await adminApi.deleteMusic(filename);
    if (r.success) { flash('Đã xóa.'); load(); }
    else flash(r.message ?? 'Xóa thất bại.', false);
  };

  return (
    <div className="adm-music">
      <div className="adm-music__head">
        <div>
          <h2 className="adm-music__title"><Music2 size={20} /> Thư viện nhạc</h2>
          <p className="adm-music__sub">{tracks.length} bài — hỗ trợ mp3, m4a, ogg (tối đa 20 MB)</p>
        </div>
        <button className="adm-music__upload" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 size={15} className="adm-spin" /> : <Upload size={15} />} Tải nhạc lên
        </button>
        <input ref={fileRef} type="file" accept="audio/*" hidden onChange={upload} />
      </div>


      {loading ? (
        <div className="adm-music__empty"><Loader2 className="adm-spin" /> Đang tải...</div>
      ) : tracks.length === 0 ? (
        <div className="adm-music__empty">Chưa có bài nhạc nào. Tải lên bài đầu tiên!</div>
      ) : (
        <ul className="adm-music__list">
          {tracks.map((t) => {
            const isPlaying = playing === t.url;
            const isEditing = editUrl === t.url;
            return (
              <li key={t.url} className={`adm-music__item ${isPlaying ? 'playing' : ''}`}>
                <button
                  className="adm-music__play"
                  onClick={() => togglePlay(t.url)}
                  aria-label={isPlaying ? 'Dừng' : 'Nghe thử'}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <div className="adm-music__info">
                  {isEditing ? (
                    <input
                      className="adm-music__rename"
                      value={editName}
                      autoFocus
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(t); if (e.key === 'Escape') cancelEdit(); }}
                    />
                  ) : (
                    <>
                      <span className="adm-music__name">{t.name}</span>
                      <span className="adm-music__file">{t.url.split('/').pop()}</span>
                    </>
                  )}
                </div>

                <div className="adm-music__actions">
                  {isEditing ? (
                    <>
                      <button className="adm-mini-btn adm-mini-btn--primary" onClick={() => saveEdit(t)} title="Lưu"><Check size={14} /></button>
                      <button className="adm-mini-btn" onClick={cancelEdit} title="Hủy"><X size={14} /></button>
                    </>
                  ) : (
                    <>
                      <button className="adm-mini-btn" onClick={() => startEdit(t)} title="Đổi tên"><Pencil size={14} /></button>
                      <button className="adm-mini-btn adm-mini-btn--danger" onClick={() => del(t)} title="Xóa"><Trash2 size={14} /></button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
