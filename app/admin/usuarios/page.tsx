import DashboardShell from "@/components/DashboardShell";
import { sql, hasDb } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function AdminUsers() {
  const rows: any[] = hasDb ? (await sql`select * from users order by created_at desc` as any) : [];
  return (
    <DashboardShell role="admin">
      <h1 className="font-display text-3xl font-bold mb-6">Usuarios ({rows.length})</h1>
      <div className="glass rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-white/50 border-b border-white/10">
            <tr><th className="py-3">#</th><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Ciudad</th></tr>
          </thead>
          <tbody>
            {rows.map((u: any) => (
              <tr key={u.id} className="border-b border-white/5">
                <td className="py-3 text-white/50">#{u.id}</td>
                <td>{u.name}</td>
                <td className="text-white/70">{u.email}</td>
                <td className="text-white/70">{u.phone}</td>
                <td>{u.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
