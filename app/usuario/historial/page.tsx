import DashboardShell from "@/components/DashboardShell";
import { sql, hasDb } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function UsuarioHistorial() {
  const rows: any[] = hasDb ? await sql`
    select t.*, d.name as driver_name, d.plate from trips t
    left join drivers d on d.id=t.driver_id
    where t.user_id=1 order by t.created_at desc
  ` : [];
  return (
    <DashboardShell role="usuario">
      <h1 className="font-display text-3xl font-bold mb-6">Historial de viajes</h1>
      <div className="space-y-3">
        {rows.map((t) => (
          <div key={t.id} className="glass rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-neon-cyan uppercase tracking-wider">{t.service}</div>
              <div className="font-semibold mt-1">{t.origin} → {t.destination}</div>
              <div className="text-xs text-white/50 mt-1">{t.driver_name} · {t.plate} · {Number(t.distance_km).toFixed(1)} km · {t.duration_min} min</div>
            </div>
            <div className="text-right">
              <div className="font-display text-xl font-bold text-gradient">${Number(t.fare_mxn).toFixed(0)}</div>
              <div className="text-xs text-white/50">{new Date(t.created_at).toLocaleString("es-MX")}</div>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
