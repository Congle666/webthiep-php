/** Dữ liệu thiệp mẫu cho khung xem trước trong Admin Designer (giống shape /api/demo). */
import type { Invitation } from '../invitation/types';

export function sampleInvitation(layout: string): Invitation {
  // ceremony/reception cho mọi layout (preview P1 thấy lễ/tiệc).
  // groomPhoto/bridePhoto CHỈ cho hoamoc (header ảnh đôi) — admin designer phải thấy placeholder.
  const extra: Invitation['extra'] = {
    ceremony: { enabled: true, datetime: '2026-12-20 09:00', venue: 'Tư Gia Nhà Gái', address: '123 Nguyễn Huệ, Quận 1' },
    reception: { welcomeTime: '17:00', banquetTime: '18:00' },
    groomRank: 'Trưởng Nam',
    brideRank: 'Út Nữ',
    showLunar: true,
    ...(layout === 'hoamoc'
      ? { groomPhoto: '/invitation/hoahong/groom.webp', bridePhoto: '/invitation/hoahong/bride.webp' }
      : {}),
  };
  return {
    slug: 'preview',
    groomName: 'Minh Quân',
    brideName: 'Thu Hà',
    weddingDate: '2026-12-20 17:00:00',
    venueName: 'Trung Tâm Tiệc Cưới Hoàng Gia',
    venueAddress: '123 Đường Hoa Hồng, Quận 1, TP. Hồ Chí Minh',
    mapUrl: 'https://maps.google.com',
    coverPhoto: null,
    groomFamily: { title: 'Ông Bà', father: 'Trần Văn An', mother: 'Lê Thị Bình', address: '12 Lê Lợi, Hà Nội' },
    brideFamily: { title: 'Ông Bà', father: 'Nguyễn Văn Cường', mother: 'Phạm Thị Dung', address: '78 Bạch Đằng, Đà Nẵng' },
    giftQrGroom: null,
    giftQrBride: null,
    receptionTime: '2026-12-20 16:30:00',
    bankGroom: { bank: 'VCB', account: '0123456789', name: 'TRAN MINH QUAN' },
    bankBride: { bank: 'MB', account: '9876543210', name: 'NGUYEN THU HA' },
    gallery: [],   // khớp demo backend — album chỉ hiện khi khách upload ảnh thật
    loveStory: [
      { date: '2022', title: 'Lần đầu gặp gỡ', text: 'Chúng tôi quen nhau qua một người bạn chung.' },
      { date: '2024', title: 'Lời cầu hôn', text: 'Anh đã ngỏ lời dưới ánh hoàng hôn biển.' },
    ],
    musicUrl: null,
    inviteMessage: 'Trân trọng kính mời',
    settings: { countdown: true, rsvp: true, guestbook: true, petals: true },
    isPublished: true,
    templateSlug: null,
    guestbook: [],
    layout,
    isDemo: true,
    extra,
  };
}
