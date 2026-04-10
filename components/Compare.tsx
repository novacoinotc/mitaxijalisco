"use client";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const rows: [string, string | boolean, string | boolean][] = [
  ["Comisión", "10%", "30%"],
  ["Pago al conductor", "24 horas", "Hasta 7 días"],
  ["Botón SOS con C5 Jalisco", true, false],
  ["Propina 100% al conductor", true, false],
  ["Acepta efectivo sin cargo extra", true, true],
  ["Datos almacenados en México", true, false],
];

export default function Compare() {
  return (
    <section id="comparativa" className="relative py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Mi Taxi Jalisco <span className="text-gradient">vs</span> la competencia
          </h2>
        </motion.div>

        <div className="mt-8 glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 text-sm font-semibold border-b border-white/10">
            <div className="p-4 text-white/70"></div>
            <div className="p-4 text-neon-cyan">Nosotros</div>
            <div className="p-4 text-white/60">Otros</div>
          </div>
          {rows.map(([label, a, b], i) => (
            <div key={label as string} className={`grid grid-cols-3 text-sm border-b border-white/5 ${i % 2 ? "bg-white/[0.02]" : ""}`}>
              <div className="p-4 text-white/70">{label}</div>
              <div className="p-4 font-semibold text-white">
                {typeof a === "boolean" ? (a ? <Check className="h-5 w-5 text-neon-lime" /> : <X className="h-5 w-5 text-white/30" />) : a}
              </div>
              <div className="p-4 text-white/70">
                {typeof b === "boolean" ? (b ? <Check className="h-5 w-5 text-white/60" /> : <X className="h-5 w-5 text-red-400/60" />) : b}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
