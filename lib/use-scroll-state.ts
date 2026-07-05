"use client";

import { useEffect, useState } from "react";

// La cinématique (façade → hall → écran → simulation → dézoom) se joue
// sur les 3 premières sections. Elle se termine quand la section
// "Cas client" arrive : les sections 4-5-6 restent pleinement lisibles.

export type ScrollPhase =
  | "facade"
  | "lobby"
  | "zoomIn"
  | "outlook"
  | "ai"
  | "send"
  | "zoomOut"
  | "done";

/** Longueur de scroll (en px) couverte par la cinématique. */
export function cinematicLength(): number {
  const el = document.querySelector<HTMLElement>("#cas-client");
  if (!el) {
    return document.documentElement.scrollHeight - window.innerHeight;
  }
  return Math.max(1, el.offsetTop - window.innerHeight * 0.5);
}

/** Phases de la mission V3B, en % de la cinématique. */
export function phaseFor(progress: number): ScrollPhase {
  if (progress < 0.15) return "facade";
  if (progress < 0.3) return "lobby";
  if (progress < 0.45) return "zoomIn";
  if (progress < 0.65) return "outlook";
  if (progress < 0.8) return "ai";
  if (progress < 0.9) return "send";
  if (progress < 1) return "zoomOut";
  return "done";
}

/** Progression 0 → 1 dans la cinématique + phase nommée. Se met à jour au scroll. */
export function useScrollState() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setProgress(Math.min(1, window.scrollY / cinematicLength()));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return { progress, phase: phaseFor(progress) };
}
