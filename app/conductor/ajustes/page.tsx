import DashboardShell from "@/components/DashboardShell";
export const dynamic = "force-dynamic";

export default function ConductorAjustes() {
  const sections = [
    { t: "Vehículo", items: ["Nissan Tsuru 2018 blanco", "Placas: JAL-1234", "Póliza de seguro: vigente ✅", "Verificación: aprobada ✅"] },
    { t: "Documentación", items: ["INE: validada con RENAPO ✅", "Antecedentes no penales ✅", "Examen psicométrico ✅", "Licencia vigente ✅"] },
    { t: "Preferencias", items: ["Aceptar viajes con mascota", "Acepta efectivo", "Acepta paquetería (Mi Taxi Envíos)", "Zona preferida: Zapopan / Providencia"] },
    { t: "Cuenta bancaria", items: ["BBVA •••• 4821", "Pago automático diario ✅"] },
  ];
  return (
    <DashboardShell role="conductor">
      <h1 className="font-display text-3xl font-bold mb-6">Ajustes de conductor</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((s) => (
          <div key={s.t} className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold text-lg mb-3">{s.t}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              {s.items.map((i) => <li key={i} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon-lime" /> {i}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
