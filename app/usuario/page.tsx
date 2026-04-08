import DashboardShell from "@/components/DashboardShell";
import { Stat } from "@/components/Stat";
import { sql, hasDb } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function UsuarioHome() {
  let trips: any[] = [];
  let totalSpent = 0;
  if (hasDb) {
    trips = await sql`
      select t.*, d.name as driver_name, d.plate from trips t
      left join drivers d on d.id=t.driver_id
      where t.user_id = 1 order by t.created_at desc limit 5
    `;
    const [r] = await sql`select coalesce(sum(fare_mxn),0)::float as total from trips where user_id=1`;
    totalSpent = r.total;
  }
  return (
    <DashboardShell role="usuario">
      <div className="mb-6">
        <div className="text-xs text-white/60">Hola,</div>
        <h1 className="font-display text-3xl font-bold">Sofía Ramírez 👋</h1>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Viajes totales" value={trips.length} color="cyan" />
        <Stat label="Gastado" value={`$${totalSpent.toFixed(0)}`} color="violet" />
        <Stat label="Ahorrado vs Uber" value={`$${(totalSpent * 0.23).toFixed(0)}`} color="lime" />
        <Stat label="CO₂ evitado" value="12 kg" color="pink" />
      </div>

      <div className="mt-8 glass rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold mb-4">Viajes recientes</h2>
        <div className="space-y-3">
          {trips.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div>
                <div className="text-sm font-semibold">{t.origin} → {t.destination}</div>
                <div className="text-xs text-white/50">{t.driver_name} · {t.plate} · {t.service}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-lg font-bold text-gradient">${Number(t.fare_mxn).toFixed(0)}</div>
                <div className="text-xs text-white/50">{new Date(t.created_at).toLocaleDateString("es-MX")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
