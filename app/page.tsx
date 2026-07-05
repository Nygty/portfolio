import SceneLoader from "@/components/three/SceneLoader";
import Hero from "@/components/sections/Hero";
import Agent from "@/components/sections/Agent";
import HowItWorks from "@/components/sections/HowItWorks";
import CaseStudy from "@/components/sections/CaseStudy";
import About from "@/components/sections/About";
import Pricing from "@/components/sections/Pricing";

export default function Home() {
  return (
    <main className="relative">
      <SceneLoader />
      <Hero />
      <Agent />
      <HowItWorks />
      <CaseStudy />
      <About />
      <Pricing />
    </main>
  );
}
