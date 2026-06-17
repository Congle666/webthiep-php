import { Link } from 'react-router-dom';
import { Heart, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import './Footer.css';

const columns = [
  {
    title: 'Sản Phẩm',
    links: [
      { label: 'Mẫu thiệp', to: '/mau-thiep' },
      { label: 'Bảng giá', to: '/bang-gia' },
      { label: 'Hướng dẫn tạo thiệp', to: '/mau-thiep' },
    ],
  },
  {
    title: 'Công Cụ',
    links: [
      { label: 'Tải số lượng lớn', to: '/lien-he' },
      { label: 'Bảng giá', to: '/bang-gia' },
      { label: 'Hướng dẫn sử dụng', to: '/mau-thiep' },
    ],
  },
  {
    title: 'Tài Nguyên',
    links: [
      { label: 'Cẩm nang cưới', to: '/mau-thiep' },
      { label: 'Danh sách khách mời', to: '/lien-he' },
      { label: 'Hỏi đáp thiệp cưới', to: '/bang-gia' },
    ],
  },
  {
    title: 'Pháp Lý',
    links: [
      { label: 'Điều khoản', to: '/lien-he' },
      { label: 'Chính sách bảo mật', to: '/lien-he' },
      { label: 'Liên hệ', to: '/lien-he' },
    ],
  },
];

const socials = [
  { icon: <Facebook size={18} />, label: 'Facebook' },
  { icon: <Instagram size={18} />, label: 'Instagram' },
  { icon: <Youtube size={18} />, label: 'Youtube' },
  { icon: <MessageCircle size={18} />, label: 'Zalo' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo" aria-label="JunTech Trang Chủ">
              <span className="footer__logo-icon"><Heart size={16} fill="currentColor" /></span>
              <span className="footer__logo-text">
                Jun<span className="footer__logo-accent">Tech</span>
              </span>
            </Link>
            <p className="footer__tagline">
              Tạo thiệp cưới online miễn phí, đẹp và chuyên nghiệp. Gửi link nhanh chóng qua Zalo,
              Messenger cho ngày trọng đại của bạn.
            </p>
            <div className="footer__socials">
              {socials.map((s) => (
                <a key={s.label} href="#" className="footer__social" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="footer__col">
              <h4 className="footer__col-title">{col.title}</h4>
              {col.links.map((link) => (
                <Link key={link.label} to={link.to} className="footer__link">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">© 2026 JunTech. Bản quyền thuộc về JunTech.</p>
          <p className="footer__made-with">
            Made with <Heart size={13} className="footer__heart" fill="currentColor" /> in Vietnam
          </p>
        </div>
      </div>
    </footer>
  );
}
