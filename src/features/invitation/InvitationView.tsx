/** Phần HÌNH ẢNH của thiệp (cover + header + body), render THUẦN từ object `inv`. */
import { AnimatePresence } from 'framer-motion';
import { useState, useMemo, CSSProperties } from 'react';
import type { Invitation as Inv } from './types';
import { InvitationBody } from './InvitationBody';
import { LAYOUTS } from './layouts';
import { decosByZone } from './decorations';
import { LangSwitcher } from './LangSwitcher';
import { type Lang, buildBilingual, getSavedPrimaryLang, savePrimaryLang, LANGS } from './i18n';

export function themeStyle(design?: Inv['design']): CSSProperties {
  const t = design?.theme;
  const style: Record<string, string> = {};
  if (t) {
    if (t.red) style['--red'] = t.red;
    if (t.redDeep) style['--red-deep'] = t.redDeep;
    if (t.redSoft) style['--red-soft'] = t.redSoft;
    if (t.text) style['--text'] = t.text;
    if (t.heading) style['--heading'] = t.heading;
    if (t.muted) style['--muted'] = t.muted;
    if (t.bg || t.paper) {
      const bg = t.bg || '#f5ead7';
      style.background = t.paper ? `${bg} url('${t.paper}')` : bg;
    }
  }
  return style as CSSProperties;
}

interface Props {
  inv: Inv;
  slug: string;
  opened: boolean;
  onOpen?: () => void;
  guestName?: string | null;
  guestToken?: string | null;
  editMode?: boolean;
  staticMode?: boolean;
}

export function InvitationView({ inv, slug, opened, onOpen, guestName = null, guestToken = null, editMode = false, staticMode }: Props) {
  // Danh sách ngôn ngữ chủ thiệp cài (mặc định ['vi'])
  const configuredLangs = useMemo<Lang[]>(() => {
    const raw = inv.settings?.langs ?? ['vi'];
    return raw.filter(l => LANGS.some(m => m.code === l)) as Lang[];
  }, [inv.settings?.langs]);

  // Ngôn ngữ primary khách đang xem (có thể đổi thứ tự trong configuredLangs)
  const [primaryLang, setPrimaryLang] = useState<Lang>(() =>
    getSavedPrimaryLang(slug, configuredLangs[0] ?? 'vi')
  );

  // Reorder: đưa primaryLang lên đầu, giữ các lang còn lại
  const orderedLangs = useMemo<Lang[]>(() => {
    if (!configuredLangs.includes(primaryLang)) return configuredLangs;
    return [primaryLang, ...configuredLangs.filter(l => l !== primaryLang)];
  }, [configuredLangs, primaryLang]);

  // Object i18n song ngữ theo thứ tự hiện tại
  const t = useMemo(() => buildBilingual(orderedLangs), [orderedLangs]);

  const handleLangChange = (lang: Lang) => {
    setPrimaryLang(lang);
    savePrimaryLang(slug, lang);
  };

  const L = LAYOUTS[inv.layout ?? 'traditional'] ?? LAYOUTS.traditional;
  const allDecos = inv.design?.decorations?.length ? inv.design.decorations : undefined;
  // Header nhận CẢ zone 'body' lẫn 'header' (floral) — layout tự tách trong FloralHeader.
  const bodyDecos = allDecos?.filter((d) => (d.zone ?? 'body') !== 'cover');
  const coverDecos = decosByZone(allDecos, 'cover');
  const rootClass = `inv-root inv-${inv.layout ?? 'traditional'}`;

  return (
    <div className={rootClass} style={themeStyle(inv.design)}>
      {/* Nút chọn ngôn ngữ — chỉ hiện khi có ≥2 ngôn ngữ + thiệp đã mở */}
      {opened && !staticMode && configuredLangs.length >= 2 && (
        <LangSwitcher
          langs={configuredLangs}
          current={primaryLang}
          onChange={handleLangChange}
        />
      )}

      <AnimatePresence>
        {!opened && !editMode && (
          <L.Cover
            inv={inv} guestName={guestName} onOpen={onOpen ?? (() => {})}
            decorations={coverDecos} lang={orderedLangs[0]}
          />
        )}
      </AnimatePresence>
      <L.Header inv={inv} editMode={editMode} decorations={bodyDecos} />
      <InvitationBody inv={inv} slug={slug} t={t} staticMode={staticMode} guestToken={guestToken} />
    </div>
  );
}
