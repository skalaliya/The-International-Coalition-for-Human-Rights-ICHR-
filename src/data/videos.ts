// The video registry for /media.
//
// WHY A FILE AND NOT THE DATABASE: per CLAUDE.md, `prisma migrate deploy` is a silent
// no-op in this repo, TCP 5432 to Neon is blocked locally, and every schema change is a
// hand-written idempotent HTTPS script. None of that risk buys anything for a handful of
// rows that change monthly. Revisit at ~20 videos, or the first time a non-developer
// needs to publish one without a deploy.
//
// TO ADD A VIDEO: `node scripts/add-video.mjs <youtube-url>` — it extracts the ID, reads
// the real duration and upload date off the watch page, downloads the poster, generates
// the responsive variants and prints an entry to paste below. Then translate the three
// strings per locale. src/lib/videos.test.ts fails the build if anything is missing.
//
// One slug serves all three locales (/media/x, /ar/media/x, /fr/media/x), matching how
// Post already works — so the hreflang alternates are a 1:1 map with no lookup.

import type { Locale } from '@/i18n';

/** Playlists double as the filter facet on /media. Labels live in the i18n dicts under
 *  `media.playlists`; videos.test.ts asserts every id has a label in all three. */
export const PLAYLISTS = ['geneva-panel-2026', 'advocacy-2025'] as const;
export type PlaylistId = (typeof PLAYLISTS)[number];

export interface VideoCopy {
  /** A clean site headline — NOT the YouTube title, which is truncated and
   *  speaker-first. The speaker belongs in `speaker`. */
  title: string;
  /** Byline: "Name · Affiliation", or a description of the segment. */
  speaker: string;
  /** Dateline place, IN THIS LANGUAGE — "Geneva" / "جنيف" / "Genève". It lives here
   *  rather than on Video because a shared string rendered Latin "GENEVA" into the
   *  Arabic dateline, where every existing article says جنيف. */
  location?: string;
  /** 1–3 sentences. Also the meta description and the JSON-LD `description`. */
  summary: string;
}

export interface Video {
  /** Shared across all three locales. Lowercase kebab-case. */
  slug: string;
  /** The 11-character YouTube ID. Extracted by the script, never retyped. */
  youtubeId: string;
  /** When it was published to YouTube (UTC). Schema.org `uploadDate`. */
  uploadDate: string;
  /** When the footage was recorded — what the reader actually cares about, and what
   *  the Dateline shows. Distinct from uploadDate: the Geneva panel was held on
   *  25 August and uploaded on the 29th. */
  eventDate: string;
  /** THE only duration field. Every format is derived in src/lib/duration.ts. */
  durationSeconds: number;
  playlist: PlaylistId;
  /** Site-absolute path under /media/<slug>/. Must have responsive variants. */
  poster: string;
  /** Slug of the related newsroom article, if any. Shared across locales. */
  relatedPostSlug?: string;
  i18n: Record<Locale, VideoCopy>;
}

// The Geneva panel — "Women's Condition and Violence in Wartime: Focus on the Sudan
// Crisis", Club Suisse de la Presse, 25 August 2026. Jointly organised by ICHR, EADM,
// TYFA and Post Versa. Arabic name and venue forms are taken verbatim from the existing
// Arabic articles (عبد الرحيم قرين, آندي فيرمو, رامون راهانغميتان, النادي السويسري
// للصحافة) so the site never spells the same person two ways.
const VIDEOS: Video[] = [
  {
    slug: 'panel-final-statements-geneva-2026',
    youtubeId: 'KzzbAruFHWk',
    uploadDate: '2026-08-30',
    eventDate: '2026-08-25',
    durationSeconds: 292,
    playlist: 'geneva-panel-2026',
    poster: '/media/panel-final-statements-geneva-2026/poster.jpg',
    relatedPostSlug: 'civil-society-panel-women-sudan-geneva-august-2026',
    i18n: {
      en: {
        title: 'Final Statements: Justice, War Crimes and Women in Sudan',
        speaker: 'Closing remarks · Club Suisse de la Presse, Geneva',
        location: 'Geneva',
        summary:
          'Closing remarks and debate from the international civil society panel on women’s condition and violence in wartime, with concluding statements by Manel Msalmi, Abderrahim Grein, Dr Mohamed Ali, Andy Vermaut and Elisabeth Saba. The speakers called for immediate international intervention, protection of journalists and civilians, ICC prosecution without immunity, and an urgent ceasefire.',
      },
      ar: {
        title: 'البيانات الختامية: العدالة وجرائم الحرب والنساء في السودان',
        speaker: 'الكلمات الختامية · النادي السويسري للصحافة، جنيف',
        location: 'جنيف',
        summary:
          'الملاحظات الختامية والنقاش في ندوة المجتمع المدني الدولية حول أوضاع النساء والعنف في زمن الحرب، مع كلمات ختامية لمنال مسلمي وعبد الرحيم قرين والدكتور محمد علي وآندي فيرمو وإليزابيث سابا. دعا المتحدثون إلى تدخل دولي فوري، وحماية الصحفيين والمدنيين، وملاحقة الجناة أمام المحكمة الجنائية الدولية دون حصانة، ووقف عاجل لإطلاق النار.',
      },
      fr: {
        title: 'Déclarations finales : justice, crimes de guerre et femmes au Soudan',
        speaker: 'Remarques de clôture · Club Suisse de la Presse, Genève',
        location: 'Genève',
        summary:
          'Remarques de clôture et débat du panel international de la société civile sur la condition des femmes et les violences en temps de guerre, avec les déclarations finales de Manel Msalmi, Abderrahim Grein, du Dr Mohamed Ali, d’Andy Vermaut et d’Elisabeth Saba. Les intervenants ont appelé à une intervention internationale immédiate, à la protection des journalistes et des civils, à des poursuites devant la CPI sans immunité et à un cessez-le-feu urgent.',
      },
    },
  },
  {
    slug: 'abderrahim-grein-icc-accountability-geneva-2026',
    youtubeId: 'dPDFlbBOr-I',
    uploadDate: '2026-08-29',
    eventDate: '2026-08-25',
    durationSeconds: 856,
    playlist: 'geneva-panel-2026',
    poster: '/media/abderrahim-grein-icc-accountability-geneva-2026/poster.jpg',
    relatedPostSlug: 'civil-society-panel-women-sudan-geneva-august-2026',
    i18n: {
      en: {
        title: 'Violations Against Women and ICC Accountability in Sudan',
        speaker: 'Abderrahim Grein · International Coalition for Human Rights',
        location: 'Geneva',
        summary:
          'Evidence of systematic human rights abuses in Sudan, with a call for an independent OPCW investigation, an ICC referral without immunity, the protection of civilians, and the direct inclusion of Sudanese women in every peace process.',
      },
      ar: {
        title: 'الانتهاكات ضد النساء والمساءلة أمام المحكمة الجنائية الدولية في السودان',
        speaker: 'عبد الرحيم قرين · التحالف الدولي لحقوق الإنسان',
        location: 'جنيف',
        summary:
          'عرض لأدلة على انتهاكات منهجية لحقوق الإنسان في السودان، مع الدعوة إلى تحقيق مستقل تجريه منظمة حظر الأسلحة الكيميائية، وإحالة إلى المحكمة الجنائية الدولية دون حصانة، وحماية المدنيين، وإشراك النساء السودانيات إشراكًا مباشرًا في كل مسارات السلام.',
      },
      fr: {
        title: 'Violations contre les femmes et responsabilité devant la CPI au Soudan',
        speaker: 'Abderrahim Grein · Coalition internationale pour les droits de l’homme',
        location: 'Genève',
        summary:
          'Présentation de preuves de violations systématiques des droits humains au Soudan, avec un appel à une enquête indépendante de l’OIAC, à une saisine de la CPI sans immunité, à la protection des civils et à l’inclusion directe des femmes soudanaises dans tous les processus de paix.',
      },
    },
  },
  {
    slug: 'hiba-elwassilla-women-families-geneva-2026',
    youtubeId: '3WrVShqYa9Q',
    uploadDate: '2026-08-29',
    eventDate: '2026-08-25',
    durationSeconds: 589,
    playlist: 'geneva-panel-2026',
    poster: '/media/hiba-elwassilla-women-families-geneva-2026/poster.jpg',
    relatedPostSlug: 'civil-society-panel-women-sudan-geneva-august-2026',
    i18n: {
      en: {
        title: 'The Impact of the Sudan Conflict on Women and Families',
        speaker: 'Hiba Elwassilla · International Coalition for Human Rights',
        location: 'Geneva',
        summary:
          'The disproportionate toll of the conflict on Sudanese women and children — gender-based violence, the loss of healthcare and education, and widespread displacement — with a call for immediate international action and accountability before the ICC.',
      },
      ar: {
        title: 'أثر النزاع في السودان على النساء والأسر',
        speaker: 'هبة الوصيلة · التحالف الدولي لحقوق الإنسان',
        location: 'جنيف',
        summary:
          'الأثر غير المتناسب للنزاع على النساء والأطفال في السودان — من العنف القائم على النوع الاجتماعي، وفقدان الرعاية الصحية والتعليم، والنزوح الواسع — مع الدعوة إلى تحرك دولي فوري ومساءلة أمام المحكمة الجنائية الدولية.',
      },
      fr: {
        title: 'L’impact du conflit soudanais sur les femmes et les familles',
        speaker: 'Hiba Elwassilla · Coalition internationale pour les droits de l’homme',
        location: 'Genève',
        summary:
          'Le poids disproportionné du conflit sur les femmes et les enfants soudanais — violences fondées sur le genre, perte de l’accès aux soins et à l’éducation, déplacements massifs — avec un appel à une action internationale immédiate et à une responsabilité devant la CPI.',
      },
    },
  },
  {
    slug: 'andy-vermaut-icc-referral-geneva-2026',
    youtubeId: 'wORgNBFvnIs',
    uploadDate: '2026-08-29',
    eventDate: '2026-08-25',
    durationSeconds: 817,
    playlist: 'geneva-panel-2026',
    poster: '/media/andy-vermaut-icc-referral-geneva-2026/poster.jpg',
    relatedPostSlug: 'civil-society-panel-women-sudan-geneva-august-2026',
    i18n: {
      en: {
        title: 'Justice, ICC Referral and the Sudan Conflict',
        speaker: 'Andy Vermaut · Post Versa and EADM',
        location: 'Geneva',
        summary:
          'Systematic violations against civilians and women in Sudan, and the case for accountability through an ICC referral, an independent OPCW investigation, and the protection of essential infrastructure.',
      },
      ar: {
        title: 'العدالة والإحالة إلى المحكمة الجنائية الدولية والنزاع في السودان',
        speaker: 'آندي فيرمو · بوست فيرسا والرابطة الأوروبية للدفاع عن الأقليات',
        location: 'جنيف',
        summary:
          'الانتهاكات المنهجية ضد المدنيين والنساء في السودان، والحجة لصالح المساءلة عبر الإحالة إلى المحكمة الجنائية الدولية، وتحقيق مستقل تجريه منظمة حظر الأسلحة الكيميائية، وحماية البنية التحتية الأساسية.',
      },
      fr: {
        title: 'Justice, saisine de la CPI et conflit soudanais',
        speaker: 'Andy Vermaut · Post Versa et EADM',
        location: 'Genève',
        summary:
          'Les violations systématiques contre les civils et les femmes au Soudan, et les arguments en faveur d’une responsabilité par la saisine de la CPI, une enquête indépendante de l’OIAC et la protection des infrastructures essentielles.',
      },
    },
  },
  {
    slug: 'ramon-rahangmetan-gender-based-violence-geneva-2026',
    youtubeId: 's6zmoXIVuhI',
    uploadDate: '2026-08-29',
    eventDate: '2026-08-25',
    durationSeconds: 668,
    playlist: 'geneva-panel-2026',
    poster: '/media/ramon-rahangmetan-gender-based-violence-geneva-2026/poster.jpg',
    relatedPostSlug: 'civil-society-panel-women-sudan-geneva-august-2026',
    i18n: {
      en: {
        title: 'Gender-Based Violence and Justice in Sudan',
        speaker: 'Ramon Rahangmetan · Circle of Sustainable Europe',
        location: 'Geneva',
        summary:
          'Severe human rights violations against women in Sudan, and a call for accountability through an ICC referral, an independent OPCW investigation, and the active inclusion of women in all peace processes.',
      },
      ar: {
        title: 'العنف القائم على النوع الاجتماعي والعدالة في السودان',
        speaker: 'رامون راهانغميتان · دائرة أوروبا المستدامة',
        location: 'جنيف',
        summary:
          'انتهاكات جسيمة لحقوق الإنسان بحق النساء في السودان، ودعوة إلى المساءلة عبر الإحالة إلى المحكمة الجنائية الدولية، وتحقيق مستقل تجريه منظمة حظر الأسلحة الكيميائية، والإشراك الفاعل للنساء في جميع مسارات السلام.',
      },
      fr: {
        title: 'Violences fondées sur le genre et justice au Soudan',
        speaker: 'Ramon Rahangmetan · Circle of Sustainable Europe',
        location: 'Genève',
        summary:
          'De graves violations des droits humains à l’encontre des femmes au Soudan, et un appel à la responsabilité par la saisine de la CPI, une enquête indépendante de l’OIAC et l’inclusion active des femmes dans tous les processus de paix.',
      },
    },
  },
  // ---- Advocacy, 2025 ----
  // Deliberately NOT included from the channel: "Participation of the Peace in the joint
  // meeting…" (MkOllAEEwOo). Its description carries #UAE_supports_Sudan,
  // #UAE_welcomes_US_President and praise for a foundation "in the heart of the Emirates".
  // That is state-aligned political messaging, and publishing it here would undercut the
  // impartial-accountability position every other page on this site argues for. Decision
  // taken with the owner, 30 August 2026 — revisit only as a deliberate editorial choice.
  {
    slug: 'icj-stand-sudanese-civil-society-hague-2025',
    youtubeId: '5l9T6mcwwTk',
    uploadDate: '2025-07-25',
    eventDate: '2025-05-04',
    durationSeconds: 118,
    playlist: 'advocacy-2025',
    poster: '/media/icj-stand-sudanese-civil-society-hague-2025/poster.jpg',
    i18n: {
      en: {
        title: 'Outside the ICJ: Sudanese Civil Society Demands Justice',
        speaker: 'Delegation led by Abderrahim Grein · Peace Palace, The Hague',
        location: 'The Hague',
        // "The delegation called for" — an attributed demand, not a statement of fact,
        // matching the hedging discipline the press statements already use.
        summary:
          'A Sudanese civil society delegation, led by Abderrahim Grein Sadam, delivered a statement at the gates of the International Court of Justice on 4 May 2025. The delegation called for the Islamic Movement to be designated a terrorist organisation, for those responsible for atrocities in Sudan to be held accountable, and for concrete humanitarian, legal and diplomatic action to protect civilians.',
      },
      ar: {
        title: 'أمام محكمة العدل الدولية: المجتمع المدني السوداني يطالب بالعدالة',
        speaker: 'وفد بقيادة عبد الرحيم قرين · قصر السلام، لاهاي',
        location: 'لاهاي',
        summary:
          'وفد من المجتمع المدني السوداني، بقيادة عبد الرحيم قرين صدام، يدلي ببيان أمام بوابات محكمة العدل الدولية في 4 مايو 2025. دعا الوفد إلى تصنيف الحركة الإسلامية منظمةً إرهابية، ومحاسبة المسؤولين عن الفظائع في السودان، واتخاذ إجراءات إنسانية وقانونية ودبلوماسية ملموسة لحماية المدنيين.',
      },
      fr: {
        title: 'Devant la CIJ : la société civile soudanaise réclame justice',
        speaker: 'Délégation menée par Abderrahim Grein · Palais de la Paix, La Haye',
        location: 'La Haye',
        summary:
          'Une délégation de la société civile soudanaise, menée par Abderrahim Grein Sadam, a lu une déclaration devant les grilles de la Cour internationale de justice le 4 mai 2025. La délégation a demandé que le Mouvement islamique soit désigné organisation terroriste, que les responsables des atrocités au Soudan répondent de leurs actes, et que des mesures humanitaires, juridiques et diplomatiques concrètes protègent les civils.',
      },
    },
  },
  {
    slug: 'abderrahim-grein-human-rights-2025',
    youtubeId: '51E407P1cNA',
    uploadDate: '2025-07-19',
    // No filming date is stated anywhere; the upload date is the only fact we have.
    eventDate: '2025-07-19',
    durationSeconds: 100,
    playlist: 'advocacy-2025',
    poster: '/media/abderrahim-grein-human-rights-2025/poster.jpg',
    i18n: {
      en: {
        title: 'The Work of ICHR: Justice, Education and Dignity',
        speaker: 'Abderrahim Grein Sadam · Founder, International Coalition for Human Rights',
        summary:
          'A short profile of the human rights work of Abderrahim Grein Sadam, founder of the International Coalition for Human Rights — from advocacy for justice in Sudan to the defence of vulnerable communities, and a call for peace, education and dignity.',
      },
      ar: {
        title: 'عمل التحالف الدولي لحقوق الإنسان: العدالة والتعليم والكرامة',
        speaker: 'عبد الرحيم قرين صدام · مؤسس التحالف الدولي لحقوق الإنسان',
        summary:
          'لمحة قصيرة عن العمل الحقوقي لعبد الرحيم قرين صدام، مؤسس التحالف الدولي لحقوق الإنسان — من المناصرة من أجل العدالة في السودان إلى الدفاع عن المجتمعات الضعيفة، ودعوة إلى السلام والتعليم والكرامة.',
      },
      fr: {
        title: 'Le travail de l’ICHR : justice, éducation et dignité',
        speaker: 'Abderrahim Grein Sadam · fondateur de la Coalition internationale pour les droits de l’homme',
        summary:
          'Un court portrait du travail d’Abderrahim Grein Sadam, fondateur de la Coalition internationale pour les droits de l’homme — de la défense de la justice au Soudan à la protection des communautés vulnérables, et un appel à la paix, à l’éducation et à la dignité.',
      },
    },
  },
];

/** Newest first, by the date the reader cares about (when it was recorded). */
function byDateDesc(a: Video, b: Video): number {
  return b.eventDate.localeCompare(a.eventDate) || b.uploadDate.localeCompare(a.uploadDate);
}

/** Every video, newest first, optionally narrowed to one playlist.
 *  `lang` is required so no call site can forget which language it is rendering. */
export function getVideos(lang: Locale, playlist?: PlaylistId | 'All'): Video[] {
  void lang; // copy is selected per-video by the caller; the parameter keeps that explicit
  const all = [...VIDEOS].sort(byDateDesc);
  return !playlist || playlist === 'All' ? all : all.filter((v) => v.playlist === playlist);
}

/** One video by its (locale-independent) slug, or undefined. */
export function getVideo(slug: string | undefined): Video | undefined {
  if (!slug) return undefined;
  return VIDEOS.find((v) => v.slug === slug);
}

/** The copy for a locale. Typed as total, so this can never return undefined. */
export function copyFor(video: Video, lang: Locale): VideoCopy {
  return video.i18n[lang];
}

/** Raw list, for the tests and the sitemap. */
export const ALL_VIDEOS: readonly Video[] = VIDEOS;
