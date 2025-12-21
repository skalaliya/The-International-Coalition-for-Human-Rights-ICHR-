import React, { useEffect, useRef } from "react";
import L from "leaflet";

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
    title: "Geneva (International HQ)",
    coords: [46.2044, 6.1432],
    description:
      "Our central hub for international legal advocacy, policy coordination, and UN liaison efforts.",
    link: "#",
    category: "International Headquarters",
    address: "123 Humanitarian Avenue, Geneva, Switzerland 1202",
    email: "ichr.geneva@gmail.com",
    phone: "+33 7 68 85 10 66"
  },
  {
    id: 7,
    title: "Paris (Administrative HQ)",
    coords: [48.8566, 2.3522],
    description:
      "Coordination center for European operations, fundraising, and strategic partnerships.",
    link: "#",
    category: "Administrative Headquarters",
    address: "25 Rue de la Paix, 75002 Paris, France",
    email: "ichr.geneva@gmail.com",
    phone: "+33 7 68 85 10 66"
  },
  {
    id: 2,
    title: "Juba, South Sudan",
    coords: [4.8594, 31.5713],
    description:
      "Operating three emergency education centers and providing food security for 15,000+ displaced persons.",
    link: "#",
    category: "Field Mission",
    address: "Plot 44, Block 3K, Tongping, Juba",
    email: "juba.mission@ichr.org",
    phone: "+211 91 234 5678"
  },
  {
    id: 3,
    title: "Kyiv, Ukraine",
    coords: [50.4501, 30.5234],
    description:
      "Distributing medical supplies to frontline hospitals and providing winter shelter support.",
    link: "#",
    category: "Regional Office",
    address: "Khreshchatyk St, 15, Kyiv, 02000",
    email: "ukraine.response@ichr.org",
    phone: "+380 44 123 4567"
  },
  {
    id: 4,
    title: "Sana'a, Yemen",
    coords: [15.3694, 44.191],
    description:
      "Clean water initiatives and mobile health clinics addressing the cholera crisis in remote regions.",
    link: "#",
    category: "Field Mission",
    address: "Hadda Street, Sana'a, Yemen",
    email: "yemen.aid@ichr.org",
    phone: "+967 1 234 567"
  },
  {
    id: 5,
    title: "Bogotá, Colombia",
    coords: [4.711, -74.0721],
    description:
      "Legal support for indigenous land rights and protection programs for community leaders.",
    link: "#",
    category: "Regional Office",
    address: "Cra. 7 #32-16, Bogotá, Colombia",
    email: "colombia.legal@ichr.org",
    phone: "+57 1 234 5678"
  },
  {
    id: 6,
    title: "Cox's Bazar, Bangladesh",
    coords: [21.4272, 92.0058],
    description:
      "Psychosocial support and sanitation infrastructure for refugee camps.",
    link: "#",
    category: "Field Mission",
    address: "Marine Drive Road, Cox's Bazar",
    email: "bangladesh.mission@ichr.org",
    phone: "+880 341 23456"
  },
];

export const WorldMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      attributionControl: true,
      zoomControl: false, // We'll add it back to a custom position if needed, or stick to default
    }).setView([35, 10], 2); // Adjusted view slightly to show Paris and Geneva better

    // Re-add zoom control to bottom right for cleaner look
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      }
    ).addTo(map);

    locations.forEach((loc, index) => {
      // Create a custom DivIcon to handle animations
      // We use the default marker images but wrap them in a div we can animate
      const customIcon = L.divIcon({
        className: '!bg-transparent !border-0', // Override Leaflet's default white square
        html: `
          <div class="relative w-[25px] h-[41px]">
            <!-- Shadow (static) -->
            <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png" 
                 class="absolute bottom-0 left-[-12px] w-[41px] h-[41px] max-w-none opacity-40 pointer-events-none" 
                 alt="" />
            <!-- Marker Pin (animated) -->
            <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" 
                 class="absolute top-0 left-0 w-[25px] h-[41px] max-w-none marker-animate-drop" 
                 style="animation-delay: ${index * 150}ms; opacity: 0;"
                 alt="Marker" />
          </div>
        `,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      // Updated popup content with Accessibility attributes
      const popup = `
        <div class="font-sans w-[280px] overflow-hidden" role="dialog" aria-labelledby="popup-title-${loc.id}">
          <div class="h-1.5 w-full bg-blue-900" aria-hidden="true"></div>
          <div class="p-5">
            <span class="inline-flex mb-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-800 border border-blue-100">
              ${loc.category}
            </span>
            <h3 id="popup-title-${loc.id}" class="font-bold text-blue-950 text-lg leading-snug mb-2">
              ${loc.title}
            </h3>
            <p class="text-slate-600 text-sm leading-relaxed mb-4">
              ${loc.description}
            </p>
            <div class="pt-3 border-t border-slate-100">
              <a href="${loc.link}" 
                 class="inline-flex items-center text-rose-500 text-xs font-bold uppercase tracking-wider hover:text-rose-700 transition group focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 rounded-sm"
                 aria-label="View project details for ${loc.title}">
                View Project Details
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="ml-1.5 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      `;

      L.marker(loc.coords, { icon: customIcon }).addTo(map).bindPopup(popup, {
        className: "custom-popup",
        closeButton: false,
        maxWidth: 300,
        minWidth: 280,
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden shadow-lg border border-slate-200 relative isolate">
      <div ref={containerRef} className="w-full h-full bg-slate-50" />

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-[400] hidden md:block bg-white/95 backdrop-blur px-4 py-3 rounded-lg shadow-md border border-slate-100 text-sm text-slate-600 opacity-90 hover:opacity-100 transition">
        <span className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Interact with markers to explore our impact
        </span>
      </div>
    </div>
  );
};