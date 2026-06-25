// Arabic + French versions of the "ICHR meets EU Delegation to the UN in Geneva"
// press release. Linked to the English original via a hardcoded translationKey so
// all three locales share one translation group. Idempotent upsert by
// (slug, locale); gallery rows are deleted and recreated each run so re-running
// never duplicates them. Both locales are published.
//   node --env-file=.env.local prisma/seed-eu-translations.mjs
import { PrismaClient } from '@prisma/client';

const SLUG = 'eu-delegation-geneva-sudan-june-2026';
// The English post's translationKey — hardcoded so AR + FR link to it.
const TRANSLATION_KEY = 'cmqcvaqwy00028csoy1wlm83s';
const DATE = new Date('2026-06-02T00:00:00.000Z');
const COVER_IMAGE_URL = `/blog/${SLUG}/E1.jpg`;
const HASHTAGS = JSON.stringify(['#international_coalition_for_h_rights']);
const GALLERY_URLS = [
  `/blog/${SLUG}/E1.jpg`,
  `/blog/${SLUG}/E2.jpg`,
  `/blog/${SLUG}/E3.jpg`,
];

const DB_URL = process.env.DATABASE_URL || '';
if (!DB_URL || /localhost|127\.0\.0\.1|placeholder/i.test(DB_URL) || !/neon\.tech/i.test(DB_URL)) {
  console.error('ABORT: DATABASE_URL is not the Neon production database.\n  Run: node --env-file=.env.local prisma/seed-eu-translations.mjs');
  process.exit(1);
}

const prisma = new PrismaClient();

// ── Arabic (Modern Standard Arabic — formal human-rights / diplomatic register) ──
const AR = {
  locale: 'ar',
  location: 'جنيف',
  authorName: 'إعلام ICHR',
  title:
    'التحالف الدولي لحقوق الإنسان يجتمع مع بعثة الاتحاد الأوروبي لدى الأمم المتحدة في جنيف بشأن الانتهاكات الناجمة عن الحرب في السودان',
  excerpt:
    'عقد ممثلو التحالف الدولي لحقوق الإنسان اجتماعاً مهماً وموسّعاً مع السيدة كاتارينا تابيو من بعثة الاتحاد الأوروبي لدى الأمم المتحدة في جنيف، لمناقشة الأوضاع الإنسانية والحقوقية المتدهورة بسرعة في السودان نتيجة النزاع المستمر.',
  body: `في مستهلّ الاجتماع، استعرض رئيس التحالف الوضع الحقوقي الراهن في السودان، مؤكداً موقف التحالف الثابت الداعي إلى وقفٍ فوريٍّ وشاملٍ للأعمال العدائية، وتحقيق العدالة الناجزة، والالتزام المستمر بآليات المساءلة الدولية — بما في ذلك تسليم جميع الأشخاص المطلوبين لدى المحكمة الجنائية الدولية (ICC). وشدّد على أنّ هذه التدابير ضرورية لإنهاء الإفلات من العقاب وضمان سلامٍ مستدام.

ثمّ قدّم أعضاء وفد التحالف تقريراً مفصّلاً وموثّقاً يبيّن العواقب الكارثية للحرب وأثرها المباشر على المدنيين. وحذّر التقرير من ظاهرة العسكرة المتنامية والتطرّف الممنهج المنسوب إلى القيادة العسكرية الحالية. كما سلّط الضوء على المخاطر الناجمة عن صمت المجتمع الدولي إزاء أعمال الترهيب والعنف المنسوبة إلى الحركة الإسلامية ضد المدنيين السودانيين، محذّراً من أنّ هذه الممارسات تهدّد النسيج الاجتماعي وتنذر بانزلاق البلاد إلى مزيدٍ من عدم الاستقرار والفوضى.

وتناول الاجتماع كذلك مسألة شبكة أطباء السودان والمزاعم المتعلقة بإقرار القائد العام للقوات المسلحة السودانية باستخدام الكوادر الطبية غطاءً لأنشطة الاستخبارات العسكرية. وأعرب الوفد عن بالغ قلقه وإدانته لاستغلال الكوادر الطبية وإقحامها في العمليات العسكرية على نحوٍ يتنافى مع المبادئ الإنسانية الدولية والأعراف القانونية.

كما ناقش المشاركون تدهور الأوضاع في المناطق الخاضعة لسيطرة قوات الدعم السريع (RSF). وأبرز وفد التحالف غياب مؤسسات النيابة العامة، وانهيار المنظومة التعليمية، وحرمان المواطنين من حقوقهم الدستورية الأساسية. وفي هذا الصدد، كشفت السيدة كاتارينا تابيو أنّ الاتحاد الأوروبي خصّص موارد مالية لدعم التعليم ومبادرات التعلّم البديل في السودان عبر منظمة الأمم المتحدة للطفولة (UNICEF) وعددٍ من المنظمات الدولية.

وفي ما يتعلق بآليات الرصد والمساءلة، شدّد التحالف على أهمية قيام بعثة تقصّي الحقائق التابعة للأمم المتحدة بزيارات ميدانية مباشرة ولقاء الضحايا والشهود على الأرض، ضماناً لأعلى مستويات المصداقية والدقة في تقاريرها. وأعربت الدبلوماسية الأوروبية عن اتفاقها الكامل مع هذه التوصية.

وفي ختام الاجتماع، أشادت بعثة الاتحاد الأوروبي لدى الأمم المتحدة في جنيف بالدور المحوري الذي تضطلع به المملكة المتحدة في دفع جهود السلام في السودان. وجدّدت تأكيد موقف الاتحاد الأوروبي الثابت الداعي إلى وقفٍ فوريٍّ للحرب، وأعلنت أنّ الاتحاد الأوروبي سيقدّم في الخامس عشر من حزيران/يونيو تقريراً شاملاً عن الوضع الحقوقي في السودان أمام الأمم المتحدة.`,
  captions: [
    'بعثة الاتحاد الأوروبي في جنيف تشيد بجهود المملكة المتحدة لإعادة السلام إلى السودان، وتؤكد للتحالف الدولي استمرار دعمها للتعليم عبر منظمة اليونيسف.',
    'محادثات جنيف بين التحالف الدولي والاتحاد الأوروبي تبحث التصدّي للانتهاكات في السودان؛ وتصنيف الحركة الإسلامية منظمةً إرهابيةً جهدٌ محوريٌّ لإعادة السلام.',
    'التحالف الدولي لحقوق الإنسان يطلع ممثل الاتحاد الأوروبي لدى مجلس حقوق الإنسان في الأمم المتحدة على استغلال الجيش السوداني للكوادر الطبية، ويدين استخدام الأسلحة الكيميائية، ويدعو إلى زيارة ميدانية لبعثة تقصّي الحقائق التابعة للأمم المتحدة.',
  ],
};

// ── French (formal register) ──
const FR = {
  locale: 'fr',
  location: 'Genève',
  authorName: 'Communication ICHR',
  title:
    "La Coalition internationale pour les droits de l'homme rencontre la délégation de l'Union européenne auprès des Nations Unies à Genève au sujet des violations engendrées par la guerre au Soudan",
  excerpt:
    "Les représentants de la Coalition internationale pour les droits de l'homme ont tenu une réunion importante et approfondie avec Mme Katarina Tapio, de la délégation de l'Union européenne auprès des Nations Unies à Genève, afin d'examiner la situation humanitaire et des droits de l'homme qui se détériore rapidement au Soudan en raison du conflit en cours.",
  body: `À l'ouverture de la réunion, le président de la Coalition a passé en revue la situation actuelle des droits de l'homme au Soudan, soulignant la position ferme de la Coalition qui appelle à une cessation immédiate et complète des hostilités, à l'administration d'une justice diligente et au maintien de l'engagement envers les mécanismes internationaux de responsabilité — y compris la remise de toutes les personnes recherchées par la Cour pénale internationale (ICC). Il a insisté sur le fait que de telles mesures sont essentielles pour mettre fin à l'impunité et garantir une paix durable.

Les membres de la délégation de la Coalition ont ensuite présenté un rapport détaillé et solidement documenté exposant les conséquences catastrophiques de la guerre et son impact direct sur les civils. Le rapport a mis en garde contre le phénomène croissant de la militarisation et de l'extrémisme systématique qui serait poursuivi par l'actuel commandement militaire. Il a également souligné les dangers que représente le silence de la communauté internationale face aux actes d'intimidation et de violence qui seraient commis par le Mouvement islamique contre les civils soudanais, avertissant que de telles pratiques menacent la cohésion sociale et risquent de plonger le pays dans une instabilité et un chaos plus profonds.

La réunion a également abordé la question du Réseau des médecins soudanais et les allégations relatives à la reconnaissance, par le commandant en chef des forces armées soudanaises, du recours à du personnel médical comme couverture pour des activités de renseignement militaire. La délégation a exprimé sa profonde préoccupation et sa condamnation face à l'exploitation des professionnels de la santé et à leur implication dans des opérations militaires d'une manière contraire aux principes humanitaires internationaux et aux normes juridiques.

Les participants ont en outre examiné la dégradation des conditions dans les zones sous le contrôle des Forces de soutien rapide (RSF). La délégation de la Coalition a mis en évidence l'absence d'institutions chargées des poursuites, l'effondrement du système éducatif et la privation des droits constitutionnels fondamentaux des citoyens. À cet égard, Mme Katarina Tapio a révélé que l'Union européenne avait alloué des ressources financières pour soutenir l'éducation et les initiatives d'apprentissage alternatif au Soudan par l'intermédiaire de l'UNICEF et de plusieurs organisations internationales.

S'agissant des mécanismes de suivi et de responsabilité, la Coalition a souligné l'importance que la Mission d'établissement des faits des Nations Unies effectue des visites de terrain directes et rencontre les victimes et les témoins sur place, afin de garantir le plus haut niveau de crédibilité et d'exactitude dans ses rapports. La diplomate de l'Union européenne s'est déclarée pleinement d'accord avec cette recommandation.

À l'issue de la réunion, la délégation de l'Union européenne auprès des Nations Unies à Genève a salué le rôle déterminant joué par le Royaume-Uni dans l'avancement des efforts de paix au Soudan. Elle a réaffirmé la position ferme de l'Union européenne appelant à une cessation immédiate de la guerre et a annoncé que, le 15 juin, l'Union européenne présenterait un rapport complet sur la situation des droits de l'homme au Soudan devant les Nations Unies.`,
  captions: [
    "La Mission de l'Union européenne à Genève salue les efforts du Royaume-Uni pour rétablir la paix au Soudan et réaffirme à la Coalition internationale son soutien continu à l'éducation par l'intermédiaire de l'UNICEF.",
    "Les pourparlers de Genève entre la Coalition internationale et l'Union européenne envisagent de remédier aux violations au Soudan ; la désignation du Mouvement islamique comme organisation terroriste constitue un effort essentiel pour rétablir la paix.",
    "La Coalition internationale pour les droits de l'homme informe le représentant de l'Union européenne auprès du Conseil des droits de l'homme des Nations Unies de l'exploitation des professionnels de la santé par l'armée soudanaise, condamne l'emploi d'armes chimiques et appelle à une visite de terrain de la Mission d'établissement des faits des Nations Unies.",
  ],
};

const LOCALES = [AR, FR];

async function main() {
  for (const t of LOCALES) {
    const data = {
      slug: SLUG,
      locale: t.locale,
      translationKey: TRANSLATION_KEY,
      title: t.title,
      category: 'Press Release',
      status: 'published',
      date: DATE,
      location: t.location,
      excerpt: t.excerpt,
      coverImageUrl: COVER_IMAGE_URL,
      body: t.body,
      hashtags: HASHTAGS,
      authorName: t.authorName,
    };

    const post = await prisma.$transaction(async (tx) => {
      const p = await tx.post.upsert({
        where: { slug_locale: { slug: SLUG, locale: t.locale } },
        update: data,
        create: data,
      });
      // Delete + recreate gallery so re-running never duplicates rows.
      await tx.galleryImage.deleteMany({ where: { postId: p.id } });
      await tx.galleryImage.createMany({
        data: GALLERY_URLS.map((url, i) => ({
          postId: p.id,
          url,
          caption: t.captions[i] ?? null,
          order: i,
        })),
      });
      return p;
    });

    // Re-fetch and verify title, translationKey, and gallery count.
    const check = await prisma.post.findFirst({
      where: { slug: SLUG, locale: t.locale },
      include: { gallery: true },
    });
    const galleryCount = check?.gallery.length ?? 0;
    const ok =
      !!check &&
      check.title === t.title &&
      check.translationKey === TRANSLATION_KEY &&
      galleryCount === 3;
    console.log(
      `Read-back: id=${check?.id} locale=${check?.locale} status=${check?.status} key=${check?.translationKey} gallery=${galleryCount}`,
    );
    if (!ok) {
      console.error(`ABORT: read-back verification failed for locale "${t.locale}".`);
      process.exit(1);
    }
    console.log(`✅ ${t.locale} published: /${t.locale}/news/${post.slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
