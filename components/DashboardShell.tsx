"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, User, Shield, CreditCard, History, Settings, LayoutDashboard } from "lucide-react";

type Role = "admin" | "conductor" | "usuario";

const menus: Record<Role, { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[]> = {
  admin: [
    { href: "/admin", label: "Panel", icon: LayoutDashboard },
    { href: "/admin/usuarios", label: "Usuarios", icon: User },
    { href: "/admin/conductores", label: "Conductores", icon: Car },
    { href: "/admin/viajes", label: "Viajes", icon: History },
    { href: "/admin/seguridad", label: "Seguridad", icon: Shield },
  ],
  conductor: [
    { href: "/conductor", label: "Panel", icon: LayoutDashboard },
    { href: "/conductor/historial", label: "Historial", icon: History },
    { href: "/conductor/ganancias", label: "Ganancias", icon: CreditCard },
    { href: "/conductor/ajustes", label: "Ajustes", icon: Settings },
  ],
  usuario: [
    { href: "/usuario", label: "Panel", icon: LayoutDashboard },
    { href: "/usuario/historial", label: "Historial", icon: History },
    { href: "/usuario/pagos", label: "Métodos de pago", icon: CreditCard },
    { href: "/usuario/ajustes", label: "Ajustes", icon: Settings },
  ],
};

export default function DashboardShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const p = usePathname();
  const items = menus[role];
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-violet" />
            <span className="font-display font-bold">Mi Taxi <span className="text-gradient">Jalisco</span></span>
            <span className="ml-2 text-[10px] uppercase tracking-wider glass rounded-full px-2 py-0.5 text-white/80">{role}</span>
          </Link>
          <Link href="/" className="text-xs text-white/80 hover:text-white flex items-center gap-1"><Home className="h-3 w-3" /> Volver al inicio</Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = p === href;
            return (
              <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${active ? "bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/30 text-white" : "text-white/80 hover:bg-white/5 hover:text-white"}`}>
                <Icon className="h-4 w-4" /> {label}
              </Link>
            );
          })}
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
