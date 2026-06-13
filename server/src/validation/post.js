const { z } = require('zod');

const CATEGORIES = ['Press Release', 'Statement', 'Field Update', 'News'];
const STATUSES = ['draft', 'published'];

const gallerySchema = z.object({
    url: z.string().min(1, 'gallery image url is required'),
    caption: z.string().max(500).optional(),
    order: z.number().int().min(0).optional(),
});

// Create: status defaults to 'draft' when omitted.
const createPostSchema = z.object({
    slug: z.string().trim().max(120).optional(), // optional → auto-generated from title
    title: z.string().trim().min(1, 'title is required').max(300),
    category: z.enum(CATEGORIES),
    status: z.enum(STATUSES).default('draft'),
    date: z.coerce.date(),
    location: z.string().max(300).optional(),
    excerpt: z.string().trim().min(1, 'excerpt is required').max(1000),
    coverImageUrl: z.string().max(2000).optional(), // relative /uploads or /blog, or absolute
    body: z.string().min(1, 'body is required'),
    hashtags: z.array(z.string().trim().min(1).max(100)).max(50).default([]),
    authorName: z.string().max(200).optional(),
    gallery: z.array(gallerySchema).max(50).default([]),
});

// Update: every field optional and NO status default (so an omitted status
// never silently unpublishes a post).
const updatePostSchema = z.object({
    slug: z.string().trim().max(120).optional(),
    title: z.string().trim().min(1).max(300).optional(),
    category: z.enum(CATEGORIES).optional(),
    status: z.enum(STATUSES).optional(),
    date: z.coerce.date().optional(),
    location: z.string().max(300).optional(),
    excerpt: z.string().trim().min(1).max(1000).optional(),
    coverImageUrl: z.string().max(2000).optional(),
    body: z.string().min(1).optional(),
    hashtags: z.array(z.string().trim().min(1).max(100)).max(50).optional(),
    authorName: z.string().max(200).optional(),
    gallery: z.array(gallerySchema).max(50).optional(),
});

module.exports = { createPostSchema, updatePostSchema, CATEGORIES, STATUSES };
