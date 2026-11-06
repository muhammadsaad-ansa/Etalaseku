export interface DigitalLink {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  price?: string;
  badge?: string;
  clicks: number;
  isActive: boolean;
  isPinned: boolean;
  order: number;
}

export interface ProfileData {
  name: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  theme: 'slate' | 'emerald' | 'sunset' | 'purple' | 'midnight';
  whatsapp: string;
  instagram: string;
  email: string;
  website: string;
  tiktok: string;
  viewCount: number;
  categories: string[];
}
