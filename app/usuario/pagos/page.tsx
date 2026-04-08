import DashboardShell from "@/components/DashboardShell";
import { sql, hasDb } from "@/lib/db";
import { CreditCard, Banknote, Smartphone, Plus } from "lucide-react";
export const dynamic = "force-dynamic";

const iconFor = (kind: string) => {
  if (kind === "card") return CreditCard;
  if (kind === "cash") return Banknote;
  return Smartphone;
};

export default async function UsuarioPagos() {
  const rows: any[] = hasDb ? await sql`select * from payment_methods where user_id=1 order by is_default desc` : [];
  return (
    <DashboardShell role="usuario">
      <h1 className="font-display text-3xl font-bold mb-6">Métodos de pago</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {rows.map((p) => {
          const Icon = iconFor(p.kind);
          return (
            <div key={p.id} className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 border border-white/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-neon-cyan" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{p.label}</div>
                <div className="text-xs text-white/50">{p.last4 ? `•••• ${p.last4}` : p.kind.toUpperCase()}</div>
              </div>
              {p.is_default && <span className="text-[10px] uppercase tracking-wider bg-neon-lime/15 text-neon-lime rounded-full px-2 py-0.5">Default</span>}
            </div>
          );
        })}
        <button className="glass rounded-2xl p-5 border-dashed border-white/20 flex items-center justify-center gap-2 text-white/60 hover:text-white hover:bg-white/5">
          <Plus className="h-4 w-4" /> Agregar método
        </button>
      </div>
    </DashboardShell>
  );
}
