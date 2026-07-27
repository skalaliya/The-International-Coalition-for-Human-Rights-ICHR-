// Server-only post logic: validation, slug generation, serialization, and all
// DB queries/mutations. Reused by SSR pages (src/lib/api.ts) and API endpoints.
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from './db';
import { clampPageNumber } from '@/lib/pagination';
import type { Post, PostCategory } from '@/types';

export const CATEGORIES = ['Press Release', 'Statement', 'Field Update', 'News'] as const;
export const STATUSES = ['draft', 'published'] as const;
export const LOCALES = ['en', 'ar', 'fr'] as const;
export const DEFAULT_LOCALE = 'en';

// ---- validation ----
// Asset URLs must be http(s) or a known same-origin public path — never data:/
// blob:/javascript:, which could execute when rendered into <img>/<a>.
const ASSET_URL_RE = /^(https?:\/\/|\/(uploads|blog|images)\/)/;
const assetUrl = z
  .string()
  .max(2000)
  .refine((u) => ASSET_URL_RE.test(u), 'must be an http(s) URL or an /uploads, /blog, or /images path');

const gallerySchema = z.object({
  url: assetUrl,
  caption: z.string().max(500).optional(),
  order: z.number().int().min(0).optional(),
});

export const createPostSchema = z.object({
  slug: z.string().trim().max(120).optional(),
  locale: z.enum(LOCALES).default('en'),
  translationKey: z.string().trim().max(64).optional(),
  title: z.string().trim().min(1, 'title is required').max(300),
  category: z.enum(CATEGORIES),
  status: z.enum(STATUSES).default('draft'),
  date: z.coerce.date(),
  location: z.string().max(300).optional(),
  excerpt: z.string().trim().min(1, 'excerpt is required').max(1000),
  coverImageUrl: assetUrl.optional(),
  body: z.string().min(1, 'body is required'),
  hashtags: z.array(z.string().trim().min(1).max(100)).max(50).default([]),
  authorName: z.string().max(200).optional(),
  gallery: z.array(gallerySchema).max(50).default([]),
});

export const updatePostSchema = z.object({
  slug: z.string().trim().max(120).optional(),
  locale: z.enum(LOCALES).optional(),
  translationKey: z.string().trim().max(64).optional(),
  title: z.string().trim().min(1).max(300).optional(),
  category: z.enum(CATEGORIES).optional(),
  status: z.enum(STATUSES).optional(),
  date: z.coerce.date().optional(),
  location: z.string().max(300).optional(),
  excerpt: z.string().trim().min(1).max(1000).optional(),
  coverImageUrl: assetUrl.optional(),
  body: z.string().min(1).optional(),
  hashtags: z.array(z.string().trim().min(1).max(100)).max(50).optional(),
  authorName: z.string().max(200).optional(),
  gallery: z.array(gallerySchema).max(50).optional(),
});

export type CreateInput = z.infer<typeof createPostSchema>;
export type UpdateInput = z.infer<typeof updatePostSchema>;

// ---- helpers ----
export function slugify(input: string): string {
  return (
    String(input)
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'post'
  );
}

// Slugs are unique per locale, so the same story can share a slug across languages.
async function uniqueSlug(base: string, locale: string, excludeId: string | null = null): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let n = 1;
  for (;;) {
    const existing = await prisma.post.findFirst({ where: { slug: candidate, locale } });
    if (!existing || existing.id === excludeId) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

type DbPost = Prisma.PostGetPayload<{ include: { gallery: true } }>;

export function serializePost(p: DbPost): Post {
  let hashtags: string[] = [];
  try {
    const parsed = JSON.parse(p.hashtags ?? '[]');
    if (Array.isArray(parsed)) hashtags = parsed;
  } catch {
    hashtags = [];
  }
  return {
    id: p.id,
    slug: p.slug,
    locale: p.locale ?? 'en',
    translationKey: p.translationKey ?? undefined,
    title: p.title,
    category: p.category as PostCategory,
    status: p.status as Post['status'],
    date: p.date.toISOString(),
    location: p.location ?? '',
    excerpt: p.excerpt ?? '',
    coverImageUrl: p.coverImageUrl ?? '',
    body: p.body,
    gallery: (p.gallery ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((g) => ({ url: g.url, caption: g.caption ?? undefined })),
    hashtags,
    authorName: p.authorName ?? undefined,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

function clampPage(q: URLSearchParams) {
  const page = Math.min(10000, Math.max(1, parseInt(q.get('page') || '', 10) || 1));
  const pageSize = Math.min(50, Math.max(1, parseInt(q.get('pageSize') || '', 10) || 10));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

export interface Paged {
  items: Post[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ---- queries ----
export async function listPublished(opts: {
  page?: number;
  pageSize?: number;
  category?: string;
  locale?: string;
}): Promise<Paged> {
  // Clamped again here, not just at the caller: the SSR page calls this directly, and
  // Math.max(1, NaN) is NaN — which reaches Prisma as `skip: NaN` and throws.
  const page = clampPageNumber(opts.page ?? 1);
  const pageSize = clampPageNumber(opts.pageSize ?? 9, 50);
  const where: Prisma.PostWhereInput = { status: 'published', locale: opts.locale ?? DEFAULT_LOCALE };
  if (opts.category && CATEGORIES.includes(opts.category as PostCategory)) {
    where.category = opts.category;
  }
  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { gallery: true },
    }),
    prisma.post.count({ where }),
  ]);
  return {
    items: items.map(serializePost),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function listPublishedFromQuery(q: URLSearchParams): Promise<Paged> {
  const { page, pageSize } = clampPage(q);
  return listPublished({
    page,
    pageSize,
    category: q.get('category') || undefined,
    locale: q.get('locale') || undefined,
  });
}

export async function getPublishedBySlug(slug: string, locale: string = DEFAULT_LOCALE): Promise<Post | null> {
  const post = await prisma.post.findFirst({
    where: { slug, locale, status: 'published' },
    include: { gallery: true },
  });
  return post ? serializePost(post) : null;
}

/** Published translations of a story (for the article language toggle). */
export async function getTranslations(
  translationKey: string | null | undefined,
): Promise<{ locale: string; slug: string; title: string }[]> {
  if (!translationKey) return [];
  const rows = await prisma.post.findMany({
    where: { translationKey, status: 'published' },
    select: { locale: true, slug: true, title: true },
  });
  return rows;
}

export async function listAll(q: URLSearchParams): Promise<Paged> {
  const { page, pageSize, skip, take } = clampPage(q);
  const where: Prisma.PostWhereInput = {};
  const status = q.get('status');
  const category = q.get('category');
  const locale = q.get('locale');
  if (status) where.status = status;
  if (category && CATEGORIES.includes(category as PostCategory)) where.category = category;
  if (locale && (LOCALES as readonly string[]).includes(locale)) where.locale = locale;
  const [items, total] = await Promise.all([
    prisma.post.findMany({ where, orderBy: [{ updatedAt: 'desc' }], skip, take, include: { gallery: true } }),
    prisma.post.count({ where }),
  ]);
  return {
    items: items.map(serializePost),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getById(id: string): Promise<Post | null> {
  const post = await prisma.post.findUnique({ where: { id }, include: { gallery: true } });
  return post ? serializePost(post) : null;
}

// ---- mutations ----
export async function createPost(d: CreateInput): Promise<Post> {
  const locale = d.locale ?? DEFAULT_LOCALE;
  const slug = await uniqueSlug(d.slug && d.slug.trim() ? d.slug : d.title, locale);
  // Link translations safely: an explicit key wins; otherwise reuse the key of any
  // same-slug post in another locale (a shared slug is ALWAYS the same story, since
  // (slug, locale) is unique) — so a translation can never be silently orphaned even
  // if the editor forgets the key; only a genuinely new slug starts a fresh story.
  let translationKey = d.translationKey && d.translationKey.trim() ? d.translationKey.trim() : '';
  if (!translationKey) {
    const sibling = await prisma.post.findFirst({
      where: { slug, locale: { not: locale } },
      select: { translationKey: true },
    });
    translationKey = sibling?.translationKey || randomUUID();
  }
  const post = await prisma.post.create({
    data: {
      slug,
      locale,
      translationKey,
      title: d.title,
      category: d.category,
      status: d.status,
      date: d.date,
      location: d.location ?? null,
      excerpt: d.excerpt,
      coverImageUrl: d.coverImageUrl ?? null,
      body: d.body,
      authorName: d.authorName ?? null,
      hashtags: JSON.stringify(d.hashtags ?? []),
      gallery: {
        create: (d.gallery ?? []).map((g, i) => ({
          url: g.url,
          caption: g.caption ?? null,
          order: g.order ?? i,
        })),
      },
    },
    include: { gallery: true },
  });
  return serializePost(post);
}

export async function updatePost(id: string, d: UpdateInput): Promise<Post | null> {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return null;

  const locale = d.locale ?? existing.locale ?? DEFAULT_LOCALE;
  let slug = existing.slug;
  if (d.slug !== undefined || d.title !== undefined || d.locale !== undefined) {
    const base = d.slug && d.slug.trim() ? d.slug : d.title ?? existing.title;
    slug = await uniqueSlug(base, locale, existing.id);
  }

  const scalar: Prisma.PostUpdateInput = { slug, locale };
  if (d.translationKey !== undefined) scalar.translationKey = d.translationKey;
  if (d.title !== undefined) scalar.title = d.title;
  if (d.category !== undefined) scalar.category = d.category;
  if (d.status !== undefined) scalar.status = d.status;
  if (d.date !== undefined) scalar.date = d.date;
  if (d.location !== undefined) scalar.location = d.location;
  if (d.excerpt !== undefined) scalar.excerpt = d.excerpt;
  if (d.coverImageUrl !== undefined) scalar.coverImageUrl = d.coverImageUrl;
  if (d.body !== undefined) scalar.body = d.body;
  if (d.authorName !== undefined) scalar.authorName = d.authorName;
  if (d.hashtags !== undefined) scalar.hashtags = JSON.stringify(d.hashtags);

  const post = await prisma.$transaction(async (tx) => {
    await tx.post.update({ where: { id: existing.id }, data: scalar });
    if (d.gallery !== undefined) {
      await tx.galleryImage.deleteMany({ where: { postId: existing.id } });
      if (d.gallery.length > 0) {
        await tx.galleryImage.createMany({
          data: d.gallery.map((g, i) => ({
            postId: existing.id,
            url: g.url,
            caption: g.caption ?? null,
            order: g.order ?? i,
          })),
        });
      }
    }
    return tx.post.findUnique({ where: { id: existing.id }, include: { gallery: true } });
  });
  return post ? serializePost(post) : null;
}

export async function setStatus(id: string, status: 'draft' | 'published'): Promise<Post | null> {
  try {
    const post = await prisma.post.update({ where: { id }, data: { status }, include: { gallery: true } });
    return serializePost(post);
  } catch {
    return null;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    await prisma.post.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export function isUniqueViolation(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002';
}
