import type { APIRoute } from 'astro';
import { setStatus } from '@/server/posts';
import { verifyRequest, json, unauthorized } from '@/server/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
  if (!verifyRequest(request)) return unauthorized();
  const post = await setStatus(params.key!, 'draft');
  if (!post) return json({ error: 'Post not found' }, 404);
  return json(post);
};
