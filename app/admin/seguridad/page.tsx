import DashboardShell from "@/components/DashboardShell";
import { sql, hasDb } from "@/lib/db";
import { AlertTriangle, Shield } from "lucide-react";
export const dynamic = "force-dynamic";

export default async function AdminSecurity() {
  const rows: any[] = hasDb ? await sql`
    select s.*, u.name as user_name, d.name as driver_name, t.origin, t.destination
    from security_events s
    left join trips t on t.id=s.trip_id
    left join users u on u.id=t.user_id
    left join drivers d on d.id=t.driver_id
    order by s.created_at desc
  ` : [];

  return (
    <DashboardShell role="admin">
      <h1 className="font-display text-3xl font-bold mb-2">Centro de seguridad</h1>
      <p className="text-white/60 mb-6">Eventos atendidos por el equipo 24/7 y monitoreo C5 Jalisco.</p>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="glass rounded-2xl p-5"><div className="text-xs text-white/60">Alertas hoy</div><div className="font-display text-3xl font-bold text-gradient">{rows.length}</div></div>
        <div className="glass rounded-2xl p-5"><div className="text-xs text-white/60">SOS activos</div><div className="font-display text-3xl font-bold text-neon-pink">0</div></div>
        <div className="glass rounded-2xl p-5"><div className="text-xs text-white/60">Tiempo resp. promedio</div><div className="font-display text-3xl font-bold text-neon-lime">4.2s</div></div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-neon-cyan" /> Eventos recientes</h2>
        <div className="space-y-3">
          {rows.length === 0 && <div className="text-white/50 text-sm">Sin eventos. Todo tranquilo. 🌿</div>}
          {rows.map((e) => (
            <div key={e.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <AlertTriangle className="h-4 w-4 text-neon-pink mt-0.5" />
              <div className="flex-1">
                <div className="text-sm"><b className="uppercase text-xs text-neon-cyan">{e.kind.replace("_", " ")}</b> — {e.details}</div>
                <div className="text-xs text-white/50 mt-0.5">Usuario: {e.user_name} · Conductor: {e.driver_name} · {e.origin} → {e.destination}</div>
              </div>
              <div className="text-xs text-white/40">{new Date(e.created_at).toLocaleString("es-MX")}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
