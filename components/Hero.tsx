"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden noise">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-white/80 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-neon-cyan" />
            Hecho en Jalisco · Impulsado por conductores mexicanos
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
            La movilidad <span className="text-gradient">ya no es de Uber.</span>
            <br />
            Es tuya, es de Jalisco.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl">
            Mi Taxi Jalisco le devuelve el control a los conductores: <b className="text-white">solo 10% de comisión</b> vs el 30% de Uber.
            Taxis formales, informales y autos particulares — todos en una sola plataforma, con seguridad de nivel bancario y precios más justos para el pasajero.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/app"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-violet px-6 py-3.5 text-base font-semibold text-black hover:opacity-90 glow"
            >
              🎮 Probar la app en vivo
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="#registro"
              className="inline-flex items-center gap-2 rounded-2xl glass px-6 py-3.5 text-base font-semibold text-white hover:bg-white/10"
            >
              Registrarme
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            {[
              { icon: TrendingUp, k: "90%", v: "para el conductor" },
              { icon: ShieldCheck, k: "24/7", v: "botón de pánico + rastreo" },
              { icon: Sparkles, k: "-20%", v: "vs tarifas Uber" },
            ].map(({ icon: Icon, k, v }, i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass rounded-2xl p-5"
              >
                <Icon className="h-5 w-5 text-neon-cyan mb-2" />
                <div className="font-display text-3xl font-bold text-gradient">{k}</div>
                <div className="text-sm text-white/60">{v}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating phone mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: -6 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="hidden lg:block absolute right-8 top-32 w-[320px] animate-float"
        >
          <div className="glass rounded-[40px] p-3 glow">
            <div className="rounded-[32px] bg-gradient-to-b from-jalisco-900 to-black p-5 h-[560px] relative overflow-hidden">
              <div className="text-xs text-white/60">Hola, Carlos 👋</div>
              <div className="mt-1 font-display text-xl font-bold">¿A dónde vamos?</div>
              <div className="mt-4 glass rounded-xl p-3 text-sm">📍 Av. Chapultepec 123</div>
              <div className="mt-2 glass rounded-xl p-3 text-sm">🎯 Plaza del Sol</div>
              <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 h-[260px] relative bg-[#1a0a00]">
                <div className="absolute inset-0 grid-bg opacity-60" />
                <motion.div
                  className="absolute h-3 w-3 rounded-full bg-neon-cyan glow"
                  animate={{ x: [20, 200, 220], y: [220, 120, 40] }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                />
                <div className="absolute left-5 top-[220px] h-2 w-2 rounded-full bg-neon-pink" />
                <div className="absolute right-5 top-10 h-2 w-2 rounded-full bg-neon-lime" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/60">Tarifa estimada</div>
                  <div className="font-display text-2xl font-bold text-gradient">$68 MXN</div>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet px-4 py-2 text-black font-semibold text-sm">Pedir</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
