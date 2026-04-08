import DashboardShell from "@/components/DashboardShell";
import { sql, hasDb } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function ConductorHistorial() {
  const rows: any[] = hasDb ? await sql`
    select t.*, u.name as user_name from trips t
    left join users u on u.id=t.user_id
    where t.driver_id=1 order by t.created_at desc
  ` : [];
  return (
    <DashboardShell role="conductor">
      <h1 className="font-display text-3xl font-bold mb-6">Historial de viajes</h1>
      <div className="space-y-3">
        {rows.map((t) => (
          <div key={t.id} className="glass rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-neon-lime uppercase tracking-wider">{t.service}</div>
              <div className="font-semibold mt-1">{t.origin} → {t.destination}</div>
              <div className="text-xs text-white/50 mt-1">Pasajero: {t.user_name} · {Number(t.distance_km).toFixed(1)} km · {t.duration_min} min</div>
            </div>
            <div className="text-right">
              <div className="font-display text-xl font-bold text-neon-lime">+${Number(t.driver_earnings).toFixed(0)}</div>
              <div className="text-xs text-white/50">Tarifa: ${Number(t.fare_mxn).toFixed(0)}</div>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
