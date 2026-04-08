"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Smartphone, Car, MapPin, Star, Phone, Siren, CheckCircle2 } from "lucide-react";

type Stage = "idle" | "searching" | "matched" | "arriving" | "onroute" | "done";

export default function Demo() {
  const [mode, setMode] = useState<"passenger" | "driver">("passenger");
  const [stage, setStage] = useState<Stage>("idle");

  useEffect(() => {
    if (stage === "searching") { const t = setTimeout(() => setStage("matched"), 1800); return () => clearTimeout(t); }
    if (stage === "matched") { const t = setTimeout(() => setStage("arriving"), 2000); return () => clearTimeout(t); }
    if (stage === "arriving") { const t = setTimeout(() => setStage("onroute"), 2500); return () => clearTimeout(t); }
    if (stage === "onroute") { const t = setTimeout(() => setStage("done"), 3500); return () => clearTimeout(t); }
  }, [stage]);

  const reset = () => setStage("idle");

  return (
    <section id="demo" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-neon-cyan mb-3">Demo interactiva</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Pruébala <span className="text-gradient">ahora mismo</span>.
            </h2>
            <p className="mt-4 text-white/70 text-lg">
              Simula un viaje completo: desde pedirlo como pasajero hasta aceptarlo como conductor.
            </p>
          </div>
          <div className="glass rounded-full p-1 flex">
            <button
              onClick={() => { setMode("passenger"); reset(); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${mode === "passenger" ? "bg-gradient-to-r from-neon-cyan to-neon-violet text-black" : "text-white/70"}`}
            >
              <Smartphone className="h-4 w-4" /> Pasajero
            </button>
            <button
              onClick={() => { setMode("driver"); reset(); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${mode === "driver" ? "bg-gradient-to-r from-neon-lime to-neon-cyan text-black" : "text-white/70"}`}
            >
              <Car className="h-4 w-4" /> Conductor
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Phone */}
          <div className="flex justify-center">
            <div className="glass rounded-[44px] p-3 glow w-full max-w-[360px]">
              <div className="rounded-[36px] bg-gradient-to-b from-jalisco-900 to-black p-5 h-[640px] relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {mode === "passenger" ? (
                    <PassengerUI key={"p-" + stage} stage={stage} onRequest={() => setStage("searching")} onReset={reset} />
                  ) : (
                    <DriverUI key={"d-" + stage} stage={stage} onAccept={() => setStage("arriving")} onReset={reset} />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Side explainer */}
          <div className="space-y-4">
            <StageCard active={stage === "idle"} n="1" t={mode === "passenger" ? "Abre la app y pide tu viaje" : "Esperando solicitudes cercanas"} d={mode === "passenger" ? "Interfaz limpia, sin publicidad, sin tarifas ocultas. Ingresas origen y destino." : "Solo llegan viajes dentro de tu zona. Tú eliges aceptar o no."} />
            <StageCard active={stage === "searching" || stage === "matched"} n="2" t="Match inteligente en segundos" d="Algoritmo local que prioriza cercanía, rating y zonas conocidas por el conductor." />
            <StageCard active={stage === "arriving"} n="3" t="Conductor verificado en camino" d="Ves foto, INE verificada, placas y rating. Puedes llamar o chatear sin mostrar tu número." />
            <StageCard active={stage === "onroute"} n="4" t="Viaje con rastreo y SOS" d="Tu familia ve la ruta en vivo. Un botón rojo conecta directo al C5." />
            <StageCard active={stage === "done"} n="5" t="Pago + propina 100% al conductor" d="Efectivo, tarjeta, CoDi o SPEI. La propina nunca la tocamos." />

            <button onClick={reset} className="mt-4 glass rounded-2xl px-5 py-3 text-sm font-semibold hover:bg-white/10">
              ↻ Reiniciar demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function StageCard({ active, n, t, d }: { active: boolean; n: string; t: string; d: string }) {
  return (
    <div className={`glass rounded-2xl p-5 transition-all ${active ? "ring-2 ring-neon-cyan/60 bg-white/5" : "opacity-60"}`}>
      <div className="flex items-start gap-4">
        <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-bold ${active ? "bg-gradient-to-br from-neon-cyan to-neon-violet text-black" : "bg-white/5 text-white/50"}`}>{n}</div>
        <div>
          <div className="font-display font-semibold">{t}</div>
          <div className="text-sm text-white/60 mt-0.5">{d}</div>
        </div>
      </div>
    </div>
  );
}

function MiniMap({ progress = 0 }: { progress?: number }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 h-[260px] relative bg-[#0a1220]">
      <div className="absolute inset-0 grid-bg opacity-70" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 260" fill="none">
        <path d="M20 220 Q 120 180 160 120 T 300 20" stroke="url(#g)" strokeWidth="3" strokeDasharray="6 6" />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#22e9ff" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute left-4 bottom-4 h-3 w-3 rounded-full bg-neon-pink ring-4 ring-neon-pink/30" />
      <div className="absolute right-4 top-4 h-3 w-3 rounded-full bg-neon-lime ring-4 ring-neon-lime/30" />
      <motion.div
        className="absolute h-4 w-4 rounded-full bg-neon-cyan glow flex items-center justify-center"
        initial={{ left: "5%", top: "82%" }}
        animate={{ left: `${5 + progress * 85}%`, top: `${82 - progress * 75}%` }}
        transition={{ duration: 1.5 }}
      >
        <Car className="h-2.5 w-2.5 text-black" />
      </motion.div>
    </div>
  );
}

function PassengerUI({ stage, onRequest, onReset }: { stage: Stage; onRequest: () => void; onReset: () => void }) {
  if (stage === "idle")
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
        <div className="text-xs text-white/60">Hola, Sofía 👋</div>
        <div className="font-display text-xl font-bold">¿A dónde vamos?</div>
        <div className="mt-4 space-y-2">
          <div className="glass rounded-xl p-3 text-sm flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neon-pink" /> Av. Chapultepec 123, GDL</div>
          <div className="glass rounded-xl p-3 text-sm flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neon-lime" /> Plaza del Sol</div>
        </div>
        <div className="mt-4"><MiniMap progress={0} /></div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-white/60">Tarifa estimada</div>
            <div className="font-display text-2xl font-bold text-gradient">$68 MXN</div>
            <div className="text-[11px] text-white/50">Uber: ~$89 MXN</div>
          </div>
          <button onClick={onRequest} className="rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet px-5 py-3 text-black font-bold text-sm">Pedir viaje</button>
        </div>
      </motion.div>
    );

  if (stage === "searching")
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-24 w-24 rounded-full bg-gradient-to-br from-neon-cyan to-neon-violet glow flex items-center justify-center">
          <Car className="h-10 w-10 text-black" />
        </motion.div>
        <div className="mt-6 font-display text-xl font-bold">Buscando conductor...</div>
        <div className="mt-1 text-sm text-white/60">Priorizando los más cercanos</div>
      </motion.div>
    );

  if (stage === "matched" || stage === "arriving")
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
        <div className="glass rounded-xl p-3 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-neon-lime to-neon-cyan" />
          <div className="flex-1">
            <div className="font-semibold">Don Roberto M.</div>
            <div className="text-xs text-white/60 flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400 fill-yellow-400" /> 4.97 · Nissan Tsuru blanco · JAL-1234</div>
          </div>
          <Phone className="h-5 w-5 text-neon-cyan" />
        </div>
        <div className="mt-3"><MiniMap progress={0.3} /></div>
        <div className="mt-3 glass rounded-xl p-3 text-sm">Llega en <b className="text-neon-cyan">3 min</b></div>
        <div className="mt-auto flex gap-2">
          <button className="flex-1 glass rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2"><Siren className="h-4 w-4 text-red-400" /> SOS</button>
          <button className="flex-1 glass rounded-xl py-3 text-sm font-semibold">Compartir viaje</button>
        </div>
      </motion.div>
    );

  if (stage === "onroute")
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
        <div className="text-xs text-white/60">En camino a</div>
        <div className="font-display text-lg font-bold">Plaza del Sol</div>
        <div className="mt-3"><MiniMap progress={0.85} /></div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="glass rounded-xl p-2"><div className="text-xs text-white/50">ETA</div><div className="font-bold">6 min</div></div>
          <div className="glass rounded-xl p-2"><div className="text-xs text-white/50">Distancia</div><div className="font-bold">2.4 km</div></div>
          <div className="glass rounded-xl p-2"><div className="text-xs text-white/50">Tarifa</div><div className="font-bold text-gradient">$68</div></div>
        </div>
        <div className="mt-auto glass rounded-xl p-3 text-xs text-white/70">
          🛡️ Viaje compartido con <b className="text-white">Mamá</b> en tiempo real
        </div>
      </motion.div>
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center">
      <CheckCircle2 className="h-20 w-20 text-neon-lime" />
      <div className="mt-4 font-display text-2xl font-bold">¡Llegaste!</div>
      <div className="mt-1 text-white/60 text-sm">Califica a Don Roberto</div>
      <div className="mt-4 flex gap-1">{[1,2,3,4,5].map(i => <Star key={i} className="h-7 w-7 text-yellow-400 fill-yellow-400" />)}</div>
      <div className="mt-6 glass rounded-xl p-4 w-full">
        <div className="text-xs text-white/60">Total cobrado</div>
        <div className="font-display text-3xl font-bold text-gradient">$68 MXN</div>
        <div className="text-[11px] text-white/50">Don Roberto recibe $61.20 (90%) · Propina 100% suya</div>
      </div>
      <button onClick={onReset} className="mt-4 text-xs text-neon-cyan underline">Reiniciar</button>
    </motion.div>
  );
}

function DriverUI({ stage, onAccept, onReset }: { stage: Stage; onAccept: () => void; onReset: () => void }) {
  if (stage === "idle" || stage === "searching")
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-white/60">Modo conductor</div>
            <div className="font-display text-lg font-bold">En línea 🟢</div>
          </div>
          <div className="glass rounded-full px-3 py-1 text-xs">Hoy: <b className="text-neon-lime">$842</b></div>
        </div>
        <div className="mt-3"><MiniMap progress={0.1} /></div>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-4 glass rounded-2xl p-4 border-2 border-neon-cyan/40"
        >
          <div className="text-xs text-neon-cyan font-semibold">NUEVA SOLICITUD</div>
          <div className="mt-1 font-display text-lg font-bold">Sofía R. · ⭐ 4.9</div>
          <div className="mt-2 text-xs text-white/70 flex items-center gap-2"><MapPin className="h-3 w-3 text-neon-pink" /> Av. Chapultepec 123</div>
          <div className="text-xs text-white/70 flex items-center gap-2"><MapPin className="h-3 w-3 text-neon-lime" /> Plaza del Sol (2.4 km)</div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-white/50">Ganas</div>
              <div className="font-display text-2xl font-bold text-gradient">$61.20</div>
            </div>
            <button onClick={onAccept} className="rounded-xl bg-gradient-to-r from-neon-lime to-neon-cyan px-5 py-3 text-black font-bold text-sm">Aceptar</button>
          </div>
        </motion.div>
      </motion.div>
    );

  if (stage === "matched" || stage === "arriving" || stage === "onroute")
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
        <div className="text-xs text-white/60">Recogiendo a</div>
        <div className="font-display text-lg font-bold">Sofía R.</div>
        <div className="mt-3"><MiniMap progress={stage === "onroute" ? 0.9 : 0.4} /></div>
        <div className="mt-3 glass rounded-xl p-3 text-sm">
          {stage === "onroute" ? "En camino al destino · ETA 6 min" : "Llegando en 3 min · Av. Chapultepec 123"}
        </div>
        <div className="mt-auto flex gap-2">
          <button className="flex-1 glass rounded-xl py-3 text-sm font-semibold">Navegar</button>
          <button className="flex-1 rounded-xl bg-gradient-to-r from-neon-lime to-neon-cyan py-3 text-sm font-bold text-black">Llamar</button>
        </div>
      </motion.div>
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center">
      <CheckCircle2 className="h-20 w-20 text-neon-lime" />
      <div className="mt-4 font-display text-2xl font-bold">¡Viaje completado!</div>
      <div className="mt-4 glass rounded-xl p-4 w-full">
        <div className="text-xs text-white/60">Tus ganancias</div>
        <div className="font-display text-3xl font-bold text-gradient">$61.20 MXN</div>
        <div className="text-[11px] text-white/50">De $68 · Comisión plataforma: $6.80 (10%)</div>
        <div className="mt-2 text-[11px] text-neon-lime">💰 En Uber hubieras recibido $47.60</div>
      </div>
      <button onClick={onReset} className="mt-4 text-xs text-neon-cyan underline">Reiniciar</button>
    </motion.div>
  );
}
