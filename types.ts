export interface NewsItem {
  id: number;
  title: string;
  date: string;
  source?: string;
  summary: string;
  imageUrl: string;
  category?: 'News' | 'Blog';
}

export interface VideoItem {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  date: string;
  duration?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export enum SectionType {
  Standard,
  Gray,
  Dark
}