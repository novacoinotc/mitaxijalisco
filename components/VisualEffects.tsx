"use client";
import { motion } from "framer-motion";

/* Floating orbs / particles that move around the page */
export function FloatingOrbs() {
  const orbs = [
    { size: 300, x: "10%", y: "20%", color: "#10b981", delay: 0, dur: 20 },
    { size: 200, x: "80%", y: "10%", color: "#065f46", delay: 3, dur: 25 },
    { size: 250, x: "70%", y: "60%", color: "#10b981", delay: 5, dur: 22 },
    { size: 180, x: "20%", y: "75%", color: "#34d399", delay: 8, dur: 18 },
    { size: 150, x: "50%", y: "40%", color: "#065f46", delay: 2, dur: 30 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.size, height: o.size,
            left: o.x, top: o.y,
            background: `radial-gradient(circle, ${o.color}15, transparent 70%)`,
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 40, -30, 20, 0],
            y: [0, -30, 20, -40, 0],
            scale: [1, 1.15, 0.95, 1.1, 1],
          }}
          transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut", delay: o.delay }}
        />
      ))}
    </div>
  );
}

/* Animated grid that pulses */
export function AnimatedGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #10b98140, transparent)" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* Hero background with animated mesh gradient */
export function HeroVisual() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large gradient blob */}
      <motion.div
        className="absolute"
        style={{
          width: 700, height: 700,
          right: "-10%", top: "-20%",
          background: "radial-gradient(circle, #10b98118, #10b98108, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      {/* Rings */}
      {[300, 450, 600].map((size, i) => (
        <motion.div
          key={size}
          className="absolute rounded-full border"
          style={{
            width: size, height: size,
            right: `${-size / 4}px`, top: `${-size / 4 + 50}px`,
            borderColor: `rgba(16,185,129,${0.06 - i * 0.015})`,
          }}
          animate={{ rotate: i % 2 === 0 ? [0, 360] : [360, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-neon-cyan"
          style={{
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            opacity: 0.2 + Math.random() * 0.3,
          }}
          animate={{
            y: [0, -20 - Math.random() * 40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 5 }}
        />
      ))}
    </div>
  );
}

/* Section divider with glow line */
export function GlowDivider() {
  return (
    <div className="relative py-2">
      <motion.div
        className="h-px mx-auto max-w-3xl"
        style={{ background: "linear-gradient(90deg, transparent, #10b98150, #10b98120, transparent)" }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
