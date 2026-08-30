// Canonical English copy for the whole site. This object's SHAPE is the contract:
// `ar.ts` and `fr.ts` must match it exactly (enforced by `Dict` in ../index.ts).
// Edit user-facing English here — never hardcode strings back into components.

export const en = {
  // Per-page <title> + meta description.
  meta: {
    home: {
      title: 'The International Coalition for Human Rights (ICHR)',
      desc: 'A global non-governmental organisation dedicated to the protection of human dignity and the advancement of justice worldwide. Headquartered in Geneva.',
    },
    about: {
      title: 'About ICHR — International Coalition for Human Rights',
      desc: 'The International Coalition for Human Rights is a global NGO dedicated to the protection of human dignity and the advancement of justice worldwide.',
    },
    contact: {
      title: 'Contact ICHR',
      desc: 'For media inquiries, partnerships, or emergency assistance, reach the International Coalition for Human Rights.',
    },
    donate: {
      title: 'Support Our Work — Donate to ICHR',
      desc: 'Your contribution enables us to continue protecting human rights and providing humanitarian assistance.',
    },
    volunteer: {
      title: 'Volunteer With ICHR',
      desc: 'Join our global team of professionals working to protect human rights and provide humanitarian assistance.',
    },
    locations: {
      title: 'Global Presence — ICHR Locations',
      desc: 'Coordinating humanitarian efforts and legal advocacy through our network of offices and field missions worldwide.',
    },
    news: {
      title: 'Press Releases & Statements — ICHR Newsroom',
      desc: 'Official press releases, statements and field updates from the International Coalition for Human Rights.',
    },
    media: {
      title: 'Videos — ICHR Media',
      desc: 'Speeches, panels and field footage from the International Coalition for Human Rights.',
    },
    notFound: { title: 'Page not found — ICHR' },
  },

  notFound: {
    code: '404',
    title: 'Page not found',
    body: 'This page may have been moved, unpublished, or never existed.',
    goHome: 'Go home',
    visitNews: 'Visit the Newsroom',
  },

  nav: {
    home: 'Home',
    about: 'About',
    locations: 'Locations',
    news: 'News',
    media: 'Media',
    contact: 'Contact',
    support: 'Support Us',
  },

  langNames: { en: 'English', ar: 'العربية', fr: 'Français' },

  a11y: {
    toggleMenu: 'Toggle menu',
    switchLanguage: 'Change language',
    skipToContent: 'Skip to main content',
    filterNews: 'Filter news by category',
    filterVideos: 'Filter videos by series',
    playVideo: 'Play video: {title}', // {title}
    pagination: 'Pagination',
    tags: 'Tags',  },

  footer: {
    blurb:
      'The International Coalition for Human Rights (ICHR) is a global non-governmental organisation dedicated to the protection of human dignity and the advancement of justice worldwide.',
    headOffices: 'Head Offices',
    contact: 'Contact',
    orgName: 'The International Coalition for Human Rights (ICHR)',
    rights: 'All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
  },

  hero: {
    eyebrow: 'International Non-Governmental Organisation',
    title: 'The International Coalition for Human Rights',
    subtitle:
      'Coordinating civil society efforts, documenting violations, and providing humanitarian response to protect human dignity worldwide.',
    ctaMandate: 'Our Mandate',
    ctaPresence: 'Global Presence',
  },

  home: {
    mandateTitle: 'Our Mandate',
    mandateBody:
      'The International Coalition for Human Rights (ICHR) is a global non-governmental organisation dedicated to the protection of human dignity and the advancement of justice worldwide. We bridge the gap between international policy and on-the-ground practice through coordinated civil society action.',
    readMore: 'Read more about ICHR',
    whatWeDoTitle: 'What We Do',
    whatWeDoIntro:
      'Our operations encompass three core pillars designed to protect human rights and provide relief.',
    pillars: [
      {
        title: 'Human Rights Advocacy',
        body: 'Engaging with international bodies, governments, and the public to drive policy change and uphold international law.',
      },
      {
        title: 'Documentation & Reporting',
        body: 'Systematically monitoring, verifying, and reporting on human rights violations to ensure factual accountability.',
      },
      {
        title: 'Humanitarian Coordination',
        body: 'Facilitating rapid aid deployment and support mechanisms for communities in crisis zones and conflict areas.',
      },
    ],
    presenceTitle: 'Global Presence',
    presenceBody:
      'Headquartered in Geneva with administrative offices in Paris, we operate field missions across multiple continents.',
    viewAll: 'View all locations',
    supportTitle: 'Support Our Work',
    supportBody:
      'Your contribution enables us to continue protecting human rights and providing humanitarian assistance to those in need.',
    donate: 'Make a Donation',
    volunteer: 'Volunteer With Us',
  },

  about: {
    title: 'About ICHR',
    subtitle:
      'The International Coalition for Human Rights is a global non-governmental organisation dedicated to the protection of human dignity and the advancement of justice worldwide.',
    mandateTitle: 'Our Mandate',
    mandateP1:
      'Founded to bridge the gap between international policy and on-the-ground practice, ICHR operates as an international coalition of civil society actors, legal experts, and humanitarian workers. We provide a unified platform to address systemic human rights violations and coordinate effective response mechanisms across borders.',
    mandateP2:
      'Our strength lies in our unique coalition-based structure, which allows us to leverage diverse expertise and local knowledge while maintaining a cohesive international strategy. From documenting violations to providing essential aid, ICHR stands as a pillar of support for those whose voices are silenced.',
    missionTitle: 'Mission',
    missionBody:
      'To coordinate civil society efforts, document violations, and provide immediate humanitarian response. We strive to embed universal human values into the fabric of global governance, ensuring accountability, justice, and protection for vulnerable populations.',
    visionTitle: 'Vision',
    visionBody:
      'A world where universal human rights are respected, protected, and fulfilled for every individual, regardless of race, religion, or nationality. A robust global civil society capable of holding power to account and delivering justice.',
    objectivesTitle: 'Strategic Objectives',
    objectives: [
      'Humanitarian coordination and rapid response deployment',
      'Systematic monitoring and documenting of human rights violations',
      'Capacity building of local civil society organisations',
      'Advocacy for policy reform and international accountability',
      'Amplifying voices of marginalised communities',
    ],
    presenceTitle: 'Global Presence',
    offices: [
      {
        city: 'Geneva, Switzerland',
        role: 'International Headquarters',
        text: 'Positioned to engage directly with UN mechanisms, international agencies, and diplomatic missions.',
      },
      {
        city: 'Paris, France',
        role: 'Administrative Office',
        text: 'Coordinating European operations, strategic partnerships, and administrative oversight.',
      },
    ],
    principlesTitle: 'Guiding Principles',
    principles: ['Neutrality', 'Independence', 'Accountability', 'Transparency', 'Respect for International Law'],
  },

  contact: {
    title: 'Contact Us',
    subtitle:
      'For media inquiries, partnerships, or emergency assistance, please reach out through the channels below.',
    headOffices: 'Head Offices',
    offices: [
      { city: 'Geneva, Switzerland', role: 'International Headquarters' },
      { city: 'Paris, France', role: 'Administrative Office' },
    ],
    channelsTitle: 'Contact Channels',
    general: 'General / Emergency',
    email: 'Email',
    whatsapp: 'WhatsApp',
    followTitle: 'Follow Us',
    formTitle: 'Send a Message',
    formIntro: 'Your inquiry will be directed to the appropriate department.',
    fullName: 'Full Name',
    org: 'Organisation (Optional)',
    emailAddress: 'Email Address',
    subject: 'Subject',
    subjects: ['General Inquiry', 'Press / Media', 'Partnership', 'Report a Violation', 'Donation Support'],
    message: 'Message',
    privacy: 'Your data is protected. ICHR follows strict privacy protocols.',
    send: 'Send Message',
  },

  donate: {
    title: 'Support Our Work',
    subtitle:
      'Your contribution enables us to continue protecting human rights and providing humanitarian assistance.',
    once: 'One-time',
    monthly: 'Monthly',
    otherAmount: 'Other amount',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    donate: 'Donate', // rendered as "Donate $50" / "Donate $50/month"
    perMonth: '/month',
    secure: 'Secure, encrypted donation',
    impactTitle: 'Your Impact',
    impact: [
      '92% of funds go directly to field operations',
      'Tax-deductible contributions',
      'Quarterly impact reports',
      'Immediate deployment capability',
    ],
    quote:
      '"Contributions from supporters like you enable our teams to respond rapidly to humanitarian crises and advocate for those who cannot speak for themselves."',
    quoteAttr: '— ICHR Field Operations',
  },

  volunteer: {
    title: 'Volunteer With Us',
    subtitle:
      'Join our global team of professionals working to protect human rights and provide humanitarian assistance.',
    formTitle: 'Application Form',
    formIntro: 'We review applications on a rolling basis and will contact qualified candidates.',
    firstName: 'First Name',
    lastName: 'Last Name',
    emailAddress: 'Email Address',
    phone: 'Phone Number',
    areaLabel: 'Area of Interest',
    areas: [
      'Select an area...',
      'Field Operations',
      'Legal Advocacy',
      'Documentation & Research',
      'Communications',
      'Fundraising',
      'Remote / Digital Support',
    ],
    expLabel: 'Relevant Experience',
    expPlaceholder: 'Briefly describe your relevant skills and experience...',
    disclaimer:
      'By submitting this application, you agree to our volunteer code of conduct and acknowledge that placement is subject to availability and vetting requirements.',
    submit: 'Submit Application',
  },

  locations: {
    title: 'Global Presence',
    subtitle:
      'Coordinating humanitarian efforts and legal advocacy through our network of offices and field missions worldwide.',
    headOffices: 'Head Offices',
    regionalTitle: 'Regional Presence',
    regionalIntro: 'Explore our field missions and regional offices across multiple continents.',
    stats: {
      offices: 'Offices',
      countries: 'Countries',
      continents: 'Continents',
      hq: 'Headquarters',
      regional: 'Regional',
      field: 'Field Missions',
    },
    skipMap: 'Skip the map — go to the office directory',
    noscript: 'The interactive map needs JavaScript. All offices and missions are listed below.',
    fieldTitle: 'Field Offices & Missions',
    partnerTitle: 'Partner With Us',
    partnerBody:
      'Are you a local NGO or civil society organisation? We build capacity and provide support for partners aligned with our mission.',
    partnerCta: 'Become a Partner',
  },

  news: {
    eyebrow: 'Newsroom',
    title: 'Press Releases & Statements',
    intro:
      'Official communications, field updates, and statements from the International Coalition for Human Rights.',
    filterAll: 'All',
    emptyTitle: 'No posts yet',
    emptyAll: 'There are no published posts at this time. Please check back soon.',
    emptyCategory: 'No posts in “{category}” yet.', // {category} = localized category label
    prev: 'Previous',
    next: 'Next',
    pageOf: 'Page {page} of {total}', // {page}, {total}
  },

  media: {
    eyebrow: 'Media',
    title: 'Videos',
    intro: 'Speeches, panel interventions and field footage from ICHR and its partners.',
    filterAll: 'All',
    // Keyed by PlaylistId in src/data/videos.ts — videos.test.ts fails if one is missing.
    playlists: { 'geneva-panel-2026': 'Geneva Panel 2026', 'advocacy-2025': 'Advocacy 2025' },
    watchOnYouTube: 'Watch on YouTube',
    relatedStatement: 'Read the related statement',
    back: 'Back to Media',
    emptyTitle: 'No videos yet',
    emptyBody: 'There are no published videos at this time. Please check back soon.',
    channelTitle: 'Latest from our channel',
    channelCta: 'See all videos',
    duration: 'Duration',
  },

  // Display labels for the DB-stored canonical English categories.
  categories: {
    'Press Release': 'Press Release',
    Statement: 'Statement',
    'Field Update': 'Field Update',
    News: 'News',
  },

  article: {
    // Downloadable document (scripts/gen-attachments.mjs → src/lib/attachments.ts)
    documentTitle: 'Full document',
    documentDownload: 'Download PDF',
    documentMegabytes: 'MB',
    documentInLanguage: { en: 'in English', ar: 'in Arabic', fr: 'in French' },
    back: 'Back to Newsroom',
    gallery: 'Gallery',
    enlarge: 'Enlarge image',
    closeImage: 'Close image',
    tags: 'Tags',
    shareStory: 'Share this story',
    shareHelp: 'Help raise awareness — share it with your network.',
    availableIn: 'Read in', // language-toggle label
    supportTitle: 'Support Our Work',
    supportBody:
      'Your contribution enables us to continue protecting human rights and providing humanitarian assistance to those in need.',
    donate: 'Make a Donation',
    volunteer: 'Volunteer With Us',
  },

  common: {
    readMore: 'Read more',
    share: 'Share',
    copyLink: 'Copy link',
  },

  // Localized labels for the office data in src/lib/locations.ts (keyed by id),
  // plus the category + region labels used by the map and directory.
  locationsData: {
    categories: {
      'International Headquarters': 'International Headquarters',
      'Administrative Headquarters': 'Administrative Headquarters',
      'Regional Office': 'Regional Office',
      'Field Mission': 'Field Mission',
    },
    regions: {
      Headquarters: 'Headquarters',
      'Eastern Europe': 'Eastern Europe',
      'Latin America': 'Latin America',
      'East Africa': 'East Africa',
      'Middle East': 'Middle East',
      'South Asia': 'South Asia',
    },
    offices: {
      '1': {
        title: 'Geneva (International HQ)',
        description: 'Our central hub for international legal advocacy, policy coordination, and UN liaison efforts.',
      },
      '7': {
        title: 'Paris (Administrative HQ)',
        description: 'Coordination center for European operations, fundraising, and strategic partnerships.',
      },
      '3': {
        title: 'Kyiv, Ukraine',
        description: 'Distributing medical supplies to frontline hospitals and providing winter shelter support.',
      },
      '5': {
        title: 'Bogotá, Colombia',
        description: 'Legal support for indigenous land rights and protection programs for community leaders.',
      },
      '2': {
        title: 'Juba, South Sudan',
        description:
          'Operating three emergency education centers and providing food security for 15,000+ displaced persons.',
      },
      '4': {
        title: "Sana'a, Yemen",
        description:
          'Clean water initiatives and mobile health clinics addressing the cholera crisis in remote regions.',
      },
      '6': {
        title: "Cox's Bazar, Bangladesh",
        description: 'Psychosocial support and sanitation infrastructure for refugee camps.',
      },
    },
  },
};

export type Dict = typeof en;
