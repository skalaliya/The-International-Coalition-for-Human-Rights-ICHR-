import type { APIRoute } from 'astro';
import { listPublishedFromQuery, createPost, createPostSchema, isUniqueViolation } from '@/server/posts';
import { verifyRequest, json, unauthorized } from '@/server/auth';

export const prerender = false;

// Public: published posts only, paginated, optional ?category=
export const GET: APIRoute = async ({ url }) => {
  try {
    return json(await listPublishedFromQuery(url.searchParams));
  } catch (e) {
    console.error(e);
    return json({ error: 'Failed to load posts' }, 500);
  }
};

// Admin: create
export const POST: APIRoute = async ({ request }) => {
  if (!verifyRequest(request)) return unauthorized();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) return json({ error: 'Validation failed', details: parsed.error.flatten() }, 400);
  try {
    return json(await createPost(parsed.data), 201);
  } catch (e) {
    if (isUniqueViolation(e)) return json({ error: 'A post with this slug already exists' }, 409);
    console.error(e);
    return json({ error: 'Failed to create post' }, 500);
  }
};
