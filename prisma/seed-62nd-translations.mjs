// Arabic + French versions of the 62nd-Session statement on Sudan's Doctors
// Network / Emergency Response Rooms. Both locales are linked to the English
// original via a hardcoded translationKey. Gallery-aware and idempotent:
// upsert by (slug, locale), then replace the gallery rows so re-runs never
// duplicate. Published.
//   node --env-file=.env.local prisma/seed-62nd-translations.mjs
import { PrismaClient } from '@prisma/client';

const SLUG = '62nd-session-palais-des-nations-june-2026';
// Links both translations to the English original's translation group.
const TRANSLATION_KEY = 'cmqdjl4pq00002t4y7jwvtyup';

const DB_URL = process.env.DATABASE_URL || '';
if (!DB_URL || /localhost|127\.0\.0\.1|placeholder/i.test(DB_URL) || !/neon\.tech/i.test(DB_URL)) {
  console.error('ABORT: DATABASE_URL is not the Neon production database.\n  Run: node --env-file=.env.local prisma/seed-62nd-translations.mjs');
  process.exit(1);
}

const prisma = new PrismaClient();

// Four gallery images, in order, no captions (the English has none).
const GALLERY_URLS = [
  `/blog/${SLUG}/P1.jpg`,
  `/blog/${SLUG}/P2.jpg`,
  `/blog/${SLUG}/P3.jpg`,
  `/blog/${SLUG}/P4.jpg`,
];

// ---------------------------------------------------------------------------
// Arabic (Modern Standard Arabic — formal human-rights / legal register).
// Markdown structure preserved: leading *italic* line, `## ` headings,
// `-` bullet list, `1.`/`2.`… numbered list, final **bold** line.
// ---------------------------------------------------------------------------
const AR_TITLE =
  'التحالف الدولي لحقوق الإنسان يُدين استغلال شبكة أطباء السودان وغرف الطوارئ كأدوات للاستخبارات العسكرية';

const AR_EXCERPT =
  'في الدورة الثانية والستين لمجلس حقوق الإنسان التابع للأمم المتحدة بقصر الأمم في جنيف، أدان التحالف الدولي لحقوق الإنسان استغلال شبكة أطباء السودان وغرف الطوارئ كأدوات للاستخبارات العسكرية، وحثّ المجلس على صون الحياد الطبي وحماية العاملين في القطاع الصحي في السودان.';

const AR_BODY = `*الدورة الثانية والستون — قصر الأمم — حزيران/يونيو 2026. تلقّى الأمين العام البيان التالي.*

يُدين التحالف الدولي لحقوق الإنسان بشدّة استغلال شبكة أطباء السودان وغرف الطوارئ من قِبَل قائد الجيش السوداني عبد الفتاح البرهان كأدوات استخباراتية لدعم مراكز العمليات العسكرية.

## كيف قوّض النزاع في السودان الحياد الطبي والإنساني؟

لا يزال النزاع المسلّح المستمر في السودان، الذي اندلع في 15 نيسان/أبريل 2023، يُخلّف عواقب إنسانية وحقوقية جسيمة. وإلى جانب الأثر المباشر للأعمال العدائية على المدنيين، برزت مخاوف متزايدة بشأن حماية الحياد الطبي، واستقلالية مقدّمي الرعاية الصحية، ونزاهة العمل الإنساني.

يُشكّل الحياد الطبي مبدأً أساسياً من مبادئ القانون الدولي الإنساني. فيجب أن يكون بمقدور الكوادر الطبية والمرافق الصحية والجهات الفاعلة الإنسانية أداء مهامها بنزاهة، بمنأى عن أيّ تدخّل عسكري أو سياسي أو أمني. واحترام هذا المبدأ أمرٌ جوهري لضمان الوصول إلى الرعاية الصحية وحماية السكان المدنيين المتضرّرين من النزاع المسلّح.

أثارت التطوّرات الأخيرة مخاوف بشأن تزايد تسييس البُنى الطبية والإنسانية في السودان. فقد أثارت تصريحات علنية منسوبة إلى كبار المسؤولين العسكريين بشأن انخراط مهنيي القطاع الطبي في مهامّ داعمة مرتبطة بالعمليات العسكرية قلقاً إزاء الاستقلالية المُفترَضة للمؤسسات الصحية والعاملين فيها. وتنطوي مثل هذه التطوّرات على خطر تقويض ثقة الجمهور بحياد الخدمات الطبية، وقد تُعرّض العاملين في القطاع الصحي لمخاطر أمنية إضافية.

## مخاوف بشأن استقلالية الشبكات الطبية والإنسانية

سلّطت التقارير الصادرة عن منظمات المجتمع المدني والمراقبين الحقوقيين خلال عام 2026 الضوء على ادّعاءات تتعلّق بتسييس بعض المبادرات الطبية والإنسانية العاملة في المناطق المتأثّرة بالنزاع. وتشمل هذه المخاوف ما يلي:

- الاستخدام المحتمل لآليات الإبلاغ الطبي بطرق قد تُخلّ بمبدأَي الحياد والموضوعية؛
- ادّعاءات بشأن التوثيق الانتقائي للانتهاكات التي تطال مجتمعات أو مناطق جغرافية بعينها؛
- خطر أن يُنظَر إلى المنصّات الإنسانية على أنها تُسهم في روايات سياسية أو عسكرية بدلاً من أن تخدم أغراضاً إنسانية بحتة.

وإذا تُركت هذه المخاوف دون معالجة، فقد تُضعف ثقة الجمهور بالمؤسسات الإنسانية وتُقوّض مصداقية جهود التوثيق الرامية إلى دعم المساءلة وحماية الضحايا.

## الاعتداءات على المرافق الصحية والكوادر الطبية

وفي الوقت نفسه، لا تزال التقارير عن الاعتداءات على المرافق الصحية والكوادر الطبية وسيارات الإسعاف والبُنى التحتية الإنسانية تثير قلقاً بالغاً. فالقانون الدولي الإنساني، بما في ذلك اتفاقيات جنيف وبروتوكولاتها الإضافية، يمنح حماية خاصة للوحدات والكوادر الطبية أثناء النزاع المسلّح.

وأيّ اعتداء متعمّد على المرافق أو الكوادر الطبية المشمولة بالحماية، أو أيّ إساءة استخدام للمؤسسات الصحية لأغراض عسكرية، قد يُشكّل انتهاكاً جسيماً للقانون الدولي الإنساني، وقد يستتبع مسؤولية جنائية فردية بموجب القانون الدولي.

كما أدّى تدمير الخدمات الصحية أو تعطيلها أو تسييسها إلى زيادة تقييد الوصول إلى العلاج المُنقِذ للحياة بالنسبة لملايين المدنيين، بمن فيهم النازحون داخلياً والنساء والأطفال وكبار السن والأشخاص ذوو الإعاقة.

## التوصيات

يدعو التحالف الدولي لحقوق الإنسان، بكلّ احترام، مجلس حقوق الإنسان وآليات الأمم المتحدة المعنية إلى ما يلي:

1. حثّ جميع أطراف النزاع على احترام مبدأ الحياد الطبي وصونه وفقاً للقانون الدولي الإنساني؛
2. المطالبة بالوقف الفوري لجميع أشكال التدخّل العسكري أو السياسي أو الأمني في عمل المؤسسات الصحية والكوادر الطبية والجهات الفاعلة الإنسانية؛
3. دعم إجراء تحقيقات مستقلة ونزيهة وشفّافة في الادّعاءات المتعلّقة بتسييس الإبلاغ الطبي والإنساني؛
4. تعزيز آليات الرصد والمساءلة المتعلّقة بالاعتداءات على المرافق الصحية والكوادر الطبية؛
5. ضمان توثيق جميع ضحايا الانتهاكات وحمايتهم دون تمييز وبصرف النظر عن الانتماء الجغرافي أو العِرقي أو السياسي أو الاجتماعي؛
6. تعزيز التدابير الرامية إلى استعادة ثقة الجمهور باستقلالية قطاعَي الصحة والعمل الإنساني في السودان وحيادهما ونزاهتهما.

إنّ حماية الحياد الطبي أمرٌ لا غنى عنه لصون الكرامة الإنسانية، وإيصال المساعدات الإنسانية، والسعي إلى تحقيق العدالة والمساءلة في السودان. ويتعيّن على المجتمع الدولي اتخاذ جميع التدابير المناسبة لضمان بقاء الخدمات الصحية بمنأى عن آثار المواجهة السياسية والعسكرية.

**التحالف الدولي لحقوق الإنسان**`;

// ---------------------------------------------------------------------------
// French (formal register).
// ---------------------------------------------------------------------------
const FR_TITLE =
  'La Coalition internationale pour les droits de l’homme condamne l’instrumentalisation du Réseau des médecins du Soudan et des salles d’intervention d’urgence comme outils du renseignement militaire';

const FR_EXCERPT =
  'Lors de la 62e session du Conseil des droits de l’homme des Nations Unies, au Palais des Nations à Genève, la Coalition internationale pour les droits de l’homme a condamné l’instrumentalisation du Réseau des médecins du Soudan et des salles d’intervention d’urgence comme outils du renseignement militaire, et a exhorté le Conseil à faire respecter la neutralité médicale et à protéger le personnel de santé au Soudan.';

const FR_BODY = `*62e session — Palais des Nations — juin 2026. Le Secrétaire général a reçu la déclaration suivante.*

La Coalition internationale pour les droits de l’homme condamne fermement l’instrumentalisation du Réseau des médecins du Soudan et des salles d’intervention d’urgence par le commandant de l’armée soudanaise Abdel Fattah al-Burhan, en tant qu’outils de renseignement au service des centres d’opérations militaires.

## Comment le conflit au Soudan a-t-il érodé la neutralité médicale et humanitaire ?

Le conflit armé en cours au Soudan, déclenché le 15 avril 2023, continue d’engendrer de graves conséquences humanitaires et en matière de droits de l’homme. Au-delà de l’impact direct des hostilités sur les civils, des préoccupations croissantes ont émergé concernant la protection de la neutralité médicale, l’indépendance des prestataires de soins de santé et l’intégrité de l’action humanitaire.

La neutralité médicale constitue un principe fondamental du droit international humanitaire. Le personnel médical, les établissements de santé et les acteurs humanitaires doivent pouvoir exercer leurs fonctions en toute impartialité, à l’abri de toute ingérence militaire, politique ou sécuritaire. Le respect de ce principe est essentiel pour garantir l’accès aux soins de santé et protéger les populations civiles touchées par le conflit armé.

Les évolutions récentes ont suscité des préoccupations quant à la politisation croissante des structures médicales et humanitaires au Soudan. Des déclarations publiques attribuées à de hauts responsables militaires concernant la participation de professionnels de santé à des fonctions de soutien liées aux opérations militaires ont fait naître des inquiétudes quant à l’indépendance perçue des institutions de santé et de leur personnel. De telles évolutions risquent de saper la confiance du public dans la neutralité des services médicaux et peuvent exposer le personnel de santé à des risques sécuritaires supplémentaires.

## Préoccupations relatives à l’indépendance des réseaux médicaux et humanitaires

Les rapports publiés par des organisations de la société civile et des observateurs des droits de l’homme au cours de l’année 2026 ont mis en lumière des allégations concernant la politisation de certaines initiatives médicales et humanitaires opérant dans les zones touchées par le conflit. Ces préoccupations portent notamment sur :

- l’utilisation possible des mécanismes de signalement médical d’une manière susceptible de compromettre les principes d’impartialité et d’objectivité ;
- des allégations de documentation sélective des violations affectant certaines communautés ou zones géographiques ;
- le risque que les plateformes humanitaires soient perçues comme contribuant à des récits politiques ou militaires plutôt que de servir des fins exclusivement humanitaires.

Si elles ne sont pas prises en compte, de telles préoccupations risquent d’affaiblir la confiance du public dans les institutions humanitaires et de compromettre la crédibilité des efforts de documentation destinés à soutenir la responsabilisation et la protection des victimes.

## Attaques contre les établissements de santé et le personnel médical

Dans le même temps, les signalements d’attaques contre des établissements de santé, du personnel médical, des ambulances et des infrastructures humanitaires continuent de susciter de vives préoccupations. Le droit international humanitaire, y compris les Conventions de Genève et leurs Protocoles additionnels, accorde une protection spéciale aux unités et au personnel médicaux pendant un conflit armé.

Toute attaque délibérée contre des établissements ou du personnel médicaux protégés, ou tout détournement d’institutions de santé à des fins militaires, peut constituer une violation grave du droit international humanitaire et est susceptible d’engager la responsabilité pénale individuelle au regard du droit international.

La destruction, la perturbation ou la politisation des services de santé ont encore restreint l’accès à des soins vitaux pour des millions de civils, notamment les personnes déplacées à l’intérieur de leur propre pays, les femmes, les enfants, les personnes âgées et les personnes handicapées.

## Recommandations

La Coalition internationale pour les droits de l’homme invite respectueusement le Conseil des droits de l’homme et les mécanismes compétents des Nations Unies à :

1. exhorter toutes les parties au conflit à respecter et à faire respecter le principe de neutralité médicale, conformément au droit international humanitaire ;
2. exiger la cessation immédiate de toute forme d’ingérence militaire, politique ou sécuritaire dans le travail des institutions de santé, du personnel médical et des acteurs humanitaires ;
3. soutenir des enquêtes indépendantes, impartiales et transparentes sur les allégations relatives à la politisation des signalements médicaux et humanitaires ;
4. renforcer les mécanismes de suivi et de responsabilisation relatifs aux attaques contre les établissements de santé et le personnel médical ;
5. veiller à ce que toutes les victimes de violations soient documentées et protégées sans discrimination et indépendamment de toute appartenance géographique, ethnique, politique ou sociale ;
6. promouvoir des mesures visant à restaurer la confiance du public dans l’indépendance, l’impartialité et l’intégrité des secteurs de la santé et de l’action humanitaire au Soudan.

La protection de la neutralité médicale est indispensable à la préservation de la dignité humaine, à l’acheminement de l’aide humanitaire et à la quête de justice et de responsabilisation au Soudan. La communauté internationale doit prendre toutes les mesures appropriées pour que les services de santé demeurent à l’abri des effets de la confrontation politique et militaire.

**Coalition internationale pour les droits de l’homme**`;

const LOCALES = [
  {
    locale: 'ar',
    title: AR_TITLE,
    excerpt: AR_EXCERPT,
    body: AR_BODY,
    location: 'جنيف',
    authorName: 'إعلام ICHR',
  },
  {
    locale: 'fr',
    title: FR_TITLE,
    excerpt: FR_EXCERPT,
    body: FR_BODY,
    location: 'Genève',
    authorName: 'Communication ICHR',
  },
];

async function publishLocale({ locale, title, excerpt, body, location, authorName }) {
  const data = {
    slug: SLUG,
    locale,
    translationKey: TRANSLATION_KEY,
    title,
    category: 'Statement',
    status: 'published',
    date: new Date('2026-06-14T00:00:00.000Z'),
    location,
    excerpt,
    coverImageUrl: `/blog/${SLUG}/P1.jpg`,
    body,
    hashtags: JSON.stringify(['#international_coalition_for_h_rights', '#Sudan']),
    authorName,
  };

  // Upsert the post and rebuild its gallery atomically so re-runs never leave
  // duplicate gallery rows.
  const post = await prisma.$transaction(async (tx) => {
    const post = await tx.post.upsert({
      where: { slug_locale: { slug: SLUG, locale } },
      update: data,
      create: data,
    });
    await tx.galleryImage.deleteMany({ where: { postId: post.id } });
    await tx.galleryImage.createMany({
      data: GALLERY_URLS.map((url, i) => ({ postId: post.id, url, caption: null, order: i })),
    });
    return post;
  });

  // Re-fetch and verify.
  const check = await prisma.post.findFirst({ where: { slug: SLUG, locale } });
  const galleryCount = await prisma.galleryImage.count({ where: { postId: post.id } });
  const ok =
    !!check &&
    check.title === title &&
    check.translationKey === TRANSLATION_KEY &&
    galleryCount === GALLERY_URLS.length;
  console.log(
    `Read-back: id=${check?.id} locale=${check?.locale} status=${check?.status} key=${check?.translationKey} gallery=${galleryCount}`,
  );
  if (!ok) {
    console.error(`ABORT: read-back verification failed for locale "${locale}".`);
    process.exit(1);
  }
  console.log(`✅ ${locale} published: /${locale}/news/${post.slug}`);
}

async function main() {
  for (const entry of LOCALES) {
    await publishLocale(entry);
  }
}

// Exported so the HTTPS runner (prisma/seed-translations-http.mjs) can reuse the
// translated content over port 443 on networks that block Postgres :5432.
export { SLUG, TRANSLATION_KEY, GALLERY_URLS, LOCALES };

// Only run the Prisma (:5432) path when executed directly, not when imported.
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
