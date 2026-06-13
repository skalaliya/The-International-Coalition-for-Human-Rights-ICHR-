import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { locations } from '@/lib/locations';

// Rendered as `client:only="react"` — never server-rendered (Leaflet needs window).
export const WorldMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      attributionControl: true,
      zoomControl: false,
    }).setView([35, 10], 2);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    locations.forEach((loc, index) => {
      const customIcon = L.divIcon({
        className: '!bg-transparent !border-0',
        html: `
          <div class="relative w-[25px] h-[41px]">
            <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
                 class="absolute bottom-0 left-[-12px] w-[41px] h-[41px] max-w-none opacity-40 pointer-events-none"
                 alt="" />
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
          </div>
        </div>
      `;

      L.marker(loc.coords, { icon: customIcon }).addTo(map).bindPopup(popup, {
        className: 'custom-popup',
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
      <div className="absolute bottom-6 left-6 z-[400] hidden md:block bg-white/95 backdrop-blur px-4 py-3 rounded-lg shadow-md border border-slate-100 text-sm text-slate-600 opacity-90 hover:opacity-100 transition">
        <span className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Interact with markers to explore our impact
        </span>
      </div>
    </div>
  );
};

export default WorldMap;
