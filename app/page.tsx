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
      <div className="relative">
        <PatternBg />
        <Compare />
      </div>

      <GlowDivider />
      <Security />

      <CityIllustration />

      <div className="relative">
        <PatternBg variant="lines" />
        <Services />
      </div>

      <GlowDivider />
      <div className="relative">
        <Demo />
        <div className="hidden lg:flex justify-center mt-6 opacity-60">
          <PhoneIllustration className="w-24" />
        </div>
      </div>

      <GlowDivider />
      <Register />

      <div className="flex justify-center py-8 opacity-40">
        <CarIllustration className="w-32" />
      </div>

      <Footer />
    </main>
  );
}
