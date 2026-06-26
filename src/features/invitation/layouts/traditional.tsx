/** Layout TRUYỀN THỐNG (Song Phụng đỏ) — cover gate đỏ + tên CD-CR góc trên trái + header banner đỏ + phượng. */
import { CoverGate } from '../CoverGate';
import { DecorationLayer } from '../DecorationLayer';
import type { CoverProps, HeaderProps } from './types';
import './traditional.css';

function TraditionalCover(props: CoverProps) {
  return <CoverGate {...props} />;
}

function TraditionalHeader({ inv, editMode, decorations, onDecoChange, selectedId, onSelect }: HeaderProps) {
  return (
    <>
      {/* Tên cô dâu chú rể GÓC TRÊN TRÁI — UPPERCASE, căn trái, cạnh phượng (giống ChungĐôi Song Phụng).
          z=30 luôn nổi trên decoration (phượng z=3, banner z=1). */}
      <div className="inv-lp-names">
        <h1 className="inv-lp-name">{inv.groomName}</h1>
        <h1 className="inv-lp-name inv-lp-name--2">{inv.brideName}</h1>
      </div>

      <header className="inv-header">
        <div className="inv-banner" />
      </header>
      {/* Lớp trang trí phủ TOÀN trang -> kéo ảnh đi khắp nơi, không kẹt trong header */}
      <div className="inv-deco-root">
        <DecorationLayer editable={editMode} value={decorations} onChange={onDecoChange}
          selectedId={selectedId} onSelect={onSelect} />
      </div>
    </>
  );
}

export const traditional = { Cover: TraditionalCover, Header: TraditionalHeader };
