"use client";
import { motion } from "framer-motion";
import { Package, ShoppingBasket, HandHelping, Pill, Plane, Car } from "lucide-react";

const services = [
  { icon: Car, t: "Viajes", d: "Taxi clásico, compartido o moto. Tú eliges." },
  { icon: Package, t: "Envíos", d: "Paquetería el mismo día dentro de la ZMG." },
  { icon: ShoppingBasket, t: "Súper", d: "Te hacemos el mandado en tu mercado favorito." },
  { icon: HandHelping, t: "Favores", d: "Recados, pagos, recoger algo. Lo que necesites." },
  { icon: Pill, t: "Farmacia", d: "Medicamentos en menos de 30 minutos." },
  { icon: Plane, t: "Aeropuerto", d: "Tarifa plana. Sin sorpresas." },
];

export default function Services() {
  return (
    <section id="servicios" className="relative py-20">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Más que <span className="text-gradient">taxi</span>.
          </h2>
          <p className="mt-3 text-white/80">Todo con la misma red de conductores verificados.</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map(({ icon: Icon, t, d }, i) => (
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
              <p className="mt-1 text-sm text-white/70">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
