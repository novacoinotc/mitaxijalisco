import DashboardShell from "@/components/DashboardShell";
import { Stat } from "@/components/Stat";
import { sql, hasDb } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function ConductorHome() {
  let trips: any[] = [];
  let earnings = 0;
  let driver: any = { name: "Don Roberto Mendoza", rating: 4.97, score_safety: 98, vehicle: "Nissan Tsuru 2018", plate: "JAL-1234" };
  if (hasDb) {
    trips = await sql`select * from trips where driver_id=1 order by created_at desc limit 5`;
    const [r] = await sql`select coalesce(sum(driver_earnings),0)::float as total from trips where driver_id=1`;
    earnings = r.total;
    const [d] = await sql`select * from drivers where id=1`;
    driver = d;
  }
  return (
    <DashboardShell role="conductor">
      <div className="mb-6">
        <div className="text-xs text-white/60">Bienvenido,</div>
        <h1 className="font-display text-3xl font-bold">{driver.name} 🚕</h1>
        <div className="text-xs text-white/50 mt-1">{driver.vehicle} · {driver.plate}</div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Ganancias totales" value={`$${earnings.toFixed(0)}`} color="lime" />
        <Stat label="Viajes" value={trips.length} color="cyan" />
        <Stat label="Rating" value={`⭐ ${Number(driver.rating).toFixed(2)}`} color="violet" />
        <Stat label="Score seguridad" value={driver.score_safety} hint="Excelente" color="pink" />
      </div>

      <div className="mt-8 glass rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold mb-4">Viajes recientes</h2>
        <div className="space-y-3">
          {trips.map((t: any) => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div>
                <div className="text-sm font-semibold">{t.origin} → {t.destination}</div>
                <div className="text-xs text-white/50">{t.service} · {Number(t.distance_km).toFixed(1)} km</div>
              </div>
              <div className="text-right">
                <div className="font-display text-lg font-bold text-neon-lime">+${Number(t.driver_earnings).toFixed(0)}</div>
                <div className="text-xs text-white/50">90% de ${Number(t.fare_mxn).toFixed(0)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
