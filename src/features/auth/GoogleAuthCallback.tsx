/** Trang /auth/google/success và /auth/google/error — nhận redirect từ backend OAuth. */
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

/** /auth/google/success — backend đã login xong, fetch user rồi về trang chủ. */
export function GoogleSuccess() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    authApi.me().then((r) => {
      if (r.success && r.data) setUser(r.data);
      navigate('/', { replace: true });
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', background: '#fff' }}>
      <div style={{ textAlign: 'center', color: '#6b6168' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✓</div>
        <p>Đăng nhập thành công, đang chuyển hướng…</p>
      </div>
    </div>
  );
}

/** /auth/google/error — hiển thị lỗi rồi về trang chủ. */
export function GoogleError() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const msg = params.get('msg') ?? 'unknown_error';

  const messages: Record<string, string> = {
    state_mismatch:        'Phiên đăng nhập hết hạn, vui lòng thử lại.',
    token_exchange_failed: 'Không thể xác thực với Google, vui lòng thử lại.',
    invalid_token:         'Thông tin Google không hợp lệ.',
    account_blocked:       'Tài khoản của bạn đã bị khoá.',
    access_denied:         'Bạn đã huỷ đăng nhập Google.',
  };

  useEffect(() => {
    const t = setTimeout(() => navigate('/', { replace: true }), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', background: '#fff' }}>
      <div style={{ textAlign: 'center', color: '#b00046', maxWidth: '360px', padding: '24px' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✕</div>
        <p style={{ fontWeight: 600 }}>{messages[msg] ?? 'Đăng nhập thất bại.'}</p>
        <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '8px' }}>Tự chuyển về trang chủ sau 4 giây…</p>
      </div>
    </div>
  );
}
