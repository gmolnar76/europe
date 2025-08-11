"use client";
import * as React from "react";
import maplibregl, { Map as MLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

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
    m.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

    m.on("load", () => {
      console.log("[Map] load: adding layers");
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
      console.log("[Map] layers:", m.getStyle().layers?.map(l => l.id));
    });

    m.on("sourcedata", (ev) => {
      if (ev.sourceId === "countries" && ev.isSourceLoaded) {
        console.log("[Map] countries source loaded");
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
      const admin = (f?.properties as Record<string, unknown> | undefined)?.ADMIN as string | undefined;
      console.log("[mousemove] id:", id, "admin:", admin);
      setHoverById(id ?? null);
      m.getCanvas().style.cursor = id != null ? "pointer" : "";

      if (!admin || !e.lngLat) return;
      if (popupRef.current) popupRef.current.remove();
      const popup = new maplibregl.Popup({ closeButton: false, offset: 10 })
        .setLngLat(e.lngLat)
        .setHTML(`<strong style='color:#0A2A6A'>${admin}</strong>`)
        .addTo(m!);
      popupRef.current = popup;
    }

    function onLeave() {
      console.log("[mouseleave]");
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

  return (
    <div className={("relative "+(className ?? ""))}>
      <div ref={mapRef} className={"rounded-lg overflow-hidden border border-black/5 shadow-sm bg-white"} style={{ height }} aria-label="Térkép – Europe" role="img" />
    </div>
  );
}
