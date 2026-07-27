import type { APIRoute } from 'astro';
import { getById } from '@/server/posts';
import { verifyRequest, json, unauthorized } from '@/server/auth';
import { errorResponse } from '@/server/http';

export const prerender = false;

// Admin: a single post by id (incl. drafts).
export const GET: APIRoute = async ({ request, params }) => {
  if (!verifyRequest(request)) return unauthorized();
  try {
    const post = await getById(params.id!);
    if (!post) return json({ error: 'Post not found' }, 404);
    return json(post);
  } catch (e) {
    // Without this, an outage escaped as the adapter's HTML 500 page from a JSON
    // endpoint, and the admin client could only report "Request failed (500)".
    return errorResponse(e, 'load post');
  }
};
