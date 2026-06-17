/** Kiểu dữ liệu thiệp sống — khớp shape backend mapInvitation(). */
import type { DecoConfig } from './decorations';

export interface InvitationDesign {
  theme?: Record<string, string>;
  decorations?: DecoConfig[];
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
}

/** Dữ liệu mở rộng (1 cột JSON `extra`): các khối ngoài schema cũ. */
export interface InvitationExtra {
  groomPhoto?: string;          // ảnh chú rể (tròn)
  bridePhoto?: string;          // ảnh cô dâu (tròn)
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
}
