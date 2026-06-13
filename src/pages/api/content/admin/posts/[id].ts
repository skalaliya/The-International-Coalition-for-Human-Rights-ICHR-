import type { APIRoute } from 'astro';
import { getById } from '@/server/posts';
import { verifyRequest, json, unauthorized } from '@/server/auth';

export const prerender = false;

// Admin: a single post by id (incl. drafts).
export const GET: APIRoute = async ({ request, params }) => {
  if (!verifyRequest(request)) return unauthorized();
  const post = await getById(params.id!);
  if (!post) return json({ error: 'Post not found' }, 404);
  return json(post);
};
