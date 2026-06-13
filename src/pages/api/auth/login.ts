import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import { prisma } from '@/server/db';
import { signToken, json } from '@/server/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }
  const { username, password } = body || {};
  if (!username || !password) return json({ error: 'Invalid credentials' }, 400);

  // Single generic message for both cases (no user enumeration).
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return json({ error: 'Invalid credentials' }, 400);
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return json({ error: 'Invalid credentials' }, 400);

  return json({ token: signToken({ id: user.id, username: user.username }) });
};
