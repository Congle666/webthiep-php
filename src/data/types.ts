export interface Template {
  id: string;
  slug: string;
  name: string;
  category: 'luxury' | 'modern' | 'classic' | 'minimalist' | 'floral' | 'vintage';
  description: string;
  thumbnail: string;
  gallery: string[];
  features: string[];
  priceFrom: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isHot: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: { text: string; included: boolean }[];
  isRecommended: boolean;
  ctaText: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  quote: string;
  rating: number;
  date: string;
}

export type CategoryFilter = 'all' | Template['category'];
