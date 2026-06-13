export interface Location {
  id: number;
  title: string;
  coords: [number, number];
  description: string;
  link: string;
  category: string;
  address?: string;
  email?: string;
  phone?: string;
}

export const locations: Location[] = [
  {
    id: 1,
    title: 'Geneva (International HQ)',
    coords: [46.2044, 6.1432],
    description:
      'Our central hub for international legal advocacy, policy coordination, and UN liaison efforts.',
    link: '#',
    category: 'International Headquarters',
    address: '123 Humanitarian Avenue, Geneva, Switzerland 1202',
    email: 'ichr.geneva@gmail.com',
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
    address: '25 Rue de la Paix, 75002 Paris, France',
    email: 'ichr.geneva@gmail.com',
    phone: '+33 7 68 85 10 66',
  },
  {
    id: 2,
    title: 'Juba, South Sudan',
    coords: [4.8594, 31.5713],
    description:
      'Operating three emergency education centers and providing food security for 15,000+ displaced persons.',
    link: '#',
    category: 'Field Mission',
    address: 'Plot 44, Block 3K, Tongping, Juba',
    email: 'juba.mission@ichr.org',
    phone: '+211 91 234 5678',
  },
  {
    id: 3,
    title: 'Kyiv, Ukraine',
    coords: [50.4501, 30.5234],
    description:
      'Distributing medical supplies to frontline hospitals and providing winter shelter support.',
    link: '#',
    category: 'Regional Office',
    address: 'Khreshchatyk St, 15, Kyiv, 02000',
    email: 'ukraine.response@ichr.org',
    phone: '+380 44 123 4567',
  },
  {
    id: 4,
    title: "Sana'a, Yemen",
    coords: [15.3694, 44.191],
    description:
      'Clean water initiatives and mobile health clinics addressing the cholera crisis in remote regions.',
    link: '#',
    category: 'Field Mission',
    address: "Hadda Street, Sana'a, Yemen",
    email: 'yemen.aid@ichr.org',
    phone: '+967 1 234 567',
  },
  {
    id: 5,
    title: 'Bogotá, Colombia',
    coords: [4.711, -74.0721],
    description:
      'Legal support for indigenous land rights and protection programs for community leaders.',
    link: '#',
    category: 'Regional Office',
    address: 'Cra. 7 #32-16, Bogotá, Colombia',
    email: 'colombia.legal@ichr.org',
    phone: '+57 1 234 5678',
  },
  {
    id: 6,
    title: "Cox's Bazar, Bangladesh",
    coords: [21.4272, 92.0058],
    description: 'Psychosocial support and sanitation infrastructure for refugee camps.',
    link: '#',
    category: 'Field Mission',
    address: "Marine Drive Road, Cox's Bazar",
    email: 'bangladesh.mission@ichr.org',
    phone: '+880 341 23456',
  },
];
