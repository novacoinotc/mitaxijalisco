import DashboardShell from "@/components/DashboardShell";
import { Stat } from "@/components/Stat";
import { sql, hasDb } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function ConductorGanancias() {
  let total = 0, gross = 0, fee = 0, count = 0;
  if (hasDb) {
    const [r] = await sql`
      select coalesce(sum(driver_earnings),0)::float as net,
             coalesce(sum(fare_mxn),0)::float as gross,
             coalesce(sum(fare_mxn - driver_earnings),0)::float as fee,
             count(*)::int as c
      from trips where driver_id=1
    `;
    total = r.net; gross = r.gross; fee = r.fee; count = r.c;
  }
  const competitorWouldPay = gross * 0.7;
  const saved = total - competitorWouldPay;

  return (
    <DashboardShell role="conductor">
      <h1 className="font-display text-3xl font-bold mb-6">Ganancias</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Recibido (90%)" value={`$${total.toFixed(0)}`} color="lime" />
        <Stat label="Tarifa bruta" value={`$${gross.toFixed(0)}`} color="cyan" />
        <Stat label="Comisión (10%)" value={`$${fee.toFixed(0)}`} color="violet" />
        <Stat label="Viajes" value={count} color="pink" />
      </div>

      <div className="mt-8 glass rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold mb-2">💰 Cuánto ganaste de más vs la competencia</h2>
        <p className="text-white/60 text-sm mb-4">Si estos mismos viajes los hubieras hecho en la competencia, habrías recibido solo el 70% (La competencia cobra 30% de comisión).</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass rounded-xl p-4"><div className="text-xs text-white/60">Aquí recibiste</div><div className="font-display text-2xl font-bold text-neon-lime">${total.toFixed(0)}</div></div>
          <div className="glass rounded-xl p-4"><div className="text-xs text-white/60">En la competencia</div><div className="font-display text-2xl font-bold text-white/50">${competitorWouldPay.toFixed(0)}</div></div>
          <div className="glass rounded-xl p-4 bg-gradient-to-br from-neon-lime/10 to-transparent border-neon-lime/30"><div className="text-xs text-neon-lime">Ganaste extra</div><div className="font-display text-2xl font-bold text-gradient">+${saved.toFixed(0)}</div></div>
        </div>
        <div className="mt-6 text-xs text-white/50">💸 Pago al día siguiente automático a tu cuenta BBVA</div>
      </div>
    </DashboardShell>
  );
}
