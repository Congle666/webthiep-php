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

import type { Invitation } from '../features/invitation/types';

export const invitationApi = {
  view: (slug: string) => api.get<Invitation>(`/thiep/${slug}`),
  demo: (slug: string) => api.get<Invitation>(`/demo/${slug}`),
  rsvp: (slug: string, data: { guest_name: string; attendance: 'yes' | 'no' | 'maybe'; guest_count?: number; message?: string }) =>
    api.post(`/thiep/${slug}/rsvp`, data),
  guestbook: (slug: string, data: { guest_name: string; message: string }) =>
    api.post(`/thiep/${slug}/guestbook`, data),
};

export interface AuthUser { id: number; fullName: string; email: string; phone: string | null; role: 'admin' | 'customer'; }

export const authApi = {
  register: (data: { full_name: string; email: string; phone?: string; password: string }) =>
    api.post<AuthUser>('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post<AuthUser>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<AuthUser>('/auth/me'),
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
};
