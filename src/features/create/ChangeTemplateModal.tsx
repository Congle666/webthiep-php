/** Modal đổi mẫu thiệp: chọn mẫu khác để đổi giao diện, giữ nguyên nội dung. */
import { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';
import { catalogApi } from '../../api/client';
import type { Template } from '../../data/types';

interface Props {
  currentTemplateId?: string | number;
  onSelect: (templateId: number) => void;
  onClose: () => void;
}

export default function ChangeTemplateModal({ currentTemplateId, onSelect, onClose }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalogApi.templates().then((res) => {
      if (res.success && res.data) setTemplates(res.data);
      setLoading(false);
    });
  }, []);

  const curId = currentTemplateId != null ? String(currentTemplateId) : '';

  return (
    <div className="ci-tplmodal-overlay" onClick={onClose}>
      <div className="ci-tplmodal" role="dialog" aria-modal="true" aria-label="Đổi mẫu thiệp" onClick={(e) => e.stopPropagation()}>
        <header className="ci-tplmodal-head">
          <div>
            <h2 className="ci-tplmodal-title">Đổi mẫu thiệp</h2>
            <p className="ci-tplmodal-sub">Nội dung thiệp sẽ được giữ nguyên, chỉ thay đổi giao diện.</p>
          </div>
          <button className="ci-tplmodal-x" onClick={onClose} aria-label="Đóng"><X size={20} /></button>
        </header>

        <div className="ci-tplmodal-body">
          {loading ? (
            <p className="ci-tplmodal-empty">Đang tải mẫu thiệp…</p>
          ) : (
            <div className="ci-tplmodal-grid">
              {templates.map((t) => {
                const active = String(t.id) === curId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`ci-tplmodal-card${active ? ' is-active' : ''}`}
                    onClick={() => { if (!active) onSelect(Number(t.id)); }}
                    aria-label={`Chọn mẫu ${t.name}`}
                    aria-current={active}
                  >
                    <div className="ci-tplmodal-thumb">
                      <img src={t.thumbnail} alt={t.name} loading="lazy" />
                      {active && <span className="ci-tplmodal-tick"><Check size={16} /></span>}
                    </div>
                    <span className="ci-tplmodal-name">{t.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
