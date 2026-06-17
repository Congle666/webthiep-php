import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, HelpCircle, Plus, Minus, Star, ArrowRight } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';
import Button from '../../components/common/Button';
import { formatPrice } from '../../data';
import { usePlans } from '../../hooks/useCatalog';
import './Pricing.css';

const faqs = [
  {
    question: 'Tôi có thể thay đổi thông tin sau khi tạo thiệp không?',
    answer: 'Hoàn toàn được! Bạn có thể tự do chỉnh sửa toàn bộ thông tin (tên cô dâu chú rể, ngày giờ, địa điểm cưới, album ảnh, nhạc nền...) bất kỳ lúc nào trong thời hạn thuê gói. Hệ thống sẽ cập nhật ngay lập tức sau khi bạn lưu.'
  },
  {
    question: 'Thiệp cưới online hiển thị như thế nào trên điện thoại di động?',
    answer: 'JunTech thiết kế thiệp tối ưu 100% cho thiết bị di động. Tất cả các mẫu thiệp đều có giao diện responsive mượt mà, trực quan, hình ảnh sắc nét và font chữ dễ đọc giống như một ứng dụng cao cấp.'
  },
  {
    question: 'Làm thế nào để nhận thông tin khách mời phản hồi (RSVP)?',
    answer: 'Khi khách mời xác nhận tham dự trên thiệp (điền tên, số người tham dự, lời chúc...), hệ thống sẽ gửi thông báo trực tiếp qua Zalo/Email cho bạn và cập nhật vào trang quản trị danh sách khách mời thời gian thực.'
  },
  {
    question: 'Tôi có thể sử dụng nhạc nền tự chọn của riêng mình không?',
    answer: 'Có! Với gói Cao Cấp và VIP, bạn có thể tải lên file nhạc định dạng MP3 yêu thích hoặc chèn liên kết từ YouTube để phát làm nhạc nền tự động khi khách mở thiệp.'
  },
  {
    question: 'Hình thức thanh toán và thời gian kích hoạt thiệp ra sao?',
    answer: 'Chúng tôi hỗ trợ chuyển khoản qua ngân hàng, ví Momo, ZaloPay. Sau khi thanh toán hoàn tất, hệ thống sẽ kích hoạt tài khoản thiết kế thiệp của bạn ngay lập tức trong vòng dưới 1 phút.'
  }
];

export default function Pricing() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const { plans: pricingPlans } = usePlans();

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <main className="pricing-page">
      {/* Hero */}
      <section className="pricing-hero">
        <div className="pricing-hero__glow" />
        <div className="container">
          <ScrollReveal>
            <span className="label">Bảng Giá</span>
            <h1>Chọn Gói Dịch Vụ<br /><span className="text-gradient">Phù Hợp.</span></h1>
            <p className="pricing-hero__sub">
              Chi phí hợp lý, không phát sinh phụ phí. Đầy đủ tính năng cao cấp cho ngày cưới trọn vẹn.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="section--sm">
        <div className="container">
          <div className="pricing-grid">
            {pricingPlans.map((plan, i) => (
              <ScrollReveal key={plan.id} delay={i * 0.1} className="pricing-card-wrapper">
                <div className={`pricing-card ${plan.isRecommended ? 'pricing-card--recommended' : ''}`}>
                  {plan.isRecommended && (
                    <div className="pricing-card__badge">
                      <Star size={12} fill="currentColor" /> PHỔ BIẾN NHẤT
                    </div>
                  )}
                  
                  <div className="pricing-card__header">
                    <h3 className="pricing-card__name">{plan.name}</h3>
                    <p className="pricing-card__desc">{plan.description}</p>
                    <div className="pricing-card__price-container">
                      <span className="pricing-card__price">{formatPrice(plan.price)}</span>
                      <span className="pricing-card__duration">/ {plan.duration}</span>
                    </div>
                  </div>

                  <div className="pricing-card__features">
                    <p className="pricing-card__features-title">Tính năng bao gồm:</p>
                    <ul className="pricing-features-list">
                      {plan.features.map((feat, index) => (
                        <li 
                          key={index} 
                          className={`pricing-features-item ${!feat.included ? 'pricing-features-item--excluded' : ''}`}
                        >
                          <Check 
                            size={16} 
                            className={feat.included ? 'pricing-features-icon--included' : 'pricing-features-icon--excluded'} 
                          />
                          <span>{feat.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pricing-card__actions">
                    <Button 
                      variant={plan.isRecommended ? 'primary' : 'secondary'} 
                      size="lg" 
                      href={`/lien-he?package=${plan.id}`}
                      className="pricing-card__btn"
                    >
                      {plan.ctaText} <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container"><hr className="divider" /></div>

      {/* FAQ Section */}
      <section className="section faq-section">
        <div className="container container--narrow">
          <ScrollReveal>
            <div className="section-header text-center">
              <span className="label">Giải đáp</span>
              <h2>Câu Hỏi<br /><span className="text-gradient">Thường Gặp.</span></h2>
              <p className="section-header__sub">Giải đáp mọi thắc mắc của bạn về dịch vụ thuê thiệp cưới online tại JunTech.</p>
            </div>
          </ScrollReveal>

          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <ScrollReveal key={index} delay={index * 0.05}>
                  <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
                    <button 
                      className="faq-item__trigger" 
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-item__question">
                        <HelpCircle size={18} className="faq-item__question-icon" />
                        {faq.question}
                      </span>
                      <span className="faq-item__icon-wrapper">
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
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
                          <div className="faq-item__answer">
                            <p>{faq.answer}</p>
                          </div>
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
    </main>
  );
}
