// Surgical, idempotent i18n migration applied as explicit SQL (no destructive
// operations — only ADD COLUMN + an index swap). Mirrors the schema change so a
// later `prisma db push` is a no-op. Run:
//   node --env-file=.env.local prisma/migrate-i18n.mjs
import { PrismaClient } from '@prisma/client';

const DB_URL = process.env.DATABASE_URL || '';
if (!DB_URL || /localhost|127\.0\.0\.1|placeholder/i.test(DB_URL) || !/neon\.tech/i.test(DB_URL)) {
  console.error('ABORT: DATABASE_URL is not the Neon production database.\n  Run: node --env-file=.env.local prisma/migrate-i18n.mjs');
  process.exit(1);
}

const prisma = new PrismaClient();

// Each statement is additive / idempotent. Nothing drops a column, row, or table.
const STATEMENTS = [
  `ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "locale" TEXT NOT NULL DEFAULT 'en'`,
  `ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "translationKey" TEXT`,
  // Swap the slug-only unique index for a (slug, locale) composite (no rows touched).
  `DROP INDEX IF EXISTS "Post_slug_key"`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Post_slug_locale_key" ON "Post" ("slug", "locale")`,
  `CREATE INDEX IF NOT EXISTS "Post_status_locale_date_idx" ON "Post" ("status", "locale", "date")`,
  `CREATE INDEX IF NOT EXISTS "Post_translationKey_idx" ON "Post" ("translationKey")`,
];

async function main() {
  console.log('Target:', DB_URL.replace(/:[^:@]+@/, ':***@'));
  for (const sql of STATEMENTS) {
    await prisma.$executeRawUnsafe(sql);
    console.log('  ✓', sql);
  }
  // Verify the new columns are readable and existing rows are intact.
  const count = await prisma.post.count();
  const sample = await prisma.post.findMany({ select: { slug: true, locale: true, translationKey: true }, take: 5 });
  console.log(`✅ Migration applied. Post rows intact: ${count}`);
  for (const r of sample) console.log(`   - ${r.slug} [${r.locale}] key=${r.translationKey ?? '(null)'}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
