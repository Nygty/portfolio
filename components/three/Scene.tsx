"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import Environment from "./Environment";
import Hotel from "./Hotel";
import { sceneState } from "@/lib/scroll-timeline";
import { cinematicLength } from "@/lib/use-scroll-state";
import { screenHover } from "@/lib/screen-hover";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/use-media";

// PERF (mission 0.5) : DoF, grain et aberration chromatique SACRIFIÉS
// (ordre de priorité de la mission) — seuls restent Bloom (basse intensité)
// et Vignette. dpr plafonné à 1.5. Si les FPS restent < 30 pendant 2s,
// FpsGuard coupe aussi le post-processing et la poussière.

// Caméra sur rails : suit sceneState (piloté par GSAP au scroll) avec un
// lissage doux + balancement orbital résiduel (amplitude sceneState.sway).
function CameraRig({ frozen }: { frozen: boolean }) {
  const look = useRef(
    new THREE.Vector3(sceneState.lookX, sceneState.lookY, sceneState.lookZ)
  );

  useFrame(({ camera, clock }) => {
    const s = sceneState;
    const t = frozen ? 0 : clock.getElapsedTime();
    const angle = Math.sin(t * 0.08) * 0.4 * s.sway;

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

// Sonde : projette la position 3D de l'écran du hall en pixels fenêtre
// (pour l'easter egg HTML).
function ScreenProbe() {
  const world = useRef(new THREE.Vector3());

  useFrame(({ camera, size }) => {
    world.current.set(0, -1.08, -4.6);
    world.current.project(camera);
    const p = Math.min(1, Math.max(0, window.scrollY / cinematicLength()));
    screenHover.inPhase = p > 0.14 && p < 0.42 && world.current.z < 1;
    screenHover.x = (world.current.x * 0.5 + 0.5) * size.width;
    screenHover.y = (-world.current.y * 0.5 + 0.5) * size.height;
  });
  return null;
}

// Garde-fou : FPS moyens < 30 pendant 2 secondes → mode dégradé
// (coupe le post-processing et la poussière, une seule fois).
function FpsGuard({ onDegrade }: { onDegrade: () => void }) {
  const frames = useRef(0);
  const windowStart = useRef(0);
  const lowStreak = useRef(0);
  const fired = useRef(false);

  useFrame(({ clock }) => {
    if (fired.current) return;
    const t = clock.getElapsedTime();
    if (windowStart.current === 0) windowStart.current = t;
    frames.current++;
    const elapsed = t - windowStart.current;
    if (elapsed >= 1) {
      const fps = frames.current / elapsed;
      lowStreak.current = fps < 30 ? lowStreak.current + 1 : 0;
      frames.current = 0;
      windowStart.current = t;
      if (lowStreak.current >= 2) {
        fired.current = true;
        onDegrade();
      }
    }
  });
  return null;
}

// Scène 3D unique, fixée derrière tout le contenu du site. aria-hidden.
export default function Scene() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const [degraded, setDegraded] = useState(false);

  return (
    <div
      className={`fixed inset-0 -z-10 ${
        isMobile ? "opacity-75 blur-[2px]" : ""
      }`}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, -1.3, 10.5], fov: 45 }}
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <CameraRig frozen={reducedMotion} />
        {!isMobile && <ScreenProbe />}
        {!isMobile && !reducedMotion && !degraded && (
          <FpsGuard onDegrade={() => setDegraded(true)} />
        )}
        <Environment showGrid={!isMobile} />
        <Hotel dust={!isMobile && !degraded} />
        {/* Post-processing minimal : Bloom bas + Vignette (desktop, hors mode dégradé) */}
        {!isMobile && !degraded && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.9}
              mipmapBlur
              radius={0.4}
            />
            <Vignette eskil={false} offset={0.28} darkness={0.65} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
