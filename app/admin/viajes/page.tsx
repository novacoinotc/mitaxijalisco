import DashboardShell from "@/components/DashboardShell";
import { sql, hasDb } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function AdminTrips() {
  const rows: any[] = hasDb ? await sql`
    select t.*, u.name as user_name, d.name as driver_name, d.plate as driver_plate
    from trips t left join users u on u.id=t.user_id left join drivers d on d.id=t.driver_id
    order by t.created_at desc
  ` : [];
  return (
    <DashboardShell role="admin">
      <h1 className="font-display text-3xl font-bold mb-6">Viajes ({rows.length})</h1>
      <div className="glass rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-white/50 border-b border-white/10">
            <tr><th className="py-3">#</th><th>Usuario</th><th>Conductor</th><th>Ruta</th><th>Km</th><th>Min</th><th>Servicio</th><th className="text-right">Tarifa</th><th className="text-right">Conductor</th></tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-b border-white/5">
                <td className="py-3 text-white/50">#{t.id}</td>
                <td>{t.user_name}</td>
                <td>{t.driver_name}<div className="text-xs text-white/40">{t.driver_plate}</div></td>
                <td className="text-white/70 text-xs">{t.origin}<br/>→ {t.destination}</td>
                <td>{Number(t.distance_km).toFixed(1)}</td>
                <td>{t.duration_min}</td>
                <td><span className="glass rounded-full px-2 py-0.5 text-xs">{t.service}</span></td>
                <td className="text-right font-semibold text-gradient">${Number(t.fare_mxn).toFixed(0)}</td>
                <td className="text-right text-neon-lime">${Number(t.driver_earnings).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
