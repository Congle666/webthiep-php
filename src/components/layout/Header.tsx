import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Sun, Moon } from 'lucide-react';
import Button from '../common/Button';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

const navLinks = [
  { path: '/mau-thiep', label: 'Mẫu Thiệp' },
  { path: '/bang-gia', label: 'Bảng Giá' },
  { path: '/lien-he', label: 'Liên Hệ' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner container">
        <Link to="/" className="header__logo" aria-label="JunTech Trang Chủ">
          <span className="header__logo-icon"><Heart size={18} fill="currentColor" /></span>
          <span className="header__logo-text">
            Jun<span className="header__logo-accent">Tech</span>
          </span>
        </Link>

        <nav
          className={`header__nav ${mobileOpen ? 'header__nav--open' : ''}`}
          aria-label="Điều hướng chính"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`header__link ${location.pathname === link.path ? 'header__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="header__nav-actions-mobile">
            <Button variant="primary" size="md" href="/lien-he">
              Đăng nhập
            </Button>
          </div>
        </nav>

        <div className="header__actions">
          <button
            className="header__theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Chuyển sáng' : 'Chuyển tối'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Button variant="primary" size="sm" href="/lien-he" className="header__cta">
            Đăng nhập
          </Button>
          <button
            className="header__menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Mở menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && <div className="header__overlay" onClick={() => setMobileOpen(false)} />}
    </header>
  );
}
