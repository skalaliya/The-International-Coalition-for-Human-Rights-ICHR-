import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import { prisma } from '@/server/db';
import { signToken, json } from '@/server/auth';

export const prerender = false;

// A valid bcrypt hash compared against when the username is missing, so both
// branches take ~equal time and don't reveal whether an account exists.
const DUMMY_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

export const POST: APIRoute = async ({ request }) => {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }
  const { username, password } = body || {};
  if (!username || !password) return json({ error: 'Invalid credentials' }, 400);

  // Always run bcrypt (against a dummy hash when the user is missing) so response
  // time can't be used to enumerate usernames. Single generic message either way.
  const user = await prisma.user.findUnique({ where: { username } });
  const ok = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
  if (!user || !ok) return json({ error: 'Invalid credentials' }, 400);

  return json({ token: signToken({ id: user.id, username: user.username }) });
};
