import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi Taxi Jalisco — La app mexicana que impulsa a los jaliscienses",
  description:
    "Plataforma jalisciense de movilidad. 90% para el conductor, seguridad de nivel bancario, precios justos. Demo en vivo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
