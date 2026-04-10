// VisualEffects.tsx — Lightweight decorative components
// No heavy animations, no blur filters, no rAF loops.
// CSS-only animations where motion is needed.

/* -------------------------------------------------------------------------- */
/*  1. HeroVisual                                                              */
/* -------------------------------------------------------------------------- */
export function HeroVisual() {
  // Fixed particle positions — avoids Math.random() hydration mismatch
  const particles = [
    { cx: "12%", cy: "18%", r: 2 },
    { cx: "28%", cy: "72%", r: 1.5 },
    { cx: "45%", cy: "30%", r: 2.5 },
    { cx: "62%", cy: "55%", r: 1.5 },
    { cx: "78%", cy: "22%", r: 2 },
    { cx: "88%", cy: "68%", r: 1.5 },
    { cx: "55%", cy: "85%", r: 2 },
    { cx: "35%", cy: "45%", r: 1 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft gradient blob — CSS only, no blur */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          right: "-120px",
          top: "-160px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.04) 45%, transparent 70%)",
        }}
      />
      {/* Second smaller blob bottom-left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          left: "-60px",
          bottom: "-80px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 60% 60%, rgba(16,185,129,0.07) 0%, transparent 70%)",
        }}
      />
      {/* Gentle floating dots (SVG, CSS animation) */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill="#10b981"
            style={{
              opacity: 0.25,
              animation: `heroFloat ${5 + (i % 3)}s ease-in-out ${i * 0.7}s infinite alternate`,
            }}
          />
        ))}
      </svg>

      <style>{`
        @keyframes heroFloat {
          from { transform: translateY(0px); opacity: 0.2; }
          to   { transform: translateY(-10px); opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. CityIllustration — Guadalajara skyline silhouette                      */
/* -------------------------------------------------------------------------- */
export function CityIllustration() {
  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden"
      style={{ lineHeight: 0 }}
    >
      <svg
        viewBox="0 0 1200 220"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet"
        style={{ display: "block", width: "100%", height: "auto" }}
      >
        {/* Sky gradient */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="100%" stopColor="#030f09" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(16,185,129,0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        <rect width="1200" height="220" fill="url(#skyGrad)" />

        {/* Horizon glow */}
        <rect x="0" y="170" width="1200" height="10" fill="url(#glowGrad)" />

        {/* Ground line */}
        <rect x="0" y="178" width="1200" height="42" fill="#000" />

        {/*
          Buildings — drawn as simple filled rects / polygons
          Green stroke only, fill black (silhouette style)
        */}
        <g fill="#000" stroke="#10b981" strokeWidth="1">
          {/* Far-left apartment block */}
          <rect x="20" y="130" width="50" height="50" />
          <rect x="30" y="118" width="30" height="14" />
          {/* Windows */}
          <rect x="27" y="138" width="6" height="7" fill="#10b981" fillOpacity="0.18" stroke="none" />
          <rect x="40" y="138" width="6" height="7" fill="#10b981" fillOpacity="0.18" stroke="none" />
          <rect x="53" y="138" width="6" height="7" fill="#10b981" fillOpacity="0.18" stroke="none" />
          <rect x="27" y="152" width="6" height="7" fill="#10b981" fillOpacity="0.10" stroke="none" />
          <rect x="53" y="152" width="6" height="7" fill="#10b981" fillOpacity="0.10" stroke="none" />

          {/* Tall modern tower */}
          <rect x="90" y="60" width="40" height="120" />
          <rect x="100" y="52" width="20" height="10" />
          <line x1="110" y1="52" x2="110" y2="38" stroke="#10b981" strokeWidth="1" />
          {/* Antenna tip dot */}
          <circle cx="110" cy="36" r="2" fill="#10b981" />
          {/* Windows */}
          {[70, 82, 94, 106, 118, 130, 142, 154].map((y) => (
            <g key={y}>
              <rect x="96" y={y} width="7" height="6" fill="#10b981" fillOpacity="0.15" stroke="none" />
              <rect x="108" y={y} width="7" height="6" fill="#10b981" fillOpacity="0.15" stroke="none" />
              <rect x="120" y={y} width="7" height="6" fill="#10b981" fillOpacity="0.12" stroke="none" />
            </g>
          ))}

          {/* Cathedral Guadalajara — center piece */}
          {/* Main body */}
          <rect x="540" y="90" width="120" height="90" />
          {/* Left tower */}
          <rect x="532" y="50" width="28" height="130" />
          {/* Right tower */}
          <rect x="640" y="50" width="28" height="130" />
          {/* Left spire */}
          <polygon points="546,50 546,20 554,50" fill="#000" stroke="#10b981" strokeWidth="1" />
          <polygon points="554,50 554,20 562,50" fill="#000" stroke="#10b981" strokeWidth="1" />
          <circle cx="554" cy="18" r="3" fill="#10b981" />
          {/* Right spire */}
          <polygon points="648,50 648,20 656,50" fill="#000" stroke="#10b981" strokeWidth="1" />
          <polygon points="656,50 656,20 664,50" fill="#000" stroke="#10b981" strokeWidth="1" />
          <circle cx="656" cy="18" r="3" fill="#10b981" />
          {/* Dome */}
          <ellipse cx="600" cy="90" rx="28" ry="18" fill="#000" stroke="#10b981" strokeWidth="1" />
          <ellipse cx="600" cy="88" rx="16" ry="10" fill="#000" stroke="#10b981" strokeWidth="0.8" />
          <circle cx="600" cy="76" r="3" fill="#10b981" />
          {/* Rose window */}
          <circle cx="600" cy="118" r="10" fill="none" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.6" />
          <circle cx="600" cy="118" r="5" fill="none" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.4" />
          {/* Arched doorway */}
          <path d="M586,178 L586,150 Q600,138 614,150 L614,178 Z" fill="#000" stroke="#10b981" strokeWidth="0.8" />

          {/* Office building left of cathedral */}
          <rect x="440" y="105" width="60" height="75" />
          <rect x="455" y="96" width="30" height="11" />
          {[112, 124, 136, 148, 160].map((y) => (
            <g key={y}>
              <rect x="447" y={y} width="8" height="7" fill="#10b981" fillOpacity="0.13" stroke="none" />
              <rect x="461" y={y} width="8" height="7" fill="#10b981" fillOpacity="0.13" stroke="none" />
              <rect x="476" y={y} width="8" height="7" fill="#10b981" fillOpacity="0.13" stroke="none" />
              <rect x="490" y={y} width="8" height="7" fill="#10b981" fillOpacity="0.10" stroke="none" />
            </g>
          ))}

          {/* Office building right of cathedral */}
          <rect x="700" y="100" width="65" height="80" />
          <rect x="714" y="92" width="37" height="10" />
          {[108, 120, 132, 144, 156].map((y) => (
            <g key={y}>
              <rect x="707" y={y} width="9" height="7" fill="#10b981" fillOpacity="0.12" stroke="none" />
              <rect x="722" y={y} width="9" height="7" fill="#10b981" fillOpacity="0.12" stroke="none" />
              <rect x="737" y={y} width="9" height="7" fill="#10b981" fillOpacity="0.12" stroke="none" />
              <rect x="752" y={y} width="9" height="7" fill="#10b981" fillOpacity="0.10" stroke="none" />
            </g>
          ))}

          {/* Slim glass tower far right */}
          <rect x="820" y="75" width="35" height="105" />
          <rect x="826" y="68" width="23" height="9" />
          <line x1="837" y1="68" x2="837" y2="55" stroke="#10b981" strokeWidth="0.8" />
          <circle cx="837" cy="53" r="1.8" fill="#10b981" />
          {[82, 94, 106, 118, 130, 142, 154].map((y) => (
            <g key={y}>
              <rect x="824" y={y} width="9" height="6" fill="#10b981" fillOpacity="0.16" stroke="none" />
              <rect x="838" y={y} width="9" height="6" fill="#10b981" fillOpacity="0.16" stroke="none" />
            </g>
          ))}

          {/* Low-rise block far right */}
          <rect x="880" y="140" width="70" height="40" />
          <rect x="894" y="132" width="42" height="10" />
          {[146, 158].map((y) => (
            <g key={y}>
              <rect x="888" y={y} width="8" height="7" fill="#10b981" fillOpacity="0.12" stroke="none" />
              <rect x="902" y={y} width="8" height="7" fill="#10b981" fillOpacity="0.12" stroke="none" />
              <rect x="916" y={y} width="8" height="7" fill="#10b981" fillOpacity="0.12" stroke="none" />
              <rect x="930" y={y} width="8" height="7" fill="#10b981" fillOpacity="0.10" stroke="none" />
            </g>
          ))}

          {/* Medium block */}
          <rect x="970" y="120" width="55" height="60" />
          <rect x="982" y="112" width="31" height="10" />
          {[128, 140, 152].map((y) => (
            <g key={y}>
              <rect x="977" y={y} width="8" height="7" fill="#10b981" fillOpacity="0.12" stroke="none" />
              <rect x="991" y={y} width="8" height="7" fill="#10b981" fillOpacity="0.12" stroke="none" />
              <rect x="1005" y={y} width="8" height="7" fill="#10b981" fillOpacity="0.12" stroke="none" />
            </g>
          ))}

          {/* Right edge short block */}
          <rect x="1050" y="145" width="45" height="35" />
          <rect x="1062" y="136" width="21" height="11" />

          {/* Wide warehouse/hotel left side */}
          <rect x="160" y="115" width="80" height="65" />
          <rect x="174" y="106" width="52" height="11" />
          {[122, 134, 146, 158].map((y) => (
            <g key={y}>
              {[168, 183, 198, 213, 228].map((x) => (
                <rect key={x} x={x} y={y} width="7" height="6" fill="#10b981" fillOpacity="0.12" stroke="none" />
              ))}
            </g>
          ))}

          {/* Medium tower next to cathedral on left */}
          <rect x="260" y="88" width="45" height="92" />
          <rect x="270" y="80" width="25" height="10" />
          <line x1="282" y1="80" x2="282" y2="65" stroke="#10b981" strokeWidth="0.8" />
          <circle cx="282" cy="63" r="2" fill="#10b981" />
          {[95, 107, 119, 131, 143, 155, 167].map((y) => (
            <g key={y}>
              <rect x="266" y={y} width="8" height="7" fill="#10b981" fillOpacity="0.14" stroke="none" />
              <rect x="279" y={y} width="8" height="7" fill="#10b981" fillOpacity="0.14" stroke="none" />
              <rect x="292" y={y} width="8" height="7" fill="#10b981" fillOpacity="0.11" stroke="none" />
            </g>
          ))}

          {/* Small buildings filling gaps */}
          <rect x="380" y="145" width="40" height="35" />
          <rect x="1110" y="150" width="70" height="30" />
        </g>

        {/* Palm trees — left side */}
        <g stroke="#10b981" strokeWidth="1.2" fill="none">
          {/* Palm 1 */}
          <line x1="350" y1="178" x2="352" y2="140" />
          <path d="M352,140 Q340,128 328,132" strokeWidth="1" />
          <path d="M352,140 Q345,126 338,124" strokeWidth="1" />
          <path d="M352,140 Q358,126 368,128" strokeWidth="1" />
          <path d="M352,140 Q360,128 370,132" strokeWidth="1" />
          <path d="M352,140 Q350,124 352,118" strokeWidth="1" />
          {/* Palm 2 */}
          <line x1="1145" y1="178" x2="1147" y2="148" />
          <path d="M1147,148 Q1135,136 1123,140" strokeWidth="1" />
          <path d="M1147,148 Q1140,134 1133,132" strokeWidth="1" />
          <path d="M1147,148 Q1153,134 1163,136" strokeWidth="1" />
          <path d="M1147,148 Q1155,136 1165,140" strokeWidth="1" />
          <path d="M1147,148 Q1145,132 1147,126" strokeWidth="1" />
        </g>

        {/* Stars */}
        {[
          [50, 25], [140, 15], [230, 35], [330, 10], [430, 28],
          [500, 18], [680, 12], [760, 30], [850, 8], [950, 22],
          [1050, 14], [1150, 30], [1180, 8],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.2 : 0.8} fill="#10b981" fillOpacity="0.35" />
        ))}
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. CarIllustration — Clean sedan side-view                                */
/* -------------------------------------------------------------------------- */
export function CarIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Car illustration"
      role="img"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Body */}
      <path
        d="M18,52 L18,40 Q20,30 42,26 L76,20 Q90,16 108,16 L142,16 Q162,16 172,26 L195,40 L200,52 Z"
        fill="url(#bodyGrad)"
        stroke="#10b981"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Cabin roof */}
      <path
        d="M60,26 Q72,12 100,10 L148,10 Q166,10 174,26"
        fill="none"
        stroke="#10b981"
        strokeWidth="1.2"
      />

      {/* Windshield */}
      <path
        d="M62,26 Q72,13 100,11 L102,26 Z"
        fill="#10b981"
        fillOpacity="0.08"
        stroke="#10b981"
        strokeWidth="0.8"
      />

      {/* Rear window */}
      <path
        d="M148,11 L172,26 L148,26 Z"
        fill="#10b981"
        fillOpacity="0.08"
        stroke="#10b981"
        strokeWidth="0.8"
      />

      {/* Side windows */}
      <rect x="106" y="12" width="38" height="14" rx="2" fill="#10b981" fillOpacity="0.08" stroke="#10b981" strokeWidth="0.8" />

      {/* Door lines */}
      <line x1="106" y1="26" x2="106" y2="50" stroke="#10b981" strokeWidth="0.7" strokeOpacity="0.5" />
      <line x1="144" y1="26" x2="148" y2="50" stroke="#10b981" strokeWidth="0.7" strokeOpacity="0.5" />

      {/* Door handles */}
      <line x1="116" y1="40" x2="124" y2="40" stroke="#10b981" strokeWidth="1.2" />
      <line x1="152" y1="40" x2="160" y2="40" stroke="#10b981" strokeWidth="1.2" />

      {/* Undercarriage */}
      <line x1="18" y1="52" x2="200" y2="52" stroke="#10b981" strokeWidth="1" strokeOpacity="0.4" />

      {/* Front wheel */}
      <circle cx="58" cy="56" r="14" fill="#000" stroke="#10b981" strokeWidth="1.5" />
      <circle cx="58" cy="56" r="8" fill="none" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.5" />
      <circle cx="58" cy="56" r="3" fill="#10b981" fillOpacity="0.3" />

      {/* Rear wheel */}
      <circle cx="158" cy="56" r="14" fill="#000" stroke="#10b981" strokeWidth="1.5" />
      <circle cx="158" cy="56" r="8" fill="none" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.5" />
      <circle cx="158" cy="56" r="3" fill="#10b981" fillOpacity="0.3" />

      {/* Headlight */}
      <ellipse cx="20" cy="46" rx="4" ry="3" fill="#10b981" fillOpacity="0.4" stroke="#10b981" strokeWidth="0.8" />

      {/* Taillight */}
      <rect x="197" y="43" width="4" height="6" rx="1" fill="#10b981" fillOpacity="0.5" stroke="#10b981" strokeWidth="0.8" />

      {/* Ground shadow */}
      <ellipse cx="108" cy="72" rx="80" ry="4" fill="#10b981" fillOpacity="0.06" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. GlowDivider — Green gradient line                                      */
/* -------------------------------------------------------------------------- */
export function GlowDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative py-px overflow-hidden ${className}`}
    >
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.12) 15%, rgba(16,185,129,0.5) 50%, rgba(16,185,129,0.12) 85%, transparent 100%)",
          animation: "glowPulse 4s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  5. PatternBg — Subtle dot grid background                                 */
/* -------------------------------------------------------------------------- */
export function PatternBg({
  className = "",
  variant = "dots",
}: {
  className?: string;
  variant?: "dots" | "lines";
}) {
  const dotPattern =
    "radial-gradient(circle, rgba(16,185,129,0.18) 1px, transparent 1px)";
  const linePattern = `
    linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)
  `;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: variant === "dots" ? dotPattern : linePattern,
        backgroundSize: variant === "dots" ? "28px 28px" : "48px 48px",
        opacity: 0.04,
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  6. PhoneIllustration — Phone with mini map/route inside                  */
/* -------------------------------------------------------------------------- */
export function PhoneIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Phone with map illustration"
      role="img"
      style={{ display: "block" }}
    >
      <defs>
        <clipPath id="screenClip">
          <rect x="12" y="24" width="96" height="148" rx="4" />
        </clipPath>
        <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#030f09" />
          <stop offset="100%" stopColor="#050f07" />
        </linearGradient>
      </defs>

      {/* Phone shell */}
      <rect
        x="4"
        y="4"
        width="112"
        height="192"
        rx="16"
        fill="#000"
        stroke="#10b981"
        strokeWidth="1.5"
      />

      {/* Side buttons */}
      <rect x="0" y="50" width="4" height="20" rx="2" fill="#10b981" fillOpacity="0.4" />
      <rect x="0" y="76" width="4" height="30" rx="2" fill="#10b981" fillOpacity="0.4" />
      <rect x="116" y="60" width="4" height="24" rx="2" fill="#10b981" fillOpacity="0.4" />

      {/* Notch / camera bar */}
      <rect x="38" y="8" width="44" height="8" rx="4" fill="#10b981" fillOpacity="0.15" />
      <circle cx="60" cy="12" r="2" fill="#10b981" fillOpacity="0.3" />

      {/* Screen background */}
      <rect x="12" y="24" width="96" height="148" rx="4" fill="url(#mapBg)" />

      {/* Map content clipped to screen */}
      <g clipPath="url(#screenClip)">
        {/* Map grid (streets) */}
        <g stroke="rgba(16,185,129,0.12)" strokeWidth="0.8" fill="none">
          {[35, 50, 65, 80, 95, 110, 125, 140].map((y) => (
            <line key={`h${y}`} x1="12" y1={y} x2="108" y2={y} />
          ))}
          {[25, 40, 55, 70, 85, 100].map((x) => (
            <line key={`v${x}`} x1={x} y1="24" x2={x} y2="172" />
          ))}
        </g>

        {/* City blocks */}
        {[
          [28, 38, 24, 12],
          [56, 38, 26, 12],
          [28, 54, 11, 10],
          [43, 54, 18, 10],
          [65, 54, 22, 10],
          [28, 68, 30, 12],
          [62, 68, 22, 12],
          [28, 84, 16, 10],
          [48, 84, 18, 10],
          [70, 84, 14, 10],
          [28, 98, 26, 12],
          [58, 98, 26, 12],
          [28, 114, 14, 10],
          [46, 114, 20, 10],
          [70, 114, 14, 10],
        ].map(([x, y, w, h], i) => (
          <rect
            key={i}
            x={x} y={y} width={w} height={h}
            fill="rgba(16,185,129,0.06)"
            stroke="rgba(16,185,129,0.15)"
            strokeWidth="0.5"
          />
        ))}

        {/* Route path */}
        <path
          d="M30,160 L30,130 L55,130 L55,100 L75,100 L75,70 L90,70 L90,50"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 2"
        />

        {/* Origin pin (bottom) */}
        <circle cx="30" cy="160" r="5" fill="#10b981" fillOpacity="0.9" />
        <circle cx="30" cy="160" r="3" fill="#000" />
        <circle cx="30" cy="160" r="1.5" fill="#10b981" />

        {/* Destination pin (top) */}
        <circle cx="90" cy="50" r="6" fill="#10b981" fillOpacity="0.2" />
        <path
          d="M90,44 C86.5,44 83.5,46.8 83.5,50.2 C83.5,54.5 90,62 90,62 C90,62 96.5,54.5 96.5,50.2 C96.5,46.8 93.5,44 90,44 Z"
          fill="#10b981"
          stroke="none"
        />
        <circle cx="90" cy="50" r="2.5" fill="#000" />

        {/* Car icon on route */}
        <g transform="translate(51, 113)">
          <rect x="-6" y="-3" width="12" height="6" rx="2" fill="#10b981" />
          <rect x="-4" y="-6" width="8" height="4" rx="1" fill="#10b981" fillOpacity="0.7" />
          <circle cx="-3" cy="4" r="2" fill="#000" stroke="#10b981" strokeWidth="0.5" />
          <circle cx="3" cy="4" r="2" fill="#000" stroke="#10b981" strokeWidth="0.5" />
        </g>

        {/* Status bar */}
        <rect x="12" y="24" width="96" height="12" fill="rgba(0,0,0,0.6)" />
        <text x="60" y="33" textAnchor="middle" fill="#10b981" fontSize="6" fontFamily="sans-serif" letterSpacing="0.5">MI TAXI JALISCO</text>
      </g>

      {/* Home bar */}
      <rect x="44" y="182" width="32" height="3" rx="1.5" fill="#10b981" fillOpacity="0.3" />
    </svg>
  );
}
