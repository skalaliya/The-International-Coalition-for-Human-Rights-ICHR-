// Arabic version of the UN Fact-Finding Mission press release. Linked to the
// English post via translationKey (looked up at run time). Idempotent upsert by
// (slug, locale). Draft by default; pass PUBLISH=1 to publish.
//   node --env-file=.env.local prisma/seed-un-ffm-ar.mjs            # create/update as draft
//   PUBLISH=1 node --env-file=.env.local prisma/seed-un-ffm-ar.mjs  # publish
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';

const SLUG = 'un-fact-finding-mission-sudan-geneva-june-2026';
const PUBLISH = process.env.PUBLISH === '1';

const DB_URL = process.env.DATABASE_URL || '';
if (!DB_URL || /localhost|127\.0\.0\.1|placeholder/i.test(DB_URL) || !/neon\.tech/i.test(DB_URL)) {
  console.error('ABORT: DATABASE_URL is not the Neon production database.\n  Run: node --env-file=.env.local prisma/seed-un-ffm-ar.mjs');
  process.exit(1);
}

const prisma = new PrismaClient();

const BODY = `في خضمّ مشهدٍ حقوقيٍّ بالغ الحساسية، انعقد اجتماع استراتيجي جمَع التحالف الدولي لحقوق الإنسان بالبعثة الأممية المستقلة لتقصّي الحقائق بشأن السودان، في لقاءٍ وصفه المشاركون بأنه «محطة فارقة» في مسيرة العدالة الانتقالية.

## قيادة الجلسة والمشاركة

أدار الجلسة رئيس البعثة الخبير القانوني محمد شاندي عثمان، إلى جانب عضوَي اللجنة السيدة جوي إيزيلو والسيدة منى رشماوي، في حضورٍ كاملٍ لطاقم البعثة يُجسّد الجدية التي تتعامل بها الآلية الأممية مع الملف السوداني.

## في صميم النقاشات

وفي قلب النقاشات، رفع التحالف مطلباً جوهرياً: مراجعة شاملة لآليات الاستماع المعتمدة حتى الآن، محذّراً من أن الاتكاء المفرط على شهادات السودانيين في المهجر قد يُعمّق الهوة بين العدالة ومستحقّيها الحقيقيين — أولئك الذين لا يزالون يعيشون وطأة الأحداث على الأرض، وأصواتهم لم تُسمَع بعد.

## من التوصيات إلى التنفيذ

كما تصدّرت أجندة الاجتماع مسألة الانتقال من التوصيات إلى التنفيذ، إذ ناقش المجتمعون آلياتٍ عمليةً لتوثيق الانتهاكات بمعايير صارمة، وحماية الشهود في بيئاتٍ ميدانيةٍ بالغة التعقيد، وكسر دورة الإفلات من العقاب التي طال أمدها.

## توافق ختامي

وأسدل الاجتماع ستاره على توافقٍ جامعٍ حول التعاون المشترك واستدامة التنسيق وإزالة العقبات أمام عمل لجان تقصّي الحقائق، في إقرارٍ صريحٍ بأن أيَّ سلامٍ حقيقي لن يُبنى على أساسٍ متين ما لم تُكشَف الحقيقة كاملةً، وما لم يُنصَف من هم الأجدر بالإنصاف.`;

const EXCERPT =
  'في خضمّ مشهدٍ حقوقيٍّ بالغ الحساسية، انعقد اجتماع استراتيجي جمَع التحالف الدولي لحقوق الإنسان بالبعثة الأممية المستقلة لتقصّي الحقائق بشأن السودان لمناقشة انتهاكات الحرب وسبل دعم العدالة الانتقالية، مع التركيز على إشراك الضحايا والشهود داخل السودان.';

const TITLE =
  'التحالف الدولي يجتمع مع لجنة تقصّي الحقائق بجنيف ويناقش انتهاكات الحرب وسبل دعم العدالة في السودان';

async function main() {
  // Link to the English version's translation group (set by the backfill).
  const enPost = await prisma.post.findFirst({
    where: { slug: SLUG, locale: 'en' },
    select: { id: true, translationKey: true },
  });
  const translationKey = enPost?.translationKey ?? enPost?.id ?? randomUUID();
  if (!enPost) console.warn('NOTE: English post not found — using a fresh translationKey.');

  const data = {
    slug: SLUG,
    locale: 'ar',
    translationKey,
    title: TITLE,
    category: 'Press Release',
    status: PUBLISH ? 'published' : 'draft',
    date: new Date('2026-06-24T00:00:00.000Z'),
    location: 'جنيف',
    excerpt: EXCERPT,
    coverImageUrl: `/blog/${SLUG}/cover-1.jpeg`,
    body: BODY,
    hashtags: JSON.stringify(['#international_coalition_for_h_rights', '#التحالف_الدولي_لحقوق_الإنسان']),
    authorName: 'إعلام ICHR',
  };

  const post = await prisma.post.upsert({
    where: { slug_locale: { slug: SLUG, locale: 'ar' } },
    update: data,
    create: data,
  });

  const check = await prisma.post.findFirst({ where: { slug: SLUG, locale: 'ar' } });
  const ok = !!check && check.title === TITLE && check.coverImageUrl === data.coverImageUrl && check.translationKey === translationKey;
  console.log(`Read-back: id=${check?.id} locale=${check?.locale} status=${check?.status} key=${check?.translationKey}`);
  if (!ok) {
    console.error('ABORT: read-back verification failed.');
    process.exit(1);
  }
  console.log(`✅ Arabic post ${post.status}: /ar/news/${post.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
