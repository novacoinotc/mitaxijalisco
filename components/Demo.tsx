"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Smartphone, Car, Star, Phone, Siren, CheckCircle2, Play, Pause, RotateCcw,
  ChevronRight, ChevronLeft, Shield, MapPin, MessageCircle, Users, Radar,
  Navigation, CreditCard, Banknote, Gift, BadgeCheck, Fingerprint, Eye,
  ThumbsUp, Heart, Package, ShoppingBasket,
} from "lucide-react";

type Stage =
  | "home"          // 0 - pantalla principal, elegir servicio
  | "pickup"        // 1 - set origen/destino con autocomplete
  | "services"      // 2 - elegir tipo de servicio (ride, envios, super, etc)
  | "fare"          // 3 - ver tarifa estimada y métodos de pago
  | "searching"     // 4 - buscando conductor
  | "matched"       // 5 - conductor encontrado, ver perfil y verificación
  | "arriving"      // 6 - conductor en camino, compartir viaje, chat
  | "pickedup"      // 7 - pasajero abordó, activar SOS, monitoreo
  | "onroute"       // 8 - en camino, IA monitorea ruta
  | "arrived"       // 9 - llegaste al destino
  | "payment"       // 10 - pago
  | "rating"        // 11 - calificar conductor
  | "review"        // 12 - dejar reseña escrita
  | "done";         // 13 - resumen final con comparación

const STAGES: Stage[] = [
  "home","pickup","services","fare","searching","matched","arriving",
  "pickedup","onroute","arrived","payment","rating","review","done",
];

const STAGE_LABELS: Record<Stage, string> = {
  home: "Inicio",
  pickup: "Origen y destino",
  services: "Elegir servicio",
  fare: "Tarifa y pago",
  searching: "Buscando conductor",
  matched: "Conductor verificado",
  arriving: "En camino a ti",
  pickedup: "Viaje iniciado",
  onroute: "En trayecto con IA",
  arrived: "Llegaste",
  payment: "Pago",
  rating: "Calificación",
  review: "Reseña",
  done: "Resumen",
};

// Tiempos por etapa (ms) — MÁS LENTOS para explicar
const STAGE_DURATIONS: Record<Stage, number> = {
  home: 6000,
  pickup: 7000,
  services: 6000,
  fare: 7000,
  searching: 5000,
  matched: 7000,
  arriving: 7000,
  pickedup: 6000,
  onroute: 10000,
  arrived: 5000,
  payment: 6000,
  rating: 6000,
  review: 7000,
  done: 0,
};

export default function Demo() {
  const [stageIdx, setStageIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stage = STAGES[stageIdx];
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing) return;
    if (stage === "done") { setPlaying(false); return; }
    timer.current = setTimeout(() => {
      setStageIdx((i) => Math.min(i + 1, STAGES.length - 1));
    }, STAGE_DURATIONS[stage]);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [stage, playing]);

  const next = () => setStageIdx((i) => Math.min(i + 1, STAGES.length - 1));
  const prev = () => setStageIdx((i) => Math.max(i - 1, 0));
  const reset = () => { setStageIdx(0); setPlaying(false); };
  const togglePlay = () => setPlaying((p) => !p);

  const progress = ((stageIdx + 1) / STAGES.length) * 100;

  return (
    <section id="demo" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-neon-cyan mb-3">Demo interactiva · Paso a paso</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Un viaje real, <span className="text-gradient">en cámara lenta</span>.
            </h2>
            <p className="mt-4 text-white/70 text-lg">
              Simulación completa: desde que abres la app hasta que dejas reseña. 14 etapas mostrando cada función antes, durante y después del viaje.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={prev} disabled={stageIdx === 0} className="glass rounded-full p-3 hover:bg-white/10 disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={togglePlay} className="rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet px-6 py-3 text-black font-semibold flex items-center gap-2 glow">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? "Pausar" : "Reproducir"}
            </button>
            <button onClick={next} disabled={stageIdx === STAGES.length - 1} className="glass rounded-full p-3 hover:bg-white/10 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
            <button onClick={reset} className="glass rounded-full p-3 hover:bg-white/10"><RotateCcw className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span>Etapa {stageIdx + 1} de {STAGES.length} · <b className="text-white">{STAGE_LABELS[stage]}</b></span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          {/* Phone mockup */}
          <div className="flex justify-center">
            <div className="glass rounded-[44px] p-3 glow w-full max-w-[360px] sticky top-28">
              <div className="rounded-[36px] bg-gradient-to-b from-jalisco-900 to-black p-5 h-[680px] relative overflow-hidden">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1 w-12 rounded-full bg-white/20" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="h-full pt-4"
                  >
                    <PhoneScreen stage={stage} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Explainer panel */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ExplainerPanel stage={stage} />
              </motion.div>
            </AnimatePresence>

            {/* Stage dots navigator */}
            <div className="mt-8 glass rounded-2xl p-4">
              <div className="text-xs text-white/50 mb-3">Saltar a etapa:</div>
              <div className="flex flex-wrap gap-1.5">
                {STAGES.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setStageIdx(i)}
                    className={`text-[10px] px-2.5 py-1.5 rounded-full transition ${
                      i === stageIdx
                        ? "bg-gradient-to-r from-neon-cyan to-neon-violet text-black font-semibold"
                        : i < stageIdx
                        ? "bg-neon-lime/10 text-neon-lime border border-neon-lime/20"
                        : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {i + 1}. {STAGE_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- MAP (GDL) ----------------------------- */

function GdlMap({ progress = 0, showRoute = true, showSosRing = false, deviation = false }: { progress?: number; showRoute?: boolean; showSosRing?: boolean; deviation?: boolean }) {
  // Coordenadas aproximadas estilizadas: Av. Chapultepec (origen) → Plaza del Sol (destino)
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 h-[260px] relative bg-gradient-to-br from-[#1a0a00] to-[#0a0500]">
      {/* Water / parks */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 260" preserveAspectRatio="none">
        <defs>
          <linearGradient id="rt" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#ea6a1a" />
            <stop offset="1" stopColor="#7c2d12" />
          </linearGradient>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(234,106,26,0.08)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="360" height="260" fill="url(#grid)" />

        {/* Parque Metropolitano */}
        <ellipse cx="80" cy="70" rx="40" ry="22" fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.2)" />
        <text x="80" y="74" textAnchor="middle" fontSize="7" fill="rgba(251,191,36,0.7)">P. Metropolitano</text>

        {/* Bosque Los Colomos */}
        <ellipse cx="280" cy="55" rx="35" ry="18" fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.2)" />
        <text x="280" y="58" textAnchor="middle" fontSize="7" fill="rgba(251,191,36,0.7)">Los Colomos</text>

        {/* Main avenues */}
        <line x1="0" y1="180" x2="360" y2="160" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
        <text x="20" y="176" fontSize="7" fill="rgba(255,255,255,0.5)">Av. López Mateos</text>

        <line x1="0" y1="130" x2="360" y2="120" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
        <text x="20" y="126" fontSize="7" fill="rgba(255,255,255,0.45)">Av. Vallarta</text>

        <line x1="90" y1="0" x2="110" y2="260" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
        <text x="114" y="250" fontSize="7" fill="rgba(255,255,255,0.45)">Av. Chapultepec</text>

        <line x1="230" y1="0" x2="250" y2="260" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
        <text x="254" y="18" fontSize="7" fill="rgba(255,255,255,0.45)">Av. Patria</text>

        {/* Route */}
        {showRoute && (
          <path
            d="M 100 210 Q 140 190 170 160 T 220 120 T 280 100 Q 310 90 320 60"
            stroke={deviation ? "#f97316" : "url(#rt)"}
            strokeWidth="3.5"
            fill="none"
            strokeDasharray={deviation ? "6 4" : "none"}
          />
        )}

        {/* Origin marker */}
        <circle cx="100" cy="210" r="5" fill="#f97316" />
        <circle cx="100" cy="210" r="10" fill="none" stroke="#f97316" strokeOpacity="0.4" strokeWidth="2" />
        <text x="108" y="225" fontSize="8" fill="#f97316" fontWeight="bold">Av. Chapultepec 123</text>

        {/* Destination marker */}
        <circle cx="320" cy="60" r="5" fill="#fbbf24" />
        <circle cx="320" cy="60" r="10" fill="none" stroke="#fbbf24" strokeOpacity="0.4" strokeWidth="2" />
        <text x="270" y="48" fontSize="8" fill="#fbbf24" fontWeight="bold">Plaza del Sol</text>
      </svg>

      {/* Car moving along route (simulated positions) */}
      <motion.div
        className="absolute"
        initial={false}
        animate={{
          left: `${27 + progress * 61}%`,
          top: `${80 - progress * 60}%`,
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          {showSosRing && (
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500/40"
              animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}
          <div className="h-6 w-6 rounded-full bg-neon-cyan glow flex items-center justify-center ring-2 ring-white/40">
            <Car className="h-3 w-3 text-black" />
          </div>
        </div>
      </motion.div>

      {/* Other cars (ambient traffic) */}
      <motion.div className="absolute h-2 w-2 rounded-full bg-white/40" animate={{ left: ["10%", "90%"], top: ["62%", "60%"] }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} />
      <motion.div className="absolute h-2 w-2 rounded-full bg-white/30" animate={{ left: ["90%", "10%"], top: ["48%", "50%"] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} />
      <motion.div className="absolute h-2 w-2 rounded-full bg-white/30" animate={{ top: ["5%", "95%"], left: ["26%", "29%"] }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }} />
    </div>
  );
}

/* --------------------------- PHONE SCREENS --------------------------- */

function PhoneScreen({ stage }: { stage: Stage }) {
  if (stage === "home") return <HomeScreen />;
  if (stage === "pickup") return <PickupScreen />;
  if (stage === "services") return <ServicesScreen />;
  if (stage === "fare") return <FareScreen />;
  if (stage === "searching") return <SearchingScreen />;
  if (stage === "matched") return <MatchedScreen />;
  if (stage === "arriving") return <ArrivingScreen />;
  if (stage === "pickedup") return <PickedUpScreen />;
  if (stage === "onroute") return <OnRouteScreen />;
  if (stage === "arrived") return <ArrivedScreen />;
  if (stage === "payment") return <PaymentScreen />;
  if (stage === "rating") return <RatingScreen />;
  if (stage === "review") return <ReviewScreen />;
  return <DoneScreen />;
}

function HomeScreen() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-white/60">Hola, buenas tardes</div>
          <div className="font-display text-xl font-bold">Sofía Ramírez 👋</div>
        </div>
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-neon-pink to-neon-violet" />
      </div>
      <div className="mt-4"><GdlMap showRoute={false} /></div>
      <div className="mt-4 glass rounded-2xl p-4">
        <div className="text-xs text-white/60">¿A dónde vamos?</div>
        <div className="mt-2 flex items-center gap-2 rounded-xl bg-white/5 p-3 text-sm">
          <MapPin className="h-4 w-4 text-neon-cyan" />
          <span className="text-white/50">Buscar destino…</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px]">
        <div className="glass rounded-xl p-2"><Car className="h-4 w-4 mx-auto text-neon-cyan mb-1" />Casa</div>
        <div className="glass rounded-xl p-2"><Car className="h-4 w-4 mx-auto text-neon-cyan mb-1" />Trabajo</div>
        <div className="glass rounded-xl p-2"><Heart className="h-4 w-4 mx-auto text-neon-pink mb-1" />Mamá</div>
      </div>
    </div>
  );
}

function PickupScreen() {
  return (
    <div className="h-full flex flex-col">
      <div className="text-xs text-white/60">Selecciona tu viaje</div>
      <div className="mt-2 space-y-2">
        <div className="glass rounded-xl p-3 text-sm flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-neon-pink" />
          <div className="flex-1">
            <div className="text-[10px] text-white/50">Origen</div>
            Av. Chapultepec 123, Guadalajara
          </div>
        </div>
        <div className="glass rounded-xl p-3 text-sm flex items-center gap-2 ring-1 ring-neon-cyan/40">
          <span className="h-2 w-2 rounded-full bg-neon-lime" />
          <div className="flex-1">
            <div className="text-[10px] text-white/50">Destino</div>
            Plaza del Sol, Zapopan
          </div>
        </div>
      </div>
      <div className="mt-3 glass rounded-xl p-2 text-[10px] text-white/60 flex items-center gap-2">
        <Users className="h-3 w-3 text-neon-cyan" /> Agregar parada (hasta 5)
      </div>
      <div className="mt-4"><GdlMap progress={0} /></div>
      <div className="mt-3 glass rounded-xl p-3">
        <div className="text-xs text-white/60">Distancia estimada</div>
        <div className="font-display text-lg font-bold">8.4 km · 18 min</div>
      </div>
    </div>
  );
}

function ServicesScreen() {
  const services = [
    { icon: Car, name: "Clásico", price: "$68", d: "4 personas", active: true },
    { icon: Users, name: "Compartido", price: "$42", d: "Hasta -40%" },
    { icon: Package, name: "Envíos", price: "$55", d: "Paquetería" },
    { icon: ShoppingBasket, name: "Súper", price: "$85+", d: "Mandados" },
  ];
  return (
    <div className="h-full flex flex-col">
      <div className="text-xs text-white/60">Elige tu servicio</div>
      <div className="font-display text-lg font-bold">8 opciones disponibles</div>
      <div className="mt-3 flex-1 space-y-2 overflow-hidden">
        {services.map((s, i) => (
          <div key={s.name} className={`glass rounded-xl p-3 flex items-center gap-3 ${s.active ? "ring-1 ring-neon-cyan/50 bg-white/5" : ""}`}>
            <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center"><s.icon className="h-4 w-4 text-neon-cyan" /></div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="text-[10px] text-white/50">{s.d}</div>
            </div>
            <div className="font-display font-bold text-gradient">{s.price}</div>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-white/40 mt-2">También: Farmacia · Niños · Pet · Aeropuerto</div>
    </div>
  );
}

function FareScreen() {
  return (
    <div className="h-full flex flex-col">
      <div className="text-xs text-white/60">Confirmar viaje</div>
      <div className="mt-3"><GdlMap progress={0} /></div>
      <div className="mt-3 glass rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Tarifa base</span>
          <span>$55.00</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Distancia (8.4 km)</span>
          <span>$13.00</span>
        </div>
        <div className="flex items-center justify-between text-sm border-t border-white/10 pt-2">
          <span className="font-semibold">Total</span>
          <span className="font-display text-xl font-bold text-gradient">$68.00</span>
        </div>
        <div className="text-[10px] text-neon-lime">💰 Uber cobraría ~$89 · Ahorras $21</div>
      </div>
      <div className="mt-3 glass rounded-xl p-3 flex items-center gap-3">
        <CreditCard className="h-4 w-4 text-neon-cyan" />
        <div className="flex-1 text-xs">BBVA •••• 4821</div>
        <ChevronRight className="h-4 w-4 text-white/40" />
      </div>
      <button className="mt-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet py-3 text-black font-bold text-sm">Confirmar y pedir</button>
    </div>
  );
}

function SearchingScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="h-28 w-28 rounded-full bg-gradient-to-br from-neon-cyan to-neon-violet glow flex items-center justify-center"
      >
        <Radar className="h-12 w-12 text-black" />
      </motion.div>
      <div className="mt-6 font-display text-xl font-bold">Buscando conductor...</div>
      <div className="mt-2 text-sm text-white/60">Priorizando los más cercanos</div>
      <div className="mt-6 w-full glass rounded-xl p-3 text-xs text-white/70 space-y-1.5">
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Algoritmo local GDL activado</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Filtrando por rating ≥ 4.8</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Verificando disponibilidad…</div>
      </div>
    </div>
  );
}

function MatchedScreen() {
  return (
    <div className="h-full flex flex-col">
      <div className="text-xs text-neon-cyan font-semibold">CONDUCTOR ASIGNADO</div>
      <div className="mt-2 glass rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-neon-lime to-neon-cyan ring-2 ring-neon-lime/40" />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <div className="font-display font-bold">Don Roberto M.</div>
              <BadgeCheck className="h-4 w-4 text-neon-cyan" />
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">4.97</span>
              <span className="text-white/50">· 1,284 viajes</span>
            </div>
            <div className="text-[10px] text-white/50 mt-0.5">Nissan Tsuru blanco · JAL-1234</div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="rounded-lg bg-neon-lime/10 border border-neon-lime/20 p-1.5 flex items-center gap-1 text-neon-lime"><BadgeCheck className="h-3 w-3" /> INE verificada</div>
          <div className="rounded-lg bg-neon-lime/10 border border-neon-lime/20 p-1.5 flex items-center gap-1 text-neon-lime"><Shield className="h-3 w-3" /> Antecedentes OK</div>
          <div className="rounded-lg bg-neon-lime/10 border border-neon-lime/20 p-1.5 flex items-center gap-1 text-neon-lime"><Fingerprint className="h-3 w-3" /> Biometría</div>
          <div className="rounded-lg bg-neon-lime/10 border border-neon-lime/20 p-1.5 flex items-center gap-1 text-neon-lime"><Car className="h-3 w-3" /> Vehículo OK</div>
        </div>
      </div>
      <div className="mt-3 text-xs text-white/60">Score seguridad: <b className="text-neon-cyan">98/100</b></div>
      <div className="mt-3 flex-1"><GdlMap progress={0.12} /></div>
      <div className="mt-3 flex items-center justify-between glass rounded-xl p-3 text-sm">
        <span>Llega en</span>
        <span className="font-display text-lg font-bold text-neon-cyan">3 min</span>
      </div>
    </div>
  );
}

function ArrivingScreen() {
  return (
    <div className="h-full flex flex-col">
      <div className="glass rounded-xl p-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-neon-lime to-neon-cyan" />
        <div className="flex-1">
          <div className="text-sm font-semibold">Don Roberto llega en 2 min</div>
          <div className="text-[10px] text-white/50">Está sobre Av. López Mateos</div>
        </div>
        <div className="flex gap-1.5">
          <button className="h-8 w-8 rounded-full bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center"><Phone className="h-3.5 w-3.5 text-neon-cyan" /></button>
          <button className="h-8 w-8 rounded-full bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center"><MessageCircle className="h-3.5 w-3.5 text-neon-cyan" /></button>
        </div>
      </div>
      <div className="mt-3"><GdlMap progress={0.3} /></div>
      <div className="mt-3 space-y-2">
        <div className="glass rounded-xl p-3 text-xs flex items-center gap-2 bg-neon-cyan/5 border-neon-cyan/20">
          <Users className="h-4 w-4 text-neon-cyan" />
          <div className="flex-1">
            <div className="font-semibold text-white">Compartiendo viaje</div>
            <div className="text-white/50">Mamá · Papá · Carlos (novio)</div>
          </div>
          <CheckCircle2 className="h-4 w-4 text-neon-lime" />
        </div>
        <div className="glass rounded-xl p-3 text-xs flex items-center gap-2">
          <Eye className="h-4 w-4 text-neon-violet" />
          <span className="flex-1">Tu número está oculto para el conductor</span>
        </div>
      </div>
      <button className="mt-auto rounded-xl bg-red-500/15 border border-red-500/40 py-3 text-red-400 font-semibold text-sm flex items-center justify-center gap-2">
        <Siren className="h-4 w-4" /> Botón de emergencia SOS
      </button>
    </div>
  );
}

function PickedUpScreen() {
  return (
    <div className="h-full flex flex-col">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass rounded-2xl p-4 border-2 border-neon-lime/40 bg-neon-lime/5 text-center">
        <CheckCircle2 className="h-10 w-10 text-neon-lime mx-auto" />
        <div className="mt-2 font-display text-lg font-bold">¡Viaje iniciado!</div>
        <div className="text-xs text-white/60">Don Roberto confirmó tu identidad con biometría</div>
      </motion.div>
      <div className="mt-3"><GdlMap progress={0.15} /></div>
      <div className="mt-3 glass rounded-xl p-3 text-xs">
        <div className="flex items-center gap-2 mb-2"><Shield className="h-3.5 w-3.5 text-neon-violet" /> <span className="font-semibold">Protección activa</span></div>
        <div className="space-y-1 text-white/60">
          <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Rastreo en tiempo real ON</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> IA detección de desvíos ON</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Viaje compartido con 3 contactos</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Grabación de audio ON (cifrado)</div>
        </div>
      </div>
      <div className="mt-auto text-[10px] text-white/50 text-center">C5 Jalisco monitoreando · 4.2s tiempo promedio de respuesta</div>
    </div>
  );
}

function OnRouteScreen() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-white/60">En camino a</div>
          <div className="font-display text-lg font-bold">Plaza del Sol</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/50">ETA</div>
          <div className="font-display text-lg font-bold text-neon-cyan">12 min</div>
        </div>
      </div>
      <div className="mt-3"><GdlMap progress={0.6} /></div>
      <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
        <div className="glass rounded-xl p-2"><div className="text-[9px] text-white/50">Distancia</div><div className="text-sm font-bold">5.2 km</div></div>
        <div className="glass rounded-xl p-2"><div className="text-[9px] text-white/50">Velocidad</div><div className="text-sm font-bold">38 km/h</div></div>
        <div className="glass rounded-xl p-2"><div className="text-[9px] text-white/50">Tarifa</div><div className="text-sm font-bold text-gradient">$68</div></div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-3 glass rounded-xl p-2 text-[10px] flex items-center gap-2 bg-neon-lime/5 border-neon-lime/20"
      >
        <Radar className="h-3.5 w-3.5 text-neon-lime" />
        <span className="text-neon-lime font-semibold">Ruta óptima confirmada</span>
        <span className="text-white/50 ml-auto">IA activa</span>
      </motion.div>
      <div className="mt-2 glass rounded-xl p-2 text-[10px] flex items-center gap-2">
        <Eye className="h-3.5 w-3.5 text-neon-cyan" />
        <span className="text-white/70">Mamá está viendo el viaje en vivo</span>
      </div>
      <div className="mt-auto flex gap-1.5">
        <button className="flex-1 glass rounded-xl py-2.5 text-[11px] font-semibold">Compartir</button>
        <button className="flex-1 glass rounded-xl py-2.5 text-[11px] font-semibold">Chat</button>
        <button className="flex-1 rounded-xl bg-red-500/15 border border-red-500/30 py-2.5 text-[11px] font-bold text-red-400 flex items-center justify-center gap-1"><Siren className="h-3 w-3" /> SOS</button>
      </div>
    </div>
  );
}

function ArrivedScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-24 w-24 rounded-full bg-neon-lime/15 border-2 border-neon-lime/40 flex items-center justify-center">
        <MapPin className="h-12 w-12 text-neon-lime" />
      </motion.div>
      <div className="mt-4 font-display text-2xl font-bold">¡Llegaste!</div>
      <div className="mt-1 text-white/60 text-sm">Plaza del Sol, Zapopan</div>
      <div className="mt-6 w-full glass rounded-2xl p-4">
        <div className="text-xs text-white/60">Resumen del viaje</div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <div><div className="text-[10px] text-white/50">Duración</div><div className="font-bold">18 min</div></div>
          <div><div className="text-[10px] text-white/50">Distancia</div><div className="font-bold">8.4 km</div></div>
          <div><div className="text-[10px] text-white/50">Total</div><div className="font-bold text-gradient">$68</div></div>
        </div>
      </div>
    </div>
  );
}

function PaymentScreen() {
  return (
    <div className="h-full flex flex-col">
      <div className="text-xs text-white/60">Pago del viaje</div>
      <div className="font-display text-lg font-bold">$68.00 MXN</div>
      <div className="mt-3 glass rounded-2xl p-4 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-white/60">Tarifa</span><span>$68.00</span></div>
        <div className="flex justify-between text-neon-lime"><span>Cupón BIENVENIDA</span><span>-$0.00</span></div>
        <div className="flex justify-between border-t border-white/10 pt-2 font-bold"><span>Total</span><span className="text-gradient">$68.00</span></div>
      </div>
      <div className="mt-3 text-xs text-white/60 mb-2">Método de pago</div>
      <div className="space-y-1.5">
        <div className="glass rounded-xl p-2.5 flex items-center gap-2 ring-1 ring-neon-cyan/40">
          <CreditCard className="h-4 w-4 text-neon-cyan" />
          <span className="flex-1 text-sm">BBVA •••• 4821</span>
          <CheckCircle2 className="h-4 w-4 text-neon-lime" />
        </div>
        <div className="glass rounded-xl p-2.5 flex items-center gap-2 opacity-60">
          <Banknote className="h-4 w-4" /><span className="flex-1 text-sm">Efectivo</span>
        </div>
        <div className="glass rounded-xl p-2.5 flex items-center gap-2 opacity-60">
          <Smartphone className="h-4 w-4" /><span className="flex-1 text-sm">CoDi BBVA</span>
        </div>
      </div>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 }} className="mt-auto glass rounded-xl p-3 flex items-center gap-2 text-xs bg-neon-lime/5 border-neon-lime/20">
        <CheckCircle2 className="h-4 w-4 text-neon-lime" />
        <span className="text-neon-lime font-semibold">Pago procesado</span>
      </motion.div>
    </div>
  );
}

function RatingScreen() {
  return (
    <div className="h-full flex flex-col items-center text-center">
      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-neon-lime to-neon-cyan mt-4" />
      <div className="mt-3 font-display text-lg font-bold">Don Roberto M.</div>
      <div className="text-xs text-white/60">¿Cómo estuvo tu viaje?</div>
      <div className="mt-4 flex gap-1">
        {[1,2,3,4,5].map((i) => (
          <motion.div key={i} initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: i * 0.2 }}>
            <Star className="h-9 w-9 text-yellow-400 fill-yellow-400" />
          </motion.div>
        ))}
      </div>
      <div className="mt-5 w-full">
        <div className="text-[10px] text-white/50 text-left mb-2">Destacar al conductor</div>
        <div className="flex flex-wrap gap-1.5">
          {["👍 Amable","🚗 Buen manejo","🧼 Limpio","🕐 Puntual","🎵 Buena música","❄️ A/C"].map((t,i) => (
            <motion.span key={t} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: 1 + i*0.1 }} className="text-[10px] glass rounded-full px-2.5 py-1.5 border-neon-cyan/20 ring-1 ring-neon-cyan/20">
              {t}
            </motion.span>
          ))}
        </div>
      </div>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: 2 }} className="mt-5 w-full glass rounded-xl p-3 text-left">
        <div className="text-[10px] text-white/50 mb-1">💰 Dar propina</div>
        <div className="flex gap-1.5">
          <div className="flex-1 glass rounded-lg py-1.5 text-xs text-center">$10</div>
          <div className="flex-1 glass rounded-lg py-1.5 text-xs text-center ring-1 ring-neon-cyan/40 text-neon-cyan font-bold">$20</div>
          <div className="flex-1 glass rounded-lg py-1.5 text-xs text-center">$30</div>
          <div className="flex-1 glass rounded-lg py-1.5 text-xs text-center">$50</div>
        </div>
        <div className="text-[9px] text-neon-lime mt-1 text-center">100% para Don Roberto</div>
      </motion.div>
    </div>
  );
}

function ReviewScreen() {
  const text = "Excelente servicio. Don Roberto fue muy amable, el carro estaba impecable y tomó la mejor ruta. Nos platicó del tráfico de Guadalajara y nos recomendó lugares. 100% recomendado 🙌";
  return (
    <div className="h-full flex flex-col">
      <div className="text-xs text-white/60">Escribe una reseña</div>
      <div className="font-display text-base font-bold">Ayuda a otros pasajeros</div>
      <div className="mt-3 glass rounded-2xl p-4 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-neon-pink to-neon-violet" />
          <div>
            <div className="text-xs font-semibold">Sofía Ramírez</div>
            <div className="flex gap-0.5">{[1,2,3,4,5].map(i=><Star key={i} className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" />)}</div>
          </div>
        </div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          transition={{ duration: 3 }}
          className="text-[11px] text-white/80 leading-relaxed overflow-hidden"
        >
          {text}
        </motion.div>
      </div>
      <div className="mt-3 glass rounded-xl p-3 text-[10px] text-white/60 flex items-center gap-2">
        <ThumbsUp className="h-3 w-3 text-neon-cyan" />
        Tu reseña se publica de forma verificada (viaje real)
      </div>
      <button className="mt-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet py-3 text-black font-bold text-sm">Publicar reseña</button>
    </div>
  );
}

function DoneScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
        <CheckCircle2 className="h-24 w-24 text-neon-lime" />
      </motion.div>
      <div className="mt-4 font-display text-2xl font-bold">¡Gracias Sofía!</div>
      <div className="mt-1 text-white/60 text-sm">Viaje #1284 completado</div>

      <div className="mt-5 w-full glass rounded-2xl p-4">
        <div className="text-xs text-white/60">Resumen del viaje</div>
        <div className="mt-2 space-y-1.5 text-xs">
          <div className="flex justify-between"><span className="text-white/60">Tarifa</span><span>$68.00</span></div>
          <div className="flex justify-between"><span className="text-white/60">Propina</span><span>$20.00</span></div>
          <div className="flex justify-between border-t border-white/10 pt-1.5 font-bold"><span>Total</span><span className="text-gradient">$88.00</span></div>
          <div className="flex justify-between text-neon-lime"><span>Don Roberto recibe</span><span>$81.20</span></div>
        </div>
      </div>

      <div className="mt-3 w-full glass rounded-xl p-3 bg-neon-lime/5 border-neon-lime/20">
        <div className="text-[10px] text-neon-lime font-semibold">💰 Ahorro comparado con Uber</div>
        <div className="font-display text-xl font-bold text-gradient">$21 + $25 extra al conductor</div>
      </div>

      <div className="mt-3 flex gap-1">
        <Gift className="h-4 w-4 text-neon-pink" />
        <span className="text-[10px] text-white/60">+120 pts · canjea en comercios locales</span>
      </div>
    </div>
  );
}

/* --------------------------- EXPLAINER PANEL --------------------------- */

function ExplainerPanel({ stage }: { stage: Stage }) {
  const data: Record<Stage, { title: string; sub: string; points: { icon: any; t: string; d: string }[] }> = {
    home: {
      title: "Antes del viaje: la app te conoce",
      sub: "Sin publicidad invasiva, sin tarifas ocultas. La pantalla principal muestra tus lugares favoritos (casa, trabajo, mamá) y sugerencias inteligentes basadas en tu historial.",
      points: [
        { icon: Heart, t: "Lugares favoritos", d: "Acceso rápido a los 3 destinos que más usas." },
        { icon: Shield, t: "Modo noche seguro", d: "Entre 10pm y 6am se filtran solo conductores con score ≥ 95." },
        { icon: Gift, t: "Puntos de lealtad", d: "Cada viaje suma puntos canjeables en comercios locales de Jalisco." },
      ],
    },
    pickup: {
      title: "Origen y destino con hasta 5 paradas",
      sub: "Buscador inteligente con autocompletado de direcciones reales de la ZMG. Puedes agregar paradas intermedias sin pagar el doble como en Uber.",
      points: [
        { icon: MapPin, t: "Autocompletado local", d: "Base de datos de calles y comercios de Guadalajara, Zapopan, Tlaquepaque y Tonalá." },
        { icon: Users, t: "Hasta 5 paradas", d: "Perfecto para dejar al niño en la escuela y luego ir al trabajo." },
        { icon: Navigation, t: "Rutas pre-calculadas", d: "Ves la distancia y el tiempo antes de pedir." },
      ],
    },
    services: {
      title: "Elige entre 8 servicios",
      sub: "No solo taxi. Una sola app para moverte, mandar paquetes, hacer el súper o favores.",
      points: [
        { icon: Car, t: "Clásico y Compartido", d: "Clásico 4 personas, Compartido hasta 40% más barato con gente verificada." },
        { icon: Package, t: "Mi Taxi Envíos", d: "Paquetería el mismo día dentro de la ZMG." },
        { icon: ShoppingBasket, t: "Mi Taxi Súper / Favor", d: "El conductor hace el mandado por ti." },
      ],
    },
    fare: {
      title: "Tarifa transparente, sin sorpresas",
      sub: "Ves el desglose completo: tarifa base + distancia. Sin 'tarifa dinámica' abusiva — máximo +20% en horas pico, comunicado claramente.",
      points: [
        { icon: CheckCircle2, t: "Ahorro vs Uber", d: "Mostramos cuánto más barato es el mismo viaje comparado con la competencia." },
        { icon: CreditCard, t: "5 métodos de pago", d: "Tarjeta, efectivo, CoDi, SPEI, Mercado Pago, vales de despensa." },
        { icon: Gift, t: "Cupones locales", d: "Promociones reales con comercios de Jalisco." },
      ],
    },
    searching: {
      title: "Match inteligente con algoritmo local",
      sub: "Usamos IA entrenada con datos reales de tráfico y zonas de GDL. No es un algoritmo genérico de Silicon Valley.",
      points: [
        { icon: Radar, t: "Prioriza cercanía real", d: "Considera tráfico, sentido de calles y conocimiento del conductor de la zona." },
        { icon: Star, t: "Filtra por rating", d: "Solo conductores con rating ≥ 4.8 son propuestos por default." },
        { icon: Shield, t: "Doble validación", d: "Verifica que el conductor tenga biometría activa y score ≥ 90." },
      ],
    },
    matched: {
      title: "Conductor 100% verificado",
      sub: "Don Roberto pasó 7 filtros de verificación antes de poder manejar en la plataforma. Su información es pública y real.",
      points: [
        { icon: BadgeCheck, t: "INE + RENAPO", d: "Su identidad fue validada con la base de datos oficial." },
        { icon: Fingerprint, t: "Biometría activa", d: "Cada turno confirma su identidad con huella y rostro." },
        { icon: Star, t: "1,284 viajes · 4.97★", d: "Historial transparente, reseñas verificadas de pasajeros reales." },
      ],
    },
    arriving: {
      title: "Conductor en camino con privacidad total",
      sub: "Puedes llamar o chatear sin mostrar tu número. Tu viaje ya se está compartiendo automáticamente con contactos de confianza.",
      points: [
        { icon: Phone, t: "Llamada enmascarada", d: "Ni el conductor ve tu número ni tú el suyo. Todo va por la plataforma." },
        { icon: Users, t: "Compartir viaje automático", d: "Mamá, papá y tu pareja ya reciben tu ubicación en vivo sin que hagas nada." },
        { icon: Siren, t: "SOS siempre visible", d: "El botón de pánico está accesible en TODA la pantalla, no escondido en menús." },
      ],
    },
    pickedup: {
      title: "Viaje iniciado — protección máxima activada",
      sub: "Al subirte al carro, el conductor confirma tu identidad con un código y todos los sistemas de seguridad se activan automáticamente.",
      points: [
        { icon: Fingerprint, t: "Código de abordaje", d: "Solo tú sabes el código. Si el conductor no lo tiene, no eres tú y se bloquea el viaje." },
        { icon: Radar, t: "IA monitoreando ruta", d: "Si el conductor se desvía más de 300m de la ruta óptima, suena alerta." },
        { icon: Eye, t: "Grabación cifrada", d: "Audio del viaje se guarda 72h cifrado. Solo se libera con orden judicial." },
      ],
    },
    onroute: {
      title: "Durante el viaje: todo bajo control",
      sub: "La IA local vigila la ruta en tiempo real. Tus contactos ven el viaje en vivo. Puedes chatear, compartir o activar SOS con un toque.",
      points: [
        { icon: Radar, t: "Detección de desvíos con IA", d: "Cualquier ruta sospechosa activa alerta al pasajero y al C5 Jalisco." },
        { icon: Users, t: "Familia viendo en vivo", d: "Tu mamá ve un mapa web sin necesidad de instalar la app." },
        { icon: Siren, t: "SOS → C5 + Policía en 5s", d: "Un botón manda ubicación, foto del conductor y placas al centro de monitoreo." },
      ],
    },
    arrived: {
      title: "Llegaste al destino",
      sub: "La app confirma la llegada por geolocalización. Resumen claro de duración, distancia y tarifa antes de cobrar.",
      points: [
        { icon: MapPin, t: "Confirmación automática", d: "El GPS sabe cuándo bajaste. No cobramos de más por esperas." },
        { icon: CheckCircle2, t: "Resumen transparente", d: "Todo cuadrado: minutos, kilómetros, tarifa exacta antes del cargo." },
        { icon: Shield, t: "Aviso a tus contactos", d: "Los familiares que te estaban viendo reciben notificación de llegada segura." },
      ],
    },
    payment: {
      title: "Pago fácil, como tú quieras",
      sub: "Acepta tarjeta, efectivo (sin cargo extra), CoDi, SPEI, Mercado Pago y vales de despensa. El conductor no toca dinero si no quiere.",
      points: [
        { icon: CreditCard, t: "Sin comisión por efectivo", d: "Uber cobra extra por pagar en efectivo. Aquí no." },
        { icon: Smartphone, t: "CoDi nativo", d: "Pago banco-a-banco con QR, sin comisiones." },
        { icon: CheckCircle2, t: "Recibo instantáneo", d: "Llega a tu correo en segundos, listo para deducir si usas la app por trabajo." },
      ],
    },
    rating: {
      title: "Calificación con detalle",
      sub: "Las 5 estrellas no son suficientes. Puedes destacar aspectos específicos del conductor y dejar propina — 100% suya.",
      points: [
        { icon: Star, t: "Rating granular", d: "Califica amabilidad, manejo, limpieza, puntualidad por separado." },
        { icon: ThumbsUp, t: "Etiquetas rápidas", d: "6 tags para reconocer lo bueno: '👍 Amable', '🧼 Limpio', '🕐 Puntual'..." },
        { icon: Heart, t: "Propina 100% para él", d: "Uber se queda con parte de la propina. Aquí ni un peso." },
      ],
    },
    review: {
      title: "Reseña escrita verificada",
      sub: "Solo pasajeros que REALMENTE viajaron pueden dejar reseña. Nada de bots ni manipulación de rating.",
      points: [
        { icon: BadgeCheck, t: "Reseñas verificadas", d: "Cada reseña está atada a un viaje real con comprobante." },
        { icon: Eye, t: "Moderación anti-abuso", d: "Sistema que detecta lenguaje ofensivo o discriminación." },
        { icon: Users, t: "Respuesta del conductor", d: "Don Roberto puede responder públicamente a tu reseña." },
      ],
    },
    done: {
      title: "Viaje completado — ganamos todos",
      sub: "Tú ahorraste $21 vs Uber. Don Roberto recibe $25 más de lo que hubiera ganado en Uber. La propina es 100% suya. Ganaste 120 puntos de lealtad.",
      points: [
        { icon: Banknote, t: "Don Roberto cobra mañana", d: "Pago automático a su cuenta BBVA en 24 horas. Uber tarda hasta 7 días." },
        { icon: Gift, t: "Puntos canjeables", d: "Tus 120 pts los puedes usar en farmacias, tiendas y restaurantes locales." },
        { icon: Heart, t: "Impacto real", d: "El 90% de tu dinero se quedó en Jalisco, con un conductor local. No en Silicon Valley." },
      ],
    },
  };

  const d = data[stage];

  return (
    <div className="glass rounded-3xl p-8">
      <div className="text-xs uppercase tracking-[0.25em] text-neon-cyan mb-2">Etapa {STAGES.indexOf(stage) + 1} · {STAGE_LABELS[stage]}</div>
      <h3 className="font-display text-2xl md:text-3xl font-bold">{d.title}</h3>
      <p className="mt-3 text-white/70 leading-relaxed">{d.sub}</p>

      <div className="mt-6 space-y-3">
        {d.points.map((p, i) => (
          <motion.div
            key={p.t}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
          >
            <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 border border-white/10 flex items-center justify-center">
              <p.icon className="h-4 w-4 text-neon-cyan" />
            </div>
            <div>
              <div className="font-semibold text-sm">{p.t}</div>
              <div className="text-xs text-white/60 mt-0.5">{p.d}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
