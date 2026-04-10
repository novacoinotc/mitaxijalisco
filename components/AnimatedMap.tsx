"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export interface AnimatedMapProps {
  progress: number; // 0-1, how far along the route
  showRoute?: boolean;
  showCar?: boolean;
  sosActive?: boolean;
  className?: string;
}

// Guadalajara route path — curves through Chapultepec, Vallarta, roundabout, López Mateos
const ROUTE_PATH =
  "M 80 320 C 100 310, 130 305, 160 290 C 190 275, 210 255, 240 240 C 260 230, 285 228, 310 220 C 335 212, 355 205, 375 195 C 400 183, 420 170, 445 155 C 465 143, 490 138, 510 128 C 530 118, 555 112, 580 108";

function getPathPointAtProgress(
  svgRef: SVGPathElement | null,
  t: number
): { x: number; y: number; angle: number } {
  if (!svgRef) return { x: 80, y: 320, angle: -30 };
  const totalLen = svgRef.getTotalLength();
  const pt = svgRef.getPointAtLength(t * totalLen);
  const eps = Math.min(2, totalLen * 0.01);
  const pt2 = svgRef.getPointAtLength(Math.min(t * totalLen + eps, totalLen));
  const angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI);
  return { x: pt.x, y: pt.y, angle };
}

const TRAFFIC = [
  { id: "t1", path: "M 120 180 L 320 155", duration: 7, delay: 0 },
  { id: "t2", path: "M 200 380 L 480 340", duration: 9, delay: 2 },
  { id: "t3", path: "M 340 420 L 560 390", duration: 11, delay: 4 },
  { id: "t4", path: "M 450 200 L 590 250", duration: 8, delay: 1 },
];

function TrafficDot({
  path,
  duration,
  delay,
}: {
  path: string;
  duration: number;
  delay: number;
}) {
  const dotRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const loop = (ts: number) => {
      if (!start) start = ts - delay * 1000;
      const elapsed = (ts - start) / 1000;
      const t = (elapsed % duration) / duration;
      const pathEl = pathRef.current;
      const dotEl = dotRef.current;
      if (pathEl && dotEl) {
        const len = pathEl.getTotalLength();
        const pt = pathEl.getPointAtLength(t * len);
        dotEl.setAttribute("cx", String(pt.x));
        dotEl.setAttribute("cy", String(pt.y));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [duration, delay]);

  return (
    <>
      <path ref={pathRef} d={path} fill="none" stroke="none" />
      <circle ref={dotRef} cx={0} cy={0} r={2.5} fill="#9ca3af" opacity={0.5} />
    </>
  );
}

export default function AnimatedMap({
  progress,
  showRoute = true,
  showCar = true,
  sosActive = false,
  className = "",
}: AnimatedMapProps) {
  const routePathRef = useRef<SVGPathElement>(null);
  const [routeLength, setRouteLength] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (routePathRef.current) {
      setRouteLength(routePathRef.current.getTotalLength());
    }
    setMounted(true);
  }, []);

  const carState =
    mounted && routePathRef.current
      ? getPathPointAtProgress(routePathRef.current, progress)
      : { x: 80, y: 320, angle: -30 };

  const dashOffset = routeLength > 0 ? routeLength * (1 - progress) : routeLength;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{ background: "#111111" }}
    >
      <svg
        viewBox="0 0 660 480"
        width="100%"
        height="100%"
        style={{ display: "block" }}
      >
        <defs>
          <clipPath id="map-clip">
            <rect x="0" y="0" width="660" height="480" />
          </clipPath>
        </defs>

        <g clipPath="url(#map-clip)">
          {/* ── Background ── */}
          <rect x="0" y="0" width="660" height="480" fill="#1a1a1a" />

          {/* ── City blocks ── */}
          <rect x="60" y="60" width="90" height="70" rx="2" fill="#222222" />
          <rect x="170" y="60" width="110" height="70" rx="2" fill="#222222" />
          <rect x="300" y="60" width="80" height="65" rx="2" fill="#222222" />
          <rect x="400" y="60" width="100" height="65" rx="2" fill="#222222" />
          <rect x="520" y="60" width="110" height="65" rx="2" fill="#222222" />

          <rect x="60" y="155" width="90" height="80" rx="2" fill="#222222" />
          <rect x="170" y="155" width="75" height="80" rx="2" fill="#222222" />
          <rect x="265" y="155" width="65" height="80" rx="2" fill="#222222" />
          <rect x="350" y="145" width="80" height="90" rx="2" fill="#222222" />
          <rect x="450" y="145" width="85" height="90" rx="2" fill="#222222" />
          <rect x="555" y="145" width="85" height="90" rx="2" fill="#222222" />

          <rect x="60" y="265" width="90" height="90" rx="2" fill="#222222" />
          <rect x="175" y="265" width="95" height="90" rx="2" fill="#222222" />
          <rect x="290" y="265" width="100" height="90" rx="2" fill="#222222" />
          <rect x="410" y="265" width="90" height="90" rx="2" fill="#222222" />
          <rect x="520" y="265" width="120" height="90" rx="2" fill="#222222" />

          <rect x="60" y="375" width="130" height="80" rx="2" fill="#222222" />
          <rect x="210" y="375" width="110" height="80" rx="2" fill="#222222" />
          <rect x="340" y="375" width="120" height="80" rx="2" fill="#222222" />
          <rect x="480" y="375" width="160" height="80" rx="2" fill="#222222" />

          {/* ── Parks ── */}
          <ellipse cx="220" cy="195" rx="30" ry="22" fill="#1e2d1e" stroke="#2a3d2a" strokeWidth="1" />
          <ellipse cx="540" cy="100" rx="38" ry="28" fill="#1e2d1e" stroke="#2a3d2a" strokeWidth="1" />
          <rect x="370" y="295" rx="6" ry="6" width="30" height="30" fill="#1e2d1e" stroke="#2a3d2a" strokeWidth="1" />

          {/* ── Major avenues ── */}
          {/* Av. Chapultepec (horizontal) */}
          <line x1="0" y1="135" x2="660" y2="135" stroke="#2a2a2a" strokeWidth="14" />
          <line x1="0" y1="135" x2="660" y2="135" stroke="#303030" strokeWidth="7" />
          {/* Av. Vallarta */}
          <line x1="0" y1="245" x2="660" y2="245" stroke="#2a2a2a" strokeWidth="14" />
          <line x1="0" y1="245" x2="660" y2="245" stroke="#303030" strokeWidth="7" />
          {/* Av. López Mateos */}
          <line x1="0" y1="360" x2="660" y2="360" stroke="#2a2a2a" strokeWidth="16" />
          <line x1="0" y1="360" x2="660" y2="360" stroke="#333333" strokeWidth="9" />

          {/* Diagonal – Av. Patria */}
          <line x1="0" y1="420" x2="450" y2="60" stroke="#2a2a2a" strokeWidth="12" />
          <line x1="0" y1="420" x2="450" y2="60" stroke="#303030" strokeWidth="6" />

          {/* Vertical avenues */}
          {/* Av. Chapultepec (vertical) */}
          <line x1="160" y1="0" x2="160" y2="480" stroke="#2a2a2a" strokeWidth="14" />
          <line x1="160" y1="0" x2="160" y2="480" stroke="#303030" strokeWidth="7" />
          {/* Av. Americas */}
          <line x1="310" y1="0" x2="310" y2="480" stroke="#2a2a2a" strokeWidth="12" />
          <line x1="310" y1="0" x2="310" y2="480" stroke="#2e2e2e" strokeWidth="6" />
          {/* Av. Federalismo */}
          <line x1="450" y1="0" x2="450" y2="480" stroke="#2a2a2a" strokeWidth="12" />
          <line x1="450" y1="0" x2="450" y2="480" stroke="#2e2e2e" strokeWidth="6" />

          {/* Secondary streets */}
          <line x1="0" y1="80" x2="660" y2="80" stroke="#252525" strokeWidth="5" />
          <line x1="0" y1="190" x2="660" y2="190" stroke="#252525" strokeWidth="4" />
          <line x1="0" y1="305" x2="660" y2="305" stroke="#252525" strokeWidth="4" />
          <line x1="0" y1="420" x2="660" y2="420" stroke="#252525" strokeWidth="5" />

          <line x1="80" y1="0" x2="80" y2="480" stroke="#252525" strokeWidth="4" />
          <line x1="230" y1="0" x2="230" y2="480" stroke="#252525" strokeWidth="4" />
          <line x1="380" y1="0" x2="380" y2="480" stroke="#252525" strokeWidth="4" />
          <line x1="530" y1="0" x2="530" y2="480" stroke="#252525" strokeWidth="4" />
          <line x1="610" y1="0" x2="610" y2="480" stroke="#252525" strokeWidth="3" />

          {/* ── Roundabouts ── */}
          <circle cx="160" cy="245" r="22" fill="none" stroke="#2a2a2a" strokeWidth="12" />
          <circle cx="160" cy="245" r="12" fill="#1a1a1a" stroke="#303030" strokeWidth="1.5" />
          <circle cx="160" cy="245" r="5" fill="#252525" />

          <circle cx="310" cy="135" r="18" fill="none" stroke="#2a2a2a" strokeWidth="10" />
          <circle cx="310" cy="135" r="9" fill="#1a1a1a" stroke="#2e2e2e" strokeWidth="1.5" />

          <circle cx="450" cy="245" r="14" fill="none" stroke="#2a2a2a" strokeWidth="8" />
          <circle cx="450" cy="245" r="6" fill="#1a1a1a" />

          {/* ── Street name labels ── */}
          <text x="52" y="130" fill="#555555" fontSize="7.5" fontFamily="system-ui, sans-serif" fontWeight="500" letterSpacing="0.8">AV. CHAPULTEPEC</text>
          <text x="52" y="240" fill="#555555" fontSize="7.5" fontFamily="system-ui, sans-serif" fontWeight="500" letterSpacing="0.8">AV. VALLARTA</text>
          <text x="52" y="355" fill="#555555" fontSize="7.5" fontFamily="system-ui, sans-serif" fontWeight="500" letterSpacing="0.8">AV. LÓPEZ MATEOS</text>
          <text
            x="155" y="75"
            fill="#555555" fontSize="7" fontFamily="system-ui, sans-serif" fontWeight="500"
            letterSpacing="0.6" transform="rotate(-90 155 75)"
            textAnchor="middle"
          >
            CHAPULTEPEC
          </text>
          <text
            x="305" y="75"
            fill="#555555" fontSize="7" fontFamily="system-ui, sans-serif" fontWeight="500"
            letterSpacing="0.6" transform="rotate(-90 305 75)"
            textAnchor="middle"
          >
            LAS AMÉRICAS
          </text>
          <text
            x="210" y="375"
            fill="#555555" fontSize="7" fontFamily="system-ui, sans-serif" fontWeight="500"
            letterSpacing="0.6" transform="rotate(-45 210 375)"
          >
            AV. PATRIA
          </text>

          {/* ── Traffic dots ── */}
          {TRAFFIC.map((t) => (
            <TrafficDot key={t.id} path={t.path} duration={t.duration} delay={t.delay} />
          ))}

          {/* Hidden path for measurement */}
          <path ref={routePathRef} d={ROUTE_PATH} fill="none" stroke="none" />

          {/* ── Route base (dashed, full path) ── */}
          {showRoute && (
            <path
              d={ROUTE_PATH}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeOpacity="0.2"
              strokeLinecap="round"
              strokeDasharray="5 5"
            />
          )}

          {/* ── Animated route draw ── */}
          {showRoute && mounted && routeLength > 0 && (
            <motion.path
              d={ROUTE_PATH}
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={routeLength}
              initial={{ strokeDashoffset: routeLength }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}

          {/* ── Origin marker ── */}
          <circle cx="80" cy="320" r="10" fill="#10b981" fillOpacity="0.15" />
          <circle cx="80" cy="320" r="6" fill="#10b981" />
          <circle cx="80" cy="320" r="2.5" fill="white" />
          <text x="93" y="316" fill="#e5e5e5" fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="600">ORIGEN</text>
          <text x="93" y="327" fill="#888888" fontSize="7.5" fontFamily="system-ui, sans-serif">Chapultepec 450</text>

          {/* ── Destination marker (pin) ── */}
          <path
            d="M580 93 C574 93 569 98 569 105 C569 113 580 123 580 123 C580 123 591 113 591 105 C591 98 586 93 580 93 Z"
            fill="#10b981"
          />
          <circle cx="580" cy="104" r="3.5" fill="white" />
          <text x="594" y="100" fill="#e5e5e5" fontSize="8.5" fontFamily="system-ui, sans-serif" fontWeight="600">DESTINO</text>
          <text x="594" y="111" fill="#888888" fontSize="7.5" fontFamily="system-ui, sans-serif">Av. Patria 1200</text>

          {/* ── Car ── */}
          {showCar && mounted && (
            <motion.g
              style={{
                translateX: carState.x,
                translateY: carState.y,
                rotate: carState.angle + 90,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              {/* Accuracy circle */}
              <circle
                cx="0"
                cy="0"
                r="18"
                fill={sosActive ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)"}
                stroke={sosActive ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}
                strokeWidth="1"
              />

              {/* Car dot base */}
              <circle
                cx="0"
                cy="0"
                r="11"
                fill={sosActive ? "#ef4444" : "#10b981"}
              />

              {/* White car silhouette (top-down) */}
              <g>
                {/* Body */}
                <path
                  d="M0 -8 C-3.5 -8 -5.5 -6 -6 -3.5 L-6.5 1 L-7 6 C-7 7.5 -5.5 8.5 -3.5 8.5 L3.5 8.5 C5.5 8.5 7 7.5 7 6 L6.5 1 L6 -3.5 C5.5 -6 3.5 -8 0 -8 Z"
                  fill="white"
                  opacity="0.95"
                />
                {/* Windshield */}
                <path
                  d="M-4 -7 C-3 -5.5, 3 -5.5, 4 -7 L4.5 -4 C3 -3, -3 -3, -4.5 -4 Z"
                  fill={sosActive ? "#ef4444" : "#10b981"}
                  opacity="0.9"
                />
                {/* Rear window */}
                <path
                  d="M-3.5 4 C-2.5 2.5, 2.5 2.5, 3.5 4 L3 7 C2.5 8, -2.5 8, -3 7 Z"
                  fill={sosActive ? "#ef4444" : "#10b981"}
                  opacity="0.7"
                />
              </g>
            </motion.g>
          )}
        </g>
      </svg>

      {/* ── Glass ETA overlay ── */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          right: 14,
          background: "rgba(30, 30, 30, 0.85)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          padding: "10px 14px",
          minWidth: 120,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10b981",
                display: "inline-block",
              }}
            />
            <span
              style={{
                color: "#10b981",
                fontSize: 9,
                fontFamily: "system-ui, sans-serif",
                letterSpacing: "1px",
                fontWeight: 600,
              }}
            >
              EN CAMINO
            </span>
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: 22,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {Math.max(1, Math.round((1 - progress) * 8))}{" "}
            <span style={{ fontSize: 11, color: "#888888", fontWeight: 400 }}>min</span>
          </div>
          <div
            style={{
              color: "#666666",
              fontSize: 10,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {(progress * 4.2).toFixed(1)} km recorridos
          </div>
        </div>
      </div>

      {/* ── SOS overlay ── */}
      {sosActive && (
        <motion.div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "rgba(239, 68, 68, 0.12)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            borderRadius: "8px",
            padding: "7px 12px",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#ef4444",
              display: "inline-block",
            }}
          />
          <span
            style={{
              color: "#fca5a5",
              fontSize: 11,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 700,
              letterSpacing: "1.5px",
            }}
          >
            SOS ACTIVO
          </span>
        </motion.div>
      )}

      {/* ── Progress dots ── */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
        }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: i < Math.round(progress * 5) ? "#10b981" : "#333333",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
