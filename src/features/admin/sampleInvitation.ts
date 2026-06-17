/** Dữ liệu thiệp mẫu cho khung xem trước trong Admin Designer (giống shape /api/demo). */
import type { Invitation } from '../invitation/types';

export function sampleInvitation(layout: string): Invitation {
  return {
    slug: 'preview',
    groomName: 'Minh Quân',
    brideName: 'Thu Hà',
    weddingDate: '2026-12-20 17:00:00',
    venueName: 'Trung Tâm Tiệc Cưới Hoàng Gia',
    venueAddress: '123 Đường Hoa Hồng, Quận 1, TP. Hồ Chí Minh',
    mapUrl: 'https://maps.google.com',
    coverPhoto: null,
    groomFamily: { father: 'Trần Văn An', mother: 'Lê Thị Bình', address: 'Hà Nội' },
    brideFamily: { father: 'Nguyễn Văn Cường', mother: 'Phạm Thị Dung', address: 'Đà Nẵng' },
    giftQrGroom: null,
    giftQrBride: null,
    receptionTime: '2026-12-20 16:30:00',
    bankGroom: { bank: 'VCB', account: '0123456789', name: 'TRAN MINH QUAN' },
    bankBride: { bank: 'MB', account: '9876543210', name: 'NGUYEN THU HA' },
    gallery: [
      '/invitation/flower.webp',
      '/invitation/songhy.webp',
    ],
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
  };
}
