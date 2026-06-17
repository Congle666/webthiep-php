/** Popup đăng nhập / đăng ký toàn site. Mở qua useAuth().openLogin(). */
import { useState } from 'react';
import { X } from 'lucide-react';
import { authApi, type AuthUser } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import './LoginModal.css';

export default function LoginModal() {
  const { loginOpen, closeLogin, setUser, _onSuccess } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [f, setF] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (!loginOpen) return null;

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
