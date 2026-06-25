// Idempotent seed: admin user + the launch press release.
// Run with: npm run db:seed  (needs DATABASE_URL + ADMIN_PASSWORD in the env)
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SLUG = 'eu-delegation-geneva-sudan-june-2026';

const BODY = `At the outset of the meeting, the President of the Coalition reviewed the current human-rights situation in Sudan, emphasizing the Coalition's firm position calling for an immediate and comprehensive cessation of hostilities, the delivery of prompt justice, and continued commitment to international accountability mechanisms — including the surrender of all individuals wanted by the International Criminal Court (ICC). He stressed that such measures are essential to ending impunity and ensuring sustainable peace.

Members of the Coalition delegation subsequently presented a detailed and well-documented report outlining the catastrophic consequences of the war and its direct impact on civilians. The report warned against the growing phenomenon of militarization and systematic extremism allegedly pursued by the current military leadership. It also highlighted the dangers posed by the international community's silence regarding acts of intimidation and violence allegedly carried out by the Islamic Movement against Sudanese civilians, warning that such practices threaten social cohesion and risk plunging the country into deeper instability and chaos.

The meeting also addressed the issue of the Sudanese Doctors Network and allegations concerning the Commander-in-Chief of the Sudanese Armed Forces' acknowledgment of using medical personnel as a cover for military intelligence activities. The delegation expressed deep concern and condemnation over the exploitation of medical professionals and their involvement in military operations in a manner that contravenes international humanitarian principles and legal norms.

Participants further discussed the deteriorating conditions in areas under the control of the Rapid Support Forces (RSF). The Coalition's delegation highlighted the absence of prosecutorial institutions, the collapse of the education system, and the deprivation of citizens' fundamental constitutional rights. In this regard, Mrs. Katarina Tapio revealed that the European Union has allocated financial resources to support education and alternative learning initiatives in Sudan through UNICEF and a number of international organizations.

Regarding monitoring and accountability mechanisms, the Coalition stressed the importance of the United Nations Fact-Finding Mission conducting direct field visits and meeting victims and witnesses on the ground to ensure the highest levels of credibility and accuracy in its reports. The EU diplomat expressed full agreement with this recommendation.

At the conclusion of the meeting, the EU Delegation to the UN in Geneva commended the pivotal role played by the United Kingdom in advancing peace efforts in Sudan. She reaffirmed the European Union's firm position calling for an immediate end to the war and announced that, on 15 June, the European Union will present a comprehensive report on the human-rights situation in Sudan before the United Nations.`;

const EXCERPT =
  'Representatives of the International Coalition for Human Rights held an important and extensive meeting with Mrs. Katarina Tapio of the EU Delegation to the UN in Geneva to discuss the rapidly deteriorating humanitarian and human rights situation in Sudan as a result of the ongoing conflict.';

const GALLERY = [
  {
    url: `/blog/${SLUG}/E1.jpg`,
    caption:
      "The European Union Mission in Geneva commends the United Kingdom's efforts to restore peace in Sudan and reaffirms to the International Coalition its continued support for education through UNICEF.",
    order: 0,
  },
  {
    url: `/blog/${SLUG}/E2.jpg`,
    caption:
      'Geneva talks between the International Coalition and the European Union consider addressing violations in Sudan; designating the Islamic Movement as a terrorist organization is a key effort to restore peace.',
    order: 1,
  },
  {
    url: `/blog/${SLUG}/E3.jpg`,
    caption:
      'The International Coalition for Human Rights briefs the European Union Representative to the Human Rights Council at the United Nations on the exploitation of medical professionals by the Sudanese Army, condemns the use of chemical weapons, and calls for a field visit by the UN Fact-Finding Mission.',
    order: 2,
  },
];

const POST = {
  slug: SLUG,
  title:
    'International Coalition for Human Rights Meets EU Delegation to the UN in Geneva on Violations Arising from the War in Sudan',
  category: 'Press Release',
  status: 'published',
  date: new Date('2026-06-02T00:00:00.000Z'),
  location: 'Geneva',
  excerpt: EXCERPT,
  coverImageUrl: `/blog/${SLUG}/E1.jpg`,
  body: BODY,
  hashtags: JSON.stringify(['#international_coalition_for_h_rights']),
  authorName: 'ICHR Communications',
};

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error('ADMIN_PASSWORD is required to seed the admin user');
  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { username },
    update: { password: hashed },
    create: { username, password: hashed },
  });
  console.log(`Admin user ready: ${username}`);

  await prisma.$transaction(async (tx) => {
    const post = await tx.post.upsert({ where: { slug: SLUG }, update: POST, create: POST });
    await tx.galleryImage.deleteMany({ where: { postId: post.id } });
    await tx.galleryImage.createMany({ data: GALLERY.map((g) => ({ ...g, postId: post.id })) });
  });
  console.log(`Seed post ready: /news/${SLUG}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
