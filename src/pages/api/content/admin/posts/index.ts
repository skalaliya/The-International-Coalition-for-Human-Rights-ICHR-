import type { APIRoute } from 'astro';
import { listAll } from '@/server/posts';
import { verifyRequest, json, unauthorized } from '@/server/auth';

export const prerender = false;

// Admin: all posts incl. drafts.
export const GET: APIRoute = async ({ request, url }) => {
  if (!verifyRequest(request)) return unauthorized();
  try {
    return json(await listAll(url.searchParams));
  } catch (e) {
    console.error(e);
    return json({ error: 'Failed to load posts' }, 500);
  }
};
