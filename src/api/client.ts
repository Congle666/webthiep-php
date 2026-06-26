/**
 * API client cho backend PHP (XAMPP).
 * Base URL cấu hình qua VITE_API_URL, mặc định trỏ tới htdocs/juntech-api.
 */
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost/juntech-api/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
  detail?: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include', // gửi cookie session
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  });

  let body: ApiResponse<T>;
  try {
    body = await res.json();
  } catch {
    return { success: false, message: `Lỗi máy chủ (${res.status})` };
  }
  return body;
}

/** Upload file (multipart) — KHÔNG set Content-Type để trình duyệt tự thêm boundary. */
async function uploadFile<T>(path: string, file: File): Promise<ApiResponse<T>> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${BASE}${path}`, { method: 'POST', credentials: 'include', body: fd });
  try { return await res.json(); } catch { return { success: false, message: `Lỗi máy chủ (${res.status})` }; }
}

export const api = {
  get:  <T>(p: string) => request<T>(p),
  upload: <T>(p: string, file: File) => uploadFile<T>(p, file),
  post: <T>(p: string, data?: unknown) =>
    request<T>(p, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put:  <T>(p: string, data?: unknown) =>
    request<T>(p, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(p: string, data?: unknown) =>
    request<T>(p, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  del:  <T>(p: string) => request<T>(p, { method: 'DELETE' }),
};

// ----- Helpers nghiệp vụ (gọn, đúng endpoint backend) -----
import type { Template, PricingPlan, Testimonial } from '../data/types';

export const catalogApi = {
  templates: (category?: string, q?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (q) params.set('q', q);
    const qs = params.toString();
    return api.get<Template[]>(`/templates${qs ? `?${qs}` : ''}`);
  },
  template: (slug: string) => api.get<Template>(`/templates/${slug}`),
  plans: () => api.get<PricingPlan[]>('/plans'),
  testimonials: () => api.get<Testimonial[]>('/testimonials'),
};

export const contactApi = {
  send: (data: { full_name: string; phone: string; email?: string; template_id?: number; note?: string }) =>
    api.post('/contact', data),
};

import type { Invitation, Guest, GuestStats } from '../features/invitation/types';

export const invitationApi = {
  view: (slug: string, token?: string) =>
    api.get<Invitation>(`/thiep/${slug}${token ? `?g=${encodeURIComponent(token)}` : ''}`),
  demo: (slug: string) => api.get<Invitation>(`/demo/${slug}`),
  rsvp: (slug: string, data: { guest_name: string; attendance: 'yes' | 'no' | 'maybe'; guest_count?: number; message?: string; token?: string }) =>
    api.post(`/thiep/${slug}/rsvp`, data),
  guestbook: (slug: string, data: { guest_name: string; message: string }) =>
    api.post(`/thiep/${slug}/guestbook`, data),
};

export interface AuthUser { id: number; fullName: string; email: string; phone: string | null; role: 'admin' | 'customer'; avatar?: string | null; }

export const authApi = {
  register: (data: { full_name: string; email: string; phone?: string; password: string }) =>
    api.post<AuthUser>('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post<AuthUser>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<AuthUser>('/auth/me'),
  googleLoginUrl: () => api.get<{ url: string }>('/auth/google/login'),
};

export interface CreateOrderResult {
  orderCode: string;
  orderId: number;
  invitationSlug: string;
  amount: number;
  paymentStatus: string;
}

export const customerApi = {
  createOrder: (template_id: number, plan_code: string) =>
    api.post<CreateOrderResult>('/orders', { template_id, plan_code }),
  myOrders: () => api.get<any[]>('/orders'),
  myInvitations: () => api.get<Invitation[]>('/my/invitations'),
  getInvitation: (slug: string) => api.get<Invitation>(`/my/invitations/${slug}`),
  updateInvitation: (slug: string, data: Partial<Invitation>) =>
    api.put<Invitation>(`/my/invitations/${slug}`, data),
  publish: (slug: string, newSlug?: string) =>
    api.post<{ slug: string; url: string }>(`/my/invitations/${slug}/publish`, newSlug ? { slug: newSlug } : {}),
  changeTemplate: (slug: string, templateId: number) =>
    api.post<Template>(`/my/invitations/${slug}/template`, { template_id: templateId }),
  uploadImage: (file: File) => api.upload<{ url: string }>('/my/upload/image', file),
  uploadMusic: (file: File) => api.upload<{ url: string }>('/my/upload/music', file),

  // Khách mời (Phase 02) — CRUD per-thiệp.
  guests: {
    list: (slug: string) =>
      api.get<{ guests: Guest[]; stats: GuestStats }>(`/my/invitations/${slug}/guests`),
    create: (slug: string, data: { name: string; tag?: string }) =>
      api.post<Guest>(`/my/invitations/${slug}/guests`, data),
    update: (slug: string, id: number, data: { name: string; tag?: string }) =>
      api.put<Guest>(`/my/invitations/${slug}/guests/${id}`, data),
    remove: (slug: string, id: number) =>
      api.del(`/my/invitations/${slug}/guests/${id}`),
  },
};

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string;
  metaTitle: string | null;
  metaDesc: string | null;
  readingTime: number;
  viewCount: number;
  publishedAt: string | null;
  // detail only:
  contentHtml?: string;
  contentJson?: string;
  ogImage?: string | null;
  status?: string;
  authorId?: number | null;
  authorName?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
}

export const blogApi = {
  list: (params?: { page?: number; limit?: number; category?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.category) q.set('category', params.category);
    if (params?.search) q.set('search', params.search);
    return api.get<BlogListResponse>(`/posts?${q}`);
  },
  detail: (slug: string) => api.get<BlogPost>(`/posts/${slug}`),
};

export const adminBlogApi = {
  list: () => api.get<BlogPost[]>('/admin/posts'),
  detail: (id: number) => api.get<BlogPost>(`/admin/posts/${id}`),
  create: (data: Partial<BlogPost> & { contentHtml?: string; contentJson?: string }) =>
    api.post<BlogPost>('/admin/posts', data),
  update: (id: number, data: Partial<BlogPost> & { contentHtml?: string; contentJson?: string }) =>
    api.put<BlogPost>(`/admin/posts/${id}`, data),
  delete: (id: number) => api.del(`/admin/posts/${id}`),
  uploadImage: (file: File) => api.upload<{ url: string }>('/admin/posts/upload-image', file),
};

export interface MusicTrack { url: string; name: string; }
export const musicApi = {
  library: () => api.get<MusicTrack[]>('/music'),
};

export interface AdminStats {
  templates: number; orders: number; invitations: number;
  customers: number; newContacts: number; revenuePaid: number;
}

export const adminApi = {
  stats: () => api.get<AdminStats>('/admin/stats'),
  orders: () => api.get<any[]>('/admin/orders'),
  updateOrder: (id: number, data: { paymentStatus?: string; status?: string }) =>
    api.patch(`/admin/orders/${id}`, data),
  contacts: () => api.get<any[]>('/admin/contacts'),
  updateContact: (id: number, status: string) => api.patch(`/admin/contacts/${id}`, { status }),
  users: () => api.get<any[]>('/admin/users'),
  updateUser: (id: number, status: string) => api.patch(`/admin/users/${id}`, { status }),

  charts: () => api.get<{
    revenue: { month: string; orders: number; revenue: number }[];
    byCategory: { category: string; count: number }[];
    byStatus: { status: string; count: number }[];
  }>('/admin/charts'),

  // Templates
  createTemplate: (data: any) => api.post('/admin/templates', data),
  updateTemplate: (id: number, data: any) => api.put(`/admin/templates/${id}`, data),
  deleteTemplate: (id: number) => api.del(`/admin/templates/${id}`),
  templateDetail: (id: number) => api.get<any>(`/admin/templates/${id}`),
  updateDesign: (id: number, data: { theme: any; decorations: any[] }) =>
    api.put(`/admin/templates/${id}/design`, data),
  // Chụp lại ảnh preview coverflow (id số = 1 mẫu, 'all' = tất cả). Trả về { log }.
  regenPreview: (id: number | 'all') =>
    api.post<{ log: string }>(`/admin/templates/${id}/preview`, {}),

  // Invitations (thiệp sống)
  invitations: () => api.get<any[]>('/admin/invitations'),
  invitationDetail: (id: number) => api.get<any>(`/admin/invitations/${id}`),
  updateGuestbook: (id: number, isApproved: boolean) => api.patch(`/admin/guestbook/${id}`, { isApproved }),

  // Plans
  plans: () => api.get<any[]>('/admin/plans'),
  updatePlan: (id: number, data: any) => api.put(`/admin/plans/${id}`, data),

  // Testimonials
  testimonials: () => api.get<any[]>('/admin/testimonials'),
  createTestimonial: (data: any) => api.post('/admin/testimonials', data),
  deleteTestimonial: (id: number) => api.del(`/admin/testimonials/${id}`),

  // Settings
  settings: () => api.get<Record<string, string>>('/admin/settings'),
  updateSettings: (data: Record<string, string>) => api.put('/admin/settings', data),

  // Thư viện ảnh trang trí
  assets: () => api.get<{ url: string; name: string; group: string }[]>('/admin/assets'),
  uploadAsset: (file: File) => api.upload<{ url: string }>('/admin/assets/upload', file),

  // Thư viện nhạc
  musicList: () => api.get<MusicTrack[]>('/admin/music'),
  uploadMusic: (file: File) => api.upload<{ url: string; name: string }>('/admin/music/upload', file),
  renameMusic: (filename: string, name: string) => api.patch('/admin/music/rename', { filename, name }),
  deleteMusic: (filename: string) => api.del(`/admin/music/${encodeURIComponent(filename)}`),
};
