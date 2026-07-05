"use client";

import { useSyncExternalStore } from "react";

// Écoute une media query et se met à jour si elle change
// (redimensionnement, changement du réglage système).
// Côté serveur : false — le rendu riche n'arrive qu'au montage client.
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** Écran < 768px : scène 3D simplifiée, pas de chorégraphie scroll. */
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");

/** Réglage système "réduire les animations" : tout doit devenir statique. */
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
