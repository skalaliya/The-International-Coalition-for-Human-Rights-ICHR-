// Server-only JWT helpers for the admin API endpoints.
import jwt from 'jsonwebtoken';

function secret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is required');
  return s;
}

export interface AuthUser {
  id: string;
  username: string;
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ id: user.id, username: user.username }, secret(), {
    expiresIn: '2h',
    algorithm: 'HS256',
  });
}

/** Returns the auth payload if the request carries a valid Bearer token, else null. */
export function verifyRequest(request: Request): AuthUser | null {
  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, secret(), { algorithms: ['HS256'] }) as {
      id: string;
      username: string;
    };
    return { id: payload.id, username: payload.username };
  } catch {
    return null;
  }
}

/** JSON response helper. */
export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function unauthorized(): Response {
  return json({ error: 'Unauthorized' }, 401);
}
