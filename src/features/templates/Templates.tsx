import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Filter, HelpCircle, Plus, Minus, Sparkles } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';
import Button from '../../components/common/Button';
import { categories, formatPrice } from '../../data';
import { CategoryFilter, Template } from '../../data/types';
import { useTemplates } from '../../hooks/useCatalog';
import { TemplateModal } from '../home/TemplateModal';
import './Templates.css';

const FAQS = [
  { q: 'Tôi có thể đổi mẫu thiệp sau khi đã chọn không?', a: 'Được! Trong lúc chỉnh sửa, bạn có thể đổi sang mẫu khác bất cứ lúc nào — nội dung đã nhập vẫn được giữ lại.' },
  { q: 'Mỗi mẫu thiệp có chỉnh sửa được nội dung không?', a: 'Có. Mọi mẫu đều cho phép tùy chỉnh tên cô dâu chú rể, ngày giờ, địa điểm, album ảnh, nhạc nền, RSVP, sổ lưu bút... Hệ thống cập nhật ngay khi bạn lưu.' },
  { q: 'Thiệp hiển thị trên điện thoại có đẹp không?', a: 'Tất cả mẫu đều tối ưu 100% cho di động — responsive mượt, hình sắc nét, font dễ đọc như một ứng dụng cao cấp.' },
  { q: 'Tôi xem thử thiệp trước khi thuê được không?', a: 'Được. Mỗi mẫu có nút "Xem demo" để xem thiệp thật trước khi quyết định tạo thiệp của riêng bạn.' },
  { q: 'Có mất phí khi tạo thử thiệp không?', a: 'Tạo và tùy chỉnh thiệp hoàn toàn miễn phí. Bạn chỉ thanh toán khi muốn đăng (publish) thiệp để gửi cho khách mời.' },
];

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [modal, setModal] = useState<Template | null>(null);
  const navigate = useNavigate();
  const { templates: filtered } = useTemplates(activeCategory);

  return (
    <main className="templates-page">
      <section className="templates-hero">
        <div className="templates-hero__glow" />
        <div className="container">
          <ScrollReveal>
            <span className="label">Bộ sưu tập</span>
            <h1>Mẫu Thiệp Cưới<br /><span className="text-gradient">Online.</span></h1>
            <p className="templates-hero__sub">Khám phá hơn 500 mẫu thiệp cưới đẹp, từ sang trọng đến tối giản — tất cả đều sẵn sàng cho ngày trọng đại.</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section--sm">
        <div className="container">
          <ScrollReveal>
            <div className="templates-filter">
              <Filter size={16} />
              {categories.map(cat => (
                <button
                  key={cat.value}
                  className={`templates-filter__btn ${activeCategory === cat.value ? 'templates-filter__btn--active' : ''}`}
                  onClick={() => setActiveCategory(cat.value as CategoryFilter)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          <div className="templates-grid">
            {filtered.map((tmpl, i) => (
              <ScrollReveal key={tmpl.id} delay={i * 0.05}>
                <button type="button" onClick={() => setModal(tmpl)} className="template-card">
                  <div className="template-card__image">
                    {/* Ảnh full thiệp; hover -> cuộn dọc xem nội dung (không iframe). */}
                    <img className="template-card__shot" src={`/invitation/thumbs-full/${tmpl.slug}.webp`} alt={tmpl.name} loading="lazy" draggable={false} />
                    {tmpl.isHot && <span className="template-card__badge template-card__badge--hot">HOT</span>}
                    {tmpl.isNew && <span className="template-card__badge template-card__badge--new">MỚI</span>}
                    <div className="template-card__overlay">
                      <span className="template-card__overlay-text">Xem Chi Tiết</span>
                    </div>
                  </div>
                  <div className="template-card__info">
                    <div className="template-card__meta">
                      <h3 className="template-card__name">{tmpl.name}</h3>
                      <span className="template-card__category">{tmpl.category}</span>
                    </div>
                    <p className="template-card__desc-short">{tmpl.description.slice(0, 80)}...</p>
                    <div className="template-card__bottom">
                      <div className="template-card__rating">
                        <Star size={14} fill="var(--accent-primary)" color="var(--accent-primary)" />
                        <span>{tmpl.rating} ({tmpl.reviewCount})</span>
                      </div>
                      <span className="template-card__price">Từ {formatPrice(tmpl.priceFrom)}</span>
                    </div>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="templates-empty">
              <p>Không tìm thấy mẫu thiệp nào cho danh mục này.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA tối ===== */}
      <section className="tpl-cta">
        <div className="container">
          <ScrollReveal>
            <div className="tpl-cta__inner">
              <Sparkles size={28} className="tpl-cta__icon" />
              <h2>Sẵn sàng tạo thiệp cưới của bạn?</h2>
              <p>Chọn một mẫu yêu thích, tự tay chỉnh sửa nội dung — miễn phí, chỉ vài phút.</p>
              <Button variant="primary" size="lg" onClick={() => navigate('/')}>Bắt đầu tạo thiệp</Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section tpl-faq">
        <div className="container container--narrow">
          <ScrollReveal>
            <div className="section-head">
              <h2>Câu hỏi <span className="text-accent">thường gặp</span></h2>
              <p>Giải đáp thắc mắc về mẫu thiệp & cách tạo thiệp.</p>
            </div>
          </ScrollReveal>
          <div className="faq-list">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className={`faq-item ${open ? 'faq-item--open' : ''}`}>
                  <button className="faq-item__trigger" onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open}>
                    <span className="faq-item__question"><HelpCircle size={18} className="faq-item__question-icon" /> {f.q}</span>
                    <span className="faq-item__icon-wrapper">{open ? <Minus size={16} /> : <Plus size={16} />}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="faq-item__content">
                        <div className="faq-item__answer"><p>{f.a}</p></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {modal && <TemplateModal t={modal} onClose={() => setModal(null)} />}
    </main>
  );
}
