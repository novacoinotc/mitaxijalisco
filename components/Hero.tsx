"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { HeroVisual } from "./VisualEffects";
import AnimatedMap from "./AnimatedMap";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <HeroVisual />
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
              Tu taxi. Tu ciudad.
              <br />
              <span className="text-gradient">Tu Jalisco.</span>
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-xl">
              Solo 10% de comisión para el conductor. Seguridad conectada al C5. Precios justos para ti. Hecho por jaliscienses.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/app"
                className="group inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-5 py-3 text-black font-semibold hover:opacity-90 glow"
              >
                Probar la app
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="#registro"
                className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 font-semibold text-white hover:bg-white/5"
              >
                Registrarme
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-neon-cyan" /> <span><b className="text-white">90%</b> para el conductor</span></div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-neon-cyan" /> <span>SOS <b className="text-white">24/7</b> con C5</span></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="hidden lg:block"
          >
            <div className="glass rounded-2xl p-1.5">
              <SmoothMapLoop />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Smooth loop using rAF — updates progress via ref, not state
function SmoothMapLoop() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);
  const progressRef = useRef(0);

  useEffect(() => {
    let lastUpdate = 0;
    const loop = (time: number) => {
      if (!lastUpdate) lastUpdate = time;
      const elapsed = (time - lastUpdate) / 1000;
      // Update every 300ms — smooth enough, minimal React work
      if (elapsed > 0.3) {
        lastUpdate = time;
        progressRef.current += elapsed * 0.035;
        if (progressRef.current > 1) progressRef.current = 0;
        setProgress(progressRef.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <AnimatedMap progress={progress} className="h-[320px] rounded-xl" />;
}
