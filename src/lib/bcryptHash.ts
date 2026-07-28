// Reading the work factor out of a stored bcrypt hash.
//
// Why this exists: making DUMMY_HASH cost 12 was NOT enough to close the
// username-enumeration timing oracle. The admin row in production predates the
// cost-12 seed and is still cost 10 — `prisma/seed.mjs` is create-only and never
// touches an existing password. So the oracle survived, merely inverted: a VALID
// username compared against the cost-10 stored hash and answered ~2x faster than an
// unknown one compared against the cost-12 dummy.
//
// A constant in the code cannot fix data that already exists, so the login route
// upgrades a stale hash in place after a successful sign-in. That self-heals whatever
// is in the database and keeps working if BCRYPT_COST is raised again later.

/** The cost factor encoded in a bcrypt hash, or null if it isn't one. */
export function parseBcryptCost(hash: string | null | undefined): number | null {
  if (typeof hash !== 'string') return null;
  const m = hash.match(/^\$2[aby]?\$(\d{2})\$[./A-Za-z0-9]{53}$/);
  if (!m) return null;
  const cost = Number(m[1]);
  return Number.isInteger(cost) ? cost : null;
}

/**
 * True when a stored hash should be re-hashed at the target cost.
 *
 * Only upgrades: a hash that is already stronger than the target is left alone, so
 * lowering BCRYPT_COST can never weaken stored credentials. A malformed hash is not
 * "rehashable" — nothing verified against it, so there is nothing to upgrade.
 */
export function needsRehash(hash: string | null | undefined, targetCost: number): boolean {
  const cost = parseBcryptCost(hash);
  if (cost === null) return false;
  return cost < targetCost;
}
