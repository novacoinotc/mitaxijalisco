"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, Car, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [tab, setTab] = useState<"user" | "driver">("user");
  const [sent, setSent] = useState(false);

  return (
    <section id="registro" className="relative py-20">
      <div className="mx-auto max-w-lg px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Únete a <span className="text-gradient">Mi Taxi Jalisco</span>.
          </h2>
          <p className="mt-3 text-white/60">Los primeros 1,000 conductores: 0% comisión por 3 meses.</p>
        </motion.div>

        <div className="mt-6 glass rounded-2xl p-6">
          <div className="flex gap-2 glass rounded-full p-1 mb-6">
            <button onClick={() => setTab("user")} className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center gap-2 ${tab === "user" ? "bg-neon-cyan text-black" : "text-white/60"}`}>
              <User className="h-4 w-4" /> Pasajero
            </button>
            <button onClick={() => setTab("driver")} className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center gap-2 ${tab === "driver" ? "bg-neon-cyan text-black" : "text-white/60"}`}>
              <Car className="h-4 w-4" /> Conductor
            </button>
          </div>

          {sent ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-14 w-14 text-neon-lime mx-auto" />
              <div className="mt-3 font-display text-xl font-bold">¡Estás dentro!</div>
              <div className="mt-1 text-white/60 text-sm">Te avisaremos en cuanto lancemos.</div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-3">
              <input required placeholder="Nombre completo" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:border-neon-cyan/60" />
              <input required placeholder="WhatsApp" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:border-neon-cyan/60" />
              <input required type="email" placeholder="Correo" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:border-neon-cyan/60" />
              {tab === "driver" && (
                <input required placeholder="Vehículo y placas" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:border-neon-cyan/60" />
              )}
              <button type="submit" className="w-full rounded-xl bg-neon-cyan py-3 text-black font-bold text-sm hover:opacity-90">
                {tab === "user" ? "Unirme a la lista" : "Registrarme como conductor"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
