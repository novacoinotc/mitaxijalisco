"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Guadalajara coordinates
const GDL_CENTER: [number, number] = [20.6597, -103.3496];

// Route points: Chapultepec → Vallarta → Américas → Patria (simplified)
const ROUTE_POINTS: [number, number][] = [
  [20.6690, -103.3620], // Origen: Chapultepec
  [20.6680, -103.3580],
  [20.6700, -103.3520],
  [20.6720, -103.3460],
  [20.6740, -103.3400],
  [20.6770, -103.3350],
  [20.6800, -103.3300],
  [20.6830, -103.3250], // Destino: Av. Patria
];

export interface RealMapProps {
  progress?: number;
  showRoute?: boolean;
  showCar?: boolean;
  originLabel?: string;
  destLabel?: string;
  userLocation?: { lat: number; lng: number } | null;
  className?: string;
  interactive?: boolean;
}

// Dynamically import to avoid SSR issues with Leaflet
const MapInner = dynamic(() => Promise.resolve(MapComponent), { ssr: false });

export default function RealMap(props: RealMapProps) {
  return <MapInner {...props} />;
}

function MapComponent({
  progress = 0,
  showRoute = true,
  showCar = true,
  originLabel = "Origen",
  destLabel = "Destino",
  userLocation,
  className = "",
  interactive = false,
}: RealMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const carMarker = useRef<any>(null);
  const routeLine = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then((L) => {
      if (!mapRef.current) return;

      // Create map
      const map = L.map(mapRef.current, {
        center: userLocation ? [userLocation.lat, userLocation.lng] : GDL_CENTER,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        dragging: interactive,
        scrollWheelZoom: interactive,
        touchZoom: interactive,
        doubleClickZoom: false,
      });

      // Dark map tiles from CartoDB
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Origin marker
      const originCoord = userLocation
        ? [userLocation.lat, userLocation.lng] as [number, number]
        : ROUTE_POINTS[0];

      const greenIcon = L.divIcon({
        html: `<div style="width:14px;height:14px;border-radius:50%;background:#10b981;border:3px solid white;box-shadow:0 0 8px rgba(16,185,129,0.5)"></div>`,
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const destIcon = L.divIcon({
        html: `<div style="width:14px;height:14px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 0 8px rgba(239,68,68,0.5)"></div>`,
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      L.marker(originCoord, { icon: greenIcon }).addTo(map).bindTooltip(originLabel, { permanent: false, direction: "top", className: "map-tooltip" });
      L.marker(ROUTE_POINTS[ROUTE_POINTS.length - 1], { icon: destIcon }).addTo(map).bindTooltip(destLabel, { permanent: false, direction: "top", className: "map-tooltip" });

      // Route line
      if (showRoute) {
        routeLine.current = L.polyline(ROUTE_POINTS, {
          color: "#10b981",
          weight: 4,
          opacity: 0.8,
          dashArray: "8 6",
        }).addTo(map);

        // Fit bounds to route
        map.fitBounds(L.latLngBounds(ROUTE_POINTS), { padding: [30, 30] });
      }

      // Car marker
      if (showCar) {
        const carIcon = L.divIcon({
          html: `<div style="width:20px;height:20px;border-radius:50%;background:#10b981;border:3px solid white;box-shadow:0 0 12px rgba(16,185,129,0.6);display:flex;align-items:center;justify-content:center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
          </div>`,
          className: "",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        carMarker.current = L.marker(ROUTE_POINTS[0], { icon: carIcon }).addTo(map);
      }

      mapInstance.current = map;
      setLoaded(true);

      // Force resize after mount
      setTimeout(() => map.invalidateSize(), 100);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update car position when progress changes
  useEffect(() => {
    if (!carMarker.current || !loaded) return;

    const idx = Math.min(Math.floor(progress * (ROUTE_POINTS.length - 1)), ROUTE_POINTS.length - 2);
    const t = (progress * (ROUTE_POINTS.length - 1)) - idx;
    const lat = ROUTE_POINTS[idx][0] + (ROUTE_POINTS[idx + 1][0] - ROUTE_POINTS[idx][0]) * t;
    const lng = ROUTE_POINTS[idx][1] + (ROUTE_POINTS[idx + 1][1] - ROUTE_POINTS[idx][1]) * t;

    carMarker.current.setLatLng([lat, lng]);
  }, [progress, loaded]);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: 180, background: "#1a1a2e" }} />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a2e]">
          <div className="h-5 w-5 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <style>{`
        .map-tooltip { background: rgba(0,0,0,0.8); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 4px 8px; font-size: 11px; font-family: system-ui; }
        .leaflet-container { background: #1a1a2e !important; }
      `}</style>
    </div>
  );
}
