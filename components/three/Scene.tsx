"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import Environment from "./Environment";
import Hotel from "./Hotel";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/use-media";

// Étape 1 (V3B) : caméra en légère contre-plongée devant la façade,
// balancement orbital très lent. Le trajet caméra piloté par le scroll
// (entrée dans le hall, zoom écran…) arrive à l'étape 2.
function OrbitRig({ frozen }: { frozen: boolean }) {
  useFrame(({ camera, clock }) => {
    const t = frozen ? 0 : clock.getElapsedTime();
    const angle = Math.sin(t * 0.08) * 0.4;
    camera.position.set(Math.sin(angle) * 10.5, -1.3, Math.cos(angle) * 10.5);
    camera.lookAt(0, -0.1, 0);
  });
  return null;
}

// Scène 3D unique, fixée derrière tout le contenu du site.
// aria-hidden : purement décorative, invisible pour les lecteurs d'écran.
export default function Scene() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      <Canvas
        camera={{ position: [0, -1.3, 10.5], fov: 45 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <OrbitRig frozen={reducedMotion} />
        <Environment showGrid={!isMobile} />
        <Hotel />
      </Canvas>
    </div>
  );
}
