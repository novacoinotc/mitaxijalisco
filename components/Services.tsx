"use client";
import { motion } from "framer-motion";
import { Package, ShoppingBasket, HandHelping, Baby, Dog, Pill, GraduationCap, Plane } from "lucide-react";

const services = [
  { icon: Package, t: "Mi Taxi Envíos", d: "Reparto de paquetes el mismo día dentro de la ZMG. Desde documentos hasta muebles pequeños.", tag: "Nuevo" },
  { icon: ShoppingBasket, t: "Mi Taxi Súper", d: "Pide despensa, frutas y verduras del mercado local. El conductor compra y lleva a tu casa.", tag: "Apoya mercados" },
  { icon: HandHelping, t: "Mi Taxi Favor", d: "Recoger recetas, pagar un recibo, llevar un regalo. Mandas el favor y te lo cumplen.", tag: "Sin filas" },
  { icon: Pill, t: "Mi Taxi Farmacia", d: "Medicamentos en menos de 30 minutos con verificación de receta médica.", tag: "24/7" },
  { icon: Baby, t: "Mi Taxi Niños", d: "Conductores certificados por DIF Jalisco para llevar a tus hijos a la escuela con silla infantil.", tag: "Certificado" },
  { icon: GraduationCap, t: "Mi Taxi Escolar", d: "Rutas fijas mensuales a escuelas con el mismo conductor verificado.", tag: "Ruta fija" },
  { icon: Dog, t: "Mi Taxi Pet", d: "Viajes pet-friendly con conductores que aceptan mascotas y jaulas transportadoras.", tag: "Pet friendly" },
  { icon: Plane, t: "Mi Taxi Aeropuerto", d: "Tarifa plana a GDL Airport. Sin sorpresas, con seguimiento de vuelo en tiempo real.", tag: "Tarifa fija" },
];

export default function Services() {
  return (
    <section id="servicios" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.25em] text-neon-pink mb-3">Más que taxi</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Una plataforma, <span className="text-gradient">ocho servicios</span>.
          </h2>
          <p className="mt-4 text-white/70 text-lg">
            No solo movemos personas. Movemos lo que necesites — paquetes, súper, medicinas, hasta favores. Todo con la misma red de conductores verificados.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map(({ icon: Icon, t, d, tag }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.07 }}
              className="group glass rounded-2xl p-6 hover:bg-white/5 transition relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon-pink/10 blur-2xl opacity-0 group-hover:opacity-100 transition" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-neon-pink/20 to-neon-violet/20 border border-white/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-neon-pink" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-white/60">{tag}</span>
                </div>
                <h3 className="mt-4 font-display font-semibold text-lg">{t}</h3>
                <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
