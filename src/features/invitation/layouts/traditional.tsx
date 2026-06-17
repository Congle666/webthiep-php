/** Layout TRUYỀN THỐNG (Song Phụng đỏ) — cover gate đỏ + header banner đỏ + phượng. */
import { CoverGate } from '../CoverGate';
import { DecorationLayer } from '../DecorationLayer';
import type { CoverProps, HeaderProps } from './types';

function TraditionalCover(props: CoverProps) {
  return <CoverGate {...props} />;
}

function TraditionalHeader({ editMode, decorations, onDecoChange, selectedId, onSelect }: HeaderProps) {
  return (
    <>
      <header className="inv-header"><div className="inv-banner" /></header>
      {/* Lớp trang trí phủ TOÀN trang -> kéo ảnh đi khắp nơi, không kẹt trong header */}
      <div className="inv-deco-root">
        <DecorationLayer editable={editMode} value={decorations} onChange={onDecoChange}
          selectedId={selectedId} onSelect={onSelect} />
      </div>
    </>
  );
}

export const traditional = { Cover: TraditionalCover, Header: TraditionalHeader };
