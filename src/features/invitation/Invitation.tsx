/** Thiệp cưới sống — orchestrator: fetch data, chọn layout từ registry, render cover + header + body. */
import { useEffect, useState, useRef, CSSProperties } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { invitationApi } from '../../api/client';
import type { Invitation as Inv } from './types';
import { InvitationBody } from './InvitationBody';
import { LAYOUTS } from './layouts';
import { decosByZone } from './decorations';
import './Invitation.css';

/** Map theme từ DB -> CSS variables + background của .inv-root. */
function themeStyle(design?: Inv['design']): CSSProperties {
  const t = design?.theme;
  const style: Record<string, string> = {};
  if (t) {
    if (t.red) style['--red'] = t.red;
    if (t.redDeep) style['--red-deep'] = t.redDeep;
    if (t.redSoft) style['--red-soft'] = t.redSoft;
    if (t.text) style['--text'] = t.text;
    if (t.heading) style['--heading'] = t.heading;
    if (t.muted) style['--muted'] = t.muted;
    if (t.bg || t.paper) {
      const bg = t.bg || '#f5ead7';
      style.background = t.paper ? `${bg} url('${t.paper}')` : bg;
    }
  }
  return style as CSSProperties;
}

export default function Invitation() {
  const { slug = '' } = useParams();
  const location = useLocation();
  const isDemo = location.pathname.includes('/thiep/demo/');
  const [params] = useSearchParams();
  const guestName = params.get('khach');
  const editMode = params.get('edit') !== null;
  const [inv, setInv] = useState<Inv | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [errMsg, setErrMsg] = useState('');
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetcher = isDemo ? invitationApi.demo(slug) : invitationApi.view(slug);
    fetcher.then((res) => {
      if (res.success && res.data) {
        setInv(res.data); setStatus('ok');
        document.title = `Thiệp cưới ${res.data.groomName} & ${res.data.brideName}`;
      } else { setStatus('error'); setErrMsg(res.message ?? 'Không tìm thấy thiệp.'); }
    });
  }, [slug, isDemo]);

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

  const L = LAYOUTS[inv.layout ?? 'traditional'] ?? LAYOUTS.traditional;
  const allDecos = inv.design?.decorations?.length ? inv.design.decorations : undefined;
  const bodyDecos = decosByZone(allDecos, 'body');
  const coverDecos = decosByZone(allDecos, 'cover');
  const rootClass = `inv-root inv-${inv.layout ?? 'traditional'}`;

  return (
    <div className={rootClass} style={themeStyle(inv.design)}>
      {inv.musicUrl && <audio ref={audioRef} src={inv.musicUrl} loop />}

      <AnimatePresence>
        {!opened && !editMode && <L.Cover inv={inv} guestName={guestName} onOpen={handleOpen} decorations={coverDecos} />}
      </AnimatePresence>

      {inv.musicUrl && opened && (
        <button className="inv-music-btn" onClick={toggleMusic} aria-label="Bật/tắt nhạc">
          {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <Music size={14} className={playing ? 'inv-music-spin' : ''} />
        </button>
      )}

      <L.Header inv={inv} editMode={editMode} decorations={bodyDecos} />

      <InvitationBody inv={inv} slug={slug} />
    </div>
  );
}
