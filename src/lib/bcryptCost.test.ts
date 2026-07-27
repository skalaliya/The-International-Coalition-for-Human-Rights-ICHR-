// The login route defends against username enumeration by always running bcrypt —
// against the stored hash when the user exists, against a dummy hash when it doesn't.
// That only works if BOTH hashes use the same work factor.
//
// They didn't. DUMMY_HASH was cost 10 while prisma/seed.mjs hashed real passwords at
// cost 12, so an unknown username answered in ~56ms and a known one in ~211ms — a 154ms
// (3.7x) oracle, while the code comment claimed the branches were equal.
//
// These tests read the source text rather than importing it: src/server/auth.ts throws
// without JWT_SECRET, and a wall-clock timing assertion would be flaky under CI load.
// Comparing the declared costs catches the real defect deterministically.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const loginSrc = readFileSync(join(REPO, 'src', 'pages', 'api', 'auth', 'login.ts'), 'utf8');
const seedSrc = readFileSync(join(REPO, 'prisma', 'seed.mjs'), 'utf8');

function declaredCost(src: string, where: string): number {
  const m = src.match(/BCRYPT_COST\s*=\s*(\d+)/);
  assert.ok(m, `no BCRYPT_COST declaration found in ${where}`);
  return Number(m![1]);
}

test('the login route and the seed script agree on the bcrypt cost', () => {
  const login = declaredCost(loginSrc, 'src/pages/api/auth/login.ts');
  const seed = declaredCost(seedSrc, 'prisma/seed.mjs');
  assert.equal(
    login,
    seed,
    `bcrypt cost drifted: login.ts uses ${login}, prisma/seed.mjs uses ${seed}. ` +
      'Unequal costs re-open the username-enumeration timing oracle.',
  );
});

test('DUMMY_HASH is a real bcrypt hash at exactly that cost', () => {
  const m = loginSrc.match(/DUMMY_HASH\s*=\s*'(\$2[aby]?\$(\d{2})\$[./A-Za-z0-9]{53})'/);
  assert.ok(m, 'DUMMY_HASH is missing or is not a well-formed bcrypt hash');
  const [, hash, cost] = m!;
  assert.equal(
    Number(cost),
    declaredCost(loginSrc, 'login.ts'),
    `DUMMY_HASH is cost ${cost} but BCRYPT_COST is ${declaredCost(loginSrc, 'login.ts')} — ` +
      'regenerate it: bcrypt.hashSync(crypto.randomBytes(32).toString("hex"), BCRYPT_COST)',
  );
  assert.equal(hash.length, 60, 'a bcrypt hash is 60 characters');
});

test('the seed script hashes with the constant, not a literal', () => {
  assert.match(
    seedSrc,
    /bcrypt\.hash\(\s*password\s*,\s*BCRYPT_COST\s*\)/,
    'prisma/seed.mjs should hash with BCRYPT_COST so the drift test above can see it',
  );
});

test('login answers 401 (not 400) for bad credentials and validates with zod', () => {
  assert.match(loginSrc, /safeParse/, 'login must validate its body with zod');
  assert.doesNotMatch(
    loginSrc,
    /error: 'Invalid credentials' \}, 400\)/,
    'bad credentials should be 401, not 400',
  );
  assert.match(loginSrc, /error: 'Invalid credentials' \}, 401\)/);
});
