"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, MapPin, Star, Phone, MessageCircle, Siren, CheckCircle2,
  CreditCard, Banknote, Smartphone, Users, Shield, Navigation, Radar,
  ArrowLeft, Home, Clock, Heart, Package, ShoppingBasket, Pill,
  Plane, Dog, Baby, BadgeCheck, Fingerprint, ThumbsUp, Gift, ChevronRight,
  X, Plus, User, Wallet, Bell, Settings, History, LogOut,
} from "lucide-react";

/* =========================  SHARED STATE  ========================= */

type TripStatus =
  | "idle" | "selecting" | "requesting" | "searching" | "matched"
  | "arriving" | "pickedup" | "onroute" | "arrived" | "paid" | "rated";

type Service = "ride" | "shared" | "envios" | "super" | "favor" | "farmacia" | "pet" | "aeropuerto";

interface TripState {
  status: TripStatus;
  origin: string;
  destination: string;
  service: Service;
  fare: number;
  distance: number;
  duration: number;
  driver: { name: string; plate: string; vehicle: string; rating: number; score: number } | null;
  paymentMethod: "card" | "cash" | "codi";
  carProgress: number; // 0-1
  sosActive: boolean;
  rating: number;
  tipAmount: number;
}

const initialTrip: TripState = {
  status: "idle",
  origin: "Av. Chapultepec 123, Guadalajara",
  destination: "",
  service: "ride",
  fare: 0,
  distance: 0,
  duration: 0,
  driver: null,
  paymentMethod: "card",
  carProgress: 0,
  sosActive: false,
  rating: 0,
  tipAmount: 0,
};

/* =========================  PAGE  ========================= */

export default function FullApp() {
  const [trip, setTrip] = useState<TripState>(initialTrip);
  const [view, setView] = useState<"both" | "passenger" | "driver">("both");

  // car progress animation while onroute
  useEffect(() => {
    if (trip.status !== "onroute") return;
    const id = setInterval(() => {
      setTrip((t) => {
        if (t.carProgress >= 1) {
          clearInterval(id);
          return { ...t, carProgress: 1, status: "arrived" };
        }
        return { ...t, carProgress: Math.min(1, t.carProgress + 0.02) };
      });
    }, 200);
    return () => clearInterval(id);
  }, [trip.status]);

  // arriving animation
  useEffect(() => {
    if (trip.status !== "arriving") return;
    const id = setInterval(() => {
      setTrip((t) => {
        if (t.carProgress >= 0.2) { clearInterval(id); return t; }
        return { ...t, carProgress: Math.min(0.2, t.carProgress + 0.015) };
      });
    }, 200);
    return () => clearInterval(id);
  }, [trip.status]);

  return (
    <div className="min-h-screen relative">
      <header className="border-b border-white/10 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-violet" />
            <span className="font-display font-bold">Mi Taxi <span className="text-gradient">Jalisco</span></span>
            <span className="ml-2 text-[10px] uppercase tracking-wider glass rounded-full px-2 py-0.5 text-white/60">App en vivo</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="glass rounded-full p-1 flex text-xs">
              <button onClick={() => setView("both")} className={`px-3 py-1.5 rounded-full ${view === "both" ? "bg-gradient-to-r from-neon-cyan to-neon-violet text-black font-semibold" : "text-white/60"}`}>Ambas</button>
              <button onClick={() => setView("passenger")} className={`px-3 py-1.5 rounded-full ${view === "passenger" ? "bg-gradient-to-r from-neon-cyan to-neon-violet text-black font-semibold" : "text-white/60"}`}>Pasajero</button>
              <button onClick={() => setView("driver")} className={`px-3 py-1.5 rounded-full ${view === "driver" ? "bg-gradient-to-r from-neon-lime to-neon-cyan text-black font-semibold" : "text-white/60"}`}>Conductor</button>
            </div>
            <button onClick={() => setTrip(initialTrip)} className="glass rounded-full px-3 py-1.5 text-xs hover:bg-white/10">Reset</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className={`grid gap-10 ${view === "both" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-md mx-auto"}`}>
          {(view === "both" || view === "passenger") && (
            <div>
              <div className="text-center mb-4">
                <div className="text-xs uppercase tracking-[0.25em] text-neon-cyan">App del pasajero</div>
                <div className="text-sm text-white/60">Sofía Ramírez · ⭐ 4.9</div>
              </div>
              <PassengerApp trip={trip} setTrip={setTrip} />
            </div>
          )}
          {(view === "both" || view === "driver") && (
            <div>
              <div className="text-center mb-4">
                <div className="text-xs uppercase tracking-[0.25em] text-neon-lime">App del conductor</div>
                <div className="text-sm text-white/60">Don Roberto Mendoza · ⭐ 4.97 · JAL-1234</div>
              </div>
              <DriverApp trip={trip} setTrip={setTrip} />
            </div>
          )}
        </div>

        <div className="mt-10 glass rounded-2xl p-5 max-w-3xl mx-auto text-sm">
          <div className="font-display font-bold mb-2">🎮 Cómo usarla en vivo</div>
          <ol className="space-y-1.5 text-white/70 list-decimal list-inside">
            <li>En el lado del <b className="text-neon-cyan">pasajero</b>, elige un destino, el servicio y confirma.</li>
            <li>El lado del <b className="text-neon-lime">conductor</b> recibe la solicitud en tiempo real. Tócala para aceptar.</li>
            <li>Avanza el viaje con los botones "Ya llegué / Iniciar viaje / Terminar" en la app del conductor.</li>
            <li>Al final, el pasajero califica, deja propina y reseña.</li>
            <li>Usa el botón rojo <b className="text-red-400">SOS</b> en cualquier momento para ver la alerta de pánico conectada al C5.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

/* =========================  PHONE FRAME  ========================= */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass rounded-[44px] p-3 glow mx-auto w-full max-w-[380px]">
      <div className="rounded-[36px] bg-gradient-to-b from-jalisco-900 to-black h-[720px] relative overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1 w-14 rounded-full bg-white/20 z-10" />
        <div className="pt-6 h-full">{children}</div>
      </div>
    </div>
  );
}

/* =========================  MAP  ========================= */

function GdlMap({ progress = 0, showRoute = true, sosRing = false, car = true }: { progress?: number; showRoute?: boolean; sosRing?: boolean; car?: boolean }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 h-[200px] relative bg-gradient-to-br from-[#1a0a00] to-[#0a0500]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 260" preserveAspectRatio="none">
        <defs>
          <linearGradient id="rt" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#ea6a1a" />
            <stop offset="1" stopColor="#7c2d12" />
          </linearGradient>
          <pattern id="grid2" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(234,106,26,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="360" height="260" fill="url(#grid2)" />
        <ellipse cx="80" cy="70" rx="40" ry="22" fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.2)" />
        <text x="80" y="74" textAnchor="middle" fontSize="7" fill="rgba(251,191,36,0.7)">P. Metropolitano</text>
        <ellipse cx="280" cy="55" rx="35" ry="18" fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.2)" />
        <line x1="0" y1="180" x2="360" y2="160" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
        <line x1="0" y1="130" x2="360" y2="120" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
        <line x1="90" y1="0" x2="110" y2="260" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
        <line x1="230" y1="0" x2="250" y2="260" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
        {showRoute && (
          <path d="M 100 210 Q 140 190 170 160 T 220 120 T 280 100 Q 310 90 320 60"
            stroke="url(#rt)" strokeWidth="3.5" fill="none" />
        )}
        <circle cx="100" cy="210" r="5" fill="#f97316" />
        <circle cx="100" cy="210" r="10" fill="none" stroke="#f97316" strokeOpacity="0.4" strokeWidth="2" />
        <circle cx="320" cy="60" r="5" fill="#fbbf24" />
        <circle cx="320" cy="60" r="10" fill="none" stroke="#fbbf24" strokeOpacity="0.4" strokeWidth="2" />
      </svg>
      {car && (
        <motion.div
          className="absolute"
          animate={{ left: `${27 + progress * 61}%`, top: `${80 - progress * 60}%` }}
          transition={{ duration: 0.6, ease: "linear" }}
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            {sosRing && (
              <motion.div className="absolute inset-0 rounded-full bg-red-500/50" animate={{ scale: [1, 3, 1], opacity: [0.6, 0, 0.6] }} transition={{ repeat: Infinity, duration: 1.2 }} />
            )}
            <div className="h-6 w-6 rounded-full bg-neon-cyan glow flex items-center justify-center ring-2 ring-white/40">
              <Car className="h-3 w-3 text-black" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* =========================  PASSENGER APP  ========================= */

function PassengerApp({ trip, setTrip }: { trip: TripState; setTrip: (u: TripState | ((t: TripState) => TripState)) => void }) {
  const [tab, setTab] = useState<"home" | "history" | "profile">("home");
  const [sosOpen, setSosOpen] = useState(false);

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col px-5">
        {tab === "home" && <PassengerHome trip={trip} setTrip={setTrip} openSos={() => setSosOpen(true)} />}
        {tab === "history" && <PassengerHistory />}
        {tab === "profile" && <PassengerProfile />}
      </div>
      {/* Bottom nav */}
      <div className="absolute bottom-0 inset-x-0 border-t border-white/10 bg-black/60 backdrop-blur flex items-center justify-around py-3">
        <button onClick={() => setTab("home")} className={`flex flex-col items-center gap-0.5 ${tab === "home" ? "text-neon-cyan" : "text-white/50"}`}><Home className="h-4 w-4" /><span className="text-[10px]">Inicio</span></button>
        <button onClick={() => setTab("history")} className={`flex flex-col items-center gap-0.5 ${tab === "history" ? "text-neon-cyan" : "text-white/50"}`}><History className="h-4 w-4" /><span className="text-[10px]">Historial</span></button>
        <button onClick={() => setTab("profile")} className={`flex flex-col items-center gap-0.5 ${tab === "profile" ? "text-neon-cyan" : "text-white/50"}`}><User className="h-4 w-4" /><span className="text-[10px]">Perfil</span></button>
      </div>

      <AnimatePresence>
        {sosOpen && <SosModal onClose={() => setSosOpen(false)} />}
      </AnimatePresence>
    </PhoneFrame>
  );
}

function PassengerHome({ trip, setTrip, openSos }: { trip: TripState; setTrip: (u: TripState | ((t: TripState) => TripState)) => void; openSos: () => void }) {
  const [dest, setDest] = useState("");
  const [showServices, setShowServices] = useState(false);

  const presets = [
    { label: "Plaza del Sol", addr: "Plaza del Sol, Zapopan", km: 8.4, min: 18, fare: 68 },
    { label: "Andares", addr: "Andares, Zapopan", km: 10.2, min: 22, fare: 82 },
    { label: "Aeropuerto GDL", addr: "Aeropuerto Internacional GDL", km: 18.5, min: 35, fare: 280 },
    { label: "Tlaquepaque Centro", addr: "Centro de Tlaquepaque", km: 7.1, min: 16, fare: 62 },
  ];

  if (trip.status === "idle" || trip.status === "selecting") {
    return (
      <div className="h-full flex flex-col pb-20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-white/60">Buenas tardes</div>
            <div className="font-display text-lg font-bold">Sofía 👋</div>
          </div>
          <div className="glass rounded-full p-2"><Bell className="h-4 w-4" /></div>
        </div>

        <div className="mt-3"><GdlMap showRoute={false} car={false} /></div>

        <div className="mt-3 glass rounded-2xl p-3">
          <div className="text-xs text-white/60 mb-2">¿A dónde vamos?</div>
          <div className="flex items-center gap-2 rounded-xl bg-white/5 p-2.5">
            <MapPin className="h-4 w-4 text-neon-cyan" />
            <input
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              placeholder="Buscar destino…"
              className="bg-transparent flex-1 text-sm outline-none placeholder-white/30"
            />
          </div>
          <div className="mt-2 space-y-1.5">
            {presets.filter(p => !dest || p.label.toLowerCase().includes(dest.toLowerCase())).slice(0, 4).map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setTrip({ ...trip, status: "selecting", destination: p.addr, distance: p.km, duration: p.min, fare: p.fare });
                  setShowServices(true);
                }}
                className="w-full text-left flex items-center gap-2 rounded-lg bg-white/[0.03] hover:bg-white/10 p-2 text-xs"
              >
                <MapPin className="h-3 w-3 text-neon-pink shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">{p.label}</div>
                  <div className="text-white/50 text-[10px]">{p.km} km · {p.min} min</div>
                </div>
                <div className="text-neon-cyan font-semibold">${p.fare}</div>
              </button>
            ))}
          </div>
        </div>

        {showServices && trip.destination && <ServicePicker trip={trip} setTrip={setTrip} />}
      </div>
    );
  }

  if (trip.status === "requesting" || trip.status === "searching") {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center pb-20">
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="h-24 w-24 rounded-full bg-gradient-to-br from-neon-cyan to-neon-violet glow flex items-center justify-center">
          <Radar className="h-10 w-10 text-black" />
        </motion.div>
        <div className="mt-5 font-display text-lg font-bold">Buscando conductor…</div>
        <div className="mt-1 text-xs text-white/60">Priorizando los más cercanos</div>
        <div className="mt-5 w-full glass rounded-xl p-3 text-[11px] text-white/70 space-y-1.5">
          <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Algoritmo local GDL activado</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Filtrando por rating ≥ 4.8</div>
          <div className="flex items-center gap-2"><Radar className="h-3 w-3 text-neon-cyan animate-pulse" /> Notificando conductores…</div>
        </div>
        <button onClick={() => setTrip({ ...initialTrip })} className="mt-4 text-xs text-red-400">Cancelar solicitud</button>
      </div>
    );
  }

  if (trip.status === "matched" || trip.status === "arriving") {
    return (
      <div className="h-full flex flex-col pb-20">
        <div className="text-[10px] text-neon-cyan font-semibold">CONDUCTOR ASIGNADO</div>
        <div className="mt-1 glass rounded-xl p-3 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-neon-lime to-neon-cyan ring-2 ring-neon-lime/40" />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <div className="font-bold text-sm">{trip.driver?.name}</div>
              <BadgeCheck className="h-3.5 w-3.5 text-neon-cyan" />
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <Star className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" />
              <span>{trip.driver?.rating}</span>
              <span className="text-white/50">· {trip.driver?.vehicle}</span>
            </div>
            <div className="text-[10px] text-white/50">{trip.driver?.plate}</div>
          </div>
          <div className="flex flex-col gap-1">
            <button className="h-7 w-7 rounded-full bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center"><Phone className="h-3 w-3 text-neon-cyan" /></button>
            <button className="h-7 w-7 rounded-full bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center"><MessageCircle className="h-3 w-3 text-neon-cyan" /></button>
          </div>
        </div>
        <div className="mt-3"><GdlMap progress={trip.carProgress} /></div>
        <div className="mt-3 glass rounded-xl p-3 flex items-center justify-between text-sm">
          <span>Llega en</span>
          <span className="font-display text-lg font-bold text-neon-cyan">
            {trip.status === "arriving" ? "1 min" : "3 min"}
          </span>
        </div>
        <div className="mt-2 glass rounded-xl p-2.5 text-[10px] flex items-center gap-2 bg-neon-cyan/5">
          <Users className="h-3 w-3 text-neon-cyan" />
          <span className="flex-1">Viaje compartido con mamá, papá y Carlos ✓</span>
        </div>
        <button onClick={openSos} className="mt-auto rounded-xl bg-red-500/15 border border-red-500/40 py-3 text-red-400 font-semibold text-sm flex items-center justify-center gap-2">
          <Siren className="h-4 w-4" /> SOS · Emergencia
        </button>
      </div>
    );
  }

  if (trip.status === "pickedup" || trip.status === "onroute") {
    return (
      <div className="h-full flex flex-col pb-20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/60">En camino a</div>
            <div className="font-display text-sm font-bold">{trip.destination}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/50">ETA</div>
            <div className="font-display text-sm font-bold text-neon-cyan">{Math.max(1, Math.round(trip.duration * (1 - trip.carProgress)))} min</div>
          </div>
        </div>
        <div className="mt-2"><GdlMap progress={Math.max(0.2, trip.carProgress)} sosRing={trip.sosActive} /></div>
        <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
          <div className="glass rounded-lg p-1.5"><div className="text-[9px] text-white/50">Distancia</div><div className="text-xs font-bold">{(trip.distance * (1 - trip.carProgress)).toFixed(1)} km</div></div>
          <div className="glass rounded-lg p-1.5"><div className="text-[9px] text-white/50">Velocidad</div><div className="text-xs font-bold">38 km/h</div></div>
          <div className="glass rounded-lg p-1.5"><div className="text-[9px] text-white/50">Tarifa</div><div className="text-xs font-bold text-gradient">${trip.fare}</div></div>
        </div>
        <div className="mt-2 glass rounded-lg p-2 text-[9px] flex items-center gap-2 bg-neon-lime/5">
          <Radar className="h-3 w-3 text-neon-lime" />
          <span className="text-neon-lime font-semibold">Ruta óptima · IA activa</span>
          <span className="text-white/50 ml-auto">Mamá viendo en vivo 👁️</span>
        </div>
        <div className="mt-auto flex gap-1">
          <button className="flex-1 glass rounded-lg py-2 text-[10px] font-semibold">Compartir</button>
          <button className="flex-1 glass rounded-lg py-2 text-[10px] font-semibold">Chat</button>
          <button onClick={openSos} className="flex-1 rounded-lg bg-red-500/15 border border-red-500/40 py-2 text-[10px] font-bold text-red-400 flex items-center justify-center gap-1">
            <Siren className="h-3 w-3" /> SOS
          </button>
        </div>
      </div>
    );
  }

  if (trip.status === "arrived") {
    return (
      <div className="h-full flex flex-col pb-20">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-20 w-20 rounded-full bg-neon-lime/15 border-2 border-neon-lime/40 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-neon-lime" />
          </motion.div>
          <div className="mt-3 font-display text-xl font-bold">¡Llegaste!</div>
          <div className="text-xs text-white/60">{trip.destination}</div>
          <div className="mt-4 w-full glass rounded-2xl p-3 text-xs">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><div className="text-[10px] text-white/50">Duración</div><div className="font-bold">{trip.duration} min</div></div>
              <div><div className="text-[10px] text-white/50">Distancia</div><div className="font-bold">{trip.distance} km</div></div>
              <div><div className="text-[10px] text-white/50">Total</div><div className="font-bold text-gradient">${trip.fare}</div></div>
            </div>
          </div>
        </div>
        <button onClick={() => setTrip({ ...trip, status: "paid" })} className="rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet py-3 text-black font-bold text-sm">Pagar ${trip.fare}</button>
      </div>
    );
  }

  if (trip.status === "paid") {
    return (
      <div className="h-full flex flex-col pb-20">
        <div className="text-xs text-white/60">Califica tu viaje</div>
        <div className="flex items-center gap-3 mt-2">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-neon-lime to-neon-cyan" />
          <div><div className="font-bold text-sm">{trip.driver?.name}</div><div className="text-[10px] text-white/50">{trip.driver?.vehicle}</div></div>
        </div>
        <div className="mt-4 flex justify-center gap-1">
          {[1,2,3,4,5].map((i) => (
            <button key={i} onClick={() => setTrip({ ...trip, rating: i })}>
              <Star className={`h-9 w-9 ${i <= trip.rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`} />
            </button>
          ))}
        </div>
        {trip.rating > 0 && (
          <>
            <div className="mt-4 text-[10px] text-white/50">Destacar al conductor</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["👍 Amable","🚗 Buen manejo","🧼 Limpio","🕐 Puntual","🎵 Música","❄️ A/C"].map((t) => (
                <span key={t} className="text-[10px] glass rounded-full px-2 py-1 cursor-pointer hover:bg-white/10">{t}</span>
              ))}
            </div>
            <div className="mt-4 glass rounded-xl p-3">
              <div className="text-[10px] text-white/60">💰 Dejar propina (100% al conductor)</div>
              <div className="mt-2 flex gap-1.5">
                {[10, 20, 30, 50].map((v) => (
                  <button
                    key={v}
                    onClick={() => setTrip({ ...trip, tipAmount: v })}
                    className={`flex-1 rounded-lg py-1.5 text-xs ${trip.tipAmount === v ? "bg-gradient-to-r from-neon-cyan to-neon-violet text-black font-bold" : "glass"}`}
                  >
                    ${v}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setTrip({ ...trip, status: "rated" })} className="mt-auto rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet py-3 text-black font-bold text-sm">Enviar y continuar</button>
          </>
        )}
      </div>
    );
  }

  // rated
  return (
    <div className="h-full flex flex-col items-center justify-center text-center pb-20">
      <CheckCircle2 className="h-20 w-20 text-neon-lime" />
      <div className="mt-3 font-display text-xl font-bold">¡Gracias Sofía!</div>
      <div className="text-xs text-white/60">Viaje completado</div>
      <div className="mt-4 w-full glass rounded-xl p-3 text-xs">
        <div className="flex justify-between"><span className="text-white/60">Tarifa</span><span>${trip.fare}</span></div>
        <div className="flex justify-between"><span className="text-white/60">Propina</span><span>${trip.tipAmount}</span></div>
        <div className="flex justify-between border-t border-white/10 pt-1.5 mt-1.5 font-bold"><span>Total</span><span className="text-gradient">${trip.fare + trip.tipAmount}</span></div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-neon-lime">
        <Gift className="h-3 w-3" /> +{Math.round(trip.fare * 1.5)} puntos de lealtad
      </div>
      <button onClick={() => setTrip(initialTrip)} className="mt-5 text-xs text-neon-cyan underline">Pedir otro viaje</button>
    </div>
  );
}

function ServicePicker({ trip, setTrip }: { trip: TripState; setTrip: (u: TripState | ((t: TripState) => TripState)) => void }) {
  const services: { key: Service; icon: any; name: string; mult: number; d: string }[] = [
    { key: "ride", icon: Car, name: "Clásico", mult: 1, d: "Hasta 4 pers." },
    { key: "shared", icon: Users, name: "Compartido", mult: 0.62, d: "Hasta -40%" },
    { key: "envios", icon: Package, name: "Envíos", mult: 0.85, d: "Paquetería" },
    { key: "super", icon: ShoppingBasket, name: "Súper", mult: 1.25, d: "Mandados" },
    { key: "farmacia", icon: Pill, name: "Farmacia", mult: 0.7, d: "Medicinas" },
    { key: "pet", icon: Dog, name: "Pet", mult: 1.1, d: "Pet friendly" },
    { key: "aeropuerto", icon: Plane, name: "Aeropuerto", mult: 4.1, d: "Tarifa fija" },
    { key: "favor", icon: Heart, name: "Favor", mult: 0.9, d: "Recados" },
  ];

  const base = Math.round(trip.fare);

  return (
    <div className="mt-3 glass rounded-2xl p-3">
      <div className="text-[10px] text-white/60 mb-2">Elige servicio</div>
      <div className="grid grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
        {services.map((s) => (
          <button
            key={s.key}
            onClick={() => setTrip({ ...trip, service: s.key, fare: Math.round(base * s.mult) })}
            className={`rounded-lg p-2 text-left flex items-center gap-2 text-xs ${trip.service === s.key ? "bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40" : "bg-white/[0.03] border border-white/5"}`}
          >
            <s.icon className="h-3.5 w-3.5 text-neon-cyan" />
            <div className="flex-1">
              <div className="font-semibold text-[10px]">{s.name}</div>
              <div className="text-[9px] text-white/50">{s.d}</div>
            </div>
            <div className="text-neon-cyan font-bold text-[10px]">${Math.round(base * s.mult)}</div>
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-white/60">
        <span>Método: BBVA •••• 4821</span>
        <span className="text-neon-lime">Uber: ${Math.round(trip.fare * 1.31)} · Ahorras ${Math.round(trip.fare * 0.31)}</span>
      </div>
      <button
        onClick={() => {
          setTrip({ ...trip, status: "searching" });
          // simulate driver assignment after 2.5s
          setTimeout(() => {
            setTrip((t) => ({
              ...t,
              status: "matched",
              driver: { name: "Don Roberto Mendoza", plate: "JAL-1234", vehicle: "Nissan Tsuru blanco", rating: 4.97, score: 98 },
            }));
          }, 2500);
        }}
        className="mt-2 w-full rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet py-2.5 text-black font-bold text-xs"
      >
        Confirmar viaje ${trip.fare}
      </button>
    </div>
  );
}

function PassengerHistory() {
  const trips = [
    { to: "Plaza del Sol", from: "Av. Chapultepec", fare: 68, date: "Hoy 14:30", rating: 5 },
    { to: "Andares", from: "Providencia", fare: 95, date: "Ayer 19:15", rating: 5 },
    { to: "Aeropuerto GDL", from: "Casa", fare: 280, date: "04 abr 06:00", rating: 5 },
    { to: "Tlaquepaque", from: "Minerva", fare: 62, date: "03 abr 18:40", rating: 4 },
    { to: "Farmacia Gdl", from: "Casa", fare: 45, date: "02 abr 22:10", rating: 5 },
  ];
  return (
    <div className="h-full flex flex-col pb-20">
      <div className="font-display text-lg font-bold">Tu historial</div>
      <div className="text-[10px] text-white/60">28 viajes · $4,820 gastado · $1,108 ahorrado vs Uber</div>
      <div className="mt-3 space-y-2 overflow-y-auto flex-1">
        {trips.map((t, i) => (
          <div key={i} className="glass rounded-xl p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs font-semibold">{t.from} → {t.to}</div>
                <div className="text-[10px] text-white/50 mt-0.5">{t.date}</div>
                <div className="flex gap-0.5 mt-1">{Array.from({length:t.rating}).map((_,j)=><Star key={j} className="h-2 w-2 text-yellow-400 fill-yellow-400" />)}</div>
              </div>
              <div className="text-right">
                <div className="font-display font-bold text-sm text-gradient">${t.fare}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PassengerProfile() {
  return (
    <div className="h-full flex flex-col pb-20">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-neon-pink to-neon-violet" />
        <div>
          <div className="font-display font-bold">Sofía Ramírez</div>
          <div className="text-[10px] text-white/60">⭐ 4.9 · 28 viajes</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="glass rounded-xl p-3"><div className="text-[10px] text-white/50">Ahorrado</div><div className="text-lg font-bold text-gradient">$1,108</div></div>
        <div className="glass rounded-xl p-3"><div className="text-[10px] text-white/50">Puntos</div><div className="text-lg font-bold text-neon-lime">3,420</div></div>
      </div>
      <div className="mt-3 space-y-1.5 text-xs">
        {[
          { icon: CreditCard, t: "Métodos de pago", d: "3 métodos" },
          { icon: Shield, t: "Seguridad", d: "Contactos: 3 · Palabra clave ✓" },
          { icon: Heart, t: "Lugares favoritos", d: "Casa · Trabajo · Mamá" },
          { icon: Bell, t: "Notificaciones", d: "Activadas" },
          { icon: Settings, t: "Ajustes", d: "Idioma: Español" },
          { icon: LogOut, t: "Cerrar sesión", d: "" },
        ].map((r) => (
          <div key={r.t} className="glass rounded-xl p-2.5 flex items-center gap-3">
            <r.icon className="h-3.5 w-3.5 text-neon-cyan" />
            <div className="flex-1">
              <div className="font-semibold">{r.t}</div>
              {r.d && <div className="text-[10px] text-white/50">{r.d}</div>}
            </div>
            <ChevronRight className="h-3 w-3 text-white/40" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SosModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-red-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-20">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
        <Siren className="h-20 w-20 text-red-400" />
      </motion.div>
      <div className="mt-4 font-display text-2xl font-bold text-red-300 text-center">SOS ACTIVADO</div>
      <div className="mt-2 text-xs text-red-200/80 text-center">Alertando a C5 Jalisco y Policía Estatal</div>
      <div className="mt-4 w-full glass rounded-xl p-3 text-[11px] space-y-1.5">
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Ubicación enviada</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Foto del conductor enviada</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Placas JAL-1234 enviadas</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Contactos notificados (3)</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-neon-lime" /> Grabación de audio ON</div>
      </div>
      <div className="mt-4 text-xs text-red-300 text-center">Tiempo de respuesta C5: <b>4.2s</b></div>
      <button onClick={onClose} className="mt-5 glass rounded-full px-5 py-2 text-xs">Cancelar alerta</button>
    </motion.div>
  );
}

/* =========================  DRIVER APP  ========================= */

function DriverApp({ trip, setTrip }: { trip: TripState; setTrip: (u: TripState | ((t: TripState) => TripState)) => void }) {
  const [online, setOnline] = useState(true);
  const [tab, setTab] = useState<"home" | "earnings" | "profile">("home");

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col px-5">
        {tab === "home" && <DriverHome trip={trip} setTrip={setTrip} online={online} setOnline={setOnline} />}
        {tab === "earnings" && <DriverEarnings />}
        {tab === "profile" && <DriverProfile />}
      </div>
      <div className="absolute bottom-0 inset-x-0 border-t border-white/10 bg-black/60 backdrop-blur flex items-center justify-around py-3">
        <button onClick={() => setTab("home")} className={`flex flex-col items-center gap-0.5 ${tab === "home" ? "text-neon-lime" : "text-white/50"}`}><Home className="h-4 w-4" /><span className="text-[10px]">Inicio</span></button>
        <button onClick={() => setTab("earnings")} className={`flex flex-col items-center gap-0.5 ${tab === "earnings" ? "text-neon-lime" : "text-white/50"}`}><Wallet className="h-4 w-4" /><span className="text-[10px]">Ganancias</span></button>
        <button onClick={() => setTab("profile")} className={`flex flex-col items-center gap-0.5 ${tab === "profile" ? "text-neon-lime" : "text-white/50"}`}><User className="h-4 w-4" /><span className="text-[10px]">Perfil</span></button>
      </div>
    </PhoneFrame>
  );
}

function DriverHome({ trip, setTrip, online, setOnline }: { trip: TripState; setTrip: (u: TripState | ((t: TripState) => TripState)) => void; online: boolean; setOnline: (v: boolean) => void }) {
  // Driver sees notification when passenger status is "searching"
  const hasRequest = trip.status === "searching";

  if (trip.status === "idle" || trip.status === "selecting" || trip.status === "requesting") {
    return (
      <div className="h-full flex flex-col pb-20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-white/60">Don Roberto</div>
            <div className="font-display text-lg font-bold">{online ? "En línea 🟢" : "Offline"}</div>
          </div>
          <button onClick={() => setOnline(!online)} className={`h-8 w-14 rounded-full p-0.5 transition ${online ? "bg-neon-lime" : "bg-white/20"}`}>
            <div className={`h-7 w-7 rounded-full bg-white transition ${online ? "translate-x-6" : ""}`} />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="glass rounded-xl p-3"><div className="text-[10px] text-white/50">Hoy</div><div className="text-lg font-bold text-neon-lime">$842</div></div>
          <div className="glass rounded-xl p-3"><div className="text-[10px] text-white/50">Viajes hoy</div><div className="text-lg font-bold">11</div></div>
        </div>

        <div className="mt-3"><GdlMap car={false} showRoute={false} /></div>

        <div className="mt-auto glass rounded-xl p-3 text-center">
          <div className="text-[10px] text-white/60">Esperando solicitudes…</div>
          <div className="text-[10px] text-white/40 mt-1">Las solicitudes aparecerán aquí cuando un pasajero pida un viaje en tu zona</div>
        </div>
      </div>
    );
  }

  if (hasRequest) {
    return (
      <div className="h-full flex flex-col pb-20">
        <div className="text-xs text-white/60">En línea 🟢</div>
        <div className="mt-2"><GdlMap progress={0.1} /></div>
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          className="mt-3 glass rounded-2xl p-4 border-2 border-neon-lime/60 bg-neon-lime/5"
        >
          <div className="flex items-center gap-2">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="h-2 w-2 rounded-full bg-neon-lime" />
            <div className="text-[10px] text-neon-lime font-bold uppercase tracking-wider">Nueva solicitud</div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-neon-pink to-neon-violet" />
            <div>
              <div className="font-bold text-sm">Sofía R.</div>
              <div className="text-[10px] text-white/60">⭐ 4.9 · 28 viajes · verificada</div>
            </div>
          </div>
          <div className="mt-3 space-y-1 text-[10px]">
            <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-neon-pink" /> {trip.origin}</div>
            <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-neon-lime" /> {trip.destination}</div>
            <div className="flex items-center gap-2 text-white/50"><Clock className="h-3 w-3" /> {trip.distance} km · {trip.duration} min</div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-white/50">Ganas (90%)</div>
              <div className="font-display text-2xl font-bold text-gradient">${Math.round(trip.fare * 0.9)}</div>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setTrip(initialTrip)} className="glass rounded-lg px-3 py-2 text-[10px]">Rechazar</button>
              <button
                onClick={() => {
                  setTrip({
                    ...trip,
                    status: "matched",
                    driver: { name: "Don Roberto Mendoza", plate: "JAL-1234", vehicle: "Nissan Tsuru blanco", rating: 4.97, score: 98 },
                  });
                }}
                className="rounded-lg bg-gradient-to-r from-neon-lime to-neon-cyan px-4 py-2 text-[11px] text-black font-bold"
              >
                Aceptar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (trip.status === "matched" || trip.status === "arriving") {
    return (
      <div className="h-full flex flex-col pb-20">
        <div className="text-[10px] text-white/60">Recoger a</div>
        <div className="font-display text-base font-bold">Sofía R. ⭐ 4.9</div>
        <div className="mt-2"><GdlMap progress={trip.carProgress} /></div>
        <div className="mt-3 glass rounded-xl p-3">
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="h-3 w-3 text-neon-pink" />
            <span className="flex-1">{trip.origin}</span>
          </div>
          <div className="text-[10px] text-white/50 mt-1">Llegando en 2 min · 1.2 km</div>
        </div>
        <div className="mt-3 flex gap-1.5">
          <button className="flex-1 glass rounded-lg py-2 text-[10px] font-semibold flex items-center justify-center gap-1"><Navigation className="h-3 w-3" /> Navegar</button>
          <button className="flex-1 glass rounded-lg py-2 text-[10px] font-semibold flex items-center justify-center gap-1"><Phone className="h-3 w-3" /> Llamar</button>
          <button className="flex-1 glass rounded-lg py-2 text-[10px] font-semibold flex items-center justify-center gap-1"><MessageCircle className="h-3 w-3" /> Chat</button>
        </div>
        <button
          onClick={() => setTrip({ ...trip, status: "arriving" })}
          disabled={trip.status === "arriving"}
          className="mt-auto rounded-xl glass py-3 text-sm font-semibold hover:bg-white/10 disabled:opacity-50"
        >
          Ya llegué al punto
        </button>
        {trip.status === "arriving" && (
          <button
            onClick={() => setTrip({ ...trip, status: "pickedup", carProgress: 0 })}
            className="mt-2 rounded-xl bg-gradient-to-r from-neon-lime to-neon-cyan py-3 text-black font-bold text-sm"
          >
            Iniciar viaje (confirmar identidad)
          </button>
        )}
      </div>
    );
  }

  if (trip.status === "pickedup" || trip.status === "onroute") {
    return (
      <div className="h-full flex flex-col pb-20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/60">Llevando a Sofía a</div>
            <div className="font-display text-sm font-bold">{trip.destination}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/50">ETA</div>
            <div className="font-bold text-sm text-neon-lime">{Math.max(1, Math.round(trip.duration * (1 - trip.carProgress)))} min</div>
          </div>
        </div>
        <div className="mt-2"><GdlMap progress={Math.max(0.2, trip.carProgress)} /></div>
        <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
          <div className="glass rounded-lg p-1.5"><div className="text-[9px] text-white/50">Distancia</div><div className="text-xs font-bold">{(trip.distance * (1 - trip.carProgress)).toFixed(1)} km</div></div>
          <div className="glass rounded-lg p-1.5"><div className="text-[9px] text-white/50">Ganas</div><div className="text-xs font-bold text-neon-lime">${Math.round(trip.fare * 0.9)}</div></div>
          <div className="glass rounded-lg p-1.5"><div className="text-[9px] text-white/50">Com.</div><div className="text-xs font-bold text-white/60">${Math.round(trip.fare * 0.1)}</div></div>
        </div>
        <div className="mt-2 glass rounded-lg p-2 text-[9px] text-center text-white/60">🛡️ Protección activa · Ruta monitoreada por IA</div>
        {trip.status === "pickedup" && (
          <button
            onClick={() => setTrip({ ...trip, status: "onroute" })}
            className="mt-auto rounded-xl bg-gradient-to-r from-neon-lime to-neon-cyan py-3 text-black font-bold text-sm"
          >
            Comenzar trayecto
          </button>
        )}
        {trip.status === "onroute" && (
          <div className="mt-auto text-[10px] text-center text-white/50">Viaje en progreso… llegando en {Math.max(1, Math.round(trip.duration * (1 - trip.carProgress)))} min</div>
        )}
      </div>
    );
  }

  if (trip.status === "arrived" || trip.status === "paid" || trip.status === "rated") {
    return (
      <div className="h-full flex flex-col pb-20 items-center justify-center text-center">
        <CheckCircle2 className="h-16 w-16 text-neon-lime" />
        <div className="mt-3 font-display text-lg font-bold">¡Viaje completado!</div>
        <div className="mt-4 w-full glass rounded-xl p-4">
          <div className="text-[10px] text-white/60">Ganancias</div>
          <div className="font-display text-2xl font-bold text-gradient">${Math.round(trip.fare * 0.9)}</div>
          <div className="text-[10px] text-white/50">90% de ${trip.fare}</div>
          {trip.tipAmount > 0 && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <div className="text-[10px] text-neon-lime">+ Propina (100% tuya)</div>
              <div className="font-bold text-neon-lime">+${trip.tipAmount}</div>
            </div>
          )}
          <div className="mt-2 text-[9px] text-neon-lime">💰 En Uber hubieras recibido ${Math.round(trip.fare * 0.7)}</div>
        </div>
        <div className="mt-3 text-[10px] text-white/50">Pago a BBVA •••• 4821 en 24h</div>
      </div>
    );
  }

  return null;
}

function DriverEarnings() {
  return (
    <div className="h-full flex flex-col pb-20">
      <div className="font-display text-lg font-bold">Ganancias</div>
      <div className="text-[10px] text-white/60">Pago automático diario a BBVA</div>
      <div className="mt-3 glass rounded-2xl p-4 bg-gradient-to-br from-neon-lime/10 to-transparent border-neon-lime/30">
        <div className="text-[10px] text-white/60">Esta semana</div>
        <div className="font-display text-3xl font-bold text-gradient">$5,428</div>
        <div className="text-[10px] text-neon-lime">+$1,230 vs Uber</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="glass rounded-xl p-3"><div className="text-[10px] text-white/50">Hoy</div><div className="font-bold">$842</div></div>
        <div className="glass rounded-xl p-3"><div className="text-[10px] text-white/50">Viajes</div><div className="font-bold">11</div></div>
        <div className="glass rounded-xl p-3"><div className="text-[10px] text-white/50">Propinas</div><div className="font-bold text-neon-lime">$180</div></div>
        <div className="glass rounded-xl p-3"><div className="text-[10px] text-white/50">Horas</div><div className="font-bold">8.2</div></div>
      </div>
      <div className="mt-3 glass rounded-xl p-3">
        <div className="text-xs font-semibold mb-2">Adelanto de ganancias</div>
        <div className="text-[10px] text-white/60 mb-2">Tienes $842 disponibles. Puedes adelantar sin intereses (3 al mes).</div>
        <button className="w-full rounded-lg bg-gradient-to-r from-neon-lime to-neon-cyan py-2 text-black font-bold text-xs">Solicitar adelanto</button>
      </div>
    </div>
  );
}

function DriverProfile() {
  return (
    <div className="h-full flex flex-col pb-20">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-neon-lime to-neon-cyan" />
        <div>
          <div className="font-display font-bold">Don Roberto M.</div>
          <div className="text-[10px] text-white/60">⭐ 4.97 · 1,284 viajes</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="glass rounded-xl p-3"><div className="text-[10px] text-white/50">Score seguridad</div><div className="text-lg font-bold text-neon-cyan">98</div></div>
        <div className="glass rounded-xl p-3"><div className="text-[10px] text-white/50">Estado</div><div className="text-xs font-bold text-neon-lime">Verificado ✓</div></div>
      </div>
      <div className="mt-3 space-y-1.5 text-xs">
        {[
          { icon: BadgeCheck, t: "Documentación", d: "7/7 filtros OK" },
          { icon: Car, t: "Vehículo", d: "Nissan Tsuru 2018 · JAL-1234" },
          { icon: Shield, t: "Seguro + póliza", d: "Vigente hasta 2026" },
          { icon: Fingerprint, t: "Biometría", d: "Activa en cada turno" },
          { icon: Wallet, t: "Cuenta bancaria", d: "BBVA •••• 4821" },
          { icon: Settings, t: "Preferencias", d: "Zona: Providencia/Zapopan" },
        ].map((r) => (
          <div key={r.t} className="glass rounded-xl p-2.5 flex items-center gap-3">
            <r.icon className="h-3.5 w-3.5 text-neon-lime" />
            <div className="flex-1">
              <div className="font-semibold">{r.t}</div>
              <div className="text-[10px] text-white/50">{r.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
