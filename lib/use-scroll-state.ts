"use client";

import { useSyncExternalStore } from "react";

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

// PERF : cette fonction est appelée depuis la boucle de rendu 3D
// (ScreenProbe, Facade, DustParticles). querySelector + offsetTop à chaque
// frame forcerait un layout synchrone → on met le résultat en cache et on
// ne l'invalide qu'au resize (les hauteurs au-dessus de #cas-client sont
// en min-h-screen, donc ne dépendent que du viewport).
let cachedLength = 0;

if (typeof window !== "undefined") {
  window.addEventListener(
    "resize",
    () => {
      cachedLength = 0;
    },
    { passive: true }
  );
}

/** Longueur de scroll (en px) couverte par la cinématique. */
export function cinematicLength(): number {
  if (cachedLength > 0) return cachedLength;
  const el = document.querySelector<HTMLElement>("#cas-client");
  cachedLength = el
    ? Math.max(1, el.offsetTop - window.innerHeight * 0.5)
    : document.documentElement.scrollHeight - window.innerHeight;
  return cachedLength;
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

// Store partagé : UN listener scroll + UN rAF pour tous les composants
// abonnés (OutlookScene, Caption, ProgressBar), au lieu d'un listener et
// d'un setState chacun — un seul chemin de mise à jour par frame.
let progress = 0;
let raf = 0;
let started = false;
const listeners = new Set<() => void>();

function update() {
  raf = 0;
  const next = Math.min(1, window.scrollY / cinematicLength());
  if (next === progress) return;
  progress = next;
  listeners.forEach((l) => l());
}

function requestUpdate() {
  if (!raf) raf = requestAnimationFrame(update);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!started) {
    started = true;
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
  }
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => progress;
const getServerSnapshot = () => 0;

/** Progression 0 → 1 dans la cinématique + phase nommée. Se met à jour au scroll. */
export function useScrollState() {
  const p = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { progress: p, phase: phaseFor(p) };
}
