import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Compare from "@/components/Compare";
import Security from "@/components/Security";
import Services from "@/components/Services";
import Demo from "@/components/Demo";
import Register from "@/components/Register";
import Footer from "@/components/Footer";
import { GlowDivider, CityIllustration, PatternBg, PhoneIllustration, CarIllustration } from "@/components/VisualEffects";

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <GlowDivider />
      <Features />
      <GlowDivider />
      <Compare />
      <div className="relative">
        <PatternBg />
        <Security />
      </div>
      <CityIllustration />
      <Services />
      <GlowDivider />
      <Demo />
      <GlowDivider />
      <Register />
      <Footer />
    </main>
  );
}
