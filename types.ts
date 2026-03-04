export interface Review {
  id: string;
  toolId: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

export interface AiTool {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  keyFeatures?: string[];
  category: string;
  rating: number;
  reviewCount: number;
  pricing: 'Free' | 'Freemium' | 'Paid';
  imageUrl: string;
  tags: string[];
  websiteUrl: string;
  featured?: boolean;
  status?: 'approved' | 'pending' | 'rejected';
  reviews?: Review[];
}

export enum Category {
  ALL = 'All',
  TEXT = 'Text & Writing',
  IMAGE = 'Image Generation',
  VIDEO = 'Video',
  AUDIO = 'Audio & Speech',
  CODING = 'Coding Assistant',
  BUSINESS = 'Business',
}

export interface NavItem {
  label: string;
  href: string;
}
