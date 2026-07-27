// Tells "the database is unreachable" apart from "that row doesn't exist".
//
// Pure and dependency-free on purpose: it must be importable from the src/lib test glob,
// which rules out anything that pulls in @prisma/client.
//
// Why it matters: src/server/posts.ts used to catch everything and return null, so the
// admin API answered "Post not found" for a post the editor was looking at whenever Neon
// hiccupped. An editor then goes hunting for a data problem that doesn't exist. Readers
// still get the quiet empty-state degradation — that part is deliberate — but the admin
// API should tell the truth.

/** Prisma initialisation/connection errors: the server could not be reached or timed out. */
const UNAVAILABLE = new Set([
  'P1000', // authentication failed against the database server
  'P1001', // can't reach database server
  'P1002', // database server reached but timed out
  'P1008', // operation timed out
  'P1011', // error opening a TLS connection
  'P1017', // server has closed the connection
]);

/** Prisma "record required but not found" — the genuine 404. */
const NOT_FOUND = new Set([
  'P2025', // an operation failed because it depends on records that were not found
]);

export function isUnavailableCode(code: unknown): boolean {
  return typeof code === 'string' && UNAVAILABLE.has(code);
}

export function isNotFoundCode(code: unknown): boolean {
  return typeof code === 'string' && NOT_FOUND.has(code);
}

/**
 * Classifies a thrown value without importing Prisma. Anything that isn't clearly a
 * missing record is treated as unavailable — a 503 the caller can retry is a better
 * failure than a 404 that sends someone looking for deleted data.
 */
export function classifyDbError(err: unknown): 'not-found' | 'unavailable' {
  const code = (err as { code?: unknown } | null)?.code;
  if (isNotFoundCode(code)) return 'not-found';
  if (isUnavailableCode(code)) return 'unavailable';
  // PrismaClientInitializationError carries no code but always means "couldn't connect".
  const name = (err as { name?: unknown } | null)?.name;
  if (typeof name === 'string' && name.includes('Initialization')) return 'unavailable';
  return 'unavailable';
}
