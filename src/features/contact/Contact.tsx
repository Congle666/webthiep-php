import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MessageSquare, MapPin, CheckCircle, Sparkles, Send } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';
import Button from '../../components/common/Button';
import { useTemplates, usePlans } from '../../hooks/useCatalog';
import { contactApi } from '../../api/client';
import './Contact.css';

const contactInfo = [
  {
    icon: <MessageSquare size={20} />,
    title: 'Chat qua Zalo',
    value: '0909 123 456',
    desc: 'Hỗ trợ nhanh nhất qua chat Zalo',
    href: 'https://zalo.me/0909123456',
    actionText: 'Nhắn tin ngay'
  },
  {
    icon: <Phone size={20} />,
    title: 'Hotline tư vấn',
    value: '0909 123 456',
    desc: 'Hỗ trợ trực tiếp từ 8:00 - 21:00 hàng ngày',
    href: 'tel:0909123456',
    actionText: 'Gọi điện thoại'
  },
  {
    icon: <Mail size={20} />,
    title: 'Gửi thư điện tử',
    value: 'hello@juntech.vn',
    desc: 'Gửi yêu cầu tùy chỉnh hoặc hợp tác doanh nghiệp',
    href: 'mailto:hello@juntech.vn',
    actionText: 'Gửi email'
  },
  {
    icon: <MapPin size={20} />,
    title: 'Địa chỉ văn phòng',
    value: 'Quận 1, Thành phố Hồ Chí Minh',
    desc: 'Gặp gỡ trực tiếp trao đổi (vui lòng hẹn trước)',
    href: '#',
    actionText: 'Xem bản đồ'
  }
];

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    packageId: 'premium',
    templateId: '1',
    note: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { templates } = useTemplates();
  const { plans: pricingPlans } = usePlans();

  useEffect(() => {
    const pkg = searchParams.get('package');
    const tmpl = searchParams.get('template');
    
    setFormData(prev => ({
      ...prev,
      packageId: pkg || prev.packageId,
      templateId: tmpl || prev.templateId
    }));
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const noteWithPackage = `Gói quan tâm: ${formData.packageId}${formData.note ? `\n${formData.note}` : ''}`;
    const res = await contactApi.send({
      full_name: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      template_id: Number(formData.templateId) || undefined,
      note: noteWithPackage,
    });

    setIsSubmitting(false);
    if (res.success) {
      setIsSuccess(true);
      setFormData({ name: '', phone: '', email: '', packageId: 'premium', templateId: '1', note: '' });
    } else {
      const firstErr = res.errors ? Object.values(res.errors)[0] : undefined;
      setErrorMsg(firstErr ?? res.message ?? 'Gửi không thành công, vui lòng thử lại.');
    }
  };

  return (
    <main className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero__glow" />
        <div className="container">
          <ScrollReveal>
            <span className="label">Liên hệ</span>
            <h1>Đăng Ký Thuê<br /><span className="text-gradient">Thiệp Cưới.</span></h1>
            <p className="contact-hero__sub">
              Điền thông tin đăng ký bên dưới, đội ngũ JunTech sẽ liên hệ và hỗ trợ bạn tạo thiệp trong vòng 15 phút.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section--sm">
        <div className="container">
          <div className="contact-grid">
            {/* Info Column */}
            <div className="contact-info">
              <ScrollReveal>
                <h2 className="contact-section-title">Kênh Liên Hệ Nhanh</h2>
                <p className="contact-info__desc">
                  Nếu bạn cần tư vấn nhanh hoặc có yêu cầu thiết kế riêng biệt, vui lòng liên hệ trực tiếp với chúng tôi qua các kênh dưới đây.
                </p>
              </ScrollReveal>

              <div className="contact-info-list">
                {contactInfo.map((info, i) => (
                  <ScrollReveal key={i} delay={i * 0.08}>
                    <a href={info.href} target="_blank" rel="noopener noreferrer" className="contact-info-card">
                      <div className="contact-info-card__icon">{info.icon}</div>
                      <div className="contact-info-card__content">
                        <h3 className="contact-info-card__title">{info.title}</h3>
                        <span className="contact-info-card__value">{info.value}</span>
                        <p className="contact-info-card__desc">{info.desc}</p>
                        <span className="contact-info-card__action">{info.actionText} →</span>
                      </div>
                    </a>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Form Column */}
            <div className="contact-form-container">
              <ScrollReveal delay={0.1}>
                <div className="contact-form-box">
                  <AnimatePresence mode="wait">
                    {!isSuccess ? (
                      <motion.form 
                        key="contact-form"
                        onSubmit={handleSubmit} 
                        className="contact-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="form-group">
                          <label htmlFor="name" className="form-label">Họ và Tên cô dâu/chú rể <span className="required">*</span></label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="Ví dụ: Nguyễn Văn A & Lê Thị B"
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="phone" className="form-label">Số điện thoại Zalo <span className="required">*</span></label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              required
                              placeholder="Ví dụ: 0909123456"
                              className="form-input"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="email" className="form-label">Email liên hệ <span className="required">*</span></label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              required
                              placeholder="Ví dụ: hello@juntech.vn"
                              className="form-input"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="packageId" className="form-label">Gói dịch vụ muốn đăng ký</label>
                            <select
                              id="packageId"
                              name="packageId"
                              className="form-select"
                              value={formData.packageId}
                              onChange={handleChange}
                            >
                              {pricingPlans.map(plan => (
                                <option key={plan.id} value={plan.id}>
                                  Gói {plan.name} ({new Intl.NumberFormat('vi-VN').format(plan.price)}đ)
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label htmlFor="templateId" className="form-label">Mẫu thiệp ưa thích</label>
                            <select
                              id="templateId"
                              name="templateId"
                              className="form-select"
                              value={formData.templateId}
                              onChange={handleChange}
                            >
                              {templates.map(tmpl => (
                                <option key={tmpl.id} value={tmpl.id}>
                                  Mẫu {tmpl.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="note" className="form-label">Ghi chú yêu cầu thêm (nếu có)</label>
                          <textarea
                            id="note"
                            name="note"
                            rows={4}
                            placeholder="Mô tả các yêu cầu riêng biệt của bạn (ví dụ: ngày giờ cụ thể cần bàn giao thiệp, yêu cầu màu sắc, bài hát riêng...)"
                            className="form-textarea"
                            value={formData.note}
                            onChange={handleChange}
                          />
                        </div>

                        {errorMsg && (
                          <p style={{ color: '#e7a3a3', fontSize: '0.85rem', marginBottom: '4px' }}>{errorMsg}</p>
                        )}

                        <button
                          type="submit"
                          className="form-submit-btn btn btn--primary btn--lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span>Đang gửi yêu cầu...</span>
                          ) : (
                            <>
                              <span>Gửi Đăng Ký Thuê Thiệp</span>
                              <Send size={16} />
                            </>
                          )}
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div 
                        key="success-message"
                        className="form-success"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 20 }}
                      >
                        <div className="form-success__icon-wrapper">
                          <CheckCircle size={48} className="form-success__icon" />
                          <div className="form-success__glow" />
                        </div>
                        <h2 className="form-success__title">Đăng Ký Thành Công!</h2>
                        <p className="form-success__desc">
                          Cảm ơn bạn đã gửi yêu cầu thuê thiệp cưới tại JunTech. Chúng tôi đã nhận được thông tin đăng ký của bạn.
                        </p>
                        <div className="form-success__details">
                          <p>✦ <strong>Thời gian phản hồi:</strong> Chuyên viên hỗ trợ sẽ liên hệ với bạn qua Zalo <strong>trong vòng 15 phút</strong>.</p>
                          <p>✦ <strong>Chuẩn bị trước:</strong> Bạn có thể chuẩn bị sẵn file ảnh cưới (album) và danh sách địa điểm đón khách để thực hiện điền thông tin nhanh nhất.</p>
                        </div>
                        <div className="form-success__actions">
                          <Button variant="primary" size="md" onClick={() => setIsSuccess(false)}>
                            Đăng ký thêm thiệp mới
                          </Button>
                          <Button variant="ghost" size="md" href="/mau-thiep">
                            Xem các mẫu khác <Sparkles size={14} className="ml-1" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
