/** Modal chi tiết mẫu thiệp (bấm card showcase) — preview cuộn trái + thông tin/nút phải. */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, Plus, Check } from 'lucide-react';
import type { Template } from '../../data/types';
import './TemplateModal.css';

const CAT_LABEL: Record<string, string> = {
  luxury: 'Sang trọng', modern: 'Hiện đại', classic: 'Cổ điển',
  minimalist: 'Tối giản', floral: 'Hoa lá', vintage: 'Vintage', traditional: 'Truyền thống',
};

export function TemplateModal({ t, onClose }: { t: Template; onClose: () => void }) {
  const navigate = useNavigate();

  // Đóng bằng phím Esc + khoá scroll nền
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="tm-overlay" onClick={onClose}>
      <div className="tm" onClick={(e) => e.stopPropagation()}>
        <button className="tm__close" onClick={onClose} aria-label="Đóng"><X size={22} /></button>

        {/* Trái: ảnh full thiệp tự cuộn dọc bằng CSS (KHÔNG iframe -> nhẹ, không lag). */}
        <div className="tm__preview">
          <img className="tm__shot" src={`/invitation/thumbs-full/${t.slug}.webp`} alt={t.name} draggable={false} />
        </div>

        {/* Phải: thông tin + hành động */}
        <div className="tm__info">
          <h2 className="tm__name">{t.name}</h2>
          <p className="tm__desc">{t.description}</p>

          <div className="tm__tags">
            <span className="tm__tag">{CAT_LABEL[t.category] ?? t.category}</span>
            {t.isHot && <span className="tm__tag">Phổ biến</span>}
            {t.isNew && <span className="tm__tag">Mới</span>}
          </div>

          <h3 className="tm__feat-title">Tính năng</h3>
          <ul className="tm__feats">
            {(t.features ?? []).map((f, i) => (
              <li key={i}><Check size={15} /> {f}</li>
            ))}
          </ul>

          <p className="tm__note">Tạo miễn phí · Thử 3 ngày · Đẹp mọi thiết bị<br />Bạn có thể đổi mẫu bất cứ lúc nào khi chỉnh sửa.</p>

          <div className="tm__actions">
            <button className="tm__btn tm__btn--primary" onClick={() => navigate(`/tao-thiep/${t.slug}`)}>
              <Plus size={18} /> Tạo thiệp
            </button>
            <a className="tm__btn tm__btn--ghost" href={`/thiep/demo/${t.slug}`} target="_blank" rel="noreferrer">
              <Eye size={18} /> Xem demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
