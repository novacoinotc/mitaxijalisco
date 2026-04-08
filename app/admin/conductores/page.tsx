import DashboardShell from "@/components/DashboardShell";
import { sql, hasDb } from "@/lib/db";
import { Star, CheckCircle2, Circle } from "lucide-react";
export const dynamic = "force-dynamic";

export default async function AdminDrivers() {
  const rows: any[] = hasDb ? (await sql`select * from drivers order by rating desc` as any) : [];
  return (
    <DashboardShell role="admin">
      <h1 className="font-display text-3xl font-bold mb-6">Conductores ({rows.length})</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {rows.map((d: any) => (
          <div key={d.id} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-lg">{d.name}</h3>
                  {d.verified && <CheckCircle2 className="h-4 w-4 text-neon-lime" />}
                </div>
                <div className="text-xs text-white/60">{d.vehicle} · {d.plate}</div>
                <div className="text-xs text-white/50 mt-1">{d.email} · {d.phone}</div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm"><Star className="h-3 w-3 text-yellow-400 fill-yellow-400" /> {Number(d.rating).toFixed(2)}</div>
                <div className="text-xs text-white/50">Score: <span className="text-neon-cyan font-semibold">{d.score_safety}</span></div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="glass rounded-full px-2 py-0.5 capitalize">{d.kind.replace("_", " ")}</span>
              <span className={`rounded-full px-2 py-0.5 flex items-center gap-1 ${d.online ? "bg-neon-lime/15 text-neon-lime" : "bg-white/5 text-white/50"}`}>
                <Circle className="h-2 w-2 fill-current" /> {d.online ? "En línea" : "Offline"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
