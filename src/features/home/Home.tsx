import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ChevronLeft, ChevronRight, MousePointerClick, Pencil, Send,
  Check, Plus, Minus, Heart,
} from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';
import Button from '../../components/common/Button';
import { useTemplates, useTestimonials } from '../../hooks/useCatalog';
import type { Template } from '../../data/types';
import './Home.css';

/* ===== Mini wedding card (CSS) dùng trong phone mockup ===== */
function MiniCard({ groom = 'Minh Triết', bride = 'Khánh Linh' }: { groom?: string; bride?: string }) {
  return (
    <div className="mini-card">
      <span className="mini-card__label">THE WEDDING OF</span>
      <h3 className="mini-card__name">{groom}</h3>
      <span className="mini-card__amp">&</span>
      <h3 className="mini-card__name">{bride}</h3>
      <div className="mini-card__photo"><Heart size={20} fill="currentColor" /></div>
      <p className="mini-card__date">20 · 10 · 2026</p>
      <p className="mini-card__venue">GEM Center, Quận 1</p>
    </div>
  );
}

function Phone({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`phone ${className}`}>
      <span className="phone__notch" />
      <div className="phone__screen">{children}</div>
    </div>
  );
}

/* ===== HERO ===== */
function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" />
      <div className="container hero__inner">
        <motion.div
          className="hero__left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="hero__brand">JunTech · Thiệp cưới online</span>
          <h1 className="hero__title">
            Tạo thiệp cưới online <span className="text-accent">miễn phí</span> trong{' '}
            <span className="text-accent">10 phút</span>
          </h1>
          <p className="hero__sub">
            Hàng trăm mẫu thiệp đẹp, hiện đại. Cá nhân hóa tên, ảnh, nhạc nền rồi gửi link cho
            quan khách qua Zalo, Messenger chỉ trong vài phút.
          </p>
          <div className="hero__actions">
            <Button variant="primary" size="lg" href="/mau-thiep">
              Tạo Thiệp Ngay <ArrowRight size={18} />
            </Button>
            <Button variant="secondary" size="lg" href="/bang-gia">
              Hướng Dẫn →
            </Button>
          </div>
          <p className="hero__caption">Tạo miễn phí · Thử 1 ngày · Đẹp mọi thiết bị</p>
        </motion.div>

        <motion.div
          className="hero__right"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Phone className="phone--tilt-l"><MiniCard groom="Quốc Anh" bride="Thảo My" /></Phone>
          <Phone className="phone--front"><MiniCard /></Phone>
          <Phone className="phone--tilt-r"><MiniCard groom="Đức Huy" bride="Mai Anh" /></Phone>
        </motion.div>
      </div>
    </section>
  );
}

/* ===== SHOWCASE carousel 3D ===== */
function Showcase({ templates }: { templates: Template[] }) {
  const items = templates.slice(0, 6);
  const [index, setIndex] = useState(0);
  const total = items.length;
  if (total === 0) return null;

  const go = (dir: number) => setIndex((p) => (p + dir + total) % total);

  return (
    <section className="section showcase">
      <div className="container">
        <ScrollReveal>
          <div className="section-head">
            <h2>Mẫu thiệp cưới online <span className="text-accent">đẹp nhất</span></h2>
            <p>Bộ sưu tập được yêu thích nhất, thiết kế tinh tế cho ngày trọng đại.</p>
          </div>
        </ScrollReveal>

        <div className="carousel">
          <button className="carousel__arrow" onClick={() => go(-1)} aria-label="Mẫu trước">
            <ChevronLeft size={22} />
          </button>

          <div className="carousel__stage">
            {items.map((t, i) => {
              const offset = (i - index + total) % total;
              const pos = offset > total / 2 ? offset - total : offset;
              if (Math.abs(pos) > 1) return null;
              return (
                <Link
                  key={t.id}
                  to={`/mau-thiep/${t.slug}`}
                  className={`carousel__card carousel__card--${pos === 0 ? 'center' : pos < 0 ? 'left' : 'right'}`}
                >
                  <div className="carousel__card-img">
                    <Heart size={28} />
                    <span>{t.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <button className="carousel__arrow" onClick={() => go(1)} aria-label="Mẫu sau">
            <ChevronRight size={22} />
          </button>
        </div>

        <div className="carousel__dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`carousel__dot ${i === index ? 'carousel__dot--active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Mẫu ${i + 1}`}
            />
          ))}
        </div>

        <ScrollReveal>
          <div className="section-cta">
            <Button variant="secondary" size="lg" href="/mau-thiep">
              Xem tất cả mẫu thiệp <ChevronRight size={18} />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ===== STEPS ===== */
const steps = [
  { icon: <MousePointerClick size={20} />, title: 'Chọn mẫu', desc: 'Duyệt kho thiệp và chọn mẫu yêu thích phù hợp phong cách.' },
  { icon: <Pencil size={20} />, title: 'Điền thông tin', desc: 'Cập nhật tên, ngày giờ, địa điểm, ảnh và nhạc nền của bạn.' },
  { icon: <Send size={20} />, title: 'Gửi thiệp', desc: 'Nhận link thiệp cưới và gửi đến quan khách ngay lập tức.' },
];

function Steps() {
  return (
    <section className="section steps">
      <div className="container steps__grid">
        <ScrollReveal direction="left">
          <div className="steps__list">
            <h2>Tạo thiệp cưới online trong <span className="text-accent">10 phút</span></h2>
            <div className="steps__items">
              {steps.map((s, i) => (
                <div key={i} className="step">
                  <span className="step__num">{i + 1}</span>
                  <div className="step__body">
                    <h3 className="step__title">{s.icon} {s.title}</h3>
                    <p className="step__desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="primary" size="lg" href="/mau-thiep">
              Bắt đầu tạo thiệp <ArrowRight size={18} />
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" className="steps__preview">
          <Phone className="phone--front"><MiniCard /></Phone>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ===== STATS banner ===== */
const stats = [
  { value: '58.483', label: 'Đăng ký' },
  { value: '82.027', label: 'Thiệp tạo' },
  { value: '1.6M', label: 'Lượt xem' },
];

function StatsBanner() {
  return (
    <section className="stats-banner">
      <div className="container">
        <ScrollReveal>
          <h2 className="stats-banner__title">
            Hơn 58.000 cặp đôi đã tạo thiệp cưới online cùng JunTech
          </h2>
          <div className="stats-banner__row">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <span className="stat__value">{s.value}</span>
                <span className="stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ===== TESTIMONIALS (dark, chat bubbles) ===== */
function Testimonials() {
  const items = useTestimonials();
  const [speed, setSpeed] = useState<'fast' | 'day'>('fast');

  return (
    <section className="section section--dark testimonials">
      <div className="container">
        <ScrollReveal>
          <div className="section-head section-head--on-dark">
            <h2>Khi bạn cần, tụi mình luôn có mặt</h2>
            <div className="chips">
              <button
                className={`chip ${speed === 'fast' ? 'chip--active' : ''}`}
                onClick={() => setSpeed('fast')}
              >
                &lt; 1 phút
              </button>
              <button
                className={`chip ${speed === 'day' ? 'chip--active' : ''}`}
                onClick={() => setSpeed('day')}
              >
                Trong ngày
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="bubbles">
          {items.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.08}>
              <div className={`bubble ${i % 2 === 0 ? 'bubble--left' : 'bubble--right'}`}>
                <p className="bubble__text">{t.quote}</p>
                <span className="bubble__author">{t.avatar} {t.name}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="carousel__dots carousel__dots--on-dark">
          {items.map((_, i) => (
            <span key={i} className={`carousel__dot ${i === 0 ? 'carousel__dot--active' : ''}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== MULTILANG (dark) ===== */
const langChips = ['Tiếng Việt', 'English', '简体中文', 'Español', 'Français', 'Русский', 'Bahasa', 'Deutsch'];
const langChecklist = [
  'Thiệp hiển thị song song hai ngôn ngữ',
  'Hỗ trợ hiển thị song song nội dung',
  'Có sẵn bản dịch mẫu chuyên nghiệp',
  'Tùy chỉnh bản dịch dễ dàng',
];

function MultiLang() {
  return (
    <section className="section section--dark multilang">
      <div className="container multilang__grid">
        <ScrollReveal direction="left" className="multilang__visual">
          <Phone className="phone--front">
            <div className="mini-card">
              <span className="mini-card__label">THE WEDDING OF</span>
              <h3 className="mini-card__name">Chú Rể</h3>
              <span className="mini-card__amp">&</span>
              <h3 className="mini-card__name">Cô Dâu</h3>
              <div className="mini-card__photo"><Heart size={20} fill="currentColor" /></div>
              <p className="mini-card__date">The Groom &amp; The Bride</p>
              <p className="mini-card__venue">Song ngữ · Bilingual</p>
            </div>
          </Phone>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div className="multilang__content">
            <h2>Hỗ trợ <span className="text-accent">Đa Ngôn Ngữ</span></h2>
            <p className="multilang__sub">
              Thiệp cưới của bạn sẵn sàng cho khách mời quốc tế với khả năng hiển thị song ngữ
              linh hoạt.
            </p>
            <ul className="check-list">
              {langChecklist.map((c) => (
                <li key={c} className="check-list__item">
                  <span className="check-list__icon"><Check size={14} /></span> {c}
                </li>
              ))}
            </ul>
            <div className="lang-chips">
              {langChips.map((l) => (
                <span key={l} className="lang-chip">{l}</span>
              ))}
            </div>
            <Button variant="primary" size="lg" href="/mau-thiep">
              Tạo thiệp ngay <ArrowRight size={18} />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ===== INSPIRATION grid ===== */
function Inspiration({ templates }: { templates: Template[] }) {
  const items = templates.slice(0, 6);
  return (
    <section className="section inspiration">
      <div className="container">
        <ScrollReveal>
          <div className="section-head">
            <h2>Cảm hứng từ những <span className="text-accent">cặp đôi</span></h2>
            <p>Khám phá những mẫu thiệp đã được các cặp đôi tin chọn.</p>
          </div>
        </ScrollReveal>
        <div className="inspiration__grid">
          {items.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.06}>
              <Link to={`/mau-thiep/${t.slug}`} className="insp-card">
                <div className="insp-card__img"><Heart size={26} /></div>
                <div className="insp-card__overlay">
                  <span className="insp-card__couple">{t.name}</span>
                  <span className="insp-card__cat">{t.category}</span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal>
          <div className="section-cta">
            <Button variant="secondary" size="lg" href="/mau-thiep">
              Xem tất cả mẫu thiệp <ChevronRight size={18} />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ===== BLOG ===== */
const posts = [
  { title: 'Cách lập danh sách khách mời đám cưới Việt', tag: 'Cẩm nang' },
  { title: 'Thiệp cưới giấy hay điện tử — cách nào tốt hơn?', tag: 'So sánh' },
  { title: 'Thiệp Cưới Song Ngữ: Anh Việt, Hoa Việt, Hàn Việt', tag: 'Song ngữ' },
];

function Blog() {
  return (
    <section className="section blog">
      <div className="container">
        <ScrollReveal>
          <div className="section-head">
            <h2>Cẩm nang <span className="text-accent">thiệp cưới online</span></h2>
            <p>Kiến thức và mẹo hữu ích cho ngày cưới của bạn.</p>
          </div>
        </ScrollReveal>
        <div className="blog__grid">
          {posts.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.08}>
              <article className="blog-card">
                <div className="blog-card__img"><Heart size={22} /></div>
                <div className="blog-card__body">
                  <span className="blog-card__tag">{p.tag}</span>
                  <h3 className="blog-card__title">{p.title}</h3>
                  <span className="blog-card__more">Đọc tiếp →</span>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal>
          <div className="section-cta">
            <Button variant="secondary" size="lg" href="/mau-thiep">
              Xem tất cả bài viết <ChevronRight size={18} />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ===== FAQ ===== */
const faqs = [
  { q: 'Tạo thiệp cưới online có miễn phí không?', a: 'Bạn có thể tạo và xem trước thiệp hoàn toàn miễn phí. Khi muốn xuất bản và chia sẻ link lâu dài, bạn chọn một gói thuê phù hợp với nhu cầu.' },
  { q: 'Tôi có thể chỉnh sửa thông tin sau khi tạo thiệp không?', a: 'Hoàn toàn được. Bạn có thể thay đổi tên, ngày giờ, địa điểm, album ảnh và nhạc nền bất kỳ lúc nào trong thời hạn thuê. Hệ thống cập nhật ngay sau khi lưu.' },
  { q: 'Thiệp hiển thị thế nào trên điện thoại?', a: 'Tất cả mẫu thiệp đều tối ưu cho di động với giao diện responsive mượt mà, hình ảnh sắc nét và font chữ dễ đọc như một ứng dụng cao cấp.' },
  { q: 'Làm sao nhận phản hồi RSVP của khách mời?', a: 'Khi khách xác nhận tham dự trên thiệp, hệ thống gửi thông báo qua Zalo/Email và cập nhật vào trang quản trị danh sách khách mời theo thời gian thực.' },
  { q: 'Tôi có thể dùng nhạc nền riêng không?', a: 'Có. Với gói Cao Cấp và VIP, bạn có thể tải lên file MP3 yêu thích hoặc dán link YouTube để phát tự động khi khách mở thiệp.' },
  { q: 'Thiệp có hỗ trợ song ngữ không?', a: 'Có. JunTech hỗ trợ hiển thị song song nhiều ngôn ngữ, kèm bản dịch mẫu và cho phép bạn tùy chỉnh nội dung dịch dễ dàng.' },
  { q: 'Thanh toán và kích hoạt thiệp ra sao?', a: 'Chúng tôi hỗ trợ chuyển khoản ngân hàng, Momo, ZaloPay. Sau khi thanh toán, tài khoản thiết kế thiệp được kích hoạt trong vòng dưới 1 phút.' },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section faq">
      <div className="container container--narrow">
        <ScrollReveal>
          <div className="section-head">
            <h2>Câu hỏi thường gặp về <span className="text-accent">thiệp cưới online</span></h2>
          </div>
        </ScrollReveal>
        <div className="faq__list">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <ScrollReveal key={i} delay={i * 0.04}>
                <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
                  <button
                    className="faq-item__trigger"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span>{f.q}</span>
                    <span className="faq-item__icon">{isOpen ? <Minus size={16} /> : <Plus size={16} />}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="faq-item__content"
                      >
                        <p>{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===== PAGE ===== */
export default function Home() {
  const { templates } = useTemplates();

  return (
    <main>
      <Hero />
      <Showcase templates={templates} />
      <Steps />
      <StatsBanner />
      <Testimonials />
      <MultiLang />
      <Inspiration templates={templates} />
      <Blog />
      <Faq />
    </main>
  );
}
