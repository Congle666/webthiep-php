/** Popup đăng nhập / đăng ký toàn site. Mở qua useAuth().openLogin(). */
import { useState } from 'react';
import { X } from 'lucide-react';
import { authApi, type AuthUser } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import './LoginModal.css';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8899/api';

export default function LoginModal() {
  const { loginOpen, closeLogin, setUser, _onSuccess } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [f, setF] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  if (!loginOpen) return null;

  const loginWithGoogle = async () => {
    setGoogleBusy(true);
    const res = await authApi.googleLoginUrl();
    if (res.success && res.data?.url) {
      window.location.href = res.data.url;
    } else {
      setErr(res.message ?? 'Không thể kết nối Google, thử lại sau.');
      setGoogleBusy(false);
    }
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    const res = tab === 'login'
      ? await authApi.login({ email: f.email, password: f.password })
      : await authApi.register({ full_name: f.full_name, email: f.email, phone: f.phone || undefined, password: f.password });
    setBusy(false);
    if (res.success && res.data) {
      const u = res.data as AuthUser;
      setUser(u);
      _onSuccess?.(u);
      closeLogin();
    } else setErr(res.message ?? 'Có lỗi xảy ra');
  }

  return (
    <div className="lm-overlay" onClick={closeLogin} role="dialog" aria-modal="true" aria-label="Đăng nhập">
      <div className="lm" onClick={(e) => e.stopPropagation()}>
        <button className="lm__close" onClick={closeLogin} aria-label="Đóng"><X size={20} /></button>
        <h2 className="lm__title">{tab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</h2>
        <p className="lm__sub">Đăng nhập để tạo & quản lý thiệp cưới của bạn.</p>

        {/* Google OAuth */}
        <button className="lm__google" type="button" onClick={loginWithGoogle} disabled={googleBusy}>
          {googleBusy ? (
            <span className="lm__google-spinner" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.1c-.6 3-2.3 5.5-4.8 7.2v6h7.8c4.6-4.2 7.4-10.5 7.4-17.5z"/>
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.8-6c-2.1 1.4-4.9 2.3-8.1 2.3-6.2 0-11.5-4.2-13.4-9.9H2.6v6.2C6.6 42.8 14.7 48 24 48z"/>
              <path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-2.9-.8-4.6s.3-3.2.8-4.6v-6.2H2.6C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.8l8-6.2z"/>
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.7 0 6.6 5.2 2.6 13.2l8 6.2C12.5 13.7 17.8 9.5 24 9.5z"/>
            </svg>
          )}
          {googleBusy ? 'Đang chuyển hướng…' : 'Tiếp tục với Google'}
        </button>

        <div className="lm__divider"><span>hoặc</span></div>

        <div className="lm__tabs">
          <button type="button" className={tab === 'login' ? 'is-active' : ''} onClick={() => setTab('login')}>Đăng nhập</button>
          <button type="button" className={tab === 'register' ? 'is-active' : ''} onClick={() => setTab('register')}>Đăng ký</button>
        </div>
        <form onSubmit={submit}>
          {tab === 'register' && (
            <input className="lm__in" placeholder="Họ và tên" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} required />
          )}
          <input className="lm__in" type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
          {tab === 'register' && (
            <input className="lm__in" placeholder="Số điện thoại (tuỳ chọn)" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          )}
          <input className="lm__in" type="password" placeholder="Mật khẩu" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
          {err && <div className="lm__err">{err}</div>}
          <button className="lm__submit" type="submit" disabled={busy}>
            {busy ? 'Đang xử lý…' : tab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>
      </div>
    </div>
  );
}
