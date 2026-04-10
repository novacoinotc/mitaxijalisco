"use client";
import { motion } from "framer-motion";
import { Wallet, ShieldCheck, Route, CreditCard, Star, Zap } from "lucide-react";

const features = [
  { icon: Wallet, t: "Solo 10% de comisión", d: "El conductor se queda con el 90%. Sin tarifas dinámicas abusivas." },
  { icon: ShieldCheck, t: "Seguridad real 24/7", d: "Botón SOS conectado al C5 Jalisco. Rastreo en vivo para tu familia." },
  { icon: Route, t: "Rutas inteligentes", d: "IA entrenada con tráfico real de la ZMG. Llegas más rápido." },
  { icon: CreditCard, t: "Paga como quieras", d: "Efectivo, tarjeta, CoDi, SPEI o Mercado Pago." },
  { icon: Star, t: "Propinas 100% al conductor", d: "Nosotros no tocamos un peso de las propinas." },
  { icon: Zap, t: "Cobro al día siguiente", d: "Nada de esperar una semana. Pago automático en 24 horas." },
];

export default function Features() {
  return (
    <section id="features" className="relative py-20">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Lo que nos hace <span className="text-gradient">diferentes</span>.
          </h2>
          <p className="mt-3 text-white/60">Hecho escuchando a conductores y pasajeros reales de Guadalajara.</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 hover:bg-white/5 transition"
            >
              <Icon className="h-5 w-5 text-neon-cyan mb-3" />
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-white/50">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
