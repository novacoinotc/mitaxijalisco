import DashboardShell from "@/components/DashboardShell";
export const dynamic = "force-dynamic";

export default function UsuarioAjustes() {
  const sections = [
    { t: "Perfil", items: ["Nombre: Sofía Ramírez", "Correo: sofia@demo.mx", "Teléfono: 33 1234 5678"] },
    { t: "Seguridad", items: ["Palabra clave de emergencia: configurada ✅", "Contactos de confianza: 3 agregados", "Compartir viaje automático con mamá: activado"] },
    { t: "Notificaciones", items: ["Viaje iniciado", "Conductor en camino", "Promociones (opcional)"] },
    { t: "Idioma", items: ["Español (México)"] },
  ];
  return (
    <DashboardShell role="usuario">
      <h1 className="font-display text-3xl font-bold mb-6">Ajustes</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((s) => (
          <div key={s.t} className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold text-lg mb-3">{s.t}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              {s.items.map((i) => <li key={i} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon-cyan" /> {i}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
