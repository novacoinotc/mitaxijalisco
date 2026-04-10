import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Compare from "@/components/Compare";
import Security from "@/components/Security";
import Services from "@/components/Services";
import Demo from "@/components/Demo";
import Register from "@/components/Register";
import Footer from "@/components/Footer";
import { FloatingOrbs, AnimatedGrid, GlowDivider } from "@/components/VisualEffects";

export default function Home() {
  return (
    <main className="relative">
      <FloatingOrbs />
      <AnimatedGrid />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <GlowDivider />
        <Features />
        <GlowDivider />
        <Compare />
        <GlowDivider />
        <Security />
        <GlowDivider />
        <Services />
        <GlowDivider />
        <Demo />
        <GlowDivider />
        <Register />
        <Footer />
      </div>
    </main>
  );
}
