"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Car, Star, MapPin, Radar, CheckCircle2, Play, Pause, RotateCcw,
  ChevronRight, Shield, CreditCard, BadgeCheck, Siren, Users, ArrowRight,
} from "lucide-react";

const STEPS = [
  { label: "Pides tu viaje", d: "Eliges destino, servicio y confirmas la tarifa." },
  { label: "Match en segundos", d: "Algoritmo local te asigna al conductor más cercano." },
  { label: "Conductor verificado", d: "Ves nombre, foto, rating, placas y 7 filtros de seguridad." },
  { label: "Viaje monitoreado", d: "IA vigila la ruta. Tu familia ve el viaje en vivo." },
  { label: "SOS conectado al C5", d: "Un botón envía tu ubicación a la policía en 5 segundos." },
  { label: "Llegas y pagas", d: "Tarjeta, efectivo o CoDi. Sin cargos ocultos." },
  { label: "Calificas y dejas reseña", d: "Propina 100% para el conductor. Rating verificado." },
];

const STEP_DURATION = 4000;

export default function Demo() {
  const [step, setStep] = useState(-1); // -1 = not started
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

  const icons = [MapPin, Radar, BadgeCheck, Shield, Siren, CreditCard, Star];
  const progress = started ? ((step + 1) / STEPS.length) * 100 : 0;

  return (
    <section id="demo" className="relative py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center">
          Así funciona <span className="text-gradient">un viaje</span>.
        </h2>
        <p className="mt-3 text-white/70 text-center">Simulación paso a paso de un viaje completo.</p>

        {/* Start button (pre-simulation) */}
        {!started && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center">
            <button
              onClick={start}
              className="inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-6 py-3 text-black font-semibold hover:opacity-90 glow"
            >
              <Play className="h-4 w-4" /> Iniciar simulación
            </button>
          </motion.div>
        )}

        {/* Progress + steps */}
        {started && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            {/* Progress bar */}
            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden mb-6">
              <motion.div
                className="h-full bg-neon-cyan"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Current step */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="glass rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="h-11 w-11 shrink-0 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center">
                  {(() => { const Icon = icons[step] ?? CheckCircle2; return <Icon className="h-5 w-5 text-neon-cyan" />; })()}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-neon-cyan mb-1">Paso {step + 1} de {STEPS.length}</div>
                  <h3 className="font-display text-lg font-bold">{STEPS[step].label}</h3>
                  <p className="mt-1 text-sm text-white/70">{STEPS[step].d}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Step dots */}
            <div className="mt-4 flex items-center justify-center gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === step ? "w-6 bg-neon-cyan" : i < step ? "w-2 bg-neon-cyan/40" : "w-2 bg-white/15"
                  }`}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <button onClick={toggle} className="glass rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-white/10">
                {done ? <><RotateCcw className="h-3 w-3" /> Reiniciar</> : playing ? <><Pause className="h-3 w-3" /> Pausar</> : <><Play className="h-3 w-3" /> Continuar</>}
              </button>
              {!done && (
                <button onClick={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))} className="glass rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-1 hover:bg-white/10">
                  Siguiente <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* CTA after simulation ends */}
            {done && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-6 py-3 text-black font-semibold hover:opacity-90 glow"
                >
                  Probar la app en vivo <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
