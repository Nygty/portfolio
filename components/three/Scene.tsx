"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Environment from "./Environment";
import Hotel from "./Hotel";
import { sceneState } from "@/lib/scroll-timeline";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/use-media";

// Caméra sur rails : suit sceneState (piloté par GSAP au scroll) avec un
// lissage doux, plus un balancement orbital résiduel autour du point regardé
// (amplitude sceneState.sway : pleine devant la façade, nulle à l'intérieur).
function CameraRig({ frozen }: { frozen: boolean }) {
  const look = useRef(
    new THREE.Vector3(sceneState.lookX, sceneState.lookY, sceneState.lookZ)
  );

  useFrame(({ camera, clock }) => {
    const s = sceneState;
    const t = frozen ? 0 : clock.getElapsedTime();
    const angle = Math.sin(t * 0.08) * 0.4 * s.sway;

    // balancement : la position pivote autour du point regardé
    const dx = s.camX - s.lookX;
    const dz = s.camZ - s.lookZ;
    const targetX = s.lookX + dx * Math.cos(angle) - dz * Math.sin(angle);
    const targetZ = s.lookZ + dx * Math.sin(angle) + dz * Math.cos(angle);

    const k = frozen ? 1 : 0.08;
    camera.position.x += (targetX - camera.position.x) * k;
    camera.position.y += (s.camY - camera.position.y) * k;
    camera.position.z += (targetZ - camera.position.z) * k;

    look.current.x += (s.lookX - look.current.x) * k;
    look.current.y += (s.lookY - look.current.y) * k;
    look.current.z += (s.lookZ - look.current.z) * k;
    camera.lookAt(look.current);

    const persp = camera as THREE.PerspectiveCamera;
    if (Math.abs(persp.fov - s.fov) > 0.01) {
      persp.fov += (s.fov - persp.fov) * k;
      persp.updateProjectionMatrix();
    }
  });
  return null;
}

// Scène 3D unique, fixée derrière tout le contenu du site.
// Mobile : la timeline scroll n'est pas construite (SmoothScroll) →
// sceneState garde ses valeurs par défaut = vue façade avec balancement.
// aria-hidden : purement décorative, invisible pour les lecteurs d'écran.
export default function Scene() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  return (
    // Mobile : façade légèrement floutée et atténuée — fond d'ambiance,
    // le contenu HTML reste la vedette
    <div
      className={`fixed inset-0 -z-10 ${
        isMobile ? "opacity-75 blur-[2px]" : ""
      }`}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, -1.3, 10.5], fov: 45 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <CameraRig frozen={reducedMotion} />
        <Environment showGrid={!isMobile} />
        <Hotel />
        {/* Bloom : le glow des zones émissives — desktop uniquement */}
        {!isMobile && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.55}
              luminanceThreshold={0.24}
              luminanceSmoothing={0.7}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
