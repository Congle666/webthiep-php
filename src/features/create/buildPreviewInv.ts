/** Chuyển form nháp (Partial<Invitation>) -> Invitation đầy đủ để render xem trước an toàn. */
import type { Invitation } from '../invitation/types';
import type { InvitationForm } from './InvitationForm';

export function buildPreviewInv(form: InvitationForm, templateSlug: string): Invitation {
  return {
    slug: form.slug ?? 'preview',
    groomName: form.groomName ?? 'Tên Chú Rể',
    brideName: form.brideName ?? 'Tên Cô Dâu',
    weddingDate: form.weddingDate ?? null,
    venueName: form.venueName ?? null,
    venueAddress: form.venueAddress ?? null,
    mapUrl: form.mapUrl ?? null,
    coverPhoto: form.coverPhoto ?? null,
    groomFamily: form.groomFamily ?? {},
    brideFamily: form.brideFamily ?? {},
    giftQrGroom: form.giftQrGroom ?? null,
    giftQrBride: form.giftQrBride ?? null,
    receptionTime: form.receptionTime ?? null,
    bankGroom: form.bankGroom ?? {},
    bankBride: form.bankBride ?? {},
    gallery: form.gallery ?? [],
    loveStory: form.loveStory ?? [],
    musicUrl: form.musicUrl ?? null,
    inviteMessage: form.inviteMessage ?? null,
    settings: form.settings ?? {},
    extra: form.extra ?? {},
    isPublished: form.isPublished ?? false,
    templateSlug: form.templateSlug ?? templateSlug,
    guestbook: form.guestbook ?? [],
    design: form.design,
    layout: form.layout ?? 'traditional',
  };
}
