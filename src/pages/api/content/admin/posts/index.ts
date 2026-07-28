import type { APIRoute } from 'astro';
import { listAll } from '@/server/posts';
import { verifyRequest, json, unauthorized } from '@/server/auth';
import { errorResponse } from '@/server/http';

export const prerender = false;

// Admin: all posts incl. drafts.
export const GET: APIRoute = async ({ request, url }) => {
  if (!verifyRequest(request)) return unauthorized();
  try {
    return json(await listAll(url.searchParams));
  } catch (e) {
    return errorResponse(e, 'list posts');
  }
};
