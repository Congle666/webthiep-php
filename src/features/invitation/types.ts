/** Kiểu dữ liệu thiệp sống — khớp shape backend mapInvitation(). */
import type { DecoConfig } from './decorations';

export interface InvitationDesign {
  theme?: Record<string, string>;
  decorations?: DecoConfig[];
  /**
   * Thứ tự + danh sách section THÂN của thiệp. Thiếu = dùng DEFAULT_ORDER (giữ nguyên bố cục hiện tại).
   * Keys hợp lệ: 'couplePhoto','intro','family','couple','album','ceremony','reception',
   * 'calendar','countdown','venue','dressCode','schedule','gift','rsvp','guestbook','thanks','envelope'.
   */
  sectionOrder?: string[];
}

export interface LoveStoryItem {
  date: string;
  title: string;
  text: string;
}

export interface InvitationSettings {
  countdown?: boolean;
  rsvp?: boolean;
  guestbook?: boolean;
  petals?: boolean;
  /** Danh sách ngôn ngữ thiệp, index 0 = ngôn ngữ chính. Mặc định ['vi']. */
  langs?: string[];
}

/** Một mục lịch trình ngày cưới. */
export interface ScheduleItem {
  time: string;   // "09:00"
  title: string;  // "Đón khách"
}

/** Hiển thị/ẩn từng khối nội dung trên thiệp (toggle Hiện/Ẩn trong editor). */
export interface SectionVisibility {
  couplePhoto?: boolean;
  family?: boolean;
  intro?: boolean;
  story?: boolean;
  gallery?: boolean;
  dressCode?: boolean;
  schedule?: boolean;
  gift?: boolean;
  thanks?: boolean;
  envelope?: boolean;
  ceremony?: boolean;   // Lễ thành hôn (reception luôn hiện vì là mốc chính)
}

/** Tinh chỉnh ảnh: vị trí (0-100%) + phóng to (1-3x). */
export interface PhotoAdjust {
  x: number;     // object-position X %, 0-100 (mặc định 50)
  y: number;     // object-position Y %, 0-100 (mặc định 50)
  scale: number; // phóng to 1-3 (mặc định 1)
}

/** Dữ liệu mở rộng (1 cột JSON `extra`): các khối ngoài schema cũ. */
export interface InvitationExtra {
  groomPhoto?: string;          // ảnh chú rể (tròn)
  bridePhoto?: string;          // ảnh cô dâu (tròn)
  groomPhotoAdjust?: PhotoAdjust;  // tinh chỉnh vị trí/zoom ảnh chú rể
  bridePhotoAdjust?: PhotoAdjust;  // tinh chỉnh vị trí/zoom ảnh cô dâu
  groomTitle?: string;          // danh xưng: "Chú rể"
  brideTitle?: string;          // "Cô dâu"
  groomShort?: string;          // tên ngắn chú rể
  brideShort?: string;          // tên ngắn cô dâu
  brideFirst?: boolean;         // nhà gái trước?
  intro?: string;               // lời mở đầu thiệp
  dressCode?: { note?: string; colors?: string[] };
  schedule?: ScheduleItem[];    // lịch trình ngày cưới
  thanks?: string;              // lời cảm ơn
  envelope?: string;            // lời mời trên phong bì
  ceremony?: {            // Lễ thành hôn (tư gia) — sự kiện riêng, có thể khác ngày tiệc
    enabled?: boolean;
    datetime?: string;    // "2026-11-20 09:00"
    venue?: string;       // "Tư gia nhà gái"
    address?: string;
  };
  reception?: {           // Tiệc cưới — chi tiết bổ sung (ngày/venue dùng wedding_date + venue_*)
    welcomeTime?: string; // giờ đón khách "17:00"
    banquetTime?: string; // giờ khai tiệc "18:30"
  };
  showLunar?: boolean;    // hiện âm lịch (mặc định true khi lang vi)
  visible?: SectionVisibility;  // hiện/ẩn khối
}

export interface GuestbookEntry {
  guest_name: string;
  message: string;
  created_at: string;
}

export interface FamilyInfo {
  title?: string;    // danh xưng (vd "Ông Bà")
  father?: string;
  mother?: string;
  address?: string;
}

export interface BankInfo {
  bank?: string;      // mã NH VietQR, vd "VCB", "MB"
  account?: string;   // số tài khoản
  name?: string;      // tên chủ TK
}

/** Khách mời (Phase 02) — khớp shape backend mapGuest(). */
export interface Guest {
  id: number;
  name: string;
  token: string;
  tag?: string | null;
  rsvpStatus: 'pending' | 'yes' | 'no' | 'maybe';
  rsvpCount: number;
  openedAt?: string | null;
}

export interface GuestStats {
  total: number;
  yes: number;
  no: number;
  maybe: number;
  pending: number;
  opened: number;
}

export interface Invitation {
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: string | null;
  venueName: string | null;
  venueAddress: string | null;
  mapUrl: string | null;
  coverPhoto: string | null;
  groomFamily: FamilyInfo;
  brideFamily: FamilyInfo;
  giftQrGroom: string | null;
  giftQrBride: string | null;
  receptionTime: string | null;
  bankGroom: BankInfo;
  bankBride: BankInfo;
  gallery: string[];
  loveStory: LoveStoryItem[];
  musicUrl: string | null;
  inviteMessage: string | null;
  settings: InvitationSettings;
  extra?: InvitationExtra;
  isPublished: boolean;
  templateSlug: string | null;
  guestbook?: GuestbookEntry[];
  design?: InvitationDesign;
  layout?: 'traditional' | 'floral' | string;
  isDemo?: boolean;
  /** Tên khách từ link riêng ?g=token (BE trả khi token hợp lệ). */
  guestName?: string | null;
}
