/** Kiểu props dùng chung cho các layout (cover + header). */
import type { Invitation } from '../types';
import type { DecoConfig } from '../decorations';
import type { Lang } from '../i18n';

export interface CoverProps {
  inv: Invitation;
  guestName: string | null;
  onOpen: () => void;
  /** Ảnh trang trí vùng bìa (zone='cover'). */
  decorations?: DecoConfig[];
  /** true: render trong khung admin (position relative), cho phép kéo-thả ảnh bìa. */
  inline?: boolean;
  /** Bật chế độ kéo-thả ảnh bìa (chỉ dùng trong admin). */
  editable?: boolean;
  /** Báo thay đổi danh sách ảnh bìa (admin). */
  onDecoChange?: (list: DecoConfig[]) => void;
  /** id ảnh đang chọn + báo chọn (admin). */
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  /** Ngôn ngữ hiển thị thiệp. */
  lang?: Lang;
}

export interface HeaderProps {
  inv: Invitation;
  editMode: boolean;
  decorations?: DecoConfig[];
  /** Báo thay đổi ảnh trang trí (admin designer). Nếu có -> DecorationLayer controlled + onChange. */
  onDecoChange?: (list: DecoConfig[]) => void;
  /** id ảnh đang chọn + báo chọn (admin). */
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
}

export interface LayoutDef {
  Cover: React.FC<CoverProps>;
  Header: React.FC<HeaderProps>;
}
