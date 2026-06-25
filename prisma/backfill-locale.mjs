// One-off backfill after adding `locale` + `translationKey` to Post.
// Sets locale='en' and translationKey=id for any pre-i18n rows. Idempotent.
// Run with: node --env-file=.env.local prisma/backfill-locale.mjs
import { PrismaClient } from '@prisma/client';

const DB_URL = process.env.DATABASE_URL || '';
if (!DB_URL || /localhost|127\.0\.0\.1|placeholder/i.test(DB_URL) || !/neon\.tech/i.test(DB_URL)) {
  console.error('ABORT: DATABASE_URL is not the Neon production database.\n  Run: node --env-file=.env.local prisma/backfill-locale.mjs');
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({ select: { id: true, slug: true, locale: true, translationKey: true } });
  let updated = 0;
  for (const p of posts) {
    const data = {};
    if (!p.locale) data.locale = 'en';
    if (!p.translationKey) data.translationKey = p.id; // each existing post is its own story
    if (Object.keys(data).length) {
      await prisma.post.update({ where: { id: p.id }, data });
      updated += 1;
    }
  }
  console.log(`Backfill complete: ${updated}/${posts.length} row(s) updated.`);
  for (const p of posts) console.log(`  - ${p.slug} [${p.locale || 'en'}] key=${p.translationKey || p.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
