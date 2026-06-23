/** Panel quản lý ngôn ngữ thiệp (dùng trong editor/CreateInvitation của chủ thiệp).
 *  Chủ thiệp chọn ngôn ngữ chính + thêm ngôn ngữ phụ song ngữ.
 */
import { useState } from 'react';
import { X, Plus, RotateCcw, Globe } from 'lucide-react';
import { LANGS, type Lang } from './i18n';
import './LangManager.css';

interface Props {
  value: Lang[];                  // danh sách ngôn ngữ hiện tại, index 0 = chính
  onChange: (langs: Lang[]) => void;
  onClose: () => void;
}

export function LangManager({ value, onChange, onClose }: Props) {
  const [active, setActive] = useState<Lang[]>(value.length ? value : ['vi']);

  const primaryLang = active[0];
  const secondaryLangs = active.slice(1);
  const remaining = LANGS.filter(l => !active.includes(l.code));

  const setPrimary = (lang: Lang) => {
    const rest = active.filter(l => l !== lang);
    const next = [lang, ...rest];
    setActive(next);
    onChange(next);
  };

  const addLang = (lang: Lang) => {
    const next = [...active, lang];
    setActive(next);
    onChange(next);
  };

  const removeLang = (lang: Lang) => {
    const next = active.filter(l => l !== lang);
    setActive(next.length ? next : ['vi']);
    onChange(next.length ? next : ['vi']);
  };

  const reset = () => {
    setActive(['vi']);
    onChange(['vi']);
  };

  const primaryMeta = LANGS.find(l => l.code === primaryLang)!;

  return (
    <div className="lm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="lm-panel">
        <div className="lm-header">
          <Globe size={16} />
          <span>Quản lý ngôn ngữ</span>
          <button className="lm-close" onClick={onClose} aria-label="Đóng"><X size={16} /></button>
        </div>

        <p className="lm-sub">Ngôn ngữ hiển thị cho khách</p>

        {/* Ngôn ngữ đang bật */}
        <div className="lm-active-list">
          {/* Primary */}
          <div className="lm-lang-row lm-lang-row--primary">
            <span className="lm-chevron">›</span>
            <span className="lm-flag">{primaryMeta.flag}</span>
            <span className="lm-name">{primaryMeta.label}</span>
            <span className="lm-badge-primary">Chính</span>
            <button className="lm-icon-btn lm-icon-btn--reset" onClick={reset} title="Reset về mặc định">
              <RotateCcw size={13} />
            </button>
          </div>

          {/* Secondary langs */}
          {secondaryLangs.map(code => {
            const meta = LANGS.find(l => l.code === code)!;
            return (
              <div key={code} className="lm-lang-row">
                <span className="lm-chevron lm-chevron--up">‹</span>
                <span className="lm-flag">{meta.flag}</span>
                <span className="lm-name">{meta.label}</span>
                <button className="lm-icon-btn" onClick={() => setPrimary(code)} title="Đặt làm ngôn ngữ chính">
                  <RotateCcw size={13} />
                </button>
                <button className="lm-icon-btn lm-icon-btn--remove" onClick={() => removeLang(code)} title="Xóa">
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Thêm ngôn ngữ */}
        {remaining.length > 0 && (
          <>
            <p className="lm-sub lm-sub--add">Thêm ngôn ngữ</p>
            <div className="lm-add-list">
              {remaining.map(l => (
                <button key={l.code} className="lm-add-btn" onClick={() => addLang(l.code)}>
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                  <Plus size={14} className="lm-plus" />
                </button>
              ))}
            </div>
          </>
        )}

        {/* Preview song ngữ */}
        {active.length >= 2 && (
          <div className="lm-preview">
            <p className="lm-preview-label">Xem trước</p>
            <p className="lm-preview-sample">
              {active.map(code => LANGS.find(l => l.code === code)?.label).join(' / ')}
            </p>
            <p className="lm-preview-eg">
              {active.map(code => {
                const map: Record<string, string> = { vi: 'Chú Rể', en: 'Groom', zh: '新郎', ko: '신랑', ja: '新郎', fr: 'Le Marié', es: 'Novio', ar: 'العريس', ru: 'Жених', id: 'Pengantin Pria', de: 'Bräutigam', 'zh-tw': '新郎' };
                return map[code] ?? code;
              }).join(' / ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
