import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Compare from "@/components/Compare";
import Security from "@/components/Security";
import Services from "@/components/Services";
import Demo from "@/components/Demo";
import Register from "@/components/Register";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Features />
      <Compare />
      <Security />
      <Services />
      <Demo />
      <Register />
      <Footer />
    </main>
  );
}
