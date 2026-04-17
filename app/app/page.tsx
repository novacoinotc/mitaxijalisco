"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Car, MapPin, Star, Phone, MessageCircle, Siren, CheckCircle2,
  CreditCard, Banknote, Smartphone, Users, Shield, Radar,
  Home, Clock, ChevronRight, ChevronLeft,
  User, Wallet, Bell, Settings, History, Plus, Trash2, Edit3,
  AlertTriangle, X, BadgeCheck, Loader2, Receipt, HelpCircle,
  Accessibility, Crown, Truck, Send,
} from "lucide-react";
import RealMap from "@/components/RealMap";
import {
  loadAppData, saveAppData, updateProfile, updatePayments, addTrip, getRandomDriver, calculateFare,
  type UserProfile, type PaymentMethod, type TripRecord, type DriverInfo, type ServiceType,
} from "@/lib/store";

export default function AppPage() {
  const [mode, setMode] = useState<"passenger" | "driver">("passenger");
  return (
    <div className="min-h-screen bg-neutral-950 flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-black text-white relative shadow-2xl shadow-black/50 flex flex-col">
        {/* Mode switcher */}
        <div className="bg-black px-4 pt-3 pb-2 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-[#10b981]" />
            <span className="text-xs font-bold">Mi Taxi Jalisco</span>
          </div>
          <div className="flex bg-white/5 rounded-full p-0.5">
            <button onClick={() => setMode("passenger")} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${mode === "passenger" ? "bg-[#10b981] text-black" : "text-white/60"}`}>
              Pasajero
            </button>
            <button onClick={() => setMode("driver")} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${mode === "driver" ? "bg-[#10b981] text-black" : "text-white/60"}`}>
              Conductor
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {mode === "passenger" ? <PassengerView /> : <DriverView />}
        </div>
      </div>
    </div>
  );
}

function PassengerView() {
  const [data, setData] = useState(() => loadAppData());
  const [tab, setTab] = useState<"home" | "trips" | "profile">("home");
  const [screen, setScreen] = useState("main");
  const [trip, setTrip] = useState<TripState | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: approxAddress(pos.coords.latitude, pos.coords.longitude) }),
      () => setLocation({ lat: 20.6597, lng: -103.3496, address: "Guadalajara, Jalisco" }),
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, []);

  const reload = useCallback(() => setData(loadAppData()), []);

  if (!data.onboarded && screen === "main") {
    return <OnboardingScreen onDone={(p) => { updateProfile(p); reload(); }} />;
  }

  return (
    <div className="h-full flex flex-col">
      {trip ? (
        <ActiveTrip trip={trip} setTrip={setTrip} location={location} onComplete={(r) => { addTrip(r); reload(); setTrip(null); }} />
      ) : (
        <>
          <div className="flex-1 pb-16 overflow-y-auto">
            {tab === "home" && screen === "main" && <HomeScreen profile={data.profile} location={location} payments={data.payments} onRequestTrip={(d, s, f, n, p) => setTrip({ status: "searching", origin: location?.address || "Tu ubicación", destination: d, service: s, baseFare: f, offeredFare: n, paymentMethod: p, driver: null, progress: 0 })} />}
            {tab === "home" && screen === "payments" && <PaymentsScreen payments={data.payments} onUpdate={(p) => { updatePayments(p); reload(); }} onBack={() => setScreen("main")} />}
            {tab === "home" && screen === "support" && <SupportScreen onBack={() => setScreen("main")} />}
            {tab === "trips" && <TripsScreen trips={data.trips} />}
            {tab === "profile" && screen === "main" && <ProfileScreen profile={data.profile} trips={data.trips} onEdit={() => setScreen("editProfile")} onPay={() => { setTab("home"); setScreen("payments"); }} onHelp={() => { setTab("home"); setScreen("support"); }} />}
            {tab === "profile" && screen === "editProfile" && <EditProfileScreen profile={data.profile} onSave={(p) => { updateProfile(p); reload(); setScreen("main"); }} onBack={() => setScreen("main")} />}
          </div>
          <nav className="border-t border-white/10 bg-black flex items-center justify-around py-2">
            {([["home", Home, "Inicio"], ["trips", Clock, "Viajes"], ["profile", User, "Perfil"]] as const).map(([k, I, l]) => (
              <button key={k} onClick={() => { setTab(k); setScreen("main"); }} className={`flex flex-col items-center gap-1 px-5 py-2 min-h-[44px] ${tab === k ? "text-[#10b981]" : "text-white/50"}`}>
                <I className="h-5 w-5" /><span className="text-[11px]">{l}</span>
              </button>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}

/* ================================================================ */
/*  DRIVER VIEW                                                      */
/* ================================================================ */

function DriverView() {
  const [online, setOnline] = useState(true);
  const [tab, setTab] = useState<"home" | "history" | "profile">("home");
  const [incomingTrip, setIncomingTrip] = useState<{ origin: string; destination: string; fare: number; user: string; userRating: number } | null>(null);
  const [activeTrip, setActiveTrip] = useState<{ status: "going" | "waiting" | "inProgress" | "done"; origin: string; destination: string; fare: number; user: string; progress: number } | null>(null);

  // Simulate incoming trip request every 15s when online and idle
  useEffect(() => {
    if (!online || incomingTrip || activeTrip) return;
    const t = setTimeout(() => {
      setIncomingTrip({
        origin: "Col. Americana, GDL",
        destination: "Plaza del Sol, Zapopan",
        fare: 68,
        user: "Sofía R.",
        userRating: 4.9,
      });
    }, 8000);
    return () => clearTimeout(t);
  }, [online, incomingTrip, activeTrip]);

  // Progress for active trip
  useEffect(() => {
    if (!activeTrip || activeTrip.status !== "inProgress") return;
    const id = setInterval(() => {
      setActiveTrip((prev) => {
        if (!prev || prev.progress >= 1) return prev ? { ...prev, status: "done", progress: 1 } : prev;
        return { ...prev, progress: prev.progress + 0.02 };
      });
    }, 300);
    return () => clearInterval(id);
  }, [activeTrip?.status]);

  const earnings = { today: 842, trips: 11, week: 5428 };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 pb-16 overflow-y-auto">
        {tab === "home" && (
          <div className="px-5 pt-4">
            {/* Driver header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-white/60">Conductor</div>
                <div className="text-lg font-bold">Roberto Mendoza</div>
                <div className="text-[11px] text-white/50">Nissan Tsuru · JAL-1234 · Sitio 42</div>
              </div>
              <button onClick={() => setOnline(!online)} className={`h-8 w-14 rounded-full p-0.5 transition ${online ? "bg-[#10b981]" : "bg-white/20"}`}>
                <div className={`h-7 w-7 rounded-full bg-white transition-transform ${online ? "translate-x-6" : ""}`} />
              </button>
            </div>

            {/* Status */}
            <div className={`rounded-xl p-4 mb-4 text-center ${online ? "bg-[#10b981]/10 border border-[#10b981]/30" : "bg-white/5"}`}>
              <div className={`text-lg font-bold ${online ? "text-[#10b981]" : "text-white/50"}`}>
                {online ? "🟢 En línea" : "⚫ Fuera de línea"}
              </div>
              <div className="text-[11px] text-white/60 mt-1">
                {online ? "Esperando solicitudes de viaje…" : "No recibirás solicitudes"}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-white/5 rounded-xl p-3 text-center"><div className="text-[11px] text-white/50">Hoy</div><div className="font-bold text-[#10b981]">${earnings.today}</div></div>
              <div className="bg-white/5 rounded-xl p-3 text-center"><div className="text-[11px] text-white/50">Viajes</div><div className="font-bold">{earnings.trips}</div></div>
              <div className="bg-white/5 rounded-xl p-3 text-center"><div className="text-[11px] text-white/50">Semana</div><div className="font-bold text-[#10b981]">${earnings.week}</div></div>
            </div>

            {/* Map */}
            <RealMap progress={0} showCar={false} className="h-[200px] mb-4" interactive />

            {/* Incoming trip */}
            {incomingTrip && !activeTrip && (
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/5 rounded-2xl p-4 border-2 border-[#10b981]/50 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-xs text-[#10b981] font-bold uppercase tracking-wider">Nueva solicitud</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-[#10b981]/20 flex items-center justify-center"><User className="h-5 w-5 text-[#10b981]" /></div>
                  <div><div className="font-bold">{incomingTrip.user}</div><div className="text-[11px] text-white/60 flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400 fill-yellow-400" /> {incomingTrip.userRating}</div></div>
                </div>
                <div className="text-xs space-y-1 mb-3">
                  <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-[#10b981]" /> {incomingTrip.origin}</div>
                  <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full border border-[#10b981]" /> {incomingTrip.destination}</div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div><div className="text-[11px] text-white/50">Ganancia (90%)</div><div className="text-xl font-bold text-[#10b981]">${Math.round(incomingTrip.fare * 0.9)}</div></div>
                  <div className="text-right text-[11px] text-white/50">8.4 km · ~18 min</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIncomingTrip(null)} className="flex-1 rounded-xl bg-white/5 py-3 text-sm font-semibold">Rechazar</button>
                  <button onClick={() => { setActiveTrip({ status: "going", origin: incomingTrip.origin, destination: incomingTrip.destination, fare: incomingTrip.fare, user: incomingTrip.user, progress: 0 }); setIncomingTrip(null); }} className="flex-1 rounded-xl bg-[#10b981] py-3 text-black text-sm font-bold">Aceptar</button>
                </div>
              </motion.div>
            )}

            {/* Active trip (driver side) */}
            {activeTrip && (
              <div className="bg-white/5 rounded-2xl p-4 mb-4">
                <div className="text-xs text-[#10b981] font-bold uppercase mb-2">
                  {activeTrip.status === "going" && "En camino al pasajero"}
                  {activeTrip.status === "waiting" && "Esperando al pasajero"}
                  {activeTrip.status === "inProgress" && "Viaje en curso"}
                  {activeTrip.status === "done" && "Viaje completado"}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-[#10b981]/20 flex items-center justify-center"><User className="h-5 w-5 text-[#10b981]" /></div>
                  <div><div className="font-bold">{activeTrip.user}</div><div className="text-[11px] text-white/50">{activeTrip.origin} → {activeTrip.destination}</div></div>
                </div>

                {activeTrip.status === "inProgress" && (
                  <div className="mb-3">
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#10b981] transition-all" style={{ width: `${activeTrip.progress * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-white/50 mt-1">
                      <span>{Math.round(activeTrip.progress * 8.4)} km</span>
                      <span>ETA: {Math.max(1, Math.round(18 * (1 - activeTrip.progress)))} min</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <div><div className="text-[11px] text-white/50">Ganancia</div><div className="text-xl font-bold text-[#10b981]">${Math.round(activeTrip.fare * 0.9)}</div></div>
                  <div className="text-right"><div className="text-[11px] text-white/50">Tarifa</div><div className="text-sm">${activeTrip.fare}</div></div>
                </div>

                {activeTrip.status === "going" && (
                  <button onClick={() => setActiveTrip({ ...activeTrip, status: "waiting" })} className="w-full rounded-xl bg-white/10 py-3 text-sm font-semibold">Ya llegué al punto</button>
                )}
                {activeTrip.status === "waiting" && (
                  <button onClick={() => setActiveTrip({ ...activeTrip, status: "inProgress", progress: 0 })} className="w-full rounded-xl bg-[#10b981] py-3 text-black text-sm font-bold">Pasajero abordó · Iniciar</button>
                )}
                {activeTrip.status === "done" && (
                  <div className="text-center">
                    <CheckCircle2 className="h-10 w-10 text-[#10b981] mx-auto mb-2" />
                    <div className="font-bold">¡Viaje completado!</div>
                    <div className="text-[11px] text-white/50 mt-1">Pago: $61 depositado en 24h</div>
                    <button onClick={() => setActiveTrip(null)} className="mt-3 rounded-xl bg-white/10 px-5 py-2 text-sm">Continuar</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "history" && (
          <div className="px-5 pt-4">
            <div className="text-lg font-bold mb-4">Historial</div>
            {[
              { dest: "Plaza del Sol", user: "Sofía R.", fare: 68, date: "Hoy 14:30" },
              { dest: "Andares", user: "Carlos H.", fare: 95, date: "Hoy 12:15" },
              { dest: "Aeropuerto", user: "María L.", fare: 280, date: "Ayer 06:00" },
              { dest: "Tlaquepaque", user: "Issac V.", fare: 62, date: "16 abr 18:40" },
            ].map((t, i) => (
              <div key={i} className="bg-white/[0.03] rounded-xl p-4 mb-2 flex items-center justify-between">
                <div><div className="text-sm font-medium">{t.dest}</div><div className="text-[11px] text-white/50">{t.user} · {t.date}</div></div>
                <div className="text-right"><div className="font-bold text-[#10b981]">+${Math.round(t.fare * 0.9)}</div><div className="text-[11px] text-white/50">${t.fare} tarifa</div></div>
              </div>
            ))}
          </div>
        )}

        {tab === "profile" && (
          <div className="px-5 pt-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-[#10b981]/20 flex items-center justify-center"><Car className="h-8 w-8 text-[#10b981]" /></div>
              <div><div className="font-bold text-lg">Roberto Mendoza</div><div className="text-xs text-white/60">⭐ 4.97 · 1,284 viajes · Sitio 42</div></div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white/5 rounded-xl p-3"><div className="text-[11px] text-white/50">Score seguridad</div><div className="font-bold text-lg text-[#10b981]">98</div></div>
              <div className="bg-white/5 rounded-xl p-3"><div className="text-[11px] text-white/50">Verificación</div><div className="font-bold text-sm text-[#10b981]">✓ 7/7 filtros</div></div>
            </div>
            <div className="space-y-1 text-sm">
              {["Nissan Tsuru 2018 Blanco · JAL-1234", "Seguro vigente ✓", "INE verificada con RENAPO ✓", "Biometría activa ✓", "Cuenta BBVA •••• 4821", "Zona: Providencia / Zapopan"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-white/[0.02] rounded-lg">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                  <span className="text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Driver bottom nav */}
      <nav className="border-t border-white/10 bg-black flex items-center justify-around py-2">
        {([["home", Home, "Inicio"], ["history", Clock, "Historial"], ["profile", Car, "Perfil"]] as const).map(([k, I, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex flex-col items-center gap-1 px-5 py-2 min-h-[44px] ${tab === k ? "text-[#10b981]" : "text-white/50"}`}>
            <I className="h-5 w-5" /><span className="text-[11px]">{l}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function approxAddress(lat: number, lng: number) {
  if (lat > 20.7) return "Zapopan, Jalisco";
  if (lat < 20.63) return "Tlaquepaque, Jalisco";
  return "Guadalajara, Jalisco";
}

function OnboardingScreen({ onDone }: { onDone: (p: UserProfile) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="h-12 w-12 rounded-xl bg-[#10b981] flex items-center justify-center mb-6"><Car className="h-6 w-6 text-black" /></div>
        <h1 className="text-2xl font-bold">Bienvenido a Mi Taxi Jalisco</h1>
        <p className="text-white/60 mt-2 text-sm">Configura tu perfil para empezar.</p>
        <div className="mt-6 space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre completo" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:border-[#10b981]/50" />
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Teléfono" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:border-[#10b981]/50" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo" type="email" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:border-[#10b981]/50" />
        </div>
        <button onClick={() => { if(name.trim()) onDone({ name: name.trim(), phone: phone.trim(), email: email.trim(), photo: "", emergencyContacts: [] }); }} disabled={!name.trim()} className="mt-6 w-full rounded-xl bg-[#10b981] py-3.5 text-black font-bold disabled:opacity-40">Comenzar</button>
      </div>
    </div>
  );
}

const DESTS = [
  { label: "Plaza del Sol", addr: "Plaza del Sol, Zapopan", km: 8.4, min: 18 },
  { label: "Andares", addr: "Andares, Zapopan", km: 10.2, min: 22 },
  { label: "Aeropuerto GDL", addr: "Aeropuerto GDL", km: 18.5, min: 35 },
  { label: "Centro Histórico", addr: "Centro Histórico, GDL", km: 5.2, min: 14 },
  { label: "Tlaquepaque", addr: "Centro Tlaquepaque", km: 7.1, min: 16 },
  { label: "Expo Guadalajara", addr: "Expo GDL", km: 6.8, min: 15 },
];

function HomeScreen({ profile, location, payments, onRequestTrip }: { profile: UserProfile; location: any; payments: PaymentMethod[]; onRequestTrip: (d: string, s: ServiceType, f: number, n: number, p: string) => void }) {
  const [dest, setDest] = useState("");
  const [sel, setSel] = useState<typeof DESTS[0] | null>(null);
  const [svc, setSvc] = useState<ServiceType>("normal");
  const [custom, setCustom] = useState("");

  const fare = sel ? calculateFare(sel.km, svc) : 0;
  const offered = custom ? parseInt(custom) : fare;
  const pm = payments.find(p => p.isDefault);

  if (sel) return (
    <div className="px-5 pt-4">
      <button onClick={() => setSel(null)} className="flex items-center gap-1 text-white/60 text-sm mb-4"><ChevronLeft className="h-4 w-4" /> Cambiar destino</button>
      <div className="bg-white/5 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1"><div className="h-2.5 w-2.5 rounded-full bg-[#10b981]" /><div className="w-px h-8 bg-white/20" /><div className="h-2.5 w-2.5 rounded-full border-2 border-[#10b981]" /></div>
          <div className="flex-1 space-y-3">
            <div><div className="text-[11px] text-white/50">Origen</div><div className="text-sm">{location?.address || "Tu ubicación"}</div></div>
            <div><div className="text-[11px] text-white/50">Destino</div><div className="text-sm">{sel.label}</div></div>
          </div>
        </div>
        <div className="flex gap-3 text-xs text-white/50 mt-2">{sel.km} km · ~{sel.min} min</div>
      </div>
      <div className="text-xs text-white/60 mb-2">Tipo de servicio</div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {([["normal",Car,"Normal","4 pers."],["grande",Truck,"Grande","5+ pers."],["accesible",Accessibility,"Accesible","Silla ruedas"],["ejecutivo",Crown,"Ejecutivo","Premium"]] as const).map(([k,I,l,d]) => (
          <button key={k} onClick={() => { setSvc(k as ServiceType); setCustom(""); }} className={`rounded-xl p-3 text-left flex items-center gap-2 ${svc===k?"bg-[#10b981]/15 border border-[#10b981]/40":"bg-white/5 border border-white/5"}`}>
            <I className="h-4 w-4 text-[#10b981]" /><div><div className="text-xs font-semibold">{l}</div><div className="text-[11px] text-white/50">{d}</div></div>
          </button>
        ))}
      </div>
      <div className="bg-white/5 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2"><span className="text-sm text-white/70">Tarifa estimada</span><span className="text-xl font-bold text-[#10b981]">${fare}</span></div>
        <div className="text-[11px] text-white/50 mb-2">¿Ofrecer tu tarifa? (negociación)</div>
        <div className="flex items-center gap-2">
          <span className="text-white/40">$</span>
          <input value={custom} onChange={e => setCustom(e.target.value.replace(/\D/g,""))} placeholder={String(fare)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#10b981]/50" />
          {custom && <button onClick={() => setCustom("")}><X className="h-4 w-4 text-white/40" /></button>}
        </div>
        {custom && parseInt(custom) < fare*0.7 && <div className="text-[11px] text-yellow-400/80 mt-2 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Tarifa baja</div>}
      </div>
      <div className="bg-white/5 rounded-2xl p-4 mb-6 flex items-center gap-3">
        {pm?.type==="cash"?<Banknote className="h-5 w-5 text-[#10b981]" />:<CreditCard className="h-5 w-5 text-[#10b981]" />}
        <div className="flex-1"><div className="text-sm">{pm?.label||"Efectivo"}</div><div className="text-[11px] text-white/50">Pago</div></div>
      </div>
      <button onClick={() => onRequestTrip(sel.addr, svc, fare, offered, pm?.label||"Efectivo")} className="w-full rounded-xl bg-[#10b981] py-4 text-black font-bold text-base active:scale-[0.98] transition">Solicitar viaje · ${offered}</button>
    </div>
  );

  return (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between mb-4">
        <div><div className="text-white/60 text-xs">Hola,</div><div className="text-lg font-bold">{profile.name||"Usuario"} 👋</div></div>
        <div className="h-11 w-11 rounded-full bg-white/5 flex items-center justify-center"><Bell className="h-4 w-4 text-white/60" /></div>
      </div>
      <div className="bg-white/5 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 text-sm"><div className="h-2 w-2 rounded-full bg-[#10b981]" /><span className="text-white/70">Tu ubicación</span></div>
        <div className="text-sm font-medium ml-4">{location?.address || <span className="text-white/40 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Detectando...</span>}</div>
      </div>
      <div className="relative mb-4">
        <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-[#10b981]" />
        <input value={dest} onChange={e => setDest(e.target.value)} placeholder="¿A dónde vamos?" className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder-white/30 focus:outline-none focus:border-[#10b981]/50" />
      </div>
      <div className="space-y-1.5">
        {DESTS.filter(d => !dest || d.label.toLowerCase().includes(dest.toLowerCase())).map(d => (
          <button key={d.label} onClick={() => setSel(d)} className="w-full text-left flex items-center gap-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] p-3">
            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center"><MapPin className="h-3.5 w-3.5 text-white/60" /></div>
            <div className="flex-1"><div className="text-sm font-medium">{d.label}</div><div className="text-[11px] text-white/50">{d.km} km · ~{d.min} min</div></div>
            <span className="text-sm font-semibold text-[#10b981]">${calculateFare(d.km,"normal")}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-2xl overflow-hidden"><RealMap progress={0} showCar={false} userLocation={location} className="h-[180px]" /></div>
    </div>
  );
}

interface TripState { status: "searching"|"negotiating"|"matched"|"arriving"|"inProgress"|"arrived"|"rating"; origin: string; destination: string; service: ServiceType; baseFare: number; offeredFare: number; paymentMethod: string; driver: DriverInfo|null; progress: number; }

function ActiveTrip({ trip, setTrip, location, onComplete }: { trip: TripState; setTrip: (t: TripState|null) => void; location: {lat:number;lng:number}|null; onComplete: (r: TripRecord) => void }) {
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState(0);
  const [sosOpen, setSosOpen] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (trip.status==="searching") {
      const t = setTimeout(() => {
        const drv = getRandomDriver();
        if (trip.offeredFare < trip.baseFare*0.85) { setCounter(Math.round(trip.baseFare*0.9)); setTrip({...trip, status:"negotiating", driver:drv}); }
        else setTrip({...trip, status:"matched", driver:drv});
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [trip.status]);

  useEffect(() => { if(trip.status==="matched") { const t=setTimeout(()=>setTrip({...trip,status:"arriving"}),2000); return()=>clearTimeout(t); } }, [trip.status]);

  useEffect(() => {
    if (trip.status!=="inProgress") return;
    const id = setInterval(() => {
      if(trip.progress>=1) { clearInterval(id); setTrip({...trip,status:"arrived",progress:1}); return; }
      setTrip({...trip, progress:trip.progress+0.015});
    }, 300);
    return () => clearInterval(id);
  }, [trip.status, trip.progress]);

  const ff = counter||trip.offeredFare;

  if (trip.status==="searching") return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6">
      <motion.div animate={{scale:[1,1.1,1]}} transition={{repeat:Infinity,duration:2}} className="h-24 w-24 rounded-full bg-[#10b981]/20 border border-[#10b981]/30 flex items-center justify-center mb-6"><Radar className="h-10 w-10 text-[#10b981]" /></motion.div>
      <div className="text-xl font-bold">Buscando conductor...</div>
      <div className="text-sm text-white/60 mt-2">Enviando a conductores cercanos</div>
      <div className="mt-6 bg-white/5 rounded-xl p-3 w-full max-w-sm text-xs space-y-1.5">
        <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-[#10b981]" /> {trip.origin}</div>
        <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-white/40" /> {trip.destination}</div>
        <div className="flex items-center gap-2"><Wallet className="h-3 w-3 text-white/40" /> ${trip.offeredFare} · {trip.paymentMethod}</div>
      </div>
      <button onClick={() => setTrip(null)} className="mt-6 text-sm text-red-400">Cancelar</button>
    </div>
  );

  if (trip.status==="negotiating" && trip.driver) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white/5 rounded-2xl p-5 w-full max-w-sm">
        <div className="text-xs text-[#10b981] font-semibold mb-3">CONTRAOFERTA</div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-[#10b981]/20 flex items-center justify-center"><User className="h-6 w-6 text-[#10b981]" /></div>
          <div><div className="font-bold">{trip.driver.name}</div><div className="text-xs text-white/60">{trip.driver.vehicle} · {trip.driver.plate}</div></div>
        </div>
        <div className="text-center mb-4">
          <div className="text-white/60 text-sm">Ofreciste: <span className="line-through">${trip.offeredFare}</span></div>
          <div className="text-2xl font-bold text-[#10b981] mt-1">Pide ${counter}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTrip(null)} className="flex-1 rounded-xl bg-white/5 py-3 text-sm">Rechazar</button>
          <button onClick={() => setTrip({...trip, status:"matched", offeredFare:counter})} className="flex-1 rounded-xl bg-[#10b981] py-3 text-black text-sm font-bold">Aceptar ${counter}</button>
        </div>
      </div>
    </div>
  );

  if (trip.status==="matched"||trip.status==="arriving") return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-y-auto">
      <div className="px-5 pt-4 pb-2"><div className="text-xs text-[#10b981] font-semibold">{trip.status==="arriving"?"EN CAMINO":"ASIGNADO"}</div></div>
      <div className="px-5 mb-3"><div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-[#10b981]/20 flex items-center justify-center"><User className="h-7 w-7 text-[#10b981]" /></div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5"><span className="font-bold">{trip.driver?.name}</span><BadgeCheck className="h-4 w-4 text-[#10b981]" /></div>
          <div className="text-xs text-white/60"><Star className="h-3 w-3 text-yellow-400 fill-yellow-400 inline" /> {trip.driver?.rating} · {trip.driver?.trips} viajes</div>
          <div className="text-xs text-white/50">{trip.driver?.vehicle} {trip.driver?.vehicleColor} · {trip.driver?.plate}</div>
          <div className="text-[11px] text-white/40">{trip.driver?.siteNumber}</div>
        </div>
        <div className="flex flex-col gap-1.5">
          <button className="h-11 w-11 rounded-full bg-white/5 flex items-center justify-center"><Phone className="h-4 w-4 text-[#10b981]" /></button>
          <button className="h-11 w-11 rounded-full bg-white/5 flex items-center justify-center"><MessageCircle className="h-4 w-4 text-[#10b981]" /></button>
        </div>
      </div></div>
      <div className="flex-1 px-5"><RealMap progress={trip.status==="arriving"?0.15:0.05} showRoute destination={trip.destination} userLocation={location} showDriverApproach={trip.status==="arriving"} driverEta={3} className="h-full rounded-2xl" /></div>
      <div className="px-5 py-4 space-y-2">
        <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between"><span className="text-sm">{trip.status==="arriving"?"Llega en ~3 min":"Preparando"}</span><span className="font-bold text-[#10b981]">${ff}</span></div>
        <div className="flex gap-2">
          <button onClick={() => setSosOpen(true)} className="flex-1 rounded-xl bg-red-500/10 border border-red-500/30 py-3 text-red-400 font-semibold text-sm flex items-center justify-center gap-2"><Siren className="h-4 w-4" /> SOS</button>
          {trip.status==="arriving" && <button onClick={() => setTrip({...trip,status:"inProgress",progress:0})} className="flex-1 rounded-xl bg-[#10b981] py-3 text-black font-bold text-sm">Ya subí</button>}
        </div>
      </div>
      {sosOpen && <SosOverlay onClose={() => setSosOpen(false)} driver={trip.driver!} />}
    </div>
  );

  if (trip.status==="inProgress") {
    const eta = Math.max(1,Math.round(18*(1-trip.progress)));
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-y-auto">
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <div><div className="text-xs text-white/60">En camino a</div><div className="font-bold">{trip.destination}</div></div>
          <div className="text-right"><div className="text-xs text-white/50">ETA</div><div className="text-lg font-bold text-[#10b981]">{eta} min</div></div>
        </div>
        <div className="flex-1 px-5"><RealMap progress={trip.progress} showRoute destination={trip.destination} userLocation={location} className="h-full rounded-2xl" /></div>
        <div className="px-5 py-3 space-y-2">
          <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between text-sm"><div className="flex items-center gap-2"><Shield className="h-4 w-4 text-[#10b981]" /> Monitoreado</div><span className="text-[#10b981] text-xs">IA activa</span></div>
          <div className="flex gap-2">
            <button onClick={() => setSosOpen(true)} className="flex-1 rounded-xl bg-red-500/10 border border-red-500/30 py-3 text-red-400 font-semibold text-sm flex items-center justify-center gap-2"><Siren className="h-4 w-4" /> SOS</button>
            <button className="flex-1 rounded-xl bg-white/5 py-3 text-sm font-semibold flex items-center justify-center gap-1"><Users className="h-4 w-4" /> Compartir</button>
          </div>
        </div>
        {sosOpen && <SosOverlay onClose={() => setSosOpen(false)} driver={trip.driver!} />}
      </div>
    );
  }

  if (trip.status==="arrived") return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6">
      <CheckCircle2 className="h-20 w-20 text-[#10b981] mb-4" />
      <div className="text-2xl font-bold">¡Llegaste!</div>
      <div className="text-sm text-white/60 mt-1">{trip.destination}</div>
      <div className="mt-6 bg-white/5 rounded-2xl p-4 w-full max-w-sm text-sm">
        <div className="flex justify-between"><span className="text-white/60">Tarifa</span><span>${ff}</span></div>
        <div className="flex justify-between mt-1"><span className="text-white/60">Método</span><span>{trip.paymentMethod}</span></div>
      </div>
      <button onClick={() => setTrip({...trip,status:"rating"})} className="mt-6 w-full max-w-sm rounded-xl bg-[#10b981] py-3.5 text-black font-bold">Calificar</button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto p-6">
      <div className="max-w-sm mx-auto text-center">
        <div className="h-16 w-16 rounded-full bg-[#10b981]/20 flex items-center justify-center mx-auto"><User className="h-8 w-8 text-[#10b981]" /></div>
        <div className="mt-3 font-bold text-lg">{trip.driver?.name}</div>
        <div className="text-xs text-white/60">{trip.driver?.vehicle} · {trip.driver?.plate}</div>
        <div className="mt-6 text-sm text-white/70 mb-2">¿Cómo estuvo?</div>
        <div className="flex justify-center gap-2">
          {[1,2,3,4,5].map(i => <button key={i} onClick={() => setRating(i)}><Star className={`h-10 w-10 ${i<=rating?"text-yellow-400 fill-yellow-400":"text-white/20"}`} /></button>)}
        </div>
        {rating>0 && <>
          <div className="mt-6 text-left"><div className="text-xs text-white/60 mb-2">Propina (100% conductor)</div>
            <div className="flex gap-2">{[0,10,20,30,50].map(v => <button key={v} onClick={() => setTip(v)} className={`flex-1 rounded-lg py-2.5 text-sm ${tip===v?"bg-[#10b981] text-black font-bold":"bg-white/5"}`}>{v===0?"—":`$${v}`}</button>)}</div>
          </div>
          <button onClick={() => onComplete({ id:`t-${Date.now()}`, date:new Date().toISOString(), origin:trip.origin, destination:trip.destination, service:trip.service, fare:ff, distance:8.4, duration:18, driver:trip.driver!, rating, driverRatingToUser:Math.random()>0.2?5:4, tip, paymentMethod:trip.paymentMethod, status:"completed" })} className="mt-6 w-full rounded-xl bg-[#10b981] py-3.5 text-black font-bold">Enviar</button>
        </>}
      </div>
    </div>
  );
}

function SosOverlay({ onClose, driver }: { onClose: () => void; driver: DriverInfo }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 bg-red-950/95 z-[60] flex flex-col items-center justify-center p-6">
      <motion.div animate={{scale:[1,1.1,1]}} transition={{repeat:Infinity,duration:1}}><Siren className="h-20 w-20 text-red-400" /></motion.div>
      <div className="mt-4 text-2xl font-bold text-red-300">SOS ACTIVADO</div>
      <div className="mt-4 bg-white/5 rounded-xl p-3 w-full max-w-sm text-sm space-y-1.5">
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> Ubicación enviada al C5</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> {driver.name} · {driver.plate}</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> Contactos notificados</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> Audio grabando</div>
      </div>
      <button onClick={onClose} className="mt-6 rounded-full bg-white/10 px-6 py-2 text-sm">Cancelar (falsa alarma)</button>
    </motion.div>
  );
}

function TripsScreen({ trips }: { trips: TripRecord[] }) {
  const [sel, setSel] = useState<TripRecord|null>(null);
  if (sel) return (
    <div className="px-5 pt-4">
      <button onClick={() => setSel(null)} className="flex items-center gap-1 text-white/60 text-sm mb-4"><ChevronLeft className="h-4 w-4" /> Historial</button>
      <div className="bg-white/5 rounded-2xl p-5">
        <div className="text-xs text-[#10b981]">{sel.service.toUpperCase()}</div>
        <div className="font-bold text-lg mt-1">{sel.origin}</div>
        <div className="text-white/60 text-sm">→ {sel.destination}</div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="bg-white/5 rounded-xl p-3"><div className="text-[11px] text-white/50">Km</div><div className="font-bold">{sel.distance}</div></div>
          <div className="bg-white/5 rounded-xl p-3"><div className="text-[11px] text-white/50">Min</div><div className="font-bold">{sel.duration}</div></div>
          <div className="bg-white/5 rounded-xl p-3"><div className="text-[11px] text-white/50">Total</div><div className="font-bold text-[#10b981]">${sel.fare+sel.tip}</div></div>
        </div>
        <div className="mt-4 bg-white/5 rounded-xl p-3">
          <div className="font-semibold">{sel.driver.name}</div>
          <div className="text-xs text-white/50">{sel.driver.vehicle} · {sel.driver.plate} · {sel.driver.siteNumber}</div>
          <div className="text-xs mt-1"><Star className="h-3 w-3 text-yellow-400 fill-yellow-400 inline" /> {sel.rating}/5</div>
          {sel.driverRatingToUser && <div className="text-xs text-white/50">Te calificó: {sel.driverRatingToUser}/5</div>}
        </div>
        <div className="mt-3 text-sm text-white/60">Pago: {sel.paymentMethod}{sel.tip>0&&` · Propina $${sel.tip}`}</div>
        <button className="mt-4 w-full rounded-xl bg-white/5 py-3 text-sm font-semibold flex items-center justify-center gap-2"><Receipt className="h-4 w-4" /> Descargar factura</button>
      </div>
    </div>
  );
  return (
    <div className="px-5 pt-4">
      <div className="text-lg font-bold mb-1">Historial</div>
      <div className="text-xs text-white/60 mb-4">{trips.length} viajes · ${trips.reduce((s,t) => s+t.fare,0)} total</div>
      <div className="space-y-2">{trips.map(t => (
        <button key={t.id} onClick={() => setSel(t)} className="w-full text-left bg-white/[0.03] hover:bg-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1"><div className="text-sm font-medium truncate">{t.destination}</div><div className="text-[11px] text-white/50">{t.driver.name} · {new Date(t.date).toLocaleDateString("es-MX")}</div></div>
            <div className="text-right ml-3"><div className="font-bold text-[#10b981]">${t.fare}</div><div className="flex gap-0.5 justify-end mt-0.5">{Array.from({length:t.rating}).map((_,i) => <Star key={i} className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" />)}</div></div>
          </div>
        </button>
      ))}</div>
    </div>
  );
}

function ProfileScreen({ profile, trips, onEdit, onPay, onHelp }: { profile: UserProfile; trips: TripRecord[]; onEdit: () => void; onPay: () => void; onHelp: () => void }) {
  return (
    <div className="px-5 pt-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 rounded-full bg-[#10b981]/20 flex items-center justify-center"><User className="h-8 w-8 text-[#10b981]" /></div>
        <div><div className="font-bold text-lg">{profile.name}</div><div className="text-xs text-white/60">{profile.phone||"Sin tel."} · {profile.email||"Sin correo"}</div></div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-white/5 rounded-xl p-3 text-center"><div className="text-[11px] text-white/50">Viajes</div><div className="font-bold text-lg">{trips.length}</div></div>
        <div className="bg-white/5 rounded-xl p-3 text-center"><div className="text-[11px] text-white/50">Gastado</div><div className="font-bold text-lg">${trips.reduce((s,t)=>s+t.fare,0)}</div></div>
        <div className="bg-white/5 rounded-xl p-3 text-center"><div className="text-[11px] text-white/50">Rating</div><div className="font-bold text-lg">4.9⭐</div></div>
      </div>
      <div className="space-y-1">
        {([[Edit3,"Editar perfil",onEdit],[CreditCard,"Métodos de pago",onPay],[Shield,"Seguridad",()=>{}],[HelpCircle,"Soporte",onHelp],[Receipt,"Facturación",()=>{}],[Settings,"Configuración",()=>{}]] as const).map(([I,l,fn],i) => (
          <button key={i} onClick={fn as any} className="w-full flex items-center gap-3 rounded-xl p-3.5 hover:bg-white/5">
            <I className="h-4 w-4 text-white/60" /><span className="flex-1 text-left text-sm">{l}</span><ChevronRight className="h-4 w-4 text-white/30" />
          </button>
        ))}
      </div>
    </div>
  );
}

function EditProfileScreen({ profile, onSave, onBack }: { profile: UserProfile; onSave: (p: UserProfile) => void; onBack: () => void }) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [contacts, setContacts] = useState(profile.emergencyContacts);
  return (
    <div className="px-5 pt-4">
      <button onClick={onBack} className="flex items-center gap-1 text-white/60 text-sm mb-4"><ChevronLeft className="h-4 w-4" /> Perfil</button>
      <div className="text-lg font-bold mb-4">Editar perfil</div>
      <div className="space-y-3">
        <div><label className="text-xs text-white/60">Nombre</label><input value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[#10b981]/50" /></div>
        <div><label className="text-xs text-white/60">Teléfono</label><input value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[#10b981]/50" /></div>
        <div><label className="text-xs text-white/60">Correo</label><input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full mt-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[#10b981]/50" /></div>
      </div>
      <div className="mt-6 flex items-center justify-between mb-2"><div className="text-sm font-semibold">Contactos de emergencia</div><button onClick={() => setContacts([...contacts,{name:"",phone:""}])} className="text-[#10b981] text-xs flex items-center gap-1"><Plus className="h-3 w-3" /> Agregar</button></div>
      {contacts.map((c,i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input value={c.name} onChange={e => { const n=[...contacts]; n[i].name=e.target.value; setContacts(n); }} placeholder="Nombre" className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none" />
          <input value={c.phone} onChange={e => { const n=[...contacts]; n[i].phone=e.target.value; setContacts(n); }} placeholder="Tel" className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none" />
          <button onClick={() => setContacts(contacts.filter((_,j) => j!==i))} className="text-red-400/60"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
      <button onClick={() => onSave({...profile, name, phone, email, emergencyContacts:contacts})} className="mt-6 w-full rounded-xl bg-[#10b981] py-3.5 text-black font-bold">Guardar</button>
    </div>
  );
}

function PaymentsScreen({ payments, onUpdate, onBack }: { payments: PaymentMethod[]; onUpdate: (p: PaymentMethod[]) => void; onBack: () => void }) {
  const [adding, setAdding] = useState(false);
  const [nt, setNt] = useState<"card"|"transfer">("card");
  const [nl, setNl] = useState("");
  const [n4, setN4] = useState("");
  return (
    <div className="px-5 pt-4">
      <button onClick={onBack} className="flex items-center gap-1 text-white/60 text-sm mb-4"><ChevronLeft className="h-4 w-4" /> Inicio</button>
      <div className="text-lg font-bold mb-4">Métodos de pago</div>
      <div className="space-y-2">
        {payments.map(p => (
          <div key={p.id} className={`flex items-center gap-3 rounded-xl p-4 ${p.isDefault?"bg-[#10b981]/10 border border-[#10b981]/30":"bg-white/5"}`}>
            {p.type==="cash"?<Banknote className="h-5 w-5 text-[#10b981]" />:p.type==="card"?<CreditCard className="h-5 w-5 text-[#10b981]" />:<Smartphone className="h-5 w-5 text-[#10b981]" />}
            <div className="flex-1"><div className="text-sm">{p.label}</div>{p.last4 && <div className="text-[11px] text-white/50">•••• {p.last4}</div>}</div>
            <div className="flex items-center gap-2">
              {!p.isDefault && <button onClick={() => onUpdate(payments.map(x => ({...x, isDefault:x.id===p.id})))} className="text-[11px] text-[#10b981]">Usar</button>}
              {p.isDefault && <span className="text-[11px] bg-[#10b981]/20 text-[#10b981] rounded-full px-2 py-0.5">Default</span>}
              {p.id!=="cash" && <button onClick={() => onUpdate(payments.filter(x => x.id!==p.id))} className="text-red-400/60"><Trash2 className="h-3.5 w-3.5" /></button>}
            </div>
          </div>
        ))}
      </div>
      {!adding ? (
        <button onClick={() => setAdding(true)} className="mt-4 w-full rounded-xl border border-dashed border-white/20 py-3 text-sm text-white/60 flex items-center justify-center gap-2"><Plus className="h-4 w-4" /> Agregar</button>
      ) : (
        <div className="mt-4 bg-white/5 rounded-xl p-4 space-y-3">
          <div className="flex gap-2">
            <button onClick={() => setNt("card")} className={`flex-1 rounded-lg py-2 text-xs ${nt==="card"?"bg-[#10b981] text-black font-bold":"bg-white/5"}`}>Tarjeta</button>
            <button onClick={() => setNt("transfer")} className={`flex-1 rounded-lg py-2 text-xs ${nt==="transfer"?"bg-[#10b981] text-black font-bold":"bg-white/5"}`}>Transferencia</button>
          </div>
          <input value={nl} onChange={e => setNl(e.target.value)} placeholder={nt==="card"?"Nombre en tarjeta":"Banco"} className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm focus:outline-none" />
          {nt==="card" && <input value={n4} onChange={e => setN4(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="Últimos 4" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm focus:outline-none" />}
          <div className="flex gap-2">
            <button onClick={() => setAdding(false)} className="flex-1 rounded-lg bg-white/5 py-2.5 text-sm">Cancelar</button>
            <button onClick={() => { if(nl.trim()) { onUpdate([...payments,{id:`pm-${Date.now()}`,type:nt,label:nl.trim(),last4:n4||undefined,isDefault:false}]); setAdding(false); setNl(""); setN4(""); }}} className="flex-1 rounded-lg bg-[#10b981] py-2.5 text-black text-sm font-bold">Agregar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SupportScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="px-5 pt-4">
      <button onClick={onBack} className="flex items-center gap-1 text-white/60 text-sm mb-4"><ChevronLeft className="h-4 w-4" /> Inicio</button>
      <div className="text-lg font-bold mb-4">Soporte y ayuda</div>
      <div className="space-y-3">
        {[
          ["¿Cómo solicito un viaje?","Elige destino, tipo de servicio, ajusta tarifa y presiona Solicitar."],
          ["¿Cómo funciona la negociación?","Ofrece tu tarifa. El conductor puede aceptar o contraoferta."],
          ["¿Qué hago en emergencia?","Presiona SOS. Tu ubicación y datos se envían al C5 en 5 segundos."],
          ["¿Los conductores están verificados?","Sí. 7 filtros: INE, antecedentes, médico, psicométrico, licencia, vehículo, conducción."],
          ["¿Puedo pedir factura?","Sí, en el detalle de cada viaje."],
        ].map(([q,a],i) => (
          <details key={i} className="bg-white/5 rounded-xl">
            <summary className="p-4 text-sm font-medium cursor-pointer list-none flex items-center justify-between">{q}<ChevronRight className="h-4 w-4 text-white/30" /></summary>
            <div className="px-4 pb-4 text-sm text-white/70">{a}</div>
          </details>
        ))}
      </div>
      <div className="mt-6 bg-white/5 rounded-xl p-4 text-center">
        <div className="text-sm font-semibold">¿Más ayuda?</div>
        <button className="mt-3 rounded-xl bg-[#10b981] px-5 py-2.5 text-black text-sm font-bold flex items-center gap-2 mx-auto"><Send className="h-4 w-4" /> WhatsApp</button>
      </div>
    </div>
  );
}
