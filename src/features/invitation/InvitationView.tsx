/** Phần HÌNH ẢNH của thiệp (cover + header + body), render THUẦN từ object `inv`.
 * Dùng chung cho: trang thiệp sống (Invitation.tsx) và xem trước trong editor (render từ state).
 */
import { AnimatePresence } from 'framer-motion';
import { CSSProperties } from 'react';
import type { Invitation as Inv } from './types';
import { InvitationBody } from './InvitationBody';
import { LAYOUTS } from './layouts';
import { decosByZone } from './decorations';

/** Map theme từ DB -> CSS variables + background của .inv-root. */
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
  /** Bìa đã mở chưa (preview/editor: true để bỏ gate). */
  opened: boolean;
  onOpen?: () => void;
  guestName?: string | null;
  /** ?edit của admin designer (kéo-thả). */
  editMode?: boolean;
  /** preview/iframe/editor: tắt animation cuộn. */
  staticMode?: boolean;
}

export function InvitationView({ inv, slug, opened, onOpen, guestName = null, editMode = false, staticMode }: Props) {
  const L = LAYOUTS[inv.layout ?? 'traditional'] ?? LAYOUTS.traditional;
  const allDecos = inv.design?.decorations?.length ? inv.design.decorations : undefined;
  const bodyDecos = decosByZone(allDecos, 'body');
  const coverDecos = decosByZone(allDecos, 'cover');
  const rootClass = `inv-root inv-${inv.layout ?? 'traditional'}`;

  return (
    <div className={rootClass} style={themeStyle(inv.design)}>
      <AnimatePresence>
        {!opened && !editMode && <L.Cover inv={inv} guestName={guestName} onOpen={onOpen ?? (() => {})} decorations={coverDecos} />}
      </AnimatePresence>
      <L.Header inv={inv} editMode={editMode} decorations={bodyDecos} />
      <InvitationBody inv={inv} slug={slug} staticMode={staticMode} />
    </div>
  );
}
