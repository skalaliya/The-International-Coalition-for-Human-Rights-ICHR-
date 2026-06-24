// Idempotent additive seed for a single press release:
// "The International Coalition Meets with the UN Fact-Finding Mission for Sudan".
// Upserts ONLY this post by slug — never touches the admin user or other posts.
//
// Usage:
//   DRY_RUN=1  node --env-file=.env.local prisma/seed-un-ffm.mjs   # validate only, no write
//              node --env-file=.env.local prisma/seed-un-ffm.mjs   # publish (upsert)
//   UNPUBLISH=1 node --env-file=.env.local prisma/seed-un-ffm.mjs  # set status=draft (rollback)
import { PrismaClient } from '@prisma/client';

const SLUG = 'un-fact-finding-mission-sudan-geneva-june-2026';
const DRY_RUN = process.env.DRY_RUN === '1';
const UNPUBLISH = process.env.UNPUBLISH === '1';

// ---- DB target guard: prove we are writing to the Neon production DB ----
const DB_URL = process.env.DATABASE_URL || '';
function maskedHost(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.username ? '***@' : ''}${u.host}${u.pathname}`;
  } catch {
    return '(unparseable DATABASE_URL)';
  }
}
console.log(`DB target: ${maskedHost(DB_URL)}`);
if (!DB_URL || /localhost|127\.0\.0\.1|placeholder/i.test(DB_URL) || !/neon\.tech/i.test(DB_URL)) {
  console.error(
    'ABORT: DATABASE_URL is not the Neon production database.\n' +
      '       Run with: node --env-file=.env.local prisma/seed-un-ffm.mjs',
  );
  process.exit(1);
}

const prisma = new PrismaClient();

const BODY = `A high-level strategic meeting was held between the Coalition of International Organizations and the United Nations Independent International Fact-Finding Mission for the Sudan, against the backdrop of the ongoing and deeply concerning human rights situation in the country. Participants characterized the meeting as an important step toward advancing accountability, truth-seeking and the broader objectives of transitional justice.

## Mission Leadership and Participation

The meeting was chaired by Mr. Mohamed Chande Othman, Chair of the Fact-Finding Mission, together with Mission members Ms. Joy Ezeilo and Ms. Mona Rishmawi, and attended by the Mission's full team. The level of participation underscored the Mission's continued commitment to engaging constructively with civil society stakeholders and partners working to promote human rights and accountability in Sudan.

## Centering Victims and Affected Communities

During the discussions, the Coalition emphasized the importance of ensuring that investigative and hearing methodologies remain inclusive, representative and responsive to the realities faced by affected communities. Particular attention was drawn to the need for broader engagement with victims, survivors and witnesses residing within Sudan and in conflict-affected areas, in order to ensure that the perspectives of those most directly impacted by ongoing violations are adequately reflected in the Mission's work.

## Strengthening Documentation and Witness Protection

Participants further discussed practical avenues for strengthening the documentation of human rights violations and abuses in accordance with international standards, enhancing witness protection measures in complex operational environments, and supporting efforts aimed at combating impunity and promoting accountability for serious violations of international human rights law and international humanitarian law.

## A Shared Commitment to Sustained Cooperation

The meeting concluded with a shared understanding of the importance of sustained cooperation, regular coordination and the removal of obstacles that may hinder the effective work of international fact-finding mechanisms. Participants reaffirmed that durable peace, justice and reconciliation in Sudan require a credible process grounded in truth, accountability and the meaningful participation of victims and affected communities.

The Coalition expressed its appreciation for the Mission's continued engagement and reiterated its readiness to contribute constructively to ongoing efforts aimed at advancing human rights protection, accountability, and sustainable peace in Sudan.`;

const EXCERPT =
  'A high-level strategic meeting was held between the International Coalition and the United Nations Independent International Fact-Finding Mission for the Sudan to discuss war-related violations and advance accountability, truth-seeking and transitional justice — with a shared focus on engaging victims, survivors and witnesses on the ground.';

const POST = {
  slug: SLUG,
  title:
    'The International Coalition Meets with the UN Fact-Finding Mission for Sudan in Geneva to Discuss War-Related Violations and Efforts to Advance Accountability and Justice',
  category: 'Press Release',
  status: 'published',
  date: new Date('2026-06-24T00:00:00.000Z'),
  location: 'Geneva',
  excerpt: EXCERPT,
  coverImageUrl: `/blog/${SLUG}/cover.jpg`,
  body: BODY,
  hashtags: JSON.stringify(['#international_coalition_for_h_rights']),
  authorName: 'ICHR Communications',
};

async function main() {
  const existing = await prisma.post.findUnique({ where: { slug: SLUG } });
  console.log(
    `Slug "${SLUG}" ${
      existing ? `exists (id ${existing.id}, status ${existing.status}) → update` : 'not found → create'
    }`,
  );

  if (DRY_RUN) {
    console.log('DRY_RUN=1 → no write. Payload summary:');
    console.log({
      title: POST.title.slice(0, 64) + '…',
      category: POST.category,
      status: POST.status,
      date: POST.date.toISOString(),
      location: POST.location,
      coverImageUrl: POST.coverImageUrl,
      hashtags: POST.hashtags,
      bodyChars: POST.body.length,
    });
    return;
  }

  if (UNPUBLISH) {
    if (!existing) {
      console.log('Nothing to unpublish.');
      return;
    }
    const u = await prisma.post.update({ where: { slug: SLUG }, data: { status: 'draft' } });
    console.log(`Unpublished: ${u.slug} is now "${u.status}".`);
    return;
  }

  const post = await prisma.post.upsert({ where: { slug: SLUG }, update: POST, create: POST });

  // ---- read-back assertion: prove the stored row matches the payload ----
  const check = await prisma.post.findUnique({ where: { slug: SLUG } });
  const ok =
    !!check &&
    check.title === POST.title &&
    check.status === 'published' &&
    check.coverImageUrl === POST.coverImageUrl;
  console.log(`Read-back: id=${check?.id} slug=${check?.slug} status=${check?.status}`);
  if (!ok) {
    console.error('ABORT: read-back verification failed — stored row does not match payload.');
    process.exit(1);
  }
  console.log(`✅ Published: /news/${post.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
