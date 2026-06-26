/**
 * UserPanel — trang quản lý tài khoản người dùng.
 * Tabs: Thiệp của tôi | Khách mời | Tài khoản
 */
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Heart, Users, User, LogOut, Copy, QrCode, Link2,
  Plus, X, ExternalLink, Check, Download, FileHeart,
  ChevronDown, Sun, Moon, BarChart2,
} from 'lucide-react';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { customerApi, type AuthUser } from '../../api/client';
import type { Invitation, Guest, GuestStats } from '../invitation/types';
import './UserPanel.css';

type Tab = 'invitations' | 'guests' | 'account';

const RSVP_LABEL: Record<Guest['rsvpStatus'], string> = {
  yes: 'Sẽ đến', no: 'Không đến', maybe: 'Có thể', pending: 'Chưa trả lời',
};
const RSVP_CLASS: Record<Guest['rsvpStatus'], string> = {
  yes: 'up-badge-green', no: 'up-badge-gray', maybe: 'up-badge-pink', pending: 'up-badge-gray',
};

function AvatarCircle({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className="up-avatar" style={{ width: size, height: size, fontSize: size * 0.35 }}>
      {initials}
    </div>
  );
}

// ── QR Modal ──────────────────────────────────────────────────────────────────
function QrModal({ url, onClose }: { url: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}`;

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div className="up-modal-overlay" onClick={onClose}>
      <div className="up-modal" onClick={e => e.stopPropagation()}>
        <button className="up-modal-close" onClick={onClose}><X size={18} /></button>
        <h3 className="up-modal-title">Mã QR thiệp cưới</h3>
        <img src={qrSrc} alt="QR Code" className="up-qr-img" width={220} height={220} />
        <p className="up-modal-url">{url}</p>
        <div className="up-modal-actions">
          <button className="up-btn up-btn-outline" onClick={copy}>
            {copied ? <><Check size={14} /> Đã copy</> : <><Copy size={14} /> Copy link</>}
          </button>
          <a className="up-btn up-btn-outline" href={qrSrc} download="qr-thiep-cuoi.png" target="_blank" rel="noreferrer">
            <Download size={14} /> Tải QR
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Thiệp của tôi ────────────────────────────────────────────────────────
function TabInvitations({ onGuestTab }: { onGuestTab: (slug: string) => void }) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerApi.myInvitations().then(r => {
      if (r.success && r.data) setInvitations(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="up-loading">Đang tải...</div>;

  if (!invitations.length) return (
    <div className="up-empty">
      <Heart size={48} className="up-empty-icon" />
      <h3>Chưa có thiệp nào</h3>
      <p>Tạo thiệp cưới đầu tiên của bạn ngay hôm nay!</p>
      <Link to="/mau-thiep" className="up-btn up-btn-primary">Chọn mẫu thiệp</Link>
    </div>
  );

  const statusData = [
    { name: 'Đã đăng', value: invitations.filter(i => i.isPublished).length, color: '#00b450' },
    { name: 'Nháp', value: invitations.filter(i => !i.isPublished).length, color: '#6b6470' },
  ].filter(d => d.value > 0);

  return (
    <div>
      <div className="up-section-header">
        <h2 className="up-section-title">Thiệp của tôi</h2>
        <Link to="/mau-thiep" className="up-btn up-btn-primary"><Plus size={14} /> Tạo thiệp mới</Link>
      </div>

      {/* Stats row */}
      <div className="up-stats-row">
        <div className="up-stat-card">
          <span className="up-stat-num">{invitations.length}</span>
          <span className="up-stat-label">Tổng thiệp</span>
        </div>
        <div className="up-stat-card">
          <span className="up-stat-num up-stat-green">{invitations.filter(i => i.isPublished).length}</span>
          <span className="up-stat-label">Đã đăng</span>
        </div>
        <div className="up-stat-card">
          <span className="up-stat-num">{invitations.filter(i => !i.isPublished).length}</span>
          <span className="up-stat-label">Nháp</span>
        </div>
      </div>

      {/* Charts */}
      {invitations.length > 0 && (
        <div className="up-charts-row">
          {/* Pie chart: trạng thái thiệp */}
          {statusData.length > 1 && (
            <div className="up-chart-card up-chart-card-sm">
              <div className="up-chart-title">Trạng thái thiệp</div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    dataKey="value" paddingAngle={3}>
                    {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Legend formatter={(v) => <span style={{ fontSize: 12, color: '#888' }}>{v}</span>} />
                  <Tooltip contentStyle={{ background: '#1a1820', border: '1px solid #333', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      <div className="up-inv-grid">
        {invitations.map(inv => (
          <div key={inv.slug} className="up-inv-card">
            <div className="up-inv-card-header">
              <div className="up-inv-names">{inv.groomName || 'Chú rể'} &amp; {inv.brideName || 'Cô dâu'}</div>
              <span className={`up-badge ${inv.isPublished ? 'up-badge-green' : 'up-badge-gray'}`}>
                {inv.isPublished ? 'Đã đăng' : 'Nháp'}
              </span>
            </div>
            {inv.weddingDate && (
              <div className="up-inv-date">
                {new Date(inv.weddingDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </div>
            )}
            {inv.venueName && <div className="up-inv-venue">{inv.venueName}</div>}
            <div className="up-inv-actions">
              <Link to={`/chinh-sua/${inv.slug}`} className="up-btn up-btn-sm up-btn-outline">
                Chỉnh sửa
              </Link>
              <button className="up-btn up-btn-sm up-btn-outline" onClick={() => onGuestTab(inv.slug)}>
                <Users size={13} /> Khách mời
              </button>
              {inv.isPublished && (
                <a href={`/thiep/${inv.slug}`} target="_blank" rel="noreferrer" className="up-btn up-btn-sm up-btn-ghost">
                  <ExternalLink size={13} /> Xem
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Khách mời ────────────────────────────────────────────────────────────
function TabGuests({ defaultSlug }: { defaultSlug?: string }) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedSlug, setSelectedSlug] = useState(defaultSlug ?? '');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<GuestStats | null>(null);
  const [newName, setNewName] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showQr, setShowQr] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestsLoading, setGuestsLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const origin = window.location.origin;

  useEffect(() => {
    customerApi.myInvitations().then(r => {
      if (r.success && r.data && r.data.length > 0) {
        setInvitations(r.data);
        if (!defaultSlug) setSelectedSlug(r.data[0].slug);
      }
      setLoading(false);
    });
  }, [defaultSlug]);

  const loadGuests = (slug: string) => {
    if (!slug) return;
    setGuestsLoading(true);
    customerApi.guests.list(slug).then(r => {
      if (r.success && r.data) { setGuests(r.data.guests); setStats(r.data.stats); }
      setGuestsLoading(false);
    });
  };

  useEffect(() => { loadGuests(selectedSlug); }, [selectedSlug]);

  const invUrl = selectedSlug ? `${origin}/thiep/${selectedSlug}` : '';
  const familyUrl = selectedSlug ? `${origin}/tai-khoan/family/${selectedSlug}` : '';

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleAddSingle = async () => {
    const name = newName.trim();
    if (!name || !selectedSlug || adding) return;
    setAdding(true); setErr('');
    const r = await customerApi.guests.create(selectedSlug, { name, tag: newTag.trim() || undefined });
    setAdding(false);
    if (r.success) {
      setNewName(''); setNewTag('');
      loadGuests(selectedSlug);
      inputRef.current?.focus();
    } else {
      setErr(r.message ?? 'Không thêm được khách.');
    }
  };

  const removeGuest = async (id: number) => {
    const r = await customerApi.guests.remove(selectedSlug, id);
    if (r.success) loadGuests(selectedSlug);
  };

  // Link riêng dùng token (?g=). Tương thích link cũ ?khach=.
  const guestLink = (g: Guest) => `${invUrl}?g=${encodeURIComponent(g.token)}`;

  if (loading) return <div className="up-loading">Đang tải...</div>;
  if (!invitations.length) return (
    <div className="up-empty">
      <Users size={48} className="up-empty-icon" />
      <h3>Chưa có thiệp nào</h3>
      <Link to="/mau-thiep" className="up-btn up-btn-primary">Tạo thiệp ngay</Link>
    </div>
  );

  return (
    <div>
      <div className="up-section-header">
        <h2 className="up-section-title">Quản lý khách mời</h2>
      </div>

      {/* Chọn thiệp */}
      <div className="up-select-wrapper">
        <label className="up-label">CHỌN THIỆP CẦN MỜI KHÁCH</label>
        <div className="up-select-box">
          <select className="up-select" value={selectedSlug} onChange={e => setSelectedSlug(e.target.value)}>
            {invitations.map(inv => (
              <option key={inv.slug} value={inv.slug}>
                {inv.groomName || 'Chú rể'} &amp; {inv.brideName || 'Cô dâu'}
                {inv.isPublished ? ' ●' : ' ○'}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="up-select-icon" />
        </div>
      </div>

      {/* Thống kê RSVP */}
      {stats && (
        <div className="up-stats-row">
          <div className="up-stat-card">
            <span className="up-stat-num">{stats.total}</span>
            <span className="up-stat-label">Tổng khách</span>
          </div>
          <div className="up-stat-card">
            <span className="up-stat-num up-stat-green">{stats.yes}</span>
            <span className="up-stat-label">Sẽ đến</span>
          </div>
          <div className="up-stat-card">
            <span className="up-stat-num">{stats.no}</span>
            <span className="up-stat-label">Không đến</span>
          </div>
          <div className="up-stat-card">
            <span className="up-stat-num up-stat-pink">{stats.pending}</span>
            <span className="up-stat-label">Chưa trả lời</span>
          </div>
          <div className="up-stat-card">
            <span className="up-stat-num">{stats.opened}</span>
            <span className="up-stat-label">Đã mở thiệp</span>
          </div>
        </div>
      )}

      {/* Chia sẻ link chung */}
      <div className="up-share-card">
        <div className="up-share-card-title"><BarChart2 size={15} /> Công cụ chia sẻ</div>
        <div className="up-share-label">CHIA SẺ LINK CHUNG</div>
        <div className="up-share-url-row">
          <span className="up-share-url">/thiep/{selectedSlug}</span>
          <span className="up-share-hint">Dùng cho nhóm chat, mạng xã hội và in thiệp giấy</span>
        </div>
        <div className="up-share-actions">
          <button className="up-share-btn" onClick={() => copyText(invUrl, 'main')}>
            {copied === 'main' ? <><Check size={15} /> Đã copy!</> : <><Link2 size={15} /> Chia sẻ link</>}
          </button>
          <button className="up-share-btn" onClick={() => setShowQr(invUrl)}>
            <QrCode size={15} /> Mã QR
          </button>
        </div>
        <button className="up-family-btn" onClick={() => copyText(familyUrl, 'family')}>
          <Users size={15} />
          {copied === 'family' ? 'Đã copy link người nhà!' : 'Mời người nhà cùng thêm khách'}
        </button>
        <p className="up-family-hint">Gửi link này cho người thân để họ cùng thêm danh sách khách mời</p>
      </div>

      {/* Danh sách khách riêng */}
      <div className="up-guest-section">
        <div className="up-guest-section-header">
          <span className="up-share-label">MỜI KHÁCH RIÊNG (LINK + QR THEO TÊN)</span>
          <div className="up-guest-count-row">
            <span className="up-guest-count">Tổng: {guests.length} khách</span>
          </div>
        </div>

        {/* Thêm khách mới */}
        <div className="up-add-guest">
          <input
            ref={inputRef}
            className="up-add-input"
            placeholder="Tên khách mời..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddSingle()}
          />
          <input
            className="up-add-input"
            placeholder="Nhóm (Nhà gái, Bạn CR...)"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddSingle()}
            style={{ maxWidth: 180 }}
          />
          <button className="up-btn up-btn-primary" onClick={handleAddSingle} disabled={!newName.trim() || adding}>
            <Plus size={14} /> {adding ? 'Đang thêm...' : 'Thêm'}
          </button>
        </div>
        {err && <p className="up-family-hint" style={{ color: '#e6017e' }}>{err}</p>}

        {guestsLoading ? <div className="up-loading">Đang tải khách...</div> : guests.length > 0 && (
          <div className="up-guest-table-wrap">
            <table className="up-guest-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên khách</th>
                  <th>Nhóm</th>
                  <th>RSVP</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((g, i) => {
                  const link = guestLink(g);
                  const key = `guest-${g.id}`;
                  return (
                    <tr key={g.id}>
                      <td className="up-guest-num">{i + 1}</td>
                      <td className="up-guest-name">
                        {g.name}
                        {g.openedAt && <span className="up-guest-link-text" title="Đã mở thiệp"> · đã mở</span>}
                      </td>
                      <td className="up-guest-link">{g.tag || '—'}</td>
                      <td>
                        <span className={`up-badge ${RSVP_CLASS[g.rsvpStatus]}`}>
                          {RSVP_LABEL[g.rsvpStatus]}{g.rsvpStatus === 'yes' && g.rsvpCount > 1 ? ` (${g.rsvpCount})` : ''}
                        </span>
                      </td>
                      <td className="up-guest-actions-cell">
                        <button className="up-icon-btn" title="Copy link riêng" onClick={() => copyText(link, key)}>
                          {copied === key ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <button className="up-icon-btn" title="Xem QR" onClick={() => setShowQr(link)}>
                          <QrCode size={14} />
                        </button>
                        <a className="up-icon-btn" href={link} target="_blank" rel="noreferrer" title="Mở thiệp">
                          <ExternalLink size={14} />
                        </a>
                        <button className="up-icon-btn up-icon-btn-danger" title="Xoá" onClick={() => removeGuest(g.id)}>
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showQr && <QrModal url={showQr} onClose={() => setShowQr(null)} />}
    </div>
  );
}

// ── Tab: Tài khoản ────────────────────────────────────────────────────────────
function TabAccount({ user }: { user: AuthUser }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerApi.myOrders().then(r => {
      if (r.success && r.data) setOrders(r.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="up-section-header">
        <h2 className="up-section-title">Tài khoản</h2>
      </div>

      {/* Profile */}
      <div className="up-profile-card">
        <AvatarCircle name={user.fullName} size={72} />
        <div className="up-profile-info">
          <div className="up-profile-name">{user.fullName}</div>
          <div className="up-profile-email">{user.email}</div>
          {user.phone && <div className="up-profile-phone">{user.phone}</div>}
          <span className="up-badge up-badge-pink">{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</span>
        </div>
        <button className="up-btn up-btn-outline up-btn-sm up-profile-edit" disabled title="Tính năng đang phát triển">
          Chỉnh sửa
        </button>
      </div>

      {/* Orders */}
      <div className="up-section-header" style={{ marginTop: 32 }}>
        <h3 className="up-section-title" style={{ fontSize: '1rem' }}>Đơn hàng của tôi</h3>
      </div>

      {loading ? <div className="up-loading">Đang tải...</div> : (
        orders.length === 0 ? (
          <div className="up-empty up-empty-sm">
            <p>Chưa có đơn hàng nào.</p>
            <Link to="/bang-gia" className="up-btn up-btn-outline up-btn-sm">Xem bảng giá</Link>
          </div>
        ) : (
          <div className="up-guest-table-wrap">
            <table className="up-guest-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Mẫu thiệp</th>
                  <th>Gói</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o: any) => (
                  <tr key={o.id}>
                    <td><code>{o.orderCode ?? o.id}</code></td>
                    <td>{o.templateName ?? o.template_id ?? '—'}</td>
                    <td>{o.planCode ?? o.plan_code ?? '—'}</td>
                    <td>{o.amount ? `${Number(o.amount).toLocaleString('vi-VN')}đ` : '—'}</td>
                    <td>
                      <span className={`up-badge ${o.paymentStatus === 'paid' ? 'up-badge-green' : 'up-badge-gray'}`}>
                        {o.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

// ── Main UserPanel ─────────────────────────────────────────────────────────────
export default function UserPanel() {
  const { user, loading, openLogin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const t = searchParams.get('tab');
    if (t === 'guests' || t === 'account') return t;
    return 'invitations';
  });
  const [guestSlug, setGuestSlug] = useState<string | undefined>();

  useEffect(() => {
    if (!loading && !user) openLogin(() => navigate('/'));
  }, [loading, user, openLogin, navigate]);

  if (loading) return <div className="up-root"><div className="up-loading up-loading-full">Đang tải...</div></div>;
  if (!user) return null;

  const handleGuestTab = (slug: string) => {
    setGuestSlug(slug);
    setTab('guests');
  };

  const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'invitations', label: 'Thiệp của tôi', icon: <FileHeart size={18} /> },
    { id: 'guests', label: 'Khách mời', icon: <Users size={18} /> },
    { id: 'account', label: 'Tài khoản', icon: <User size={18} /> },
  ];

  return (
    <div className="up-root">
      {/* Top bar */}
      <header className="up-topbar">
        <Link to="/" className="up-topbar-logo">
          <span className="up-topbar-logo-icon"><Heart size={16} fill="currentColor" /></span>
          Jun<span className="up-topbar-logo-accent">Tech</span>
        </Link>
        <div className="up-topbar-right">
          <button className="up-topbar-theme" onClick={toggleTheme} aria-label="Chuyển theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className="up-topbar-user">
            <AvatarCircle name={user.fullName} size={32} />
            <span className="up-topbar-name">{user.fullName}</span>
          </div>
          <button className="up-topbar-logout" onClick={() => { logout(); navigate('/'); }}>
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="up-layout">
        {/* Sidebar */}
        <aside className="up-sidebar">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`up-sidebar-item ${tab === n.id ? 'up-sidebar-item--active' : ''}`}
              onClick={() => setTab(n.id)}
            >
              {n.icon}
              <span>{n.label}</span>
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="up-content">
          {tab === 'invitations' && <TabInvitations onGuestTab={handleGuestTab} />}
          {tab === 'guests' && <TabGuests defaultSlug={guestSlug} />}
          {tab === 'account' && <TabAccount user={user} />}
        </main>
      </div>
    </div>
  );
}
