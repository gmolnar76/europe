"use client";
import * as React from "react";
import maplibregl, { Map as MLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import ScenariosControl from "@/components/map/ScenariosControl";
import type { Scenario } from "@/lib/regions";
import { getEAAdminNames, getEZAdminNames } from "@/lib/regions";
import { colorByMembership, inAdminNames } from "@/components/map/styleHelpers";
import { getCountryStats } from "@/lib/stats";

export type MapProps = { className?: string; height?: number };

const COUNTRIES_URL = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

export default function Map({ className, height = 420 }: MapProps) {
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<MLMap | null>(null);
  const [scenario, setScenario] = React.useState<Scenario>("sovereign");
  const popupRef = React.useRef<maplibregl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = React.useState(false);

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
        countries: { type: "geojson", data: COUNTRIES_URL },
      },
      layers: [{ id: "osm", type: "raster", source: "osm", minzoom: 0, maxzoom: 19 }],
    };

    const m = new maplibregl.Map({ container: mapRef.current, style, center: [10, 50], zoom: 3.5, attributionControl: { compact: true } });

    m.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

    m.on("load", async () => {
      m.addLayer({ id: "country-borders", type: "line", source: "countries", paint: { "line-color": "#0A2A6A", "line-width": 1.2 } });
      m.addLayer({ id: "ea-outline", type: "line", source: "countries", filter: inAdminNames(getEAAdminNames()), paint: { "line-color": "#0A2A6A", "line-width": 2.2, "line-opacity": 0.0 } });
      m.addLayer({ id: "ez-outline", type: "line", source: "countries", filter: inAdminNames(getEZAdminNames()), paint: { "line-color": "#FFCC00", "line-width": 2.2, "line-opacity": 0.0 } });
      m.addLayer({ id: "country-fill", type: "fill", source: "countries", paint: { "fill-color": colorByMembership(getEAAdminNames(), getEZAdminNames()), "fill-outline-color": "#0F172A" } });
      m.addLayer({ id: "country-borders-dashed", type: "line", source: "countries", filter: inAdminNames(getEAAdminNames()), paint: { "line-color": "#0F172A", "line-width": 0.8, "line-dasharray": [2, 2], "line-opacity": 0 } });

      applyScenario(m, "sovereign");

      // signal map is ready for binding interactions
      setMapLoaded(true);
    });

    map.current = m;
    return () => m.remove();
  }, []);

  React.useEffect(() => {
    const handler = (e: Event) => setScenario((e as CustomEvent<Scenario>).detail);
    window.addEventListener("europa:set-scenario", handler as EventListener);
    return () => window.removeEventListener("europa:set-scenario", handler as EventListener);
  }, []);

  React.useEffect(() => {
    if (!map.current) return;
    applyScenario(map.current, scenario);
  }, [scenario]);

  // Create/replace a popup on hover/click
  const handleHover = React.useCallback((e?: maplibregl.MapLayerMouseEvent, lock = false) => {
    const m = map.current;
    if (!m) return;
    if (popupRef.current && !lock) {
      popupRef.current.remove();
      popupRef.current = null;
    }
    if (scenario !== "sovereign") return;
    if (!e || !e.features?.length) return;
    const f = e.features[0];
    const props = f.properties as Record<string, unknown> | undefined;
    const iso2 = (props?.["ISO_A2"] || props?.["iso_a2"] || props?.["WB_A2"] || props?.["ISO2"] || props?.["iso2"]) as string | undefined;
    const admin = props?.["ADMIN"] as string | undefined;
    if (!iso2 || !admin) return;
    const stats = getCountryStats(iso2);
    const coords = e.lngLat ? [e.lngLat.lng, e.lngLat.lat] as [number, number] : undefined;
    if (!coords) return;

    const flagUrl = `https://flagcdn.com/w40/${iso2.toLowerCase()}.png`;
    const pop = stats?.population ? new Intl.NumberFormat().format(stats.population) : "n/a";
    const tfr = stats?.tfr ? stats.tfr.toFixed(1) : "n/a";

    const html = `
      <div style="font: 12px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial; min-width: 190px">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px">
          <img alt="${admin} flag" src="${flagUrl}" width="24" height="18" style="border-radius:2px; box-shadow:0 0 0 1px rgba(0,0,0,.15)"/>
          <strong style="color:#0A2A6A">${admin}</strong>
        </div>
        <div style="display:grid; grid-template-columns:auto 1fr; gap:4px 8px">
          <span style="color:#0F172A99">Population</span><span>${pop}</span>
          <span style="color:#0F172A99">TFR</span><span>${tfr}</span>
        </div>
      </div>`;

    const popup = new maplibregl.Popup({ closeButton: !lock, closeOnClick: !lock, offset: 12, className: "eu-popup" })
      .setLngLat(coords)
      .setHTML(html)
      .addTo(m);
    popupRef.current = popup;
  }, [scenario]);

  // Bind map interactions when map is loaded or handler changes
  React.useEffect(() => {
    const m = map.current;
    if (!m || !mapLoaded) return;

    const onMove = (e: maplibregl.MapLayerMouseEvent) => handleHover(e);
    const onLeave = () => handleHover(undefined);
    const onClick = (e: maplibregl.MapLayerMouseEvent) => handleHover(e, true);

    m.on("mousemove", "country-fill", onMove);
    m.on("mouseleave", "country-fill", onLeave);
    m.on("click", "country-fill", onClick);

    return () => {
      m.off("mousemove", "country-fill", onMove);
      m.off("mouseleave", "country-fill", onLeave);
      m.off("click", "country-fill", onClick);
    };
  }, [mapLoaded, handleHover]);

  return (
    <div className={("relative "+(className ?? ""))}>
      <div ref={mapRef} className={"rounded-lg overflow-hidden border border-black/5 shadow-sm bg-white"} style={{ height }} aria-label="Térkép – Europe" role="img" />
      <div className="absolute top-3 left-3">
        <ScenariosControl value={scenario} onChange={setScenario} />
      </div>
    </div>
  );
}

function applyScenario(m: MLMap, s: Scenario) {
  setOpacity(m, "country-borders", "line-opacity", s === "sovereign" ? 1 : s === "overlay" ? 0.4 : 0.2);
  setOpacity(m, "country-borders-dashed", "line-opacity", s === "federal" ? 0.6 : 0);
  setOpacity(m, "ea-outline", "line-opacity", s === "federal" || s === "overlay" ? 1 : 0);
  setOpacity(m, "ez-outline", "line-opacity", s === "overlay" ? 1 : 0);

  if (s === "federal") m.easeTo({ pitch: 30, bearing: -10, duration: 500, zoom: 3.3 });
  else if (s === "overlay") m.easeTo({ pitch: 0, bearing: 0, duration: 500, zoom: 3.2 });
  else m.easeTo({ pitch: 0, bearing: 0, duration: 500, zoom: 3.6 });
}

function setOpacity(m: MLMap, layerId: string, prop: "line-opacity" | "fill-opacity", value: number) {
  if (!m.getLayer(layerId)) return;
  m.setPaintProperty(layerId, prop, value);
}
