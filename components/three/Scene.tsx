"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import Environment from "./Environment";
import Signature from "./Signature";
import { sceneState } from "@/lib/scroll-timeline";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/use-media";

// Dolly de caméra piloté par le scroll (léger lissage pour la douceur)
function CameraRig() {
  useFrame(({ camera }) => {
    camera.position.z += (sceneState.cameraZ - camera.position.z) * 0.06;
  });
  return null;
}

// Scène 3D unique, fixée derrière tout le contenu du site.
// - Mobile (< 768px) : version allégée — moins de particules, pas de grille,
//   résolution plafonnée, pas de chorégraphie scroll.
// - prefers-reduced-motion : une seule frame est rendue (image fixe).
// aria-hidden : purement décorative, invisible pour les lecteurs d'écran.
export default function Scene() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {!isMobile && !reducedMotion && <CameraRig />}
        <Environment showGrid={!isMobile} />
        <Signature simple={isMobile} frozen={reducedMotion} />
      </Canvas>
    </div>
  );
}
