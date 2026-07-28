// Ensures the admin user exists. Nothing else.
//
// This script used to also upsert the launch press release, which made
// `npm run db:seed` actively dangerous: it rotated the admin password on every
// run, then threw — its `upsert({ where: { slug } })` became invalid once the
// schema moved to `@@unique([slug, locale])`. So it changed your password and
// failed. That content now lives in prisma/seed-eu-delegation.mjs.
//
// Guarantees:
//   • aborts unless DATABASE_URL points at the Neon production database
//   • creating is idempotent — re-running NEVER rotates an existing password
//   • rotating is explicit and opt-in (RESET_ADMIN_PASSWORD=1)
//
// Writes over Neon's HTTPS serverless driver (port 443); this network drops the
// Postgres :5432 handshake, so a PrismaClient here would be unrunnable locally.
//
// Usage:
//   node --env-file=.env.local prisma/seed.mjs                          # create if absent
//   RESET_ADMIN_PASSWORD=1 node --env-file=.env.local prisma/seed.mjs   # rotate the password
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

// MUST equal BCRYPT_COST in src/pages/api/auth/login.ts. If the login route compares
// against a dummy hash of a different cost, the "both branches take equal time" defence
// stops working and response time reveals whether a username exists.
// src/lib/bcryptCost.test.ts fails the build if these drift apart.
const BCRYPT_COST = 12;

const RESET = process.env.RESET_ADMIN_PASSWORD === '1';

function maskedHost(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.username ? '***@' : ''}${u.host}${u.pathname}`;
  } catch {
    return '(unparseable DATABASE_URL)';
  }
}

async function main() {
  const DB_URL = process.env.DATABASE_URL || '';
  console.log(`DB target: ${maskedHost(DB_URL)}`);
  if (!DB_URL || /localhost|127\.0\.0\.1|placeholder/i.test(DB_URL) || !/neon\.tech/i.test(DB_URL)) {
    console.error(
      'ABORT: DATABASE_URL is not the Neon production database.\n' +
        '       Run with: node --env-file=.env.local prisma/seed.mjs',
    );
    process.exit(1);
  }

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error('ADMIN_PASSWORD is required to seed the admin user');
  if (/^(admin|password|change-me)$/i.test(password)) {
    console.error('ABORT: refusing to seed a well-known default password. Set a strong ADMIN_PASSWORD.');
    process.exit(1);
  }

  const sql = neon(DB_URL);
  const hashed = await bcrypt.hash(password, BCRYPT_COST);

  if (RESET) {
    const updated = await sql.query(
      `UPDATE "User" SET password = $2, "updatedAt" = now() WHERE username = $1 RETURNING id`,
      [username, hashed],
    );
    if (!updated[0]) {
      console.error(`ABORT: no user "${username}" to reset. Run without RESET_ADMIN_PASSWORD to create one.`);
      process.exit(1);
    }
    console.log(`🔑 Password rotated for admin user: ${username}`);
    return;
  }

  // Create-only. An existing admin's password is never touched.
  await sql.query(
    `INSERT INTO "User" (id, username, password, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, now(), now())
     ON CONFLICT (username) DO NOTHING`,
    [randomUUID(), username, hashed],
  );

  const rows = await sql.query(`SELECT id FROM "User" WHERE username = $1`, [username]);
  if (!rows[0]) {
    console.error('ABORT: read-back failed — admin user was not created.');
    process.exit(1);
  }
  console.log(`✅ Admin user ready: ${username} (existing password left untouched)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
