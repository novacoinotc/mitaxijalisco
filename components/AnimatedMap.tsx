"use client";
import { useEffect, useRef, memo, useCallback } from "react";

export interface AnimatedMapProps {
  progress: number;
  showRoute?: boolean;
  showCar?: boolean;
  sosActive?: boolean;
  className?: string;
}

// Ruta realista: sigue Av. Chapultepec norte → gira por Av. Vallarta → sube por Américas → llega por López Mateos
const ROUTE =
  "M 95 340 L 95 280 Q 95 260 115 255 L 250 230 Q 270 225 280 210 L 310 160 Q 320 140 340 135 L 480 115 Q 500 110 510 95 L 540 55";

// Calles de GDL
const STREETS = {
  // Horizontales
  vallarta: "M 0 230 L 660 230",
  lopezMateos: "M 0 340 L 660 340",
  hidalgo: "M 0 135 L 660 135",
  // Verticales
  chapultepec: "M 95 0 L 95 420",
  americas: "M 280 0 L 280 420",
  federalismo: "M 430 0 L 430 420",
  patria: "M 560 0 L 560 420",
  // Secundarias
  s1: "M 0 55 L 660 55",
  s2: "M 0 380 L 660 380",
  s3: "M 190 0 L 190 420",
  s4: "M 350 0 L 350 420",
};

function getPointOnPath(path: SVGPathElement, t: number) {
  const len = path.getTotalLength();
  const pt = path.getPointAtLength(t * len);
  const eps = 2;
  const pt2 = path.getPointAtLength(Math.min(t * len + eps, len));
  const angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI);
  return { x: pt.x, y: pt.y, angle };
}

// Static map background — rendered once, never re-renders
const MapBackground = memo(function MapBackground() {
  return (
    <g>
      {/* Background — like Google Maps dark mode */}
      <rect width="660" height="420" fill="#242f3e" />

      {/* City blocks */}
      {[
        [10, 65, 75, 60], [100, 65, 80, 60], [200, 65, 70, 60], [290, 65, 50, 60], [360, 65, 60, 60],
        [440, 65, 110, 60], [570, 65, 80, 60],
        [10, 145, 75, 75], [100, 145, 80, 75], [200, 145, 70, 75], [290, 145, 50, 75], [360, 145, 60, 75],
        [440, 145, 110, 75], [570, 145, 80, 75],
        [10, 245, 75, 85], [100, 245, 80, 85], [200, 245, 70, 85], [290, 245, 50, 85], [360, 245, 60, 85],
        [440, 245, 110, 85], [570, 245, 80, 85],
        [10, 345, 75, 30], [100, 345, 80, 30], [200, 345, 70, 30], [290, 345, 50, 30], [360, 345, 60, 30],
        [440, 345, 110, 30], [570, 345, 80, 30],
        [10, 385, 75, 30], [100, 385, 80, 30], [200, 385, 70, 30], [290, 385, 50, 30],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx={2} fill="#1d2a3a" />
      ))}

      {/* Major avenues */}
      <line {...pts(STREETS.lopezMateos)} stroke="#3e5168" strokeWidth="12" />
      <line {...pts(STREETS.lopezMateos)} stroke="#4a6380" strokeWidth="6" />
      <line {...pts(STREETS.vallarta)} stroke="#3e5168" strokeWidth="10" />
      <line {...pts(STREETS.vallarta)} stroke="#4a6380" strokeWidth="5" />
      <line {...pts(STREETS.hidalgo)} stroke="#364d63" strokeWidth="8" />
      <line {...pts(STREETS.hidalgo)} stroke="#4a6380" strokeWidth="4" />
      <line {...pts(STREETS.chapultepec)} stroke="#3e5168" strokeWidth="10" />
      <line {...pts(STREETS.chapultepec)} stroke="#4a6380" strokeWidth="5" />
      <line {...pts(STREETS.americas)} stroke="#364d63" strokeWidth="8" />
      <line {...pts(STREETS.americas)} stroke="#4a6380" strokeWidth="4" />
      <line {...pts(STREETS.federalismo)} stroke="#364d63" strokeWidth="8" />
      <line {...pts(STREETS.federalismo)} stroke="#4a6380" strokeWidth="4" />
      <line {...pts(STREETS.patria)} stroke="#364d63" strokeWidth="6" />
      <line {...pts(STREETS.patria)} stroke="#4a6380" strokeWidth="3" />

      {/* Secondary streets */}
      <line {...pts(STREETS.s1)} stroke="#344b60" strokeWidth="4" />
      <line {...pts(STREETS.s2)} stroke="#344b60" strokeWidth="4" />
      <line {...pts(STREETS.s3)} stroke="#344b60" strokeWidth="4" />
      <line {...pts(STREETS.s4)} stroke="#344b60" strokeWidth="4" />

      {/* Roundabouts */}
      <circle cx="95" cy="230" r="14" fill="none" stroke="#3e5168" strokeWidth="6" />
      <circle cx="95" cy="230" r="6" fill="#2a3d50" />
      <circle cx="280" cy="135" r="10" fill="none" stroke="#364d63" strokeWidth="5" />
      <circle cx="280" cy="135" r="4" fill="#2a3d50" />

      {/* Parks */}
      <ellipse cx="180" cy="185" rx="22" ry="16" fill="#263d2e" stroke="#3a5e44" strokeWidth="0.5" />
      <ellipse cx="500" cy="80" rx="28" ry="18" fill="#263d2e" stroke="#3a5e44" strokeWidth="0.5" />

      {/* Street labels */}
      <text x="10" y="227" fill="#8a9bb0" fontSize="7" fontFamily="system-ui">Av. Vallarta</text>
      <text x="10" y="337" fill="#8a9bb0" fontSize="7" fontFamily="system-ui">Av. López Mateos</text>
      <text x="10" y="132" fill="#8a9bb0" fontSize="7" fontFamily="system-ui">Av. Hidalgo</text>
      <text x="98" y="415" fill="#8a9bb0" fontSize="6.5" fontFamily="system-ui">Chapultepec</text>
      <text x="283" y="415" fill="#8a9bb0" fontSize="6.5" fontFamily="system-ui">Américas</text>
      <text x="433" y="415" fill="#8a9bb0" fontSize="6.5" fontFamily="system-ui">Federalismo</text>
    </g>
  );
});

// Parse "M x y L x2 y2" etc for line props
function pts(d: string) {
  const m = d.match(/M\s*([\d.]+)\s+([\d.]+)\s+L\s*([\d.]+)\s+([\d.]+)/);
  if (!m) return {};
  return { x1: +m[1], y1: +m[2], x2: +m[3], y2: +m[4] };
}

export default function AnimatedMap({
  progress,
  showRoute = true,
  showCar = true,
  sosActive = false,
  className = "",
}: AnimatedMapProps) {
  const routeRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const routeDrawRef = useRef<SVGPathElement>(null);
  const routeLenRef = useRef(0);

  // Measure route length once
  useEffect(() => {
    if (routeRef.current) {
      routeLenRef.current = routeRef.current.getTotalLength();
      // Initialize route draw
      if (routeDrawRef.current) {
        routeDrawRef.current.style.strokeDasharray = `${routeLenRef.current}`;
        routeDrawRef.current.style.strokeDashoffset = `${routeLenRef.current}`;
      }
    }
  }, []);

  // Update car + route via refs — NO React re-render
  useEffect(() => {
    if (!routeRef.current || !routeLenRef.current) return;

    // Update route draw
    if (routeDrawRef.current) {
      const offset = routeLenRef.current * (1 - progress);
      routeDrawRef.current.style.strokeDashoffset = `${offset}`;
    }

    // Update car position
    if (carRef.current) {
      const { x, y, angle } = getPointOnPath(routeRef.current, progress);
      carRef.current.setAttribute("transform", `translate(${x},${y}) rotate(${angle + 90})`);
    }
  }, [progress]);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} style={{ background: "#242f3e" }}>
      <svg viewBox="0 0 660 420" className="block w-full h-full">
        <MapBackground />

        {/* Hidden path for measurement */}
        <path ref={routeRef} d={ROUTE} fill="none" stroke="none" />

        {/* Route shadow */}
        {showRoute && <path d={ROUTE} fill="none" stroke="#10b981" strokeWidth="8" strokeOpacity="0.08" strokeLinecap="round" />}

        {/* Route dashed base */}
        {showRoute && <path d={ROUTE} fill="none" stroke="#10b981" strokeWidth="2" strokeOpacity="0.2" strokeLinecap="round" strokeDasharray="6 4" />}

        {/* Route drawn line — animated via ref */}
        {showRoute && (
          <path
            ref={routeDrawRef}
            d={ROUTE}
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
          />
        )}

        {/* Origin */}
        <circle cx="95" cy="340" r="8" fill="#10b981" fillOpacity="0.15" />
        <circle cx="95" cy="340" r="4.5" fill="#10b981" />
        <circle cx="95" cy="340" r="2" fill="white" />
        <text x="108" y="337" fill="#b0bec5" fontSize="7.5" fontFamily="system-ui" fontWeight="600">Origen</text>
        <text x="108" y="347" fill="#8a9bb0" fontSize="6.5" fontFamily="system-ui">Chapultepec 450</text>

        {/* Destination */}
        <path d="M540,45 C535,45 531,48.5 531,53 C531,58.5 540,66 540,66 C540,66 549,58.5 549,53 C549,48.5 545,45 540,45 Z" fill="#10b981" />
        <circle cx="540" cy="52.5" r="2.5" fill="white" />
        <text x="552" y="52" fill="#b0bec5" fontSize="7.5" fontFamily="system-ui" fontWeight="600">Destino</text>
        <text x="552" y="62" fill="#8a9bb0" fontSize="6.5" fontFamily="system-ui">Av. Patria 1200</text>

        {/* Car — positioned via ref, no React state */}
        {showCar && (
          <g ref={carRef}>
            <circle r="8" fill={sosActive ? "#ef4444" : "#10b981"} opacity="0.2" />
            <circle r="5" fill={sosActive ? "#ef4444" : "#10b981"} />
            {/* Mini car shape */}
            <rect x="-3.5" y="-5" width="7" height="10" rx="2" fill="white" opacity="0.9" />
            <rect x="-2.5" y="-6.5" width="5" height="3" rx="1" fill="white" opacity="0.6" />
          </g>
        )}

        {/* Ambient traffic — simple CSS-animated circles */}
        <circle r="2" fill="#8a9bb0" opacity="0.4">
          <animateMotion dur="9s" repeatCount="indefinite" path="M 150 230 L 550 230" />
        </circle>
        <circle r="2" fill="#8a9bb0" opacity="0.3">
          <animateMotion dur="11s" repeatCount="indefinite" path="M 600 340 L 50 340" />
        </circle>
        <circle r="1.5" fill="#8a9bb0" opacity="0.3">
          <animateMotion dur="13s" repeatCount="indefinite" path="M 280 400 L 280 20" />
        </circle>
        <circle r="1.5" fill="#8a9bb0" opacity="0.25">
          <animateMotion dur="10s" repeatCount="indefinite" path="M 430 30 L 430 400" />
        </circle>
      </svg>

      {/* ETA overlay */}
      <div className="absolute bottom-2 right-2 rounded-lg px-3 py-2 text-[11px]" style={{ background: "rgba(36,47,62,0.9)", border: "1px solid rgba(255,255,255,0.15)" }}>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
          <span className="text-white/60 font-medium" style={{ fontSize: 11 }}>EN CAMINO</span>
        </div>
        <div className="text-white font-bold text-base leading-tight">{Math.max(1, Math.round((1 - progress) * 8))} min</div>
        <div className="text-white/40" style={{ fontSize: 11 }}>{(progress * 4.2).toFixed(1)} km</div>
      </div>
    </div>
  );
}
