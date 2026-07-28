import type { APIRoute } from 'astro';
import { setStatus } from '@/server/posts';
import { verifyRequest, json, unauthorized } from '@/server/auth';
import { errorResponse } from '@/server/http';

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
  if (!verifyRequest(request)) return unauthorized();
  try {
    const post = await setStatus(params.key!, 'draft');
    // See publish.ts — null is a missing row, a throw is an outage (503).
    if (!post) return json({ error: 'Post not found' }, 404);
    return json(post);
  } catch (e) {
    return errorResponse(e, 'unpublish post');
  }
};
