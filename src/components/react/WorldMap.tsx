import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { locations, REGION_ORDER, type Location, type LocationKind } from '@/lib/locations';

/* ────────────────────────────────────────────────────────────────────────
   ICHR Global Presence map — Leaflet 1.9, rendered client:only (needs window).
   - Labels-free Positron canvas so only our navy/gold pins carry colour.
   - Branded category pins (HQ gold teardrop / Regional navy teardrop / Field
     navy ring) built as inline-SVG divIcons with ≥44px transparent hit areas.
   - One `selectedId` (the stable, non-sequential loc.id) syncs the index/rail,
     the markers, and the detail surface (desktop Leaflet popup / mobile sheet).
   - i18n: all display text comes from the optional `labels` prop (English
     defaults derived from the data), so titles/descriptions/categories/UI
     strings render in the active locale. Geometry/data keys stay language-free.
   ──────────────────────────────────────────────────────────────────────── */

const NAVY = '#1a4a68';
const NAVY_DARK = '#11364d';
const GOLD = '#C9A227';

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
const telHref = (p: string) => p.replace(/[^+\d]/g, '');
const fill = (tpl: string, vars: Record<string, string>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);

/* ---- localized labels (display only; data keys stay English/numeric) ---- */
export interface WorldMapLabels {
  kind: Record<LocationKind, string>;
  category: Record<string, string>; // English category → localized
  region: Record<string, string>; // region key → localized
  title: Record<string, string>; // String(id) → localized title
  description: Record<string, string>; // String(id) → localized description
  ui: {
    index: string;
    viewOnMap: string; // "{title}" placeholder
    showing: string; // "{title}", "{category}" placeholders
    legendAria: string;
    railAria: string;
    twoFingers: string;
    close: string;
  };
}

const DEFAULT_LABELS: WorldMapLabels = {
  kind: { hq: 'Headquarters', regional: 'Regional Office', field: 'Field Mission' },
  category: Object.fromEntries(locations.map((l) => [l.category, l.category])),
  region: Object.fromEntries(REGION_ORDER.map((r) => [r, r])),
  title: Object.fromEntries(locations.map((l) => [String(l.id), l.title])),
  description: Object.fromEntries(locations.map((l) => [String(l.id), l.description])),
  ui: {
    index: 'Office and mission index',
    viewOnMap: 'View {title} on map',
    showing: 'Showing {title}, {category}',
    legendAria: 'Map legend: gold pin Headquarters, navy pin Regional Office, navy ring Field Mission',
    railAria: 'Tap a location to view it on the map',
    twoFingers: 'Use two fingers to move the map',
    close: 'Close details',
  },
};

/* ---- pin geometry per tier (size encodes seniority: 45 → 35 → 22) ---- */
const PIN: Record<LocationKind, { w: number; h: number; tail: boolean }> = {
  hq: { w: 34, h: 45, tail: true },
  regional: { w: 26, h: 35, tail: true },
  field: { w: 22, h: 22, tail: false },
};

const TEARDROP = 'M12 0C6.48 0 2 4.48 2 10c0 7 10 22 10 22s10-15 10-22C22 4.48 17.52 0 12 0z';

function glyphSvg(kind: LocationKind, cls = 'ichr-pin-svg'): string {
  const p = PIN[kind];
  if (kind === 'field') {
    return `<svg class="${cls}" width="${p.w}" height="${p.h}" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="#ffffff" stroke="${NAVY}" stroke-width="3.4" />
      <circle cx="12" cy="12" r="2.4" fill="${NAVY}" />
    </svg>`;
  }
  const fillColor = kind === 'hq' ? GOLD : NAVY;
  const stroke = kind === 'hq' ? NAVY : NAVY_DARK;
  const dot = kind === 'hq' ? '#ffffff' : GOLD;
  return `<svg class="${cls}" width="${p.w}" height="${p.h}" viewBox="0 0 24 32" aria-hidden="true">
    <path d="${TEARDROP}" fill="${fillColor}" stroke="${stroke}" stroke-width="1.5" />
    <circle cx="12" cy="10" r="4.2" fill="${dot}" />
  </svg>`;
}

const HIT = 44;
function buildIcon(kind: LocationKind, index: number): L.DivIcon {
  const p = PIN[kind];
  const hitH = p.tail ? Math.max(HIT, p.h) : HIT;
  const iconAnchor: [number, number] = p.tail ? [HIT / 2, hitH] : [HIT / 2, HIT / 2];
  const popupAnchor: [number, number] = p.tail ? [0, -p.h - 2] : [0, -p.h / 2 - 6];
  const html = `<div class="ichr-pin-glyph" style="animation-delay:${index * 120}ms">${glyphSvg(kind)}</div>`;
  return L.divIcon({
    className: `ichr-pin ${p.tail ? 'ichr-pin--tail' : 'ichr-pin--dot'}`,
    html,
    iconSize: [HIT, hitH],
    iconAnchor,
    popupAnchor,
  });
}

/* ---- shared detail markup (desktop popup + mobile sheet) ---- */
const MAIL_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-slate-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
const PHONE_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-slate-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>`;
const PIN_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-slate-400 mt-0.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

function detailHtml(loc: Location, variant: 'popup' | 'sheet', labels: WorldMapLabels): string {
  const isHq = loc.kind === 'hq';
  const rule = isHq ? 'bg-[#C9A227]' : 'bg-[#1a4a68]';
  const pill = isHq
    ? 'bg-[#C9A227]/15 text-[#7a5f10] border-[#C9A227]/40'
    : 'bg-[#1a4a68]/10 text-[#1a4a68] border-[#1a4a68]/20';
  const title = labels.title[String(loc.id)] ?? loc.title;
  const category = labels.category[loc.category] ?? loc.category;
  const description = labels.description[String(loc.id)] ?? loc.description;
  const rows: string[] = [];
  if (loc.address)
    rows.push(
      `<div class="flex items-start gap-2.5 text-sm text-slate-500 py-1">${PIN_SVG}<span>${esc(loc.address)}</span></div>`
    );
  if (loc.email)
    rows.push(
      `<a href="mailto:${esc(loc.email)}" class="flex items-center gap-2.5 min-h-[44px] text-sm text-slate-600 hover:text-[#1a4a68] transition-colors">${MAIL_SVG}<span class="break-all">${esc(loc.email)}</span></a>`
    );
  if (loc.phone)
    rows.push(
      `<a href="tel:${telHref(loc.phone)}" class="flex items-center gap-2.5 min-h-[44px] text-sm text-slate-600 hover:text-[#1a4a68] transition-colors">${PHONE_SVG}<span>${esc(loc.phone)}</span></a>`
    );
  const contact = rows.length
    ? `<div class="mt-3 pt-3 border-t border-slate-100">${rows.join('')}</div>`
    : '';
  const width = variant === 'sheet' ? 'w-full' : 'w-[264px]';
  return `<div class="ichr-detail ${width} max-w-full overflow-hidden">
    <div class="h-1 w-full ${rule}" aria-hidden="true"></div>
    <div class="p-4">
      <span class="inline-flex mb-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${pill}">${esc(category)}</span>
      <h3 class="font-bold text-[#1a4a68] text-base leading-snug mb-1.5">${esc(title)}</h3>
      <p class="text-slate-600 text-sm leading-relaxed">${esc(description)}</p>
      ${contact}
    </div>
  </div>`;
}

/* ---- small JSX swatch for the index/rail/legend (mirrors the map pins) ---- */
const Swatch: React.FC<{ kind: LocationKind; size?: number }> = ({ kind, size }) => (
  <span
    className="inline-flex items-center justify-center shrink-0"
    style={{ width: size ?? 22, height: size ?? 28 }}
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: glyphSvg(kind, '') }}
  />
);

export const WorldMap: React.FC<{ labels?: WorldMapLabels }> = ({ labels = DEFAULT_LABELS }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [hint, setHint] = useState(false);
  const [announce, setAnnounce] = useState(''); // sr-only live-region text

  const labelsRef = useRef(labels);
  labelsRef.current = labels;
  const catLabel = (c: string) => labels.category[c] ?? c;
  const titleLabel = (id: number) => labels.title[String(id)] ?? '';
  const regionLabel = (r: string) => labels.region[r] ?? r;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const listRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const hintTimer = useRef<number | undefined>(undefined);

  const selectedIdRef = useRef<number | null>(null);
  const isMobileRef = useRef(isMobile);
  const reduceRef = useRef(reduce);
  const selectRef = useRef<(id: number | null, trigger?: HTMLElement | null) => void>(() => {});
  const suppressCloseRef = useRef(false);

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);
  useEffect(() => {
    reduceRef.current = reduce;
  }, [reduce]);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const select = useCallback((id: number | null, trigger?: HTMLElement | null) => {
    if (trigger !== undefined) triggerRef.current = trigger;
    setSelectedId((cur) => (cur === id ? null : id));
  }, []);
  useEffect(() => {
    selectRef.current = select;
  }, [select]);

  const showHint = useCallback(() => {
    setHint(true);
    window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setHint(false), 1600);
  }, []);

  // transient hover highlight (desktop list) — purely imperative, no re-render
  const setHover = useCallback((id: number | null) => {
    const active = id ?? selectedIdRef.current;
    markersRef.current.forEach((m, mid) => {
      const el = m.getElement();
      if (el) el.classList.toggle('is-active', mid === active);
    });
  }, []);

  /* ---- media queries (live) ---- */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMq = () => setIsMobile(mq.matches);
    const onRm = () => setReduce(rm.matches);
    onMq();
    onRm();
    mq.addEventListener('change', onMq);
    rm.addEventListener('change', onRm);
    return () => {
      mq.removeEventListener('change', onMq);
      rm.removeEventListener('change', onRm);
    };
  }, []);

  /* ---- map init (ONCE) ---- */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const el = containerRef.current;

    const map = L.map(el, {
      scrollWheelZoom: false,
      attributionControl: false, // re-add below without the Leaflet 🇺🇦 flag prefix
      zoomControl: false,
      minZoom: 2,
      maxBounds: [
        [-60, -180],
        [78, 180],
      ],
      maxBoundsViscosity: 1.0,
    }).setView([25, 8], 2);
    mapRef.current = map;

    L.control.attribution({ prefix: false }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
      attribution: '© OpenStreetMap © CARTO',
    }).addTo(map);

    locations.forEach((loc, index) => {
      const marker = L.marker(loc.coords, { icon: buildIcon(loc.kind, index) }).addTo(map);
      marker.bindPopup(detailHtml(loc, 'popup', labelsRef.current), {
        className: 'ichr-popup',
        maxWidth: 300,
        minWidth: 240,
        autoPan: true,
        autoPanPadding: [20, 20],
        closeButton: true,
      });
      marker.on('click', () => selectRef.current(loc.id, marker.getElement() ?? undefined));
      marker.on('add', () => {
        const m = marker.getElement();
        if (!m) return;
        m.setAttribute('tabindex', '0');
        m.setAttribute('role', 'button');
        const lab = labelsRef.current;
        m.setAttribute('aria-label', `${lab.title[String(loc.id)] ?? loc.title}, ${lab.category[loc.category] ?? loc.category}`);
        m.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectRef.current(loc.id, m);
          }
        });
      });
      markersRef.current.set(loc.id, marker);
    });

    // Keyboard users land inside the popup (close button → mailto/tel links)
    map.on('popupopen', (e: L.PopupEvent) => {
      const closeBtn = e.popup
        .getElement()
        ?.querySelector('.leaflet-popup-close-button') as HTMLElement | null;
      closeBtn?.focus({ preventScroll: true });
    });
    map.on('popupclose', () => {
      if (suppressCloseRef.current) return;
      setSelectedId(null);
      triggerRef.current?.focus?.();
    });
    map.on('click', () => {
      if (isMobileRef.current) setSelectedId(null);
    });

    /* one finger scrolls the page (touch-action allows it); two fingers pan/zoom the map */
    let touchStart: { x: number; y: number } | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        map.dragging.enable();
        touchStart = null;
      } else {
        map.dragging.disable();
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && touchStart) {
        const dx = Math.abs(e.touches[0].clientX - touchStart.x);
        const dy = Math.abs(e.touches[0].clientY - touchStart.y);
        if (dx > 12 && dx > dy) showHint(); // horizontal pan intent → hint two fingers
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) map.dragging.disable();
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    /* keep the canvas painted across the desktop↔mobile swap + rotation */
    let rid: number | undefined;
    const ro = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect.height ?? 0;
      if (h <= 0) return;
      window.clearTimeout(rid);
      rid = window.setTimeout(() => map.invalidateSize(), 120);
    });
    ro.observe(el);
    map.whenReady(() => map.invalidateSize());
    const onOrient = () => window.setTimeout(() => map.invalidateSize(), 250);
    window.addEventListener('orientationchange', onOrient);

    return () => {
      window.clearTimeout(rid);
      ro.disconnect();
      window.removeEventListener('orientationchange', onOrient);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      map.off();
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, [showHint]);

  /* ---- reconcile selection → markers + map move + detail surface ---- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m, id) => {
      const el = m.getElement();
      if (el) el.classList.toggle('is-active', id === selectedId);
    });

    if (selectedId == null) {
      suppressCloseRef.current = true;
      map.closePopup();
      suppressCloseRef.current = false;
      setAnnounce('');
      return;
    }

    const loc = locations.find((l) => l.id === selectedId);
    const marker = markersRef.current.get(selectedId);
    if (!loc || !marker) return;

    const lab = labelsRef.current;
    setAnnounce(
      fill(lab.ui.showing, {
        title: lab.title[String(loc.id)] ?? loc.title,
        category: lab.category[loc.category] ?? loc.category,
      })
    );
    const z = loc.kind === 'hq' ? 4 : 5;
    const animate = !reduce;

    if (isMobile) {
      suppressCloseRef.current = true;
      map.closePopup();
      suppressCloseRef.current = false;
      // offset the centre south so the active pin rides above the bottom sheet
      const pt = map.project(loc.coords, z).add([0, Math.round(map.getSize().y * 0.22)]);
      const center = map.unproject(pt, z);
      if (animate) map.flyTo(center, z, { duration: 0.7 });
      else map.setView(center, z, { animate: false });
    } else {
      if (animate) map.flyTo(loc.coords, z, { duration: 0.7 });
      else map.setView(loc.coords, z, { animate: false });
      suppressCloseRef.current = true;
      marker.openPopup();
      window.setTimeout(() => {
        suppressCloseRef.current = false;
      }, 0);
    }

    const li = listRef.current?.querySelector(`[data-loc="${selectedId}"]`) as HTMLElement | null;
    li?.scrollIntoView({ block: 'nearest', behavior: animate ? 'smooth' : 'auto' });
  }, [selectedId, isMobile, reduce]);

  /* ---- Esc clears selection ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedIdRef.current != null) select(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [select]);

  /* ---- mobile sheet: body scroll-lock + background inert + focus management ---- */
  const sheetOpen = isMobile && selectedId != null;
  useEffect(() => {
    if (!sheetOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // make everything except the sheet portal inert (keyboard + assistive tech)
    const portalEl = portalRef.current;
    const inerted = Array.from(document.body.children).filter((c) => c !== portalEl) as HTMLElement[];
    inerted.forEach((c) => c.setAttribute('inert', ''));
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = prevOverflow;
      inerted.forEach((c) => c.removeAttribute('inert'));
      window.clearTimeout(t);
      triggerRef.current?.focus?.();
    };
  }, [sheetOpen]);

  /* ---- swipe-down-to-close (bound to the drag handle only) + Tab focus-trap ---- */
  const dragStartY = useRef<number | null>(null);
  const onHandleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };
  const onHandleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY.current == null) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    if (sheetRef.current) sheetRef.current.style.transform = dy > 0 ? `translateY(${dy}px)` : '';
  };
  const onHandleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartY.current == null) return;
    const dy = e.changedTouches[0].clientY - dragStartY.current;
    if (sheetRef.current) sheetRef.current.style.transform = '';
    dragStartY.current = null;
    if (dy > 80) select(null);
  };
  const onSheetKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !sheetRef.current) return;
    const f = sheetRef.current.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
    );
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const selectedLoc = selectedId == null ? null : locations.find((l) => l.id === selectedId) ?? null;

  /* index/rail rows grouped by region */
  const groups = REGION_ORDER.map((region) => ({
    region,
    items: locations.filter((l) => l.region === region),
  })).filter((g) => g.items.length > 0);

  const rowBtn = (loc: Location, ctx: 'list' | 'rail') => {
    const active = selectedId === loc.id;
    const base =
      ctx === 'list'
        ? 'w-full flex items-center gap-3 text-start px-3 py-2.5 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a4a68] focus-visible:ring-offset-1'
        : 'snap-center shrink-0 w-[78%] flex items-center gap-3 text-start px-3.5 py-3 rounded-xl border bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a4a68]';
    const state = active
      ? 'border-[#C9A227] bg-[#C9A227]/10'
      : 'border-slate-200 bg-white hover:border-[#1a4a68]/40 hover:bg-slate-50';
    return (
      <button
        key={loc.id}
        type="button"
        data-loc={loc.id}
        aria-current={active ? 'true' : undefined}
        aria-label={fill(labels.ui.viewOnMap, { title: titleLabel(loc.id) || loc.title })}
        className={`${base} ${state}`}
        onClick={(e) => select(loc.id, e.currentTarget)}
        onMouseEnter={ctx === 'list' ? () => setHover(loc.id) : undefined}
        onMouseLeave={ctx === 'list' ? () => setHover(null) : undefined}
      >
        <Swatch kind={loc.kind} />
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-slate-800 truncate">{titleLabel(loc.id) || loc.title}</span>
          <span className="block text-xs text-slate-500 truncate">{catLabel(loc.category)}</span>
        </span>
      </button>
    );
  };

  return (
    <div className="lg:grid lg:grid-cols-[minmax(280px,340px)_1fr] lg:gap-6 lg:items-start">
      <div aria-live="polite" aria-atomic="true" className="sr-only">{announce}</div>

      {/* ── DESKTOP INDEX ── */}
      <div
        ref={listRef}
        className="hidden lg:flex lg:flex-col lg:max-h-[600px] lg:overflow-y-auto pe-1 -me-1"
        aria-label={labels.ui.index}
      >
        {groups.map((g) => (
          <div key={g.region} className="mb-4 last:mb-0">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
              {regionLabel(g.region)}
            </h3>
            <div className="flex flex-col gap-1.5">{g.items.map((loc) => rowBtn(loc, 'list'))}</div>
          </div>
        ))}
      </div>

      {/* ── MAP COLUMN ── */}
      <div className="min-w-0">
        {/* mobile legend (above the map so it never covers pins) */}
        <div className="lg:hidden flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-2.5 px-0.5">
          {(['hq', 'regional', 'field'] as LocationKind[]).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 text-xs text-slate-600">
              <Swatch kind={k} size={18} />
              {labels.kind[k]}
            </span>
          ))}
        </div>

        <div className="relative">
          <div
            ref={containerRef}
            className="w-full h-[58svh] min-h-[420px] lg:h-[600px] rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-[#eaeaea] isolate"
          />

          {/* desktop legend (floating, clear of the bottom-right zoom control) */}
          <div
            className="hidden lg:block absolute bottom-4 start-4 z-[450] bg-white/95 backdrop-blur rounded-lg border border-slate-200 shadow-sm px-3 py-2.5"
            role="img"
            aria-label={labels.ui.legendAria}
          >
            <div className="flex flex-col gap-1.5">
              {(['hq', 'regional', 'field'] as LocationKind[]).map((k) => (
                <span key={k} className="inline-flex items-center gap-2 text-xs text-slate-600">
                  <Swatch kind={k} size={18} />
                  {labels.kind[k]}
                </span>
              ))}
            </div>
          </div>

          {/* one-finger hint */}
          <div
            className={`pointer-events-none lg:hidden absolute inset-x-0 top-3 z-[450] flex justify-center transition-opacity duration-200 ${
              hint ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          >
            <span className="bg-slate-900/85 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
              {labels.ui.twoFingers}
            </span>
          </div>
        </div>

        {/* mobile chip rail */}
        <div
          ref={railRef}
          className="lg:hidden mt-3 flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 -mx-4 pb-1 [scrollbar-width:none]"
          aria-label={labels.ui.railAria}
        >
          {locations.map((loc) => rowBtn(loc, 'rail'))}
        </div>
      </div>

      {/* ── MOBILE BOTTOM SHEET (portal to body so it isn't clipped by isolate/transform) ── */}
      {sheetOpen &&
        selectedLoc &&
        createPortal(
          <div ref={portalRef} className="fixed inset-0 z-[1000] lg:hidden">
            <div
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => select(null)}
              aria-hidden="true"
            />
            <div
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-label={titleLabel(selectedLoc.id) || selectedLoc.title}
              onKeyDown={onSheetKeyDown}
              className="ichr-sheet absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[72svh] overflow-y-auto overscroll-contain pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
            >
              <div
                className="sticky top-0 z-10 bg-white pt-2.5 pb-1 flex justify-center cursor-grab"
                style={{ touchAction: 'none' }}
                aria-hidden="true"
                onTouchStart={onHandleTouchStart}
                onTouchMove={onHandleTouchMove}
                onTouchEnd={onHandleTouchEnd}
              >
                <span className="h-1.5 w-10 rounded-full bg-slate-300" />
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => select(null)}
                aria-label={labels.ui.close}
                className="absolute top-2 end-2 w-11 h-11 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a4a68]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
              <div dangerouslySetInnerHTML={{ __html: detailHtml(selectedLoc, 'sheet', labels) }} />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default WorldMap;
