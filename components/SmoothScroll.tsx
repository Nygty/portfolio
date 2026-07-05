"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildScrollTimeline } from "@/lib/scroll-timeline";

gsap.registerPlugin(ScrollTrigger);

// Enveloppe le site : active le smooth scroll Lenis, le synchronise avec
// GSAP ScrollTrigger, et démarre la timeline maître qui pilote la 3D.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1 });

    // Lenis pilote le scroll → on tient ScrollTrigger informé,
    // et c'est le ticker GSAP qui fait avancer Lenis (une seule boucle).
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Les liens d'ancre (#agent, #contact…) passent par Lenis pour rester fluides
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      e.preventDefault();
      lenis.scrollTo(href);
    };
    document.addEventListener("click", onClick);

    const timeline = buildScrollTimeline();

    return () => {
      document.removeEventListener("click", onClick);
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
