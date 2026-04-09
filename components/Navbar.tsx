"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="glass rounded-2xl px-5 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-violet glow" />
            <span className="font-display font-bold tracking-tight text-lg">
              Mi Taxi <span className="text-gradient">Jalisco</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#features" className="hover:text-white">Funciones</a>
            <a href="#comparativa" className="hover:text-white">vs la competencia</a>
            <a href="#seguridad" className="hover:text-white">Seguridad</a>
            <a href="#servicios" className="hover:text-white">Servicios</a>
            <a href="#demo" className="hover:text-white">Demo</a>
            <a href="#registro" className="hover:text-white">Registro</a>
            <Link href="/app" className="text-neon-cyan hover:text-white font-semibold">🎮 Probar app</Link>
            <Link href="/usuario" className="hover:text-white">Usuario</Link>
            <Link href="/conductor" className="hover:text-white">Conductor</Link>
            <Link href="/admin" className="hover:text-white">Admin</Link>
          </nav>
          <Link
            href="#registro"
            className="rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
          >
            Unirme
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
