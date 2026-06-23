import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, Sun, Moon, LogOut, User, FileHeart } from 'lucide-react';
import Button from '../common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const navLinks = [
  { path: '/mau-thiep', label: 'Mẫu Thiệp' },
  { path: '/cam-nang', label: 'Cẩm Nang' },
  { path: '/bang-gia', label: 'Bảng Giá' },
  { path: '/lien-he', label: 'Liên Hệ' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, openLogin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user
    ? user.fullName.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner container">
        <Link to="/" className="header__logo" aria-label="JunTech Trang Chủ">
          <span className="header__logo-icon"><Heart size={18} fill="currentColor" /></span>
          <span className="header__logo-text">
            Jun<span className="header__logo-accent">Tech</span>
          </span>
        </Link>

        <nav className={`header__nav ${mobileOpen ? 'header__nav--open' : ''}`} aria-label="Điều hướng chính">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}
              className={`header__link ${location.pathname === link.path ? 'header__link--active' : ''}`}>
              {link.label}
            </Link>
          ))}
          <div className="header__nav-actions-mobile">
            {user ? (
              <>
                <button className="hdr-mobile-user" onClick={() => { navigate('/tai-khoan'); setMobileOpen(false); }}>
                  <User size={16} /> {user.fullName}
                </button>
                <button className="hdr-mobile-logout" onClick={() => { logout(); setMobileOpen(false); }}>
                  <LogOut size={16} /> Đăng xuất
                </button>
              </>
            ) : (
              <Button variant="primary" size="md" onClick={() => openLogin()}>Đăng nhập</Button>
            )}
          </div>
        </nav>

        <div className="header__actions">
          <button className="header__theme-toggle" onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Chuyển sáng' : 'Chuyển tối'}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="hdr-avatar-wrapper" ref={dropdownRef}>
              <button className="hdr-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Menu tài khoản" aria-expanded={dropdownOpen}>
                {user.avatar
                  ? <img src={user.avatar} alt={user.fullName} className="hdr-avatar-img" />
                  : <span>{initials}</span>}
              </button>
              {dropdownOpen && (
                <div className="hdr-dropdown" role="menu">
                  <div className="hdr-dropdown-header">
                    <span className="hdr-dropdown-name">{user.fullName}</span>
                    <span className="hdr-dropdown-email">{user.email}</span>
                  </div>
                  <div className="hdr-dropdown-divider" />
                  <button className="hdr-dropdown-item" onClick={() => { navigate('/tai-khoan'); setDropdownOpen(false); }}>
                    <FileHeart size={15} /> Thiệp của tôi
                  </button>
                  <button className="hdr-dropdown-item" onClick={() => { navigate('/tai-khoan?tab=guests'); setDropdownOpen(false); }}>
                    <User size={15} /> Quản lý khách mời
                  </button>
                  <div className="hdr-dropdown-divider" />
                  <button className="hdr-dropdown-item hdr-dropdown-logout" onClick={() => { logout(); setDropdownOpen(false); }}>
                    <LogOut size={15} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="primary" size="sm" onClick={() => openLogin()} className="header__cta">
              Đăng nhập
            </Button>
          )}

          <button className="header__menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Mở menu" aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && <div className="header__overlay" onClick={() => setMobileOpen(false)} />}
    </header>
  );
}
