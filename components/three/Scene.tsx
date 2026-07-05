"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import type { DepthOfFieldEffect } from "postprocessing";
import Environment from "./Environment";
import Hotel from "./Hotel";
import { sceneState } from "@/lib/scroll-timeline";
import { cinematicLength } from "@/lib/use-scroll-state";
import { screenHover } from "@/lib/screen-hover";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/use-media";

// Sonde : projette chaque frame la position 3D de l'écran du hall
// (monde : 0, -1.08, -4.6) en pixels fenêtre, pour l'easter egg HTML.
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

// Profondeur de champ cinématographique : discrète en temps normal,
// elle s'intensifie pendant le zoom vers l'écran (28-50% du scroll)
// pour guider optiquement le regard.
function CinematicDoF() {
  const dof = useRef<DepthOfFieldEffect>(null);

  useFrame(() => {
    if (!dof.current) return;
    const p = Math.min(1, Math.max(0, window.scrollY / cinematicLength()));
    const target = p > 0.28 && p < 0.5 ? 3 : 0.6;
    dof.current.bokehScale += (target - dof.current.bokehScale) * 0.05;
  });

  return (
    <DepthOfField
      ref={dof}
      focusDistance={0.012}
      focalLength={0.06}
      bokehScale={0.6}
    />
  );
}

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
  // aberration chromatique : décalage RGB très léger sur les bords
  const caOffset = useMemo(() => new THREE.Vector2(0.0015, 0.0015), []);

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
        {!isMobile && <ScreenProbe />}
        <Environment showGrid={!isMobile} />
        <Hotel />
        {/* Post-processing cinéma — desktop uniquement.
            Ordre de dégradation si perf < 65 : ChromaticAberration,
            puis Noise, puis DepthOfField. Bloom + Vignette restent. */}
        {!isMobile && (
          <EffectComposer multisampling={0}>
            <CinematicDoF />
            <Bloom
              intensity={0.55}
              luminanceThreshold={0.24}
              luminanceSmoothing={0.7}
              mipmapBlur
            />
            <ChromaticAberration offset={caOffset} />
            <Noise premultiply opacity={0.025} />
            <Vignette eskil={false} offset={0.28} darkness={0.65} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
