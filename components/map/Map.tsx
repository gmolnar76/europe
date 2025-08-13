"use client";
import * as React from "react";
import maplibregl, { Map as MLMap } from "maplibre-gl";
import type { ExpressionSpecification, GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { getEUList, getEUAdminNames } from "@/lib/regions";
import { applyScenario, type ScenarioKey } from "./scenarios";

export type MapProps = { className?: string; height?: number; eventName?: string; withLegend?: boolean };

const COUNTRIES_URL = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

export default function Map({ className, height = 420, eventName = 'europa:set-scenario', withLegend = false }: MapProps) {
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<MLMap | null>(null);
  const popupRef = React.useRef<maplibregl.Popup | null>(null);
  const hoveredIdRef = React.useRef<string | number | null>(null);
  const [scenario, setScenario] = React.useState<ScenarioKey | null>(null);

  React.useEffect(() => {
    if (!mapRef.current || map.current) return;

    const style: maplibregl.StyleSpecification = {
      version: 8,
      glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors | Style: MapLibre GL",
        },
        countries: { type: "geojson", data: COUNTRIES_URL, generateId: true },
      },
      layers: [
        { id: "osm", type: "raster", source: "osm", minzoom: 0, maxzoom: 19 }
      ],
    };

    const m = new maplibregl.Map({ container: mapRef.current, style, center: [10, 50], zoom: 3.5, attributionControl: { compact: true } });
    // Remove tilt: keep a flat (pitch 0) map
    m.setPitch(0);
    m.setBearing(0);
    m.dragRotate.disable();
    m.touchZoomRotate.disableRotation();
    m.addControl(new maplibregl.NavigationControl({ showZoom: true, showCompass: false, visualizePitch: true }), "top-right");

    m.on("load", () => {
      m.addLayer({
        id: "country-borders",
        type: "line",
        source: "countries",
        paint: { "line-color": "#0A2A6A", "line-width": 1.2 }
      });
      m.addLayer({
        id: "country-fill",
        type: "fill",
        source: "countries",
        paint: { "fill-color": "#00000000", "fill-outline-color": "#0F172A", "fill-opacity": 1 }
      });

      // EU alapszín: külön réteg, ISO_A2 kódok alapján szűrve (robosztusabb), ADMIN név fallback-kal
      const EU_CODES_LOAD = getEUList();
      const EU_ADMINS_LOAD = getEUAdminNames();
      m.addLayer({
        id: "country-fill-eu",
        type: "fill",
        source: "countries",
        filter: [
          "any",
          ["in", ["get", "ISO_A2"], ["literal", EU_CODES_LOAD]],
          [
            "in",
            ["coalesce", ["get", "ADMIN"], ["get", "NAME"], ["get", "name"], ["get", "NAME_EN"], ["get", "name_en"]],
            ["literal", EU_ADMINS_LOAD]
          ],
        ],
        paint: { "fill-color": "#2EC5B6", "fill-opacity": 0.7 },
        layout: { visibility: "none" },
      });

      const hoverOpacity: ExpressionSpecification = [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.35,
        0
      ];
      m.addLayer({
        id: "country-hover",
        type: "fill",
        source: "countries",
        paint: { "fill-color": "#FFCC00", "fill-opacity": hoverOpacity }
      });

      // Biztosítsuk a rétegsorrendet: EU réteg legyen a hover alatt, de a base fill felett
      try {
        if (m.getLayer("country-fill-eu") && m.getLayer("country-hover")) {
          m.moveLayer("country-fill-eu", "country-hover");
        }
      } catch (err) {
        console.warn("[Map] moveLayer country-fill-eu before country-hover failed:", err);
      }
    });

    m.on("sourcedata", (ev) => {
      if (ev.sourceId === "countries" && ev.isSourceLoaded) {
        // source loaded
      }
    });

    map.current = m;
    return () => m.remove();
  }, []);

  // Hover highlight and popup
  React.useEffect(() => {
    const m = map.current;
    if (!m) return;

    function setHoverById(id?: string | number | null) {
      if (!m) return;
      const prev = hoveredIdRef.current;
      if (prev != null) m.setFeatureState({ source: "countries", id: prev }, { hover: false });
      if (id != null) m.setFeatureState({ source: "countries", id }, { hover: true });
      hoveredIdRef.current = id ?? null;
    }

    function onMove(e: maplibregl.MapLayerMouseEvent) {
      if (!m) return;
      let f = e.features && e.features[0];
      if (!f) {
        const feats = m.queryRenderedFeatures(e.point, { layers: ["country-fill"] });
        f = (feats && feats[0]) as maplibregl.MapGeoJSONFeature | undefined;
      }
      const id = f?.id as string | number | undefined;
      const props = f?.properties as Record<string, unknown> | undefined;
      const name = props?.ADMIN || props?.NAME || props?.name || props?.NAME_EN || props?.name_en;
      setHoverById(id ?? null);
      m.getCanvas().style.cursor = id != null ? "pointer" : "";

      if (!name || !e.lngLat) return;
      if (popupRef.current) popupRef.current.remove();
      const popup = new maplibregl.Popup({ closeButton: false, offset: 10 })
        .setLngLat(e.lngLat)
        .setHTML(`<strong style='color:#0A2A6A'>${name}</strong>`)
        .addTo(m!);
      popupRef.current = popup;
    }

    function onLeave() {
      setHoverById(null);
      if (m) m.getCanvas().style.cursor = "";
      if (popupRef.current) popupRef.current.remove();
      popupRef.current = null;
    }

    const layers = ["country-fill", "country-hover"] as const;
    layers.forEach((id) => {
      m.on("mousemove", id, onMove);
      m.on("mouseleave", id, onLeave);
    });
    return () => {
      layers.forEach((id) => {
        m.off("mousemove", id, onMove);
        m.off("mouseleave", id, onLeave);
      });
      setHoverById(null);
      if (popupRef.current) popupRef.current.remove();
      popupRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const m = map.current;
    if (!m) return;

    const showEUFill = (visible: boolean, color?: string, opacity?: number) => {
      const apply = () => {
        if (!m.getLayer("country-fill-eu")) return;
        if (color) m.setPaintProperty("country-fill-eu", "fill-color", color);
        if (typeof opacity === "number") m.setPaintProperty("country-fill-eu", "fill-opacity", opacity);
        m.setLayoutProperty("country-fill-eu", "visibility", visible ? "visible" : "none");
      };
      if (m.isStyleLoaded()) apply(); else m.once("load", apply);
    };

    const setBaseEUColor = (color?: string, names?: string[]) => {
      const apply = () => {
        if (!m.getLayer("country-fill")) return;
        const EU_NAMES_DEFAULT = getEUAdminNames();
        const USED_NAMES = names && names.length ? names : EU_NAMES_DEFAULT;
        if (color) {
          const expr: ExpressionSpecification | undefined = color ? [
            "case",
            ["in", ["coalesce", ["get", "ADMIN"], ["get", "NAME"], ["get", "name"], ["get", "NAME_EN"], ["get", "name_en"]], ["literal", USED_NAMES]],
            color,
            "#00000000",
          ] : undefined;
          if (expr) m.setPaintProperty("country-fill", "fill-color", expr as any);
        } else {
          m.setPaintProperty("country-fill", "fill-color", "#00000000");
        }
      };
      if (m.isStyleLoaded()) apply(); else m.once("load", apply);
    };

    // Generalized green-shades filler for a provided list of country names (defaults to EU)
    const setBaseShades = (namesOverride?: string[]) => {
      const apply = () => {
        if (!m.getLayer("country-fill")) return;
        const names = namesOverride && namesOverride.length ? namesOverride : getEUAdminNames();
        // Multi-shade green palette (mid-tones for good contrast on offwhite)
        const palette = [
          "#86EFAC", // green-300
          "#4ADE80", // green-400
          "#22C55E", // green-500
          "#16A34A", // green-600
          "#10B981", // emerald-500
          "#059669", // emerald-600
        ];
        const groups: Record<string, string[]> = {};
        names.forEach((n, i) => {
          const c = palette[i % palette.length];
          (groups[c] = groups[c] || []).push(n);
        });
        const coalesced = ["coalesce", ["get", "ADMIN"], ["get", "NAME"], ["get", "name"], ["get", "NAME_EN"], ["get", "name_en"]];
        const expr: (string | unknown)[] = ["case"];
        Object.entries(groups).forEach(([color, group]) => {
          expr.push(["in", coalesced, ["literal", group]], color);
        });
        expr.push("#00000000");
        m.setPaintProperty("country-fill", "fill-color", expr as any);
      };
      if (m.isStyleLoaded()) apply(); else m.once("load", apply);
    };

    // Fit map to a set of countries by ADMIN/NAME list, with optional ROI clipping and tuning
    const fitToNames = async (
      names: string[],
      opts?: {
        padding?: number;
        duration?: number;
        maxZoom?: number;
        extraZoom?: number;
        targetZoom?: number;
        roi?: { minX: number; maxX: number; minY: number; maxY: number };
        followZoom?: boolean; // if false, skip post-fit zoom-in phase
      }
    ) => {
      const padding = opts?.padding ?? 6;
      const duration = opts?.duration ?? 700;
      const maxZoom = opts?.maxZoom ?? 8.5;
      const extraZoom = opts?.extraZoom ?? 0.6;
      const roi = opts?.roi;
      const followZoom = opts?.followZoom !== false; // default true for backward compatibility

      const src = m.getSource("countries") as GeoJSONSource | undefined;
      const getGeoJSON = async (): Promise<GeoJSON.FeatureCollection | undefined> => {
        const data: unknown = (src as any)?._data || (src as any)?._options?.data; // maplibre lacks public accessor
        if (data && typeof data === 'object' && 'features' in data) return data as GeoJSON.FeatureCollection;
        try {
          const res = await fetch(COUNTRIES_URL);
          return await res.json();
        } catch {
          return undefined;
        }
      };

      const fc = await getGeoJSON();
      if (!fc || !fc.features) return;
      const namesSet = new Set(names);
      let gMinX = Infinity, gMinY = Infinity, gMaxX = -Infinity, gMaxY = -Infinity;
      let rMinX = Infinity, rMinY = Infinity, rMaxX = -Infinity, rMaxY = -Infinity;
      const inROI = (x: number, y: number) => !roi ? true : (x >= roi.minX && x <= roi.maxX && y >= roi.minY && y <= roi.maxY);
      const coalesceName = (p: Record<string, unknown> | null | undefined) => (p?.ADMIN as string) || (p?.NAME as string) || (p?.name as string) || (p?.NAME_EN as string) || (p?.name_en as string);
      const walk = (coords: unknown): void => {
        if (!coords) return;
        if (Array.isArray(coords) && typeof coords[0] === "number") {
          const x = coords[0] as number, y = coords[1] as number;
          if (Number.isFinite(x) && Number.isFinite(y)) {
            if (x < gMinX) gMinX = x; if (y < gMinY) gMinY = y;
            if (x > gMaxX) gMaxX = x; if (y > gMaxY) gMaxY = y;
            if (inROI(x, y)) {
              if (x < rMinX) rMinX = x; if (y < rMinY) rMinY = y;
              if (x > rMaxX) rMaxX = x; if (y > rMaxY) rMaxY = y;
            }
          }
        } else if (Array.isArray(coords)) {
          for (const c of coords) walk(c);
        }
      };
      for (const f of fc.features) {
        const n = coalesceName(f.properties);
        if (!namesSet.has(n)) continue;
        if (f.geometry && (f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon")) {
          walk(f.geometry.coordinates);
        }
      }
      const useROI = rMinX !== Infinity;
      const minX = useROI ? rMinX : gMinX;
      const minY = useROI ? rMinY : gMinY;
      const maxX = useROI ? rMaxX : gMaxX;
      const maxY = useROI ? rMaxY : gMaxY;
      if (minX === Infinity) return;
      const center: [number, number] = [ (minX + maxX) / 2, (minY + maxY) / 2 ];
      const bounds: [[number, number],[number, number]] = [[minX, minY],[maxX, maxY]];
      try {
        m.fitBounds(bounds, { padding, duration, maxZoom });
        if (followZoom) {
          m.once("moveend", () => {
            try {
              const z = m.getZoom();
              const nextZoom = typeof opts?.targetZoom === "number" ? Math.min(opts.targetZoom, maxZoom + 0.5) : Math.min(z + extraZoom, maxZoom + 0.5);
              m.easeTo({ zoom: nextZoom, center, duration: 300 });
            } catch {}
          });
        }
      } catch {}
    };

    // Helper to reset view to default
    const resetView = () => {
      try {
        m.easeTo({ center: [10, 50], zoom: 3.5, pitch: 0, bearing: 0, duration: 350 });
      } catch {}
    };

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ScenarioKey>).detail;
      setScenario(detail);
      try {
        applyScenario(m, detail, {
          setBaseShades,
            setBaseEUColor,
            showEUFill,
            getEUAdminNames
        });
        // Border styling per scenario
        const bordersId = 'country-borders';
        if (m.getLayer(bordersId)) {
          if (detail === 'federal') {
            m.setPaintProperty(bordersId, 'line-color', '#0A2A6A');
            m.setPaintProperty(bordersId, 'line-opacity', 0.25);
            m.setPaintProperty(bordersId, 'line-width', 0.1); // thinned for federal view
            m.setPaintProperty(bordersId, 'line-dasharray', [2,2]);
          } else {
            m.setPaintProperty(bordersId, 'line-color', '#0A2A6A');
            m.setPaintProperty(bordersId, 'line-opacity', 0.9);
            m.setPaintProperty(bordersId, 'line-width', 1.2);
            m.setPaintProperty(bordersId, 'line-dasharray', [1,0]);
          }
        }
        const isDev = eventName.includes('-dev');
        if (detail === 'sovereign') {
          // Confederation view: focused EU frame (no pitch), stable zoom per breakpoint
          const adaptiveConfed = () => {
            const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
            if (w < 640) return { padding: 16, targetZoom: 3.9 };
            if (w < 1024) return { padding: 24, targetZoom: 4.05 };
            return { padding: 30, targetZoom: 4.15 };
          };
          const { padding, targetZoom } = adaptiveConfed();
          try {
            fitToNames(getEUAdminNames(), {
              padding: isDev ? padding : 24,
              targetZoom: isDev ? targetZoom : 4.1,
              duration: 750,
              roi: { minX: -25, maxX: 40, minY: 34, maxY: 72 },
              followZoom: false
            });
          } catch {}
          try { m.easeTo({ pitch: 0, duration: 300 }); } catch {}
        } else if (detail === 'federal') {
          // Adaptive camera (dev map only): responsive pitch & padding
          const adaptive = () => {
            const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
            if (w < 640) return { pitch: 0, padding: 18, targetZoom: 4.0 };
            if (w < 1024) return { pitch: 10, padding: 28, targetZoom: 4.15 };
            return { pitch: 14, padding: 36, targetZoom: 4.25 };
          };
          const { pitch, padding, targetZoom } = adaptive();
          try {
            fitToNames(getEUAdminNames(), {
              padding: isDev ? padding : 24,
              targetZoom: isDev ? targetZoom : 4.2,
              duration: 800,
              roi: { minX: -25, maxX: 40, minY: 34, maxY: 72 },
              followZoom: false // disable post-fit zoom-in
            });
          } catch {}
          if (isDev) {
            const applyPitch = () => { try { m.easeTo({ pitch, duration: 400 }); } catch {} };
            m.once('moveend', applyPitch);
          } else {
            try { m.easeTo({ pitch: 0, duration: 300 }); } catch {}
          }
        } else if (detail === 'overlay') {
          // Scenario 3 (EU + Extended Eurasian) – Portugal to left edge requirement
          const extendedNames = [...getEUAdminNames(), 'Russia', 'Russian Federation'];
          const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
          const targetZoom = w < 640 ? 3.1 : (w < 1024 ? 3.0 : 2.9);
          const padding = w < 640 ? 18 : (w < 1024 ? 22 : 26);
          // ROI narrowed on west (minX -15) so Atlantic gap reduced; east trimmed to 75 for balance
          try {
            fitToNames(extendedNames, {
              padding,
              targetZoom,
              duration: 780,
              roi: { minX: -3, maxX: 170, minY: 34, maxY: 72 },
              followZoom: false
            });
          } catch {}
          try { m.easeTo({ pitch: 0, duration: 300 }); } catch {}
        } else {
          // (Unused now) Fallback reset
          try {
            const base = { center: [10, 50] as [number, number], zoom: 3.5, bearing: 0, duration: 350 } as const;
            m.easeTo({ center: [...base.center], zoom: base.zoom, bearing: base.bearing, duration: base.duration, pitch: 0 });
          } catch {}
        }
      } catch {}
    };
    window.addEventListener(eventName, handler as EventListener);

    // Auto-activate sovereign on first load for visual feedback
    setTimeout(() => {
      try { handler(new CustomEvent(eventName, { detail: 'sovereign' } as any)); } catch {}
    }, 0);

    return () => window.removeEventListener(eventName, handler as EventListener);
  }, [eventName]);

  const legendContent = React.useMemo(() => {
    if (!withLegend) return null;
    if (!scenario || scenario === 'sovereign') {
      return [
        { color: '#86EFAC', label: 'Distinct member shades' },
        { color: '#4ADE80', label: 'Variation = sovereign diversity' },
        { color: '#2EC5B6', label: 'Potential extension (inactive)' }
      ];
    }
    if (scenario === 'federal') {
      return [
        { color: '#EF4444', label: 'Unified federal entity' },
        { dash: true, color: '#0A2A6A', label: 'Internal borders (de-emphasized)' },
        { color: '#2EC5B6', label: 'Legacy overlay (hidden)' }
      ];
    }
    // overlay
    return [
      { color: '#2EC5B6', label: 'EU core (teal)' },
      { color: '#10B981', label: 'Extended grouping' },
      { color: '#FFCC00', label: 'Hover highlight' }
    ];
  }, [scenario, withLegend]);

  return (
    <div className={("relative "+(className ?? ""))}>
      <div ref={mapRef} className={"rounded-lg overflow-hidden border border-black/5 shadow-sm"} style={{ height }} aria-label="Térkép – Europe" role="img" />
      {withLegend && legendContent && (
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded shadow px-3 py-2 text-[11px] space-y-1 text-midnight border border-black/10">
          <div className="font-medium">Legend{scenario ? ` – ${scenario}` : ''}</div>
          {legendContent.map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              {item.dash ? (
                <span className="inline-block w-4 h-[2px] bg-midnight" style={{ backgroundImage: "repeating-linear-gradient(90deg,#0A2A6A 0 2px,transparent 2px 4px)" }} />
              ) : (
                <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
              )}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
