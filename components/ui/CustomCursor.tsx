"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/use-media";

// Curseur custom : point lumineux bleu qui suit la souris + halo traînant.
// Uniquement pour les souris de précision (jamais sur tactile),
// désactivé si l'utilisateur préfère réduire les animations.
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = usePrefersReducedMotion();
  const active = finePointer && !reducedMotion;

  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add("custom-cursor");

    const pos = { x: -100, y: -100 };
    const haloPos = { x: -100, y: -100 };

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.x - 6}px, ${pos.y - 6}px)`;
      }
    };

    let raf = 0;
    const tick = () => {
      haloPos.x += (pos.x - haloPos.x) * 0.16;
      haloPos.y += (pos.y - haloPos.y) * 0.16;
      if (halo.current) {
        halo.current.style.transform = `translate(${haloPos.x - 16}px, ${haloPos.y - 16}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div
        ref={halo}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] h-8 w-8 rounded-full bg-accent/20 blur-[6px]"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[91] h-3 w-3 rounded-full bg-accent shadow-[0_0_10px_rgba(74,158,255,0.9)]"
      />
    </>
  );
}
