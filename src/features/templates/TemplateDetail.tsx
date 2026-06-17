import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Check, ExternalLink } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';
import Button from '../../components/common/Button';
import { formatPrice } from '../../data';
import { useTemplates } from '../../hooks/useCatalog';
import './TemplateDetail.css';

export default function TemplateDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { templates } = useTemplates();
  const template = templates.find(t => t.slug === slug);

  if (!template) {
    return (
      <main className="detail-page">
        <div className="container" style={{ textAlign: 'center', paddingTop: '200px' }}>
          <h2>Không tìm thấy mẫu thiệp</h2>
          <Button variant="secondary" href="/mau-thiep" className="detail-back-btn">
            <ArrowLeft size={16} /> Quay lại
          </Button>
        </div>
      </main>
    );
  }

  const similarTemplates = templates
    .filter(t => t.category === template.category && t.id !== template.id)
    .slice(0, 3);

  return (
    <main className="detail-page">
      <div className="container">
        <ScrollReveal>
          <Link to="/mau-thiep" className="detail-back">
            <ArrowLeft size={16} /> Tất cả mẫu thiệp
          </Link>
        </ScrollReveal>

        <div className="detail-hero">
          <ScrollReveal>
            <div className="detail-hero__image">
              <div className="detail-hero__placeholder">
                <span className="detail-hero__placeholder-name">{template.name}</span>
                <span className="detail-hero__placeholder-cat">{template.category}</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="detail-hero__info">
              <div className="detail-hero__badges">
                {template.isHot && <span className="detail-badge detail-badge--hot">HOT</span>}
                {template.isNew && <span className="detail-badge detail-badge--new">MỚI</span>}
                <span className="detail-badge detail-badge--cat">{template.category}</span>
              </div>
              <h1 className="detail-hero__title">{template.name}</h1>
              <div className="detail-hero__rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(template.rating) ? 'var(--accent-primary)' : 'none'}
                    color="var(--accent-primary)"
                  />
                ))}
                <span>{template.rating} ({template.reviewCount} đánh giá)</span>
              </div>
              <p className="detail-hero__desc">{template.description}</p>

              <div className="detail-hero__price">
                <span className="detail-hero__price-label">Giá thuê từ</span>
                <span className="detail-hero__price-value">{formatPrice(template.priceFrom)}</span>
              </div>

              <div className="detail-hero__features">
                <h3>Tính năng bao gồm</h3>
                <ul className="detail-features-list">
                  {template.features.map((f, i) => (
                    <li key={i}><Check size={16} /> {f}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-hero__actions">
                <Button variant="primary" size="lg" href="/lien-he">
                  Thuê Mẫu Này
                </Button>
                <a
                  className="detail-demo-btn"
                  href={`/thiep/demo/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={16} /> Xem demo thiệp
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {similarTemplates.length > 0 && (
          <section className="section">
            <ScrollReveal>
              <h2 className="detail-similar__title">Mẫu Tương Tự</h2>
            </ScrollReveal>
            <div className="detail-similar__grid">
              {similarTemplates.map((t, i) => (
                <ScrollReveal key={t.id} delay={i * 0.1}>
                  <Link to={`/mau-thiep/${t.slug}`} className="template-card">
                    <div className="template-card__image">
                      <div className="template-card__placeholder">
                        <span>{t.name}</span>
                      </div>
                    </div>
                    <div className="template-card__info">
                      <div className="template-card__meta">
                        <h3 className="template-card__name">{t.name}</h3>
                      </div>
                      <div className="template-card__bottom">
                        <div className="template-card__rating">
                          <Star size={14} fill="var(--accent-primary)" color="var(--accent-primary)" />
                          <span>{t.rating}</span>
                        </div>
                        <span className="template-card__price">Từ {formatPrice(t.priceFrom)}</span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
