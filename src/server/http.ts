// Shared failure handling for the JSON API routes.
//
// Two things this fixes:
//  1. Routes that let a throw escape returned the adapter's HTML 500 page from a JSON
//     endpoint, so the admin client's `res.json()` failed and the editor saw the
//     unhelpful fallback "Request failed (500)".
//  2. Routes that treated every failure as "not found" told an editor their post had
//     been deleted when the database was simply unreachable.
import { json } from './auth';
import { classifyDbError } from '@/lib/prismaErrorCodes';

/**
 * Turns a thrown value into a truthful JSON response.
 * 503 carries Retry-After so a client (or a proxy) knows this is transient.
 */
export function errorResponse(err: unknown, context: string): Response {
  const kind = classifyDbError(err);
  console.error(`[api] ${context} failed (${kind}):`, err);

  if (kind === 'not-found') return json({ error: 'Not found' }, 404);

  const res = json(
    { error: 'The database is temporarily unavailable. Please try again in a moment.' },
    503,
  );
  res.headers.set('Retry-After', '5');
  return res;
}

/**
 * Wraps a route handler so no JSON endpoint can ever answer with an HTML 500.
 * Responses the handler returns itself (401, 404, 400 …) pass through untouched.
 */
export function withErrorHandling(
  context: string,
  handler: (...args: never[]) => Promise<Response>,
): (...args: never[]) => Promise<Response> {
  return async (...args: never[]) => {
    try {
      return await handler(...args);
    } catch (err) {
      return errorResponse(err, context);
    }
  };
}
