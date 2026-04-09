"use client";
import { motion } from "framer-motion";
import {
  Wallet, ShieldCheck, MapPin, Users, Car, Star, Zap, Heart,
  Languages, CreditCard, Bell, Siren, Route, BadgeCheck,
} from "lucide-react";

const features = [
  { icon: Wallet, t: "Solo 10% de comisión", d: "El conductor se queda con el 90%. Sin sorpresas, sin tarifas dinámicas abusivas." },
  { icon: Siren, t: "Botón de pánico SOS", d: "Conectado directo a C5 Jalisco y contactos de confianza en menos de 5 segundos." },
  { icon: BadgeCheck, t: "Verificación doble", d: "INE, antecedentes no penales, revisión vehicular y examen psicométrico para cada conductor." },
  { icon: Route, t: "Rutas inteligentes", d: "IA local entrenada con tráfico de Guadalajara, Zapopan, Tlaquepaque y Tonalá." },
  { icon: Users, t: "Viaje compartido real", d: "Divide el costo con amigos o desconocidos verificados. Hasta 40% más barato." },
  { icon: Car, t: "Taxis + particulares + motos", d: "Una sola app. Incluye taxis formales, informales y autos particulares." },
  { icon: CreditCard, t: "Paga como quieras", d: "Efectivo, tarjeta, SPEI, CoDi, Mercado Pago, vales de despensa y puntos." },
  { icon: Star, t: "Propinas directas", d: "100% de la propina al conductor. Nosotros no tocamos un peso." },
  { icon: Bell, t: "Alertas familiares", d: "Comparte el viaje en vivo con mamá, pareja o amigos con un toque." },
  { icon: Languages, t: "Español + wixárika + inglés", d: "La primera app de movilidad que respeta las lenguas originarias de Jalisco." },
  { icon: Heart, t: "Programa de salud", d: "Seguro de gastos médicos y dental para conductores activos sin costo extra." },
  { icon: Zap, t: "Pagos en 24h", d: "El conductor cobra al día siguiente. Otras apps tardan hasta una semana." },
  { icon: MapPin, t: "Paradas múltiples", d: "Hasta 5 paradas en un mismo viaje sin pagar el doble." },
  { icon: ShieldCheck, t: "Seguro de viaje incluido", d: "Cobertura para pasajero y conductor en cada trayecto, sin costo adicional." },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <div className="text-xs uppercase tracking-[0.25em] text-neon-cyan mb-3">Lo que la competencia no te da</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Funciones pensadas <span className="text-gradient">para México</span>,<br /> no para empresas extranjeras.
          </h2>
          <p className="mt-4 text-white/70 text-lg">
            Cada función nació escuchando a taxistas de Guadalajara y usuarios reales. Aquí no copiamos — mejoramos.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05 }}
              className="group glass rounded-2xl p-6 hover:bg-white/5 transition relative overflow-hidden"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 blur-2xl opacity-0 group-hover:opacity-100 transition" />
              <div className="relative">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 border border-white/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-neon-cyan" />
                </div>
                <h3 className="font-display font-semibold text-lg">{t}</h3>
                <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
