// Builds the localized `labels` prop for the WorldMap island from the shared
// dictionary (titles/descriptions/categories/regions) plus a small map-only UI
// string set kept here (so the main dictionaries stay focused on page copy).
import { locations } from '@/lib/locations';
import { useTranslations, type Locale } from '@/i18n';
import type { WorldMapLabels } from '@/components/react/WorldMap';

const MAP_UI: Record<Locale, WorldMapLabels['ui']> = {
  en: {
    index: 'Office and mission index',
    viewOnMap: 'View {title} on map',
    showing: 'Showing {title}, {category}',
    legendAria: 'Map legend: gold pin Headquarters, navy pin Regional Office, navy ring Field Mission',
    railAria: 'Tap a location to view it on the map',
    twoFingers: 'Use two fingers to move the map',
    close: 'Close details',
  },
  ar: {
    index: 'فهرس المكاتب والبعثات',
    viewOnMap: 'عرض {title} على الخريطة',
    showing: 'عرض {title}، {category}',
    legendAria: 'مفتاح الخريطة: دبوس ذهبي للمقر الرئيسي، ودبوس كحلي للمكتب الإقليمي، وحلقة كحلية للبعثة الميدانية',
    railAria: 'اضغط على موقع لعرضه على الخريطة',
    twoFingers: 'استخدم إصبعين لتحريك الخريطة',
    close: 'إغلاق التفاصيل',
  },
  fr: {
    index: 'Index des bureaux et missions',
    viewOnMap: 'Voir {title} sur la carte',
    showing: 'Affichage de {title}, {category}',
    legendAria:
      'Légende de la carte : épingle dorée pour le siège, épingle bleu marine pour le bureau régional, anneau bleu marine pour la mission de terrain',
    railAria: 'Appuyez sur un lieu pour le voir sur la carte',
    twoFingers: 'Utilisez deux doigts pour déplacer la carte',
    close: 'Fermer les détails',
  },
};

export function worldMapLabels(lang: Locale): WorldMapLabels {
  const t = useTranslations(lang);
  const ld = t.locationsData;
  const offices = ld.offices as Record<string, { title: string; description: string }>;
  return {
    kind: {
      hq: ld.regions['Headquarters'],
      regional: ld.categories['Regional Office'],
      field: ld.categories['Field Mission'],
    },
    category: ld.categories,
    region: ld.regions,
    title: Object.fromEntries(locations.map((l) => [String(l.id), offices[String(l.id)]?.title ?? l.title])),
    description: Object.fromEntries(
      locations.map((l) => [String(l.id), offices[String(l.id)]?.description ?? l.description]),
    ),
    ui: MAP_UI[lang] ?? MAP_UI.en,
  };
}
