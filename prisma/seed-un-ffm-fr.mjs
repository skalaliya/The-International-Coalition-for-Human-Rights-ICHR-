// French version of the UN Fact-Finding Mission press release. Linked to the
// English/Arabic posts via translationKey. Idempotent upsert by (slug, locale).
// Draft by default; pass PUBLISH=1 to publish.
//   PUBLISH=1 node --env-file=.env.local prisma/seed-un-ffm-fr.mjs
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';

const SLUG = 'un-fact-finding-mission-sudan-geneva-june-2026';
const PUBLISH = process.env.PUBLISH === '1';

const DB_URL = process.env.DATABASE_URL || '';
if (!DB_URL || /localhost|127\.0\.0\.1|placeholder/i.test(DB_URL) || !/neon\.tech/i.test(DB_URL)) {
  console.error('ABORT: DATABASE_URL is not the Neon production database.\n  Run: node --env-file=.env.local prisma/seed-un-ffm-fr.mjs');
  process.exit(1);
}

const prisma = new PrismaClient();

const BODY = `Une réunion stratégique de haut niveau s'est tenue entre la Coalition d'organisations internationales et la Mission internationale indépendante d'établissement des faits des Nations Unies sur le Soudan, dans un contexte de situation des droits humains profondément préoccupante. Les participants ont qualifié cette rencontre d'étape décisive sur la voie de la justice transitionnelle.

## Direction et participation de la Mission

La réunion a été présidée par M. Mohamed Chande Othman, président de la Mission d'établissement des faits, aux côtés des membres de la Mission Mme Joy Ezeilo et Mme Mona Rishmawi, en présence de l'ensemble de l'équipe de la Mission — un engagement qui témoigne du sérieux avec lequel le mécanisme onusien traite le dossier soudanais.

## Au cœur des discussions

Au centre des échanges, la Coalition a formulé une demande essentielle : une révision complète des méthodes d'audition adoptées jusqu'à présent, avertissant qu'une dépendance excessive aux témoignages des Soudanais de la diaspora risquait de creuser le fossé entre la justice et ses véritables ayants droit — celles et ceux qui subissent encore les événements sur le terrain et dont la voix n'a pas encore été entendue.

## Des recommandations à la mise en œuvre

L'ordre du jour a également porté sur le passage des recommandations à l'action : les participants ont examiné des mécanismes concrets pour documenter les violations selon des normes rigoureuses, protéger les témoins dans des environnements de terrain extrêmement complexes, et briser le cycle persistant de l'impunité.

## Un consensus de clôture

La réunion s'est conclue sur un consensus général en faveur d'une coopération conjointe, d'une coordination durable et de la levée des obstacles au travail des commissions d'établissement des faits — reconnaissant clairement qu'aucune paix véritable ne pourra reposer sur des fondations solides tant que toute la vérité n'aura pas été révélée et que justice n'aura pas été rendue à celles et ceux qui la méritent le plus.`;

const EXCERPT =
  "Une réunion stratégique de haut niveau s'est tenue entre la Coalition internationale pour les droits de l'homme et la Mission internationale indépendante d'établissement des faits des Nations Unies sur le Soudan, afin d'examiner les violations liées à la guerre et de faire progresser la justice transitionnelle, en mettant l'accent sur la participation des victimes et des témoins à l'intérieur du Soudan.";

const TITLE =
  "La Coalition internationale rencontre la Mission d'établissement des faits à Genève pour examiner les violations liées à la guerre et les moyens de soutenir la justice au Soudan";

async function main() {
  const enPost = await prisma.post.findFirst({
    where: { slug: SLUG, locale: 'en' },
    select: { id: true, translationKey: true },
  });
  const translationKey = enPost?.translationKey ?? enPost?.id ?? randomUUID();
  if (!enPost) console.warn('NOTE: English post not found — using a fresh translationKey.');

  const data = {
    slug: SLUG,
    locale: 'fr',
    translationKey,
    title: TITLE,
    category: 'Press Release',
    status: PUBLISH ? 'published' : 'draft',
    date: new Date('2026-06-24T00:00:00.000Z'),
    location: 'Genève',
    excerpt: EXCERPT,
    coverImageUrl: `/blog/${SLUG}/cover.jpg`, // reuses the English press card until a FR one is added
    body: BODY,
    hashtags: JSON.stringify(['#international_coalition_for_h_rights']),
    authorName: 'Communication ICHR',
  };

  const post = await prisma.post.upsert({
    where: { slug_locale: { slug: SLUG, locale: 'fr' } },
    update: data,
    create: data,
  });

  const check = await prisma.post.findFirst({ where: { slug: SLUG, locale: 'fr' } });
  const ok = !!check && check.title === TITLE && check.translationKey === translationKey;
  console.log(`Read-back: id=${check?.id} locale=${check?.locale} status=${check?.status} key=${check?.translationKey}`);
  if (!ok) {
    console.error('ABORT: read-back verification failed.');
    process.exit(1);
  }
  console.log(`✅ French post ${post.status}: /fr/news/${post.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
