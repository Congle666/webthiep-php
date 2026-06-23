/** Nút chọn ngôn ngữ nổi trên thiệp — chỉ hiện các ngôn ngữ chủ thiệp đã bật. */
import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { LANGS, type Lang } from './i18n';

interface Props {
  langs: Lang[];      // danh sách ngôn ngữ được phép chọn
  current: Lang;      // ngôn ngữ primary hiện tại
  onChange: (lang: Lang) => void;
}

export function LangSwitcher({ langs, current, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentMeta = LANGS.find(l => l.code === current);
  const availableMetas = LANGS.filter(l => langs.includes(l.code));

  return (
    <div className="inv-lang" ref={ref}>
      <button
        className="inv-lang-btn"
        onClick={() => setOpen(o => !o)}
        aria-label="Chọn ngôn ngữ"
        aria-expanded={open}
      >
        <Globe size={13} />
        <span className="inv-lang-flag">{currentMeta?.flag}</span>
        <span className="inv-lang-code">{current.toUpperCase()}</span>
      </button>

      {open && (
        <div className="inv-lang-dropdown" role="menu">
          <p className="inv-lang-hint">Đổi ngôn ngữ ưu tiên</p>
          {availableMetas.map(l => (
            <button
              key={l.code}
              className={`inv-lang-option ${l.code === current ? 'inv-lang-option--active' : ''}`}
              onClick={() => { onChange(l.code); setOpen(false); }}
              role="menuitem"
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
              {l.code === current && <span className="inv-lang-primary-badge">Chính</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
