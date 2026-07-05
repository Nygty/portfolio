"use client";

import { useScrollState } from "@/lib/use-scroll-state";
import { usePrefersReducedMotion } from "@/lib/use-media";

// Barre de progression du "film" : fine ligne en bas de l'écran,
// dégradé bleu → or, liée à la progression de la cinématique.
// S'efface une fois la cinématique terminée.
export default function ProgressBar() {
  const { progress } = useScrollState();
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-0 left-0 z-40 h-[3px] w-full bg-white/5 transition-opacity duration-700"
      style={{ opacity: progress >= 1 ? 0 : 1 }}
    >
      <div
        className="h-full bg-gradient-to-r from-accent to-[#d4a574]"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
