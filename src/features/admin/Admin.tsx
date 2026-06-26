/** Trang quản trị /admin — login gate + dashboard quản lý đầy đủ. */
import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, LayoutTemplate, Heart, Tag, MessageSquareQuote,
  Users, Mail, Settings, LogOut, Loader2, Menu, Palette, Music2, FileText, Sun, Moon,
} from 'lucide-react';
import { authApi, AuthUser } from '../../api/client';
import { useTheme } from '../../context/ThemeContext';
import AdminDashboard from './AdminDashboard';
import { AdminOrders, AdminContacts, AdminUsers } from './AdminTables';
import AdminTemplates from './AdminTemplates';
import AdminDesigner from './AdminDesigner';
import AdminInvitations from './AdminInvitations';
import { AdminPlans, AdminTestimonials, AdminSettings } from './AdminMisc';
import AdminMusic from './AdminMusic';
import AdminBlog from './AdminBlog';
import './Admin.css';

type Tab = 'dashboard' | 'orders' | 'templates' | 'designer' | 'invitations' | 'plans' | 'testimonials' | 'users' | 'contacts' | 'settings' | 'music' | 'blog';

const NAV: { id: Tab; label: string; icon: typeof LayoutDashboard; slug: string }[] = [
  { id: 'dashboard',    label: 'Tổng quan',    icon: LayoutDashboard,      slug: 'tong-quan' },
  { id: 'orders',       label: 'Đơn hàng',     icon: ShoppingBag,          slug: 'don-hang' },
  { id: 'templates',    label: 'Mẫu thiệp',    icon: LayoutTemplate,       slug: 'mau-thiep' },
  { id: 'designer',     label: 'Thiết kế mẫu', icon: Palette,              slug: 'thiet-ke-mau' },
  { id: 'invitations',  label: 'Thiệp sống',   icon: Heart,                slug: 'thiep-song' },
  { id: 'blog',         label: 'Bài viết',     icon: FileText,             slug: 'bai-viet' },
  { id: 'music',        label: 'Nhạc cưới',    icon: Music2,               slug: 'nhac-cuoi' },
  { id: 'plans',        label: 'Gói giá',      icon: Tag,                  slug: 'goi-gia' },
  { id: 'testimonials', label: 'Đánh giá',     icon: MessageSquareQuote,   slug: 'danh-gia' },
  { id: 'users',        label: 'Người dùng',   icon: Users,                slug: 'nguoi-dung' },
  { id: 'contacts',     label: 'Liên hệ',      icon: Mail,                 slug: 'lien-he' },
  { id: 'settings',     label: 'Cài đặt',      icon: Settings,             slug: 'cai-dat' },
];

const slugToTab = (slug?: string): Tab => NAV.find((n) => n.slug === slug)?.id ?? 'dashboard';

export default function Admin() {
  const { tab: tabParam } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const tab = slugToTab(tabParam);
  const setTab = (id: Tab) => {
    const slug = NAV.find((n) => n.id === id)!.slug;
    navigate(`/admin/${slug}`, { replace: false });
  };

  useEffect(() => {
    authApi.me().then((res) => {
      if (res.success && res.data && res.data.role === 'admin') setUser(res.data);
      setChecking(false);
    }).catch(() => setChecking(false));
  }, []);

  if (checking) return <div className="adm-center"><Loader2 className="adm-spin" /> Đang tải...</div>;
  if (!user) return <AdminLogin onLogin={setUser} />;

  const current = NAV.find((n) => n.id === tab)!;

  return (
    <div className="adm-root">
      <aside className={`adm-sidebar ${navOpen ? 'adm-sidebar--open' : ''}`}>
        <div className="adm-brand">JunTech <span>Admin</span></div>
        <nav className="adm-nav">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} className={tab === id ? 'adm-active' : ''} onClick={() => { setTab(id); setNavOpen(false); }}>
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
        <button className="adm-logout" onClick={async () => { await authApi.logout(); setUser(null); }}>
          <LogOut size={16} /> Đăng xuất
        </button>
      </aside>

      <main className="adm-main">
        <header className="adm-header">
          <button className="adm-burger" onClick={() => setNavOpen((o) => !o)} aria-label="Menu"><Menu size={20} /></button>
          <h1>{current.label}</h1>
          <span className="adm-who">{user.fullName}</span>
          <button className="adm-theme-toggle" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Chuyển sáng' : 'Chuyển tối'}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </header>
        {tab === 'dashboard' && <AdminDashboard />}
        {tab === 'orders' && <AdminOrders />}
        {tab === 'templates' && <AdminTemplates />}
        {tab === 'designer' && <AdminDesigner />}
        {tab === 'invitations' && <AdminInvitations />}
        {tab === 'blog' && <AdminBlog />}
        {tab === 'music' && <AdminMusic />}
        {tab === 'plans' && <AdminPlans />}
        {tab === 'testimonials' && <AdminTestimonials />}
        {tab === 'users' && <AdminUsers />}
        {tab === 'contacts' && <AdminContacts />}
        {tab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: (u: AuthUser) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr('');
    const res = await authApi.login({ email, password });
    setLoading(false);
    if (res.success && res.data) {
      if (res.data.role !== 'admin') { setErr('Tài khoản không có quyền quản trị.'); return; }
      onLogin(res.data);
    } else setErr(res.message ?? 'Đăng nhập thất bại.');
  };

  return (
    <div className="adm-login-wrap">
      <form className="adm-login" onSubmit={submit}>
        <div className="adm-brand adm-brand--lg">JunTech <span>Admin</span></div>
        <input className="adm-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="adm-input" type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <p className="adm-err">{err}</p>}
        <button className="adm-btn" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
      </form>
    </div>
  );
}
