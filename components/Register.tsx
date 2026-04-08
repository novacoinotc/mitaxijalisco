"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, Car, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [tab, setTab] = useState<"user" | "driver">("user");
  const [sent, setSent] = useState(false);

  return (
    <section id="registro" className="relative py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-xs uppercase tracking-[0.25em] text-neon-lime mb-3">Regístrate gratis</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Sé parte del <span className="text-gradient">cambio</span>.
          </h2>
          <p className="mt-4 text-white/70 text-lg max-w-2xl">
            Únete a la lista de lanzamiento. Los primeros 1,000 conductores no pagan comisión durante 3 meses.
          </p>
        </motion.div>

        <div className="mt-10 glass rounded-3xl p-6 md:p-10">
          <div className="flex gap-2 glass rounded-full p-1 w-fit mb-8">
            <button onClick={() => setTab("user")} className={`px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${tab === "user" ? "bg-gradient-to-r from-neon-cyan to-neon-violet text-black" : "text-white/70"}`}>
              <User className="h-4 w-4" /> Soy pasajero
            </button>
            <button onClick={() => setTab("driver")} className={`px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${tab === "driver" ? "bg-gradient-to-r from-neon-lime to-neon-cyan text-black" : "text-white/70"}`}>
              <Car className="h-4 w-4" /> Soy conductor
            </button>
          </div>

          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
              <CheckCircle2 className="h-16 w-16 text-neon-lime mx-auto" />
              <div className="mt-4 font-display text-2xl font-bold">¡Estás dentro!</div>
              <div className="mt-2 text-white/60">Te avisaremos en cuanto lancemos en tu zona.</div>
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Field label="Nombre completo" placeholder="Juan Pérez" />
              <Field label="WhatsApp" placeholder="33 1234 5678" />
              <Field label="Correo" placeholder="juan@ejemplo.com" type="email" />
              <Field label="Ciudad" placeholder="Guadalajara" />
              {tab === "driver" && (
                <>
                  <Field label="Marca y modelo del vehículo" placeholder="Nissan Tsuru 2018" />
                  <Field label="Placas" placeholder="JAL-1234" />
                  <div className="md:col-span-2">
                    <label className="text-xs text-white/60 mb-1 block">Tipo de conductor</label>
                    <div className="flex flex-wrap gap-2">
                      {["Taxi formal", "Taxi informal", "Auto particular", "Moto"].map((t) => (
                        <label key={t} className="glass rounded-full px-4 py-2 text-sm cursor-pointer hover:bg-white/10">
                          <input type="radio" name="tipo" className="mr-2 accent-neon-cyan" /> {t}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <div className="md:col-span-2 flex items-center justify-between mt-2">
                <label className="text-xs text-white/60 flex items-center gap-2">
                  <input type="checkbox" required className="accent-neon-cyan" /> Acepto términos y aviso de privacidad
                </label>
                <button type="submit" className="rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-violet px-7 py-3.5 text-black font-bold hover:opacity-90 glow">
                  {tab === "user" ? "Unirme a la lista" : "Registrarme como conductor"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="text-xs text-white/60 mb-1 block">{label}</label>
      <input
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder-white/30 focus:outline-none focus:border-neon-cyan/60"
      />
    </div>
  );
}
