export function Stat({ label, value, hint, color = "cyan" }: { label: string; value: React.ReactNode; hint?: string; color?: "cyan" | "lime" | "pink" | "violet" }) {
  const colors: Record<string, string> = {
    cyan: "from-neon-cyan/20 to-transparent border-neon-cyan/30",
    lime: "from-neon-lime/20 to-transparent border-neon-lime/30",
    pink: "from-neon-pink/20 to-transparent border-neon-pink/30",
    violet: "from-neon-violet/20 to-transparent border-neon-violet/30",
  };
  return (
    <div className={`glass rounded-2xl p-5 bg-gradient-to-br ${colors[color]}`}>
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 font-display text-3xl font-bold text-gradient">{value}</div>
      {hint && <div className="text-xs text-white/50 mt-0.5">{hint}</div>}
    </div>
  );
}
