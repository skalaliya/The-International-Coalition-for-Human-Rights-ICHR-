import type { APIRoute } from 'astro';
import { put } from '@vercel/blob';
import { verifyRequest, json, unauthorized } from '@/server/auth';

export const prerender = false;

// Admin image upload → Vercel Blob (public). Returns an absolute blob URL.
export const POST: APIRoute = async ({ request }) => {
  if (!verifyRequest(request)) return unauthorized();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Invalid form data' }, 400);
  }
  const file = form.get('image');
  if (!(file instanceof File)) return json({ error: 'No file uploaded' }, 400);
  if (!file.type.startsWith('image/')) return json({ error: 'Only image files are allowed' }, 400);
  if (file.size > 10 * 1024 * 1024) return json({ error: 'File too large (max 10MB)' }, 413);

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const key = `uploads/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

  try {
    const blob = await put(key, file, { access: 'public', contentType: file.type });
    return json({ url: blob.url });
  } catch (e) {
    console.error(e);
    return json({ error: 'Upload failed. Is the Blob store connected?' }, 500);
  }
};
