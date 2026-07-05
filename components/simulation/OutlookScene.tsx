"use client";

import { useScrollState } from "@/lib/use-scroll-state";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/use-media";

// La couche "dans l'écran" : prend le relais du canvas 3D quand la caméra
// a fini de zoomer sur l'ordinateur (fondu entrant ~38-45%), reste pendant
// toute la simulation, puis s'efface au dézoom (90-97%).
// pointer-events-none : rien n'est cliquable, tout est piloté par le scroll.
// Desktop uniquement — les fallbacks mobile/reduced-motion arrivent à l'étape 8.

function overlayOpacity(progress: number): number {
  if (progress < 0.38 || progress > 0.97) return 0;
  if (progress < 0.45) return (progress - 0.38) / 0.07; // fondu entrant
  if (progress > 0.9) return 1 - (progress - 0.9) / 0.07; // fondu sortant
  return 1;
}

export default function OutlookScene() {
  const { progress } = useScrollState();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  if (isMobile || reducedMotion) return null;

  const opacity = overlayOpacity(progress);
  if (opacity <= 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10"
      style={{ opacity }}
      aria-hidden
    >
      {/* L'écran de l'ordinateur, vu de l'intérieur */}
      <div className="absolute inset-0 bg-[#07090d]" />
      {/* La simulation (login → inbox → IA → envoi) arrive à l'étape 4 */}
    </div>
  );
}
