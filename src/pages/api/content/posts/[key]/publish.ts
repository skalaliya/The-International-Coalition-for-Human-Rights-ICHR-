import type { APIRoute } from 'astro';
import { setStatus } from '@/server/posts';
import { verifyRequest, json, unauthorized } from '@/server/auth';
import { errorResponse } from '@/server/http';

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
  if (!verifyRequest(request)) return unauthorized();
  try {
    const post = await setStatus(params.key!, 'published');
    // Only a genuinely missing row arrives as null. An unreachable database throws and
    // becomes a 503 below, rather than telling the editor their post was deleted.
    if (!post) return json({ error: 'Post not found' }, 404);
    return json(post);
  } catch (e) {
    return errorResponse(e, 'publish post');
  }
};
