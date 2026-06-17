import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Star, Filter } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';
import { categories, formatPrice } from '../../data';
import { CategoryFilter } from '../../data/types';
import { useTemplates } from '../../hooks/useCatalog';
import './Templates.css';

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
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
                <Link to={`/mau-thiep/${tmpl.slug}`} className="template-card">
                  <div className="template-card__image">
                    <div className="template-card__placeholder">
                      <Sparkles size={32} />
                      <span>{tmpl.name}</span>
                    </div>
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
                </Link>
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
    </main>
  );
}
