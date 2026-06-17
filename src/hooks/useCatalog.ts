/**
 * Hooks lấy dữ liệu catalog từ API backend, fallback về mock data nếu API lỗi.
 * Giữ site luôn hiển thị được kể cả khi backend chưa chạy (graceful degradation).
 */
import { useEffect, useState } from 'react';
import { catalogApi } from '../api/client';
import {
  templates as mockTemplates,
  pricingPlans as mockPlans,
  testimonials as mockTestimonials,
} from '../data';
import type { Template, PricingPlan, Testimonial } from '../data/types';

type Source = 'api' | 'fallback';

export function useTemplates(category?: string) {
  const [data, setData] = useState<Template[]>(mockTemplates);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<Source>('fallback');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    catalogApi.templates(category).then((res) => {
      if (!alive) return;
      if (res.success && res.data) { setData(res.data); setSource('api'); }
      else { setData(mockTemplates); setSource('fallback'); }
      setLoading(false);
    }).catch(() => { if (alive) { setData(mockTemplates); setSource('fallback'); setLoading(false); } });
    return () => { alive = false; };
  }, [category]);

  return { templates: data, loading, source };
}

export function usePlans() {
  const [plans, setPlans] = useState<PricingPlan[]>(mockPlans);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    catalogApi.plans().then((res) => {
      if (!alive) return;
      setPlans(res.success && res.data ? res.data : mockPlans);
      setLoading(false);
    }).catch(() => { if (alive) { setPlans(mockPlans); setLoading(false); } });
    return () => { alive = false; };
  }, []);
  return { plans, loading };
}

export function useTestimonials() {
  const [items, setItems] = useState<Testimonial[]>(mockTestimonials);
  useEffect(() => {
    let alive = true;
    catalogApi.testimonials().then((res) => {
      if (alive && res.success && res.data) setItems(res.data);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);
  return items;
}
