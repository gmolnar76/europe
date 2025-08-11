"use client";
import * as React from "react";
import maplibregl, { Map as MLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { getEUList, getEUAdminNames } from "@/lib/regions";

export type MapProps = { className?: string; height?: number };

const COUNTRIES_URL = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

export default function Map({ className, height = 420 }: MapProps) {
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<MLMap | null>(null);
  const popupRef = React.useRef<maplibregl.Popup | null>(null);
  const hoveredIdRef = React.useRef<string | number | null>(null);

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
    // Keep the view flat: no pitch or rotation
    m.setPitch(0);
    m.setBearing(0);
    m.dragRotate.disable();
    m.touchZoomRotate.disableRotation();
    m.addControl(new maplibregl.NavigationControl({ showZoom: true, showCompass: false, visualizePitch: false }), "top-right");

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
        paint: { "fill-color": "#F5F7FB", "fill-outline-color": "#0F172A", "fill-opacity": 0.7 }
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

      const hoverOpacity: maplibregl.ExpressionSpecification = [
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
      const props = f?.properties as Record<string, any> | undefined;
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
          const expr: any = [
            "case",
            ["in", ["coalesce", ["get", "ADMIN"], ["get", "NAME"], ["get", "name"], ["get", "NAME_EN"], ["get", "name_en"]], ["literal", USED_NAMES]],
            color,
            "#F5F7FB",
          ];
          m.setPaintProperty("country-fill", "fill-color", expr);
        } else {
          m.setPaintProperty("country-fill", "fill-color", "#F5F7FB");
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
        const coalesced: any = ["coalesce", ["get", "ADMIN"], ["get", "NAME"], ["get", "name"], ["get", "NAME_EN"], ["get", "name_en"]];
        const expr: any[] = ["case"];
        Object.entries(groups).forEach(([color, group]) => {
          expr.push(["in", coalesced, ["literal", group]] as any, color as any);
        });
        expr.push("#F5F7FB"); // else
        m.setPaintProperty("country-fill", "fill-color", expr as any);
      };
      if (m.isStyleLoaded()) apply(); else m.once("load", apply);
    };

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<"sovereign" | "federal" | "overlay">).detail;
      if (detail === "sovereign") {
        // Alapréteg színezése: EU országok különböző zöld árnyalatokkal
        setBaseShades();
        showEUFill(false);
      } else if (detail === "federal") {
        // Alapréteg színezése: EU országok pirossal
        setBaseEUColor("#EF4444");
        showEUFill(false);
      } else {
        // 3) Északi keresztény civilizáció: EU + Oroszország egy blokk ZÖLD árnyalatokkal
        const euPlusRu = [...getEUAdminNames(), "Russia", "Russian Federation"];
        setBaseShades(euPlusRu);
        showEUFill(false);
      }
    };
    window.addEventListener("europa:set-scenario", handler as EventListener);

    // Auto-activate sovereign on first load for visual feedback
    setTimeout(() => {
      try {
        handler(new CustomEvent("europa:set-scenario", { detail: "sovereign" }))
      } catch {}
    }, 0);

    return () => window.removeEventListener("europa:set-scenario", handler as EventListener);
  }, []);

  return (
    <div className={("relative "+(className ?? ""))}>
      <div ref={mapRef} className={"rounded-lg overflow-hidden border border-black/5 shadow-sm bg-white"} style={{ height }} aria-label="Térkép – Europe" role="img" />
    </div>
  );
}
