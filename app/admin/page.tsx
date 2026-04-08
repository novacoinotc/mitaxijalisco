import DashboardShell from "@/components/DashboardShell";
import { Stat } from "@/components/Stat";
import { sql, hasDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  let s = { users: 0, drivers: 0, trips: 0, revenue: 0, online: 0, platform: 0 };
  let recent: any[] = [];
  if (hasDb) {
    const [u] = await sql`select count(*)::int as n from users`;
    const [d] = await sql`select count(*)::int as n from drivers`;
    const [t] = await sql`select count(*)::int as n from trips`;
    const [r] = await sql`select coalesce(sum(fare_mxn),0)::float as total, coalesce(sum(fare_mxn - driver_earnings),0)::float as plat from trips`;
    const [o] = await sql`select count(*)::int as n from drivers where online = true`;
    s = { users: u.n, drivers: d.n, trips: t.n, revenue: r.total, online: o.n, platform: r.plat };
    recent = await sql`
      select t.id, t.origin, t.destination, t.fare_mxn, t.service, u.name as user_name, d.name as driver_name
      from trips t left join users u on u.id=t.user_id left join drivers d on d.id=t.driver_id
      order by t.created_at desc limit 10
    `;
  }

  return (
    <DashboardShell role="admin">
      <h1 className="font-display text-3xl font-bold mb-6">Panel general</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Usuarios" value={s.users} color="cyan" />
        <Stat label="Conductores" value={s.drivers} hint={`${s.online} en línea`} color="lime" />
        <Stat label="Viajes" value={s.trips} color="violet" />
        <Stat label="Ingresos" value={`$${s.revenue.toFixed(0)}`} hint={`Plataforma: $${s.platform.toFixed(0)}`} color="pink" />
      </div>

      <div className="mt-8 glass rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold mb-4">Últimos viajes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-white/50 border-b border-white/10">
              <tr><th className="py-3">#</th><th>Usuario</th><th>Conductor</th><th>Ruta</th><th>Servicio</th><th className="text-right">Tarifa</th></tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr key={t.id} className="border-b border-white/5">
                  <td className="py-3 text-white/50">#{t.id}</td>
                  <td>{t.user_name}</td>
                  <td>{t.driver_name}</td>
                  <td className="text-white/70">{t.origin} → {t.destination}</td>
                  <td><span className="glass rounded-full px-2 py-0.5 text-xs">{t.service}</span></td>
                  <td className="text-right font-semibold text-gradient">${Number(t.fare_mxn).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
