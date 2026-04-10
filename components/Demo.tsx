"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Car, Star, MapPin, Radar, CheckCircle2, Play, Pause, RotateCcw,
  ChevronRight, Shield, CreditCard, BadgeCheck, Siren, Users, ArrowRight,
  Phone, MessageCircle, Fingerprint,
} from "lucide-react";

const STEPS = [
  { label: "Pides tu viaje", d: "Destino, servicio y tarifa confirmada." },
  { label: "Match en segundos", d: "El conductor más cercano te acepta." },
  { label: "Conductor verificado", d: "7 filtros, biometría y rating real." },
  { label: "Viaje monitoreado", d: "IA vigila la ruta. Familia ve en vivo." },
  { label: "SOS conectado al C5", d: "Un botón → policía en 5 segundos." },
  { label: "Llegas y pagas", d: "Tarjeta, efectivo o CoDi. Sin sorpresas." },
  { label: "Calificas y reseñas", d: "Propina 100% al conductor." },
];

const STEP_DURATION = 5000;

export default function Demo() {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const started = step >= 0;
  const done = step >= STEPS.length - 1;

  useEffect(() => {
    if (!playing || done) return;
    timer.current = setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), STEP_DURATION);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [step, playing, done]);

  const start = () => { setStep(0); setPlaying(true); };
  const reset = () => { setStep(-1); setPlaying(false); };
  const toggle = () => {
    if (!started) return start();
    if (done) return reset();
    setPlaying((p) => !p);
  };

  const progress = started ? ((step + 1) / STEPS.length) * 100 : 0;
  const icons = [MapPin, Radar, BadgeCheck, Shield, Siren, CreditCard, Star];

  return (
    <section id="demo" className="relative py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Así funciona <span className="text-gradient">un viaje</span>.
          </h2>

          {!started && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <button onClick={start} className="inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-6 py-3 text-black font-semibold hover:opacity-90 glow">
                <Play className="h-4 w-4" /> Iniciar simulación
              </button>
            </motion.div>
          )}
        </div>

        {started && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Progress bar */}
            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden mb-8">
              <motion.div className="h-full bg-neon-cyan" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
              {/* Phone */}
              <div className="flex justify-center">
                <div className="glass rounded-[40px] p-3 glow w-full max-w-[300px]">
                  <div className="rounded-[32px] bg-gradient-to-b from-jalisco-900 to-black h-[520px] relative overflow-hidden">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1 w-12 rounded-full bg-white/20 z-10" />
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="p-5 pt-7 h-full"
                      >
                        <PhoneScreen step={step} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Steps list */}
              <div className="space-y-2">
                {STEPS.map((s, i) => {
                  const Icon = icons[i];
                  const active = i === step;
                  const past = i < step;
                  return (
                    <button
                      key={i}
                      onClick={() => setStep(i)}
                      className={`w-full text-left flex items-center gap-3 rounded-xl p-3 transition ${
                        active ? "glass bg-white/5 ring-1 ring-neon-cyan/40" : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${
                        active ? "bg-neon-cyan/15 border border-neon-cyan/30" : past ? "bg-neon-cyan/10" : "bg-white/5"
                      }`}>
                        {past ? <CheckCircle2 className="h-4 w-4 text-neon-cyan" /> : <Icon className={`h-4 w-4 ${active ? "text-neon-cyan" : "text-white/40"}`} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold ${active ? "text-white" : past ? "text-white/80" : "text-white/50"}`}>{s.label}</div>
                        {active && <div className="text-xs text-white/60 mt-0.5">{s.d}</div>}
                      </div>
                      <div className={`text-xs ${active ? "text-neon-cyan" : "text-white/30"}`}>{i + 1}/{STEPS.length}</div>
                    </button>
                  );
                })}

                {/* Controls */}
                <div className="flex items-center justify-center gap-2 pt-3">
                  <button onClick={toggle} className="glass rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-white/10">
                    {done ? <><RotateCcw className="h-3 w-3" /> Reiniciar</> : playing ? <><Pause className="h-3 w-3" /> Pausar</> : <><Play className="h-3 w-3" /> Continuar</>}
                  </button>
                  {!done && (
                    <button onClick={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))} className="glass rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-1 hover:bg-white/10">
                      Siguiente <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {done && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-3">
                    <Link href="/app" className="inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-6 py-3 text-black font-semibold hover:opacity-90 glow">
                      Probar la app en vivo <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ==================== PHONE SCREENS ==================== */

function MiniMap({ progress = 0 }: { progress?: number }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 h-[180px] relative bg-[#0a0a0a]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 180" preserveAspectRatio="none">
        <defs>
          <linearGradient id="drt" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#10b981" /><stop offset="1" stopColor="#065f46" /></linearGradient>
          <pattern id="dg" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" /></pattern>
        </defs>
        <rect width="300" height="180" fill="url(#dg)" />
        <line x1="0" y1="130" x2="300" y2="120" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
        <line x1="70" y1="0" x2="80" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        <path d="M 60 150 Q 120 130 150 100 T 250 30" stroke="url(#drt)" strokeWidth="3" fill="none" />
        <circle cx="60" cy="150" r="4" fill="#10b981" /><circle cx="250" cy="30" r="4" fill="#22c55e" />
      </svg>
      <motion.div className="absolute" animate={{ left: `${18 + progress * 65}%`, top: `${82 - progress * 65}%` }} transition={{ duration: 1 }}>
        <div className="h-5 w-5 rounded-full bg-neon-cyan glow flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <Car className="h-2.5 w-2.5 text-black" />
        </div>
      </motion.div>
    </div>
  );
}

function PhoneScreen({ step }: { step: number }) {
  if (step === 0) return (
    <div className="flex flex-col h-full">
      <div className="text-xs text-white/60">Hola, Sofía 👋</div>
      <div className="font-display text-lg font-bold">¿A dónde vamos?</div>
      <div className="mt-3 glass rounded-xl p-2.5 text-xs flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon-pink" /> Av. Chapultepec 123</div>
      <div className="mt-1.5 glass rounded-xl p-2.5 text-xs flex items-center gap-2 ring-1 ring-neon-cyan/30"><span className="h-1.5 w-1.5 rounded-full bg-neon-lime" /> Plaza del Sol</div>
      <div className="mt-3"><MiniMap /></div>
      <div className="mt-3 flex items-center justify-between">
        <div><div className="text-[10px] text-white/60">Total</div><div className="font-display text-xl font-bold text-gradient">$68</div></div>
        <div className="rounded-xl bg-neon-cyan px-4 py-2 text-black font-bold text-xs">Pedir viaje</div>
      </div>
    </div>
  );

  if (step === 1) return (
    <div className="flex flex-col h-full items-center justify-center text-center">
      <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} className="h-20 w-20 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center">
        <Radar className="h-8 w-8 text-neon-cyan" />
      </motion.div>
      <div className="mt-4 font-display text-lg font-bold">Buscando...</div>
      <div className="mt-1 text-xs text-white/60">Priorizando cercanos con ≥ 4.8 ⭐</div>
    </div>
  );

  if (step === 2) return (
    <div className="flex flex-col h-full">
      <div className="text-[10px] text-neon-cyan font-semibold">CONDUCTOR ASIGNADO</div>
      <div className="mt-2 glass rounded-xl p-3 flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-neon-lime to-neon-cyan" />
        <div>
          <div className="font-bold text-sm">Don Roberto M.</div>
          <div className="text-[10px] text-white/60 flex items-center gap-1"><Star className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" /> 4.97 · JAL-1234</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5 text-[9px]">
        <div className="rounded-lg bg-neon-lime/10 border border-neon-lime/20 p-1.5 flex items-center gap-1 text-neon-lime"><BadgeCheck className="h-3 w-3" /> INE verificada</div>
        <div className="rounded-lg bg-neon-lime/10 border border-neon-lime/20 p-1.5 flex items-center gap-1 text-neon-lime"><Fingerprint className="h-3 w-3" /> Biometría</div>
        <div className="rounded-lg bg-neon-lime/10 border border-neon-lime/20 p-1.5 flex items-center gap-1 text-neon-lime"><Shield className="h-3 w-3" /> Antecedentes</div>
        <div className="rounded-lg bg-neon-lime/10 border border-neon-lime/20 p-1.5 flex items-center gap-1 text-neon-lime"><Car className="h-3 w-3" /> Vehículo OK</div>
      </div>
      <div className="mt-3"><MiniMap progress={0.1} /></div>
      <div className="mt-auto text-center text-xs text-white/60">Llega en <b className="text-neon-cyan">3 min</b></div>
    </div>
  );

  if (step === 3) return (
    <div className="flex flex-col h-full">
      <div className="text-xs text-white/60">En camino a</div>
      <div className="font-display text-base font-bold">Plaza del Sol</div>
      <div className="mt-3"><MiniMap progress={0.55} /></div>
      <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
        <div className="glass rounded-lg p-2"><div className="text-[9px] text-white/50">ETA</div><div className="text-xs font-bold">8 min</div></div>
        <div className="glass rounded-lg p-2"><div className="text-[9px] text-white/50">Km</div><div className="text-xs font-bold">4.2</div></div>
        <div className="glass rounded-lg p-2"><div className="text-[9px] text-white/50">Tarifa</div><div className="text-xs font-bold text-gradient">$68</div></div>
      </div>
      <div className="mt-3 glass rounded-lg p-2 text-[10px] flex items-center gap-2 bg-neon-lime/5"><Radar className="h-3 w-3 text-neon-lime" /> <span className="text-neon-lime">Ruta óptima · IA activa</span></div>
      <div className="mt-1.5 glass rounded-lg p-2 text-[10px] flex items-center gap-2"><Users className="h-3 w-3 text-neon-cyan" /> Mamá viendo en vivo</div>
    </div>
  );

  if (step === 4) return (
    <div className="flex flex-col h-full items-center justify-center text-center">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
        <Siren className="h-16 w-16 text-red-400" />
      </motion.div>
      <div className="mt-4 font-display text-lg font-bold text-red-300">Botón SOS</div>
      <div className="mt-2 text-xs text-white/70">Un toque → alerta al C5 Jalisco</div>
      <div className="mt-4 w-full glass rounded-xl p-3 text-[10px] space-y-1">
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Ubicación enviada</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Foto + placas enviadas</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> 3 contactos notificados</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Grabación de audio ON</div>
      </div>
      <div className="mt-3 text-[10px] text-white/50">Tiempo de respuesta: <b className="text-neon-cyan">4.2s</b></div>
    </div>
  );

  if (step === 5) return (
    <div className="flex flex-col h-full">
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-4">
        <CheckCircle2 className="h-14 w-14 text-neon-lime mx-auto" />
        <div className="mt-2 font-display text-lg font-bold">¡Llegaste!</div>
        <div className="text-xs text-white/60">Plaza del Sol</div>
      </motion.div>
      <div className="glass rounded-xl p-3 space-y-1.5 text-xs">
        <div className="flex justify-between"><span className="text-white/60">Tarifa</span><span>$68.00</span></div>
        <div className="flex justify-between border-t border-white/10 pt-1.5 font-bold"><span>Total</span><span className="text-gradient">$68.00</span></div>
      </div>
      <div className="mt-3 text-[10px] text-white/60 mb-1">Método de pago</div>
      <div className="glass rounded-lg p-2.5 flex items-center gap-2 ring-1 ring-neon-cyan/30 text-xs">
        <CreditCard className="h-3.5 w-3.5 text-neon-cyan" />
        <span className="flex-1">BBVA •••• 4821</span>
        <CheckCircle2 className="h-3.5 w-3.5 text-neon-lime" />
      </div>
    </div>
  );

  // step 6 - rating
  return (
    <div className="flex flex-col h-full items-center text-center">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-neon-lime to-neon-cyan mt-2" />
      <div className="mt-2 font-bold">Don Roberto M.</div>
      <div className="mt-3 flex gap-1">
        {[1,2,3,4,5].map((i) => (
          <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15 }}>
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {["👍 Amable","🧼 Limpio","🕐 Puntual"].map((t) => (
          <span key={t} className="text-[10px] glass rounded-full px-2.5 py-1">{t}</span>
        ))}
      </div>
      <div className="mt-4 glass rounded-xl p-3 w-full">
        <div className="text-[10px] text-white/60">Propina (100% al conductor)</div>
        <div className="mt-1.5 flex gap-1.5">
          {[10,20,30].map((v) => (
            <div key={v} className={`flex-1 rounded-lg py-1.5 text-xs text-center ${v === 20 ? "bg-neon-cyan text-black font-bold" : "glass"}`}>${v}</div>
          ))}
        </div>
      </div>
      <div className="mt-4 glass rounded-xl p-3 w-full">
        <div className="text-[10px] text-white/60">Resumen</div>
        <div className="font-display text-xl font-bold text-gradient mt-1">$88.00</div>
        <div className="text-[9px] text-white/50">Don Roberto recibe $81.20</div>
      </div>
    </div>
  );
}
