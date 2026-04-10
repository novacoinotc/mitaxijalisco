export default function Footer() {
  return (
    <footer className="relative py-14 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-violet" />
            <span className="font-display font-bold">Mi Taxi <span className="text-gradient">Jalisco</span></span>
          </div>
          <p className="mt-2 text-sm text-white/70 max-w-md">
            Hecho con 🤍 en Guadalajara. Una alternativa mexicana hecha por y para jaliscienses, con comisiones justas y seguridad real.
          </p>
        </div>
        <div className="text-xs text-white/60">© {new Date().getFullYear()} Mi Taxi Jalisco · Prototipo demo</div>
      </div>
    </footer>
  );
}
