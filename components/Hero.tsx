"use client";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Tu taxi. Tu ciudad.
            <br />
            <span className="text-gradient">Tu Jalisco.</span>
          </h1>
          <p className="mt-5 text-lg text-white/60 max-w-xl">
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

          <div className="mt-12 flex flex-wrap gap-6 text-sm text-white/60">
            <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-neon-cyan" /> <span><b className="text-white">90%</b> para el conductor</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-neon-cyan" /> <span>SOS <b className="text-white">24/7</b> con C5</span></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
