import type { APIRoute } from 'astro';
import { getPublishedBySlug, updatePost, deletePost, updatePostSchema, isUniqueViolation } from '@/server/posts';
import { verifyRequest, json, unauthorized } from '@/server/auth';
import { errorResponse } from '@/server/http';

export const prerender = false;

// Public: get a published post by slug (404 for drafts/missing).
export const GET: APIRoute = async ({ params }) => {
  try {
    const post = await getPublishedBySlug(params.key!);
    if (!post) return json({ error: 'Post not found' }, 404);
    return json(post);
  } catch (e) {
    return errorResponse(e, 'load post by slug');
  }
};

// Admin: update by id (PUT = full, PATCH = partial — same handler).
const update: APIRoute = async ({ request, params }) => {
  if (!verifyRequest(request)) return unauthorized();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  const parsed = updatePostSchema.safeParse(body);
  if (!parsed.success) return json({ error: 'Validation failed', details: parsed.error.flatten() }, 400);
  try {
    const post = await updatePost(params.key!, parsed.data);
    if (!post) return json({ error: 'Post not found' }, 404);
    return json(post);
  } catch (e) {
    if (isUniqueViolation(e)) return json({ error: 'A post with this slug already exists' }, 409);
    console.error(e);
    return json({ error: 'Failed to update post' }, 500);
  }
};
export const PUT = update;
export const PATCH = update;

// Admin: delete by id (gallery cascades).
export const DELETE: APIRoute = async ({ request, params }) => {
  if (!verifyRequest(request)) return unauthorized();
  try {
    const ok = await deletePost(params.key!);
    // false means the row is genuinely gone; an unreachable database throws, so an
    // outage no longer reports as "already deleted".
    if (!ok) return json({ error: 'Post not found' }, 404);
    return json({ success: true });
  } catch (e) {
    return errorResponse(e, 'delete post');
  }
};
