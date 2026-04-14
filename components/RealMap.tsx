"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";

const GDL_CENTER: [number, number] = [20.6597, -103.3496];

// Destinos con coordenadas reales de GDL
const DEST_COORDS: Record<string, [number, number]> = {
  "Plaza del Sol, Zapopan": [20.6237, -103.4014],
  "Andares, Zapopan": [20.7050, -103.4100],
  "Aeropuerto Internacional GDL": [20.5218, -103.3111],
  "Aeropuerto GDL": [20.5218, -103.3111],
  "Centro Histórico, GDL": [20.6767, -103.3475],
  "Centro Tlaquepaque": [20.6408, -103.3145],
  "Centro de Tlaquepaque": [20.6408, -103.3145],
  "Expo GDL": [20.6525, -103.4025],
  "Expo Guadalajara": [20.6525, -103.4025],
};

export interface RealMapProps {
  progress?: number;
  showRoute?: boolean;
  showCar?: boolean;
  originLabel?: string;
  destLabel?: string;
  destination?: string;
  userLocation?: { lat: number; lng: number } | null;
  className?: string;
  interactive?: boolean;
  showDriverApproach?: boolean;
  driverEta?: number;
}

const MapInner = dynamic(() => Promise.resolve(MapComponent), { ssr: false });

export default function RealMap(props: RealMapProps) {
  return <MapInner {...props} />;
}

// Fetch real route from OSRM (free, no API key needed)
async function fetchRoute(origin: [number, number], dest: [number, number]): Promise<[number, number][]> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes?.[0]?.geometry?.coordinates) {
      // OSRM returns [lng, lat], we need [lat, lng]
      return data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
    }
  } catch {}
  // Fallback: straight line
  return [origin, dest];
}

function MapComponent({
  progress = 0,
  showRoute = true,
  showCar = true,
  originLabel = "Tu ubicación",
  destLabel = "Destino",
  destination,
  userLocation,
  className = "",
  interactive = false,
  showDriverApproach = false,
  driverEta,
}: RealMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const carMarker = useRef<any>(null);
  const routeLineRef = useRef<any>(null);
  const originMarkerRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);
  const routePoints = useRef<[number, number][]>([]);
  const [loaded, setLoaded] = useState(false);
  const LRef = useRef<any>(null);

  const originCoord: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : GDL_CENTER;

  const destCoord: [number, number] = destination && DEST_COORDS[destination]
    ? DEST_COORDS[destination]
    : [20.6237, -103.4014]; // Default: Plaza del Sol

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then((L) => {
      if (!mapRef.current) return;
      LRef.current = L;

      const map = L.map(mapRef.current, {
        center: originCoord,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        dragging: interactive,
        scrollWheelZoom: interactive,
        touchZoom: interactive,
        doubleClickZoom: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Origin marker (user location)
      const originIcon = L.divIcon({
        html: `<div style="position:relative">
          <div style="width:16px;height:16px;border-radius:50%;background:#10b981;border:3px solid white;box-shadow:0 0 10px rgba(16,185,129,0.5)"></div>
          <div style="position:absolute;top:-1px;left:-1px;width:18px;height:18px;border-radius:50%;border:2px solid rgba(16,185,129,0.3);animation:pulse 2s infinite"></div>
        </div>`,
        className: "",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      originMarkerRef.current = L.marker(originCoord, { icon: originIcon }).addTo(map);

      mapInstance.current = map;
      setLoaded(true);
      setTimeout(() => map.invalidateSize(), 150);
    });

    return () => {
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }
    };
  }, []);

  // Load route when destination changes
  useEffect(() => {
    if (!loaded || !LRef.current || !mapInstance.current || !showRoute || !destination) return;

    const L = LRef.current;
    const map = mapInstance.current;

    // Remove old route/markers
    if (routeLineRef.current) { map.removeLayer(routeLineRef.current); routeLineRef.current = null; }
    if (destMarkerRef.current) { map.removeLayer(destMarkerRef.current); destMarkerRef.current = null; }
    if (carMarker.current) { map.removeLayer(carMarker.current); carMarker.current = null; }

    // Update origin position
    if (originMarkerRef.current) originMarkerRef.current.setLatLng(originCoord);

    // Destination marker
    const destIcon = L.divIcon({
      html: `<div style="position:relative;display:flex;flex-direction:column;align-items:center">
        <div style="width:12px;height:12px;border-radius:50%;background:#ef4444;border:2px solid white;box-shadow:0 0 8px rgba(239,68,68,0.5)"></div>
        <div style="width:2px;height:6px;background:#ef4444;margin-top:-1px"></div>
      </div>`,
      className: "",
      iconSize: [12, 18],
      iconAnchor: [6, 18],
    });
    destMarkerRef.current = L.marker(destCoord, { icon: destIcon }).addTo(map);

    // Fetch real route
    fetchRoute(originCoord, destCoord).then((pts) => {
      routePoints.current = pts;

      // Draw route
      routeLineRef.current = L.polyline(pts, {
        color: "#10b981",
        weight: 5,
        opacity: 0.9,
      }).addTo(map);

      // Fit map to show full route
      const bounds = L.latLngBounds([originCoord, destCoord]);
      map.fitBounds(bounds, { padding: [40, 40] });

      // Car marker
      if (showCar) {
        const carIcon = L.divIcon({
          html: `<div style="width:28px;height:28px;border-radius:50%;background:#10b981;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
          </div>`,
          className: "",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        carMarker.current = L.marker(pts[0], { icon: carIcon, zIndexOffset: 1000 }).addTo(map);
      }
    });
  }, [loaded, destination, userLocation?.lat, userLocation?.lng]);

  // Move car along route
  useEffect(() => {
    if (!carMarker.current || routePoints.current.length < 2) return;
    const pts = routePoints.current;
    const idx = Math.min(Math.floor(progress * (pts.length - 1)), pts.length - 2);
    const t = (progress * (pts.length - 1)) - idx;
    const lat = pts[idx][0] + (pts[idx + 1][0] - pts[idx][0]) * t;
    const lng = pts[idx][1] + (pts[idx + 1][1] - pts[idx][1]) * t;
    carMarker.current.setLatLng([lat, lng]);
  }, [progress]);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: 180, background: "#1a1a2e" }} />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a2e]">
          <div className="h-5 w-5 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {/* Driver ETA badge */}
      {showDriverApproach && driverEta && (
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-2 z-[400]">
          <div className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-xs text-white font-semibold">{driverEta} min</span>
        </div>
      )}
      <style>{`
        .map-tooltip { background: rgba(0,0,0,0.85); color: white; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 4px 10px; font-size: 12px; font-family: system-ui; }
        .leaflet-container { background: #1a1a2e !important; }
        @keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.8); opacity: 0; } }
      `}</style>
    </div>
  );
}
