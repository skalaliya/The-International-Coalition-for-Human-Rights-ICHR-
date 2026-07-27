import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/server/db';
import { signToken, json } from '@/server/auth';

export const prerender = false;

// Bcrypt work factor. MUST match the cost prisma/seed.mjs hashes real passwords with —
// src/lib/bcryptCost.test.ts fails if they drift apart.
export const BCRYPT_COST = 12;

// A valid bcrypt hash of a random string, compared against when the username doesn't
// exist so both branches do the SAME amount of work.
//
// This was cost 10 while real passwords were hashed at cost 12, which made the comment
// below false and leaked exactly what it claimed to hide: measured on a dev machine, an
// unknown username answered in 56ms and a known one in 211ms — a 154ms (3.7x)
// username-enumeration oracle. Regenerated at cost 12, both branches now take the same
// ~210ms. If BCRYPT_COST ever changes, regenerate this too.
const DUMMY_HASH = '$2a$12$3aFpeApy/3vnAC.Dydsaq.XrUPFo6t1MKDFlLwjnSHfaqj5lcmgEW';

// Bounded so an enormous body can't turn bcrypt into a CPU sink. bcrypt only reads the
// first 72 bytes anyway, so the cap costs nothing legitimate.
const credentials = z.object({
  username: z.string().min(1).max(200),
  password: z.string().min(1).max(200),
});

export const POST: APIRoute = async ({ request }) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  // Without this, a JSON object where a string belongs — {"username":{"equals":"admin"}}
  // — reached Prisma and threw, answering with a 500 that confirmed the request shape.
  const parsed = credentials.safeParse(raw);
  if (!parsed.success) return json({ error: 'Invalid credentials' }, 401);
  const { username, password } = parsed.data;

  try {
    // Always run bcrypt (against the dummy hash when the user is missing) so response
    // time can't be used to enumerate usernames. Single generic message either way.
    const user = await prisma.user.findUnique({ where: { username } });
    const ok = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
    if (!user || !ok) return json({ error: 'Invalid credentials' }, 401);

    return json({ token: signToken({ id: user.id, username: user.username }) });
  } catch (e) {
    // A database outage is not "wrong password" — saying so sends the admin hunting for
    // a credential problem that doesn't exist.
    console.error('[auth] login failed:', e);
    return json({ error: 'Sign-in is temporarily unavailable. Please try again shortly.' }, 503);
  }
};
