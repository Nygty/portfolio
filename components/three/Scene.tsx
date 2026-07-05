"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import Environment from "./Environment";
import Signature from "./Signature";
import { sceneState } from "@/lib/scroll-timeline";

// Dolly de caméra piloté par le scroll (léger lissage pour la douceur)
function CameraRig() {
  useFrame(({ camera }) => {
    camera.position.z += (sceneState.cameraZ - camera.position.z) * 0.06;
  });
  return null;
}

// Scène 3D unique, fixée derrière tout le contenu du site.
// aria-hidden : purement décorative, invisible pour les lecteurs d'écran.
export default function Scene() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <CameraRig />
        <Environment />
        <Signature />
      </Canvas>
    </div>
  );
}
