/** Thiệp cưới sống — orchestrator: fetch data, chọn layout từ registry, render cover + header + body. */
import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { invitationApi, customerApi } from '../../api/client';
import type { Invitation as Inv } from './types';
import { InvitationView } from './InvitationView';
import './Invitation.css';

export default function Invitation() {
  const { slug = '' } = useParams();
  const location = useLocation();
  const isDemo = location.pathname.includes('/thiep/demo/');
  const [params] = useSearchParams();
  const guestToken = params.get('g');
  const guestNameQuery = params.get('khach');
  const editMode = params.get('edit') !== null;
  const previewMode = params.get('preview') !== null; // nhúng iframe trang chủ: bỏ gate
  const autoScrollPreview = params.get('scroll') !== null; // chỉ card giữa: tự cuộn lặp
  const draftMode = params.get('draft') !== null; // editor: xem thiệp nháp của chính chủ (chưa publish)
  const [inv, setInv] = useState<Inv | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [errMsg, setErrMsg] = useState('');
  const [opened, setOpened] = useState(previewMode);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetcher: Promise<{ success: boolean; data?: Inv; message?: string }> =
      draftMode ? customerApi.getInvitation(slug)
      : isDemo ? invitationApi.demo(slug)
      : invitationApi.view(slug, guestToken ?? undefined);
    fetcher.then((res) => {
      if (res.success && res.data) {
        setInv(res.data); setStatus('ok');
        document.title = `Thiệp cưới ${res.data.groomName} & ${res.data.brideName}`;
      } else { setStatus('error'); setErrMsg(res.message ?? 'Không tìm thấy thiệp.'); }
    });
  }, [slug, isDemo, draftMode, guestToken]);

  // Chế độ preview (iframe trang chủ): tự cuộn xuống/lên.
  // Bật/tắt qua postMessage từ trang cha (không đổi src -> không reload, không kẹt loading).
  // Card đầu (?scroll) tự cuộn ngay; các card khác chờ message bật.
  useEffect(() => {
    if (!previewMode || status !== 'ok') return;
    let raf = 0, last = 0, dir = 1, running = false;
    const step = (t: number) => {
      if (!last) last = t;
      const dt = t - last; last = t;
      const max = document.body.scrollHeight - window.innerHeight;
      let y = window.scrollY + dir * 0.45 * dt;
      if (y >= max) { y = max; dir = -1; }
      if (y <= 0) { y = 0; dir = 1; }
      window.scrollTo(0, y);
      raf = requestAnimationFrame(step);
    };
    const start = () => { if (running) return; running = true; last = 0; raf = requestAnimationFrame(step); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === 'inv-scroll') { e.data.on ? start() : stop(); }
    };
    window.addEventListener('message', onMsg);
    let id: number | undefined;
    if (autoScrollPreview) id = window.setTimeout(start, 1000);
    return () => { window.removeEventListener('message', onMsg); if (id) clearTimeout(id); stop(); };
  }, [previewMode, autoScrollPreview, status]);

  // Auto-scroll mượt 1 lần xuống cuối; chạm/cuộn tay là dừng.
  const autoScroll = () => {
    let raf = 0;
    const speed = 0.7;
    let last = 0;
    const stop = () => { cancelAnimationFrame(raf); window.removeEventListener('wheel', stop); window.removeEventListener('touchstart', stop); };
    const step = (t: number) => {
      if (!last) last = t;
      const dt = t - last; last = t;
      window.scrollBy(0, speed * dt);
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
      if (!atBottom) raf = requestAnimationFrame(step); else stop();
    };
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    setTimeout(() => { raf = requestAnimationFrame(step); }, 800);
  };

  const handleOpen = () => {
    setOpened(true);
    const a = audioRef.current;
    if (a) { a.play().then(() => setPlaying(true)).catch(() => {}); }
    autoScroll();
  };

  const toggleMusic = () => {
    const a = audioRef.current; if (!a) return;
    if (playing) a.pause(); else a.play().catch(() => {});
    setPlaying(!playing);
  };

  if (status === 'loading') return <div className="inv-loading"><span className="inv-songhy-load">囍</span><p>Đang mở thiệp...</p></div>;
  if (status === 'error' || !inv) return <div className="inv-error"><h1>404</h1><p>{errMsg}</p></div>;

  return (
    <>
      {inv.musicUrl && <audio ref={audioRef} src={inv.musicUrl} loop />}
      {inv.musicUrl && opened && !previewMode && (
        <button className="inv-music-btn" onClick={toggleMusic} aria-label="Bật/tắt nhạc">
          {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <Music size={14} className={playing ? 'inv-music-spin' : ''} />
        </button>
      )}
      <InvitationView
        inv={inv} slug={slug} opened={opened} onOpen={handleOpen}
        guestName={inv.guestName ?? guestNameQuery} guestToken={guestToken}
        editMode={editMode} staticMode={previewMode}
      />
    </>
  );
}
