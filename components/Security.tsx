"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Fingerprint, Eye, Lock, Siren, PhoneCall, Radar, Users, FileSearch, Mic, Video, AlertTriangle } from "lucide-react";

const items = [
  { icon: Siren, t: "Botón de pánico → Policía 24/7", d: "Presionas SOS y en menos de 5 segundos tu ubicación, foto del conductor y placas llegan al C5 Jalisco y Policía Estatal. El viaje se graba automáticamente." },
  { icon: Radar, t: "Detección de desvíos con IA", d: "Si el conductor se sale de la ruta óptima más de 300 metros sin motivo, la app alerta al pasajero, a familiares y al centro de monitoreo." },
  { icon: Users, t: "Compartir viaje con familia", d: "Mamá, pareja o amigos ven tu ruta en vivo en un link web — sin necesidad de instalar la app." },
  { icon: FileSearch, t: "Análisis crítico del conductor", d: "Cada conductor tiene un score de comportamiento: frenadas bruscas, exceso de velocidad, quejas, rating. Los de bajo score entran a capacitación o son removidos." },
  { icon: ShieldCheck, t: "Verificación 7 filtros", d: "INE validada con RENAPO, antecedentes no penales, revisión médica, psicometría, licencia vigente, revisión vehicular, examen de conducción defensiva." },
  { icon: Fingerprint, t: "Biometría al iniciar turno", d: "Huella y reconocimiento facial antes de cada turno. Nadie más puede usar la cuenta de un conductor." },
  { icon: Video, t: "Grabación opcional del viaje", d: "El pasajero activa audio/video desde su app. Se guarda cifrado solo 72 horas y se libera únicamente con orden judicial." },
  { icon: Mic, t: "Palabra clave de emergencia", d: "Defines una palabra secreta. Al decirla a un operador fingiendo ser un familiar, se activa protocolo silencioso y se manda patrulla." },
  { icon: AlertTriangle, t: "Alerta por paradas sospechosas", d: "Si el carro se detiene más de 2 min sin estar en una parada programada, la app pregunta '¿estás bien?'. Sin respuesta = alerta automática." },
  { icon: Eye, t: "Monitoreo humano 24/7", d: "Centro de monitoreo real en Guadalajara — humanos, no bots — atendiendo emergencias en español y revisando alertas de IA." },
  { icon: PhoneCall, t: "Línea directa 911 integrada", d: "Sin salir de la app, llamada directa a 911 con tu ubicación y datos del conductor pre-cargados." },
  { icon: Lock, t: "Datos en México, cifrado E2E", d: "Servidores en México bajo ley mexicana. Tus datos nunca salen del país ni se venden a terceros." },
];

export default function Security() {
  return (
    <section id="seguridad" className="relative py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-neon-violet/10 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-6 relative">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.25em] text-neon-lime mb-3">Seguridad</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Tu mamá va a estar <span className="text-gradient">más tranquila</span>.
          </h2>
          <p className="mt-4 text-white/70 text-lg">
            Construimos la capa de seguridad desde cero trabajando con el C5 Jalisco y asociaciones de taxistas locales.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(({ icon: Icon, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6"
            >
              <div className="h-11 w-11 rounded-xl bg-neon-violet/15 border border-neon-violet/30 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-neon-violet" />
              </div>
              <h3 className="font-display font-semibold text-lg">{t}</h3>
              <p className="mt-1.5 text-sm text-white/60">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
