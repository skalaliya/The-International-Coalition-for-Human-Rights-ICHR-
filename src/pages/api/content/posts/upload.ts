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

  // Raster allow-list only — NO svg (svg can carry script and would be served
  // from our origin). The declared MIME is then confirmed against magic bytes.
  const ALLOWED: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  if (!(file.type in ALLOWED)) {
    return json({ error: 'Only JPEG, PNG, WebP, or GIF images are allowed' }, 400);
  }
  if (file.size > 10 * 1024 * 1024) return json({ error: 'File too large (max 10MB)' }, 413);

  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const sniff =
    head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff
      ? 'image/jpeg'
      : head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47
        ? 'image/png'
        : head[0] === 0x47 && head[1] === 0x49 && head[2] === 0x46
          ? 'image/gif'
          : head[0] === 0x52 &&
              head[1] === 0x49 &&
              head[2] === 0x46 &&
              head[3] === 0x46 &&
              head[8] === 0x57 &&
              head[9] === 0x45 &&
              head[10] === 0x42 &&
              head[11] === 0x50
            ? 'image/webp'
            : null;
  if (sniff !== file.type) {
    return json({ error: 'File content does not match an allowed image type' }, 400);
  }

  const ext = ALLOWED[file.type];
  const key = `uploads/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

  try {
    const blob = await put(key, file, { access: 'public', contentType: file.type });
    return json({ url: blob.url });
  } catch (e) {
    console.error(e);
    return json({ error: 'Upload failed. Is the Blob store connected?' }, 500);
  }
};
