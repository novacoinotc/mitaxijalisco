"use client";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const rows = [
  ["Comisión al conductor", "10%", "30%"],
  ["Pago al conductor", "24 horas", "Hasta 7 días"],
  ["Botón SOS conectado a C5 Jalisco", true, false],
  ["Soporte en español local (Guadalajara)", true, false],
  ["Seguro de gastos médicos para conductor", true, false],
  ["Acepta efectivo sin comisión extra", true, true],
  ["Acepta CoDi / SPEI / vales", true, false],
  ["Tarifas dinámicas abusivas", false, true],
  ["Taxis informales legalizados en la app", true, false],
  ["Propina 100% para conductor", true, false],
  ["Datos almacenados en México", true, false],
];

export default function Compare() {
  return (
    <section id="comparativa" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-xs uppercase tracking-[0.25em] text-neon-pink mb-3">Comparativa honesta</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Mi Taxi Jalisco <span className="text-gradient">vs</span> Uber
          </h2>
        </motion.div>

        <div className="mt-10 glass rounded-3xl overflow-hidden">
          <div className="grid grid-cols-3 text-sm font-semibold border-b border-white/10">
            <div className="p-5 text-white/70">Característica</div>
            <div className="p-5 bg-gradient-to-b from-neon-cyan/10 to-transparent text-white">
              🇲🇽 Mi Taxi Jalisco
            </div>
            <div className="p-5 text-white/50">Uber</div>
          </div>
          {rows.map(([label, a, b], i) => (
            <motion.div
              key={label as string}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className={`grid grid-cols-3 text-sm border-b border-white/5 ${
                i % 2 ? "bg-white/[0.02]" : ""
              }`}
            >
              <div className="p-5 text-white/80">{label}</div>
              <div className="p-5 bg-gradient-to-r from-neon-cyan/5 to-transparent font-semibold text-white">
                {typeof a === "boolean" ? (
                  a ? <Check className="h-5 w-5 text-neon-lime" /> : <X className="h-5 w-5 text-white/30" />
                ) : a}
              </div>
              <div className="p-5 text-white/60">
                {typeof b === "boolean" ? (
                  b ? <Check className="h-5 w-5 text-white/40" /> : <X className="h-5 w-5 text-neon-pink" />
                ) : b}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
