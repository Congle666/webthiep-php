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

export interface GuestbookEntry {
  guest_name: string;
  message: string;
  created_at: string;
}

export interface FamilyInfo {
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
  isPublished: boolean;
  templateSlug: string | null;
  guestbook?: GuestbookEntry[];
  design?: InvitationDesign;
  layout?: 'traditional' | 'floral' | string;
  isDemo?: boolean;
}
