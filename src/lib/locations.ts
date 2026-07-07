export type LocationKind = 'hq' | 'regional' | 'field';

export type LocationCategory =
  | 'International Headquarters'
  | 'Administrative Headquarters'
  | 'Regional Office'
  | 'Field Mission';

export type Continent = 'Europe' | 'Africa' | 'Asia' | 'South America';

export interface Location {
  id: number;
  title: string;
  coords: [number, number];
  description: string;
  link: string;
  category: LocationCategory;
  /** Drives pin styling, legend, and stats. 'hq' covers both HQ categories. */
  kind: LocationKind;
  /** Honest, explicit (never parsed from title) — powers derived stats. */
  country: string;
  continent: Continent;
  /** Grouping header for the interactive index/rail. */
  region: string;
  address?: string;
  email?: string;
  phone?: string;
}

// NOTE: `id` is the stable sync key across the map ↔ list and is intentionally
// NON-sequential — never use the array index in its place. Addresses / emails /
// phones are seed placeholders; UI suppresses `link` until it is a real URL.
export const locations: Location[] = [
  {
    id: 1,
    title: 'Geneva (International HQ)',
    coords: [46.2044, 6.1432],
    description:
      'Our central hub for international legal advocacy, policy coordination, and UN liaison efforts.',
    link: '#',
    category: 'International Headquarters',
    kind: 'hq',
    country: 'Switzerland',
    continent: 'Europe',
    region: 'Headquarters',
    address: '123 Humanitarian Avenue, Geneva, Switzerland 1202',
    email: 'info@ichr-international.org',
    phone: '+33 7 68 85 10 66',
  },
  {
    id: 7,
    title: 'Paris (Administrative HQ)',
    coords: [48.8566, 2.3522],
    description:
      'Coordination center for European operations, fundraising, and strategic partnerships.',
    link: '#',
    category: 'Administrative Headquarters',
    kind: 'hq',
    country: 'France',
    continent: 'Europe',
    region: 'Headquarters',
    address: '25 Rue de la Paix, 75002 Paris, France',
    email: 'info@ichr-international.org',
    phone: '+33 7 68 85 10 66',
  },
  {
    id: 3,
    title: 'Kyiv, Ukraine',
    coords: [50.4501, 30.5234],
    description:
      'Distributing medical supplies to frontline hospitals and providing winter shelter support.',
    link: '#',
    category: 'Regional Office',
    kind: 'regional',
    country: 'Ukraine',
    continent: 'Europe',
    region: 'Eastern Europe',
    address: 'Khreshchatyk St, 15, Kyiv, 02000',
    email: 'ukraine.response@ichr.org',
    phone: '+380 44 123 4567',
  },
  {
    id: 5,
    title: 'Bogotá, Colombia',
    coords: [4.711, -74.0721],
    description:
      'Legal support for indigenous land rights and protection programs for community leaders.',
    link: '#',
    category: 'Regional Office',
    kind: 'regional',
    country: 'Colombia',
    continent: 'South America',
    region: 'Latin America',
    address: 'Cra. 7 #32-16, Bogotá, Colombia',
    email: 'colombia.legal@ichr.org',
    phone: '+57 1 234 5678',
  },
  {
    id: 2,
    title: 'Juba, South Sudan',
    coords: [4.8594, 31.5713],
    description:
      'Operating three emergency education centers and providing food security for 15,000+ displaced persons.',
    link: '#',
    category: 'Field Mission',
    kind: 'field',
    country: 'South Sudan',
    continent: 'Africa',
    region: 'East Africa',
    address: 'Plot 44, Block 3K, Tongping, Juba',
    email: 'juba.mission@ichr.org',
    phone: '+211 91 234 5678',
  },
  {
    id: 4,
    title: "Sana'a, Yemen",
    coords: [15.3694, 44.191],
    description:
      'Clean water initiatives and mobile health clinics addressing the cholera crisis in remote regions.',
    link: '#',
    category: 'Field Mission',
    kind: 'field',
    country: 'Yemen',
    continent: 'Asia',
    region: 'Middle East',
    address: "Hadda Street, Sana'a, Yemen",
    email: 'yemen.aid@ichr.org',
    phone: '+967 1 234 567',
  },
  {
    id: 6,
    title: "Cox's Bazar, Bangladesh",
    coords: [21.4272, 92.0058],
    description: 'Psychosocial support and sanitation infrastructure for refugee camps.',
    link: '#',
    category: 'Field Mission',
    kind: 'field',
    country: 'Bangladesh',
    continent: 'Asia',
    region: 'South Asia',
    address: "Marine Drive Road, Cox's Bazar",
    email: 'bangladesh.mission@ichr.org',
    phone: '+880 341 23456',
  },
];

export interface LocationStats {
  offices: number;
  countries: number;
  continents: number;
  hq: number;
  regional: number;
  field: number;
}

/** All numbers derived from `locations` so the stats band can never drift. */
export function deriveStats(locs: Location[]): LocationStats {
  return {
    offices: locs.length,
    countries: new Set(locs.map((l) => l.country)).size,
    continents: new Set(locs.map((l) => l.continent)).size,
    hq: locs.filter((l) => l.kind === 'hq').length,
    regional: locs.filter((l) => l.kind === 'regional').length,
    field: locs.filter((l) => l.kind === 'field').length,
  };
}

export const STATS: LocationStats = deriveStats(locations);

/** Region order for the interactive index — Headquarters always first. */
export const REGION_ORDER: string[] = (() => {
  const seen: string[] = [];
  for (const l of locations) if (!seen.includes(l.region)) seen.push(l.region);
  return seen.sort((a, b) => (a === 'Headquarters' ? -1 : b === 'Headquarters' ? 1 : 0));
})();
