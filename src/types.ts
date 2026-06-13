export type PostStatus = 'draft' | 'published';
export type PostCategory = 'Press Release' | 'Statement' | 'Field Update' | 'News';

export interface GalleryImage {
  url: string;
  caption?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  category: PostCategory;
  status: PostStatus;
  date: string; // ISO
  location: string;
  excerpt: string;
  coverImageUrl: string;
  body: string; // Markdown
  gallery: GalleryImage[];
  hashtags: string[];
  authorName?: string;
  createdAt: string;
  updatedAt: string;
}

/** Editor payload — server assigns id/slug-collision/createdAt/updatedAt. */
export type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;

export interface PaginatedPosts {
  items: Post[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const POST_CATEGORIES: PostCategory[] = [
  'Press Release',
  'Statement',
  'Field Update',
  'News',
];
