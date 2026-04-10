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

// Helper: get point and angle at t along a cubic bezier path (approximated via SVG)
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

// Traffic dots config: path segments they move on
const TRAFFIC = [
  {
    id: "t1",
    path: "M 120 180 L 320 155",
    color: "#10b981",
    duration: 7,
    delay: 0,
  },
  {
    id: "t2",
    path: "M 200 380 L 480 340",
    color: "#6ee7b7",
    duration: 9,
    delay: 2,
  },
  {
    id: "t3",
    path: "M 340 420 L 560 390",
    color: "#10b981",
    duration: 11,
    delay: 4,
  },
  {
    id: "t4",
    path: "M 450 200 L 590 250",
    color: "#34d399",
    duration: 8,
    delay: 1,
  },
];

function TrafficDot({
  path,
  color,
  duration,
  delay,
}: {
  path: string;
  color: string;
  duration: number;
  delay: number;
}) {
  // Use refs for both the dot and guide path so RAF writes directly to the DOM
  // without triggering React re-renders on every animation frame (rerender-use-ref-transient-values).
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
        // Mutate SVG attributes directly — no setState, no re-render
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
      {/* Initial cx/cy are 0; RAF overwrites them imperatively each frame */}
      <circle
        ref={dotRef}
        cx={0}
        cy={0}
        r={3}
        fill={color}
        opacity={0.7}
        filter="url(#glow-sm)"
      />
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
  // routeLength requires a DOM measurement — kept in state so the component
  // re-renders once after mount to reveal the animated route. (rerender-derived-state-no-effect:
  // we can't compute getTotalLength() during SSR, so a single effect is necessary here.)
  const [routeLength, setRouteLength] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Single effect: measure path length after first paint and mark as mounted.
  useEffect(() => {
    if (routePathRef.current) {
      setRouteLength(routePathRef.current.getTotalLength());
    }
    setMounted(true);
  }, []);

  // Derive carState directly from props + routeLength during render — no extra
  // effect needed (rerender-derived-state-no-effect).
  const carState =
    mounted && routePathRef.current
      ? getPathPointAtProgress(routePathRef.current, progress)
      : { x: 80, y: 320, angle: -30 };

  // Stroke dash for route draw animation
  const dashOffset = routeLength > 0 ? routeLength * (1 - progress) : routeLength;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: "#050a0e",
        perspective: "900px",
      }}
    >
      {/* 3D perspective tilt wrapper */}
      <div
        style={{
          transform: "rotateX(12deg) scale(1.04)",
          transformOrigin: "center 60%",
          transformStyle: "preserve-3d",
        }}
      >
        <svg
          viewBox="0 0 660 480"
          width="100%"
          height="100%"
          style={{ display: "block" }}
        >
          <defs>
            {/* Green glow filter */}
            <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-sm" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-marker" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="car-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation={sosActive ? "8" : "5"} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Route gradient */}
            <linearGradient id="route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
            </linearGradient>
            {/* Radial for parks */}
            <radialGradient id="park-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#052e1a" />
              <stop offset="100%" stopColor="#021a0e" />
            </radialGradient>
            {/* SOS red gradient */}
            <radialGradient id="sos-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            {/* Clip for map bounds */}
            <clipPath id="map-clip">
              <rect x="0" y="0" width="660" height="480" />
            </clipPath>
          </defs>

          <g clipPath="url(#map-clip)">
            {/* ── Background ── */}
            <rect x="0" y="0" width="660" height="480" fill="#060d12" />

            {/* City block fills */}
            <rect x="60" y="60" width="90" height="70" rx="3" fill="#0a1520" />
            <rect x="170" y="60" width="110" height="70" rx="3" fill="#0a1520" />
            <rect x="300" y="60" width="80" height="65" rx="3" fill="#0a1520" />
            <rect x="400" y="60" width="100" height="65" rx="3" fill="#0a1520" />
            <rect x="520" y="60" width="110" height="65" rx="3" fill="#0a1520" />

            <rect x="60" y="155" width="90" height="80" rx="3" fill="#0a1520" />
            <rect x="170" y="155" width="75" height="80" rx="3" fill="#0a1520" />
            <rect x="265" y="155" width="65" height="80" rx="3" fill="#0a1520" />
            <rect x="350" y="145" width="80" height="90" rx="3" fill="#0a1520" />
            <rect x="450" y="145" width="85" height="90" rx="3" fill="#0a1520" />
            <rect x="555" y="145" width="85" height="90" rx="3" fill="#0a1520" />

            <rect x="60" y="265" width="90" height="90" rx="3" fill="#0a1520" />
            <rect x="175" y="265" width="95" height="90" rx="3" fill="#0a1520" />
            <rect x="290" y="265" width="100" height="90" rx="3" fill="#0a1520" />
            <rect x="410" y="265" width="90" height="90" rx="3" fill="#0a1520" />
            <rect x="520" y="265" width="120" height="90" rx="3" fill="#0a1520" />

            <rect x="60" y="375" width="130" height="80" rx="3" fill="#0a1520" />
            <rect x="210" y="375" width="110" height="80" rx="3" fill="#0a1520" />
            <rect x="340" y="375" width="120" height="80" rx="3" fill="#0a1520" />
            <rect x="480" y="375" width="160" height="80" rx="3" fill="#0a1520" />

            {/* ── Parks / Green areas ── */}
            {/* Parque Revolución */}
            <ellipse cx="220" cy="195" rx="30" ry="22" fill="url(#park-grad)" stroke="#0d3320" strokeWidth="1" />
            <ellipse cx="220" cy="195" rx="22" ry="15" fill="#062214" />
            {/* Bosque Los Colomos (top right) */}
            <ellipse cx="540" cy="100" rx="38" ry="28" fill="url(#park-grad)" stroke="#0d3320" strokeWidth="1" />
            <ellipse cx="540" cy="100" rx="28" ry="19" fill="#062214" />
            {/* Small plaza */}
            <rect x="370" y="295" rx="8" ry="8" width="30" height="30" fill="url(#park-grad)" stroke="#0d3320" strokeWidth="1" />

            {/* ── Street grid — major avenues ── */}
            {/* Horizontal avenues */}
            <line x1="0" y1="135" x2="660" y2="135" stroke="#0e2030" strokeWidth="14" />
            <line x1="0" y1="135" x2="660" y2="135" stroke="#122535" strokeWidth="8" />
            {/* Av. Vallarta */}
            <line x1="0" y1="245" x2="660" y2="245" stroke="#0e2030" strokeWidth="14" />
            <line x1="0" y1="245" x2="660" y2="245" stroke="#122535" strokeWidth="8" />
            {/* Av. López Mateos */}
            <line x1="0" y1="360" x2="660" y2="360" stroke="#0e2030" strokeWidth="16" />
            <line x1="0" y1="360" x2="660" y2="360" stroke="#13263a" strokeWidth="10" />

            {/* Diagonal – Av. Patria */}
            <line x1="0" y1="420" x2="450" y2="60" stroke="#0e2030" strokeWidth="12" />
            <line x1="0" y1="420" x2="450" y2="60" stroke="#122535" strokeWidth="7" />

            {/* Vertical avenues */}
            {/* Av. Chapultepec */}
            <line x1="160" y1="0" x2="160" y2="480" stroke="#0e2030" strokeWidth="14" />
            <line x1="160" y1="0" x2="160" y2="480" stroke="#122535" strokeWidth="8" />
            {/* Av. Americas */}
            <line x1="310" y1="0" x2="310" y2="480" stroke="#0e2030" strokeWidth="12" />
            <line x1="310" y1="0" x2="310" y2="480" stroke="#122535" strokeWidth="7" />
            {/* Av. Federalismo */}
            <line x1="450" y1="0" x2="450" y2="480" stroke="#0e2030" strokeWidth="12" />
            <line x1="450" y1="0" x2="450" y2="480" stroke="#122535" strokeWidth="7" />

            {/* Secondary streets */}
            <line x1="0" y1="80" x2="660" y2="80" stroke="#0b1c28" strokeWidth="6" />
            <line x1="0" y1="190" x2="660" y2="190" stroke="#0b1c28" strokeWidth="5" />
            <line x1="0" y1="305" x2="660" y2="305" stroke="#0b1c28" strokeWidth="5" />
            <line x1="0" y1="420" x2="660" y2="420" stroke="#0b1c28" strokeWidth="6" />

            <line x1="80" y1="0" x2="80" y2="480" stroke="#0b1c28" strokeWidth="5" />
            <line x1="230" y1="0" x2="230" y2="480" stroke="#0b1c28" strokeWidth="5" />
            <line x1="380" y1="0" x2="380" y2="480" stroke="#0b1c28" strokeWidth="5" />
            <line x1="530" y1="0" x2="530" y2="480" stroke="#0b1c28" strokeWidth="5" />
            <line x1="610" y1="0" x2="610" y2="480" stroke="#0b1c28" strokeWidth="4" />

            {/* ── Roundabouts ── */}
            {/* Glorieta Minerva (Vallarta & Chapultepec area) */}
            <circle cx="160" cy="245" r="22" fill="none" stroke="#0e2535" strokeWidth="12" />
            <circle cx="160" cy="245" r="12" fill="#0a1825" stroke="#0d2030" strokeWidth="2" />
            <circle cx="160" cy="245" r="5" fill="#0d2840" />
            {/* Glorieta Patria */}
            <circle cx="310" cy="135" r="18" fill="none" stroke="#0e2535" strokeWidth="10" />
            <circle cx="310" cy="135" r="9" fill="#0a1825" stroke="#0d2030" strokeWidth="2" />
            {/* Small junction */}
            <circle cx="450" cy="245" r="14" fill="none" stroke="#0e2535" strokeWidth="8" />
            <circle cx="450" cy="245" r="6" fill="#0a1825" />

            {/* ── Street name labels ── */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <text x="52" y="130" fill="#1f6b4a" fontSize="8" fontFamily="monospace" fontWeight="600" letterSpacing="1.5">AV. CHAPULTEPEC</text>
              <text x="52" y="240" fill="#1f6b4a" fontSize="8" fontFamily="monospace" fontWeight="600" letterSpacing="1.5">AV. VALLARTA</text>
              <text x="52" y="355" fill="#1f6b4a" fontSize="8" fontFamily="monospace" fontWeight="600" letterSpacing="1.5">AV. LÓPEZ MATEOS</text>
            </motion.g>
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <text
                x="155" y="75"
                fill="#1f6b4a" fontSize="7.5" fontFamily="monospace" fontWeight="600"
                letterSpacing="1" transform="rotate(-90 155 75)"
                textAnchor="middle"
              >
                CHAPULTEPEC
              </text>
              <text
                x="305" y="75"
                fill="#1f6b4a" fontSize="7" fontFamily="monospace" fontWeight="600"
                letterSpacing="1" transform="rotate(-90 305 75)"
                textAnchor="middle"
              >
                LAS AMÉRICAS
              </text>
              <text
                x="210" y="375"
                fill="#1f6b4a" fontSize="7" fontFamily="monospace" fontWeight="600"
                letterSpacing="1" transform="rotate(-45 210 375)"
              >
                AV. PATRIA
              </text>
            </motion.g>

            {/* ── Traffic dots ── */}
            {TRAFFIC.map((t) => (
              <TrafficDot key={t.id} path={t.path} color={t.color} duration={t.duration} delay={t.delay} />
            ))}

            {/* ── Route shadow/halo ── */}
            {showRoute && (
              <path
                d={ROUTE_PATH}
                fill="none"
                stroke="#10b981"
                strokeWidth="10"
                strokeOpacity="0.12"
                strokeLinecap="round"
              />
            )}

            {/* ── Route dashed base ── */}
            {showRoute && (
              <path
                d={ROUTE_PATH}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeOpacity="0.25"
                strokeLinecap="round"
                strokeDasharray="6 6"
              />
            )}

            {/* Hidden path for measurement */}
            <path
              ref={routePathRef}
              d={ROUTE_PATH}
              fill="none"
              stroke="none"
            />

            {/* ── Animated route draw ── */}
            {showRoute && mounted && routeLength > 0 && (
              <motion.path
                d={ROUTE_PATH}
                fill="none"
                stroke="url(#route-grad)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow-green)"
                strokeDasharray={routeLength}
                initial={{ strokeDashoffset: routeLength }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}

            {/* ── Origin marker ── */}
            <motion.g
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "80px 320px" }}
            >
              <circle cx="80" cy="320" r="14" fill="#10b981" fillOpacity="0.15" filter="url(#glow-marker)" />
              <circle cx="80" cy="320" r="8" fill="#10b981" fillOpacity="0.3" />
              <circle cx="80" cy="320" r="4" fill="#10b981" />
              <circle cx="80" cy="320" r="2" fill="white" />
            </motion.g>
            <text x="92" y="316" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="700" letterSpacing="1">ORIGEN</text>
            <text x="92" y="327" fill="#6ee7b7" fontSize="7.5" fontFamily="monospace" opacity="0.7">Chapultepec 450</text>

            {/* ── Destination marker ── */}
            <motion.g
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{ transformOrigin: "580px 108px" }}
            >
              <circle cx="580" cy="108" r="16" fill="#34d399" fillOpacity="0.15" filter="url(#glow-marker)" />
              <circle cx="580" cy="108" r="9" fill="#34d399" fillOpacity="0.3" />
              {/* Pin shape */}
              <path
                d="M580 96 C574 96 570 101 570 107 C570 114 580 122 580 122 C580 122 590 114 590 107 C590 101 586 96 580 96 Z"
                fill="#34d399"
                filter="url(#glow-marker)"
              />
              <circle cx="580" cy="107" r="3.5" fill="white" />
            </motion.g>
            <text x="594" y="104" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="700" letterSpacing="1">DESTINO</text>
            <text x="594" y="115" fill="#6ee7b7" fontSize="7.5" fontFamily="monospace" opacity="0.7">Av. Patria 1200</text>

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
                {/* Radar pulse rings */}
                <motion.circle
                  cx="0" cy="0" r="18"
                  fill="none"
                  stroke={sosActive ? "#ef4444" : "#10b981"}
                  strokeWidth="1.5"
                  opacity="0.6"
                  animate={{ r: [14, 36], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.circle
                  cx="0" cy="0" r="18"
                  fill="none"
                  stroke={sosActive ? "#ef4444" : "#10b981"}
                  strokeWidth="1"
                  opacity="0.4"
                  animate={{ r: [14, 36], opacity: [0.4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                />

                {/* Car glow base */}
                <motion.circle
                  cx="0" cy="0" r="10"
                  fill={sosActive ? "#ef444430" : "#10b98130"}
                  animate={sosActive ? { opacity: [0.4, 1, 0.4] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />

                {/* Top-down taxi SVG car shape */}
                <g filter="url(#car-glow)">
                  {/* Car body */}
                  <path
                    d="M0 -14 C-5 -14 -8 -11 -9 -7 L-9.5 -2 L-10 8 C-10 11 -8 13 -5 13 L5 13 C8 13 10 11 10 8 L9.5 -2 L9 -7 C8 -11 5 -14 0 -14 Z"
                    fill={sosActive ? "#ef4444" : "#10b981"}
                  />
                  {/* Windshield */}
                  <path
                    d="M-6 -12 C-5 -10, 5 -10, 6 -12 L6.5 -7 C5 -5, -5 -5, -6.5 -7 Z"
                    fill="white"
                    opacity="0.85"
                  />
                  {/* Rear window */}
                  <path
                    d="M-5.5 6 C-4.5 4, 4.5 4, 5.5 6 L5 10 C4 11.5, -4 11.5, -5 10 Z"
                    fill="white"
                    opacity="0.6"
                  />
                  {/* Side stripe */}
                  <rect x="-9.5" y="0" width="19" height="2" fill="white" opacity="0.25" />
                  {/* Headlights */}
                  <circle cx="-6" cy="-13" r="1.5" fill="white" opacity="0.9" />
                  <circle cx="6" cy="-13" r="1.5" fill="white" opacity="0.9" />
                  {/* Tail lights */}
                  <circle cx="-6" cy="12" r="1.5" fill="#ff3333" opacity="0.9" />
                  <circle cx="6" cy="12" r="1.5" fill="#ff3333" opacity="0.9" />
                  {/* Taxi sign on roof */}
                  <rect x="-4" y="-6" width="8" height="4" rx="1" fill="white" opacity="0.15" />
                  <text x="0" y="-3" textAnchor="middle" fill="white" fontSize="3.5" fontFamily="monospace" fontWeight="900" opacity="0.8">TAXI</text>
                </g>
              </motion.g>
            )}
          </g>
        </svg>
      </div>

      {/* ── Glass-morphism ETA overlay ── */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          right: 14,
          background: "rgba(5, 20, 30, 0.72)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          borderRadius: "12px",
          padding: "10px 14px",
          minWidth: 120,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 6px #10b981" }} />
            <span style={{ color: "#6ee7b7", fontSize: 9, fontFamily: "monospace", letterSpacing: "1.5px", fontWeight: 600 }}>EN CAMINO</span>
          </div>
          <div style={{ color: "#10b981", fontSize: 22, fontFamily: "monospace", fontWeight: 800, lineHeight: 1 }}>
            {Math.max(1, Math.round((1 - progress) * 8))} <span style={{ fontSize: 11, color: "#6ee7b7", fontWeight: 500 }}>min</span>
          </div>
          <div style={{ color: "#4ade80", fontSize: 10, fontFamily: "monospace", opacity: 0.75 }}>
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
            background: "rgba(239, 68, 68, 0.15)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(239, 68, 68, 0.5)",
            borderRadius: "10px",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block", boxShadow: "0 0 10px #ef4444" }} />
          <span style={{ color: "#fca5a5", fontSize: 11, fontFamily: "monospace", fontWeight: 700, letterSpacing: "2px" }}>SOS ACTIVO</span>
        </motion.div>
      )}

      {/* ── Speed indicator dot strip ── */}
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
          <motion.div
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: i < Math.round(progress * 5) ? "#10b981" : "#0d2535",
              boxShadow: i < Math.round(progress * 5) ? "0 0 6px #10b981" : "none",
            }}
            animate={i < Math.round(progress * 5) ? { opacity: [0.7, 1, 0.7] } : {}}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>

      {/* Edge fade vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(5,10,14,0.65) 100%)",
          borderRadius: "inherit",
        }}
      />
    </div>
  );
}
