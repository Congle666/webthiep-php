/** Auth toàn site: giữ user hiện tại + điều khiển modal đăng nhập (popup). */
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { authApi, type AuthUser } from '../api/client';

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  loginOpen: boolean;
  openLogin: (onSuccess?: (u: AuthUser) => void) => void;
  closeLogin: () => void;
  setUser: (u: AuthUser | null) => void;
  logout: () => Promise<void>;
  /** callback chạy sau khi đăng nhập thành công qua modal (1 lần). */
  _onSuccess?: (u: AuthUser) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [onSuccess, setOnSuccess] = useState<((u: AuthUser) => void) | undefined>();

  useEffect(() => {
    authApi.me().then((r) => { if (r.success && r.data) setUser(r.data); }).finally(() => setLoading(false));
  }, []);

  const openLogin = useCallback((cb?: (u: AuthUser) => void) => { setOnSuccess(() => cb); setLoginOpen(true); }, []);
  const closeLogin = useCallback(() => { setLoginOpen(false); setOnSuccess(undefined); }, []);
  const logout = useCallback(async () => { await authApi.logout(); setUser(null); }, []);

  return (
    <Ctx.Provider value={{ user, loading, loginOpen, openLogin, closeLogin, setUser, logout, _onSuccess: onSuccess }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used within AuthProvider');
  return c;
}
