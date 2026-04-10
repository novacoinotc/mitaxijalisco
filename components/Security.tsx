"use client";
import { motion } from "framer-motion";
import { Siren, Users, Radar, Fingerprint, ShieldCheck, Lock } from "lucide-react";

const items = [
  { icon: Siren, t: "SOS → Policía en 5 segundos", d: "Tu ubicación, foto del conductor y placas llegan al C5 Jalisco al instante." },
  { icon: Radar, t: "Detección de desvíos", d: "Si el conductor se sale de la ruta, la app alerta a ti y a tus contactos." },
  { icon: Users, t: "Viaje compartido con familia", d: "Tu familia ve la ruta en vivo desde un link. Sin instalar nada." },
  { icon: Fingerprint, t: "Biometría obligatoria", d: "Cada conductor confirma su identidad al iniciar turno." },
  { icon: ShieldCheck, t: "7 filtros de verificación", d: "INE, antecedentes, examen médico, psicométrico, vehículo, licencia y conducción." },
  { icon: Lock, t: "Tus datos en México", d: "Cifrado de extremo a extremo. Servidores en México, bajo leyes mexicanas." },
];

export default function Security() {
  return (
    <section id="seguridad" className="relative py-20">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Seguridad <span className="text-gradient">de verdad</span>.
          </h2>
          <p className="mt-3 text-white/80">Construida con el C5 Jalisco y asociaciones de taxistas locales.</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(({ icon: Icon, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <Icon className="h-5 w-5 text-neon-cyan mb-3" />
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-white/70">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
