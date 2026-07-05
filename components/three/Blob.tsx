"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";

// Le blob organique lumineux — l'incarnation visuelle de l'IA.
// Sphère déformée en continu (MeshDistortMaterial), qui pulse plus fort
// quand l'agent "réfléchit" (intensity élevée) et se calme quand il rédige.
// Rendu dans son propre mini-canvas, imbriqué dans le panneau HTML.

function BlobMesh({ intensity }: { intensity: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 3.1) * 0.05 * (0.4 + intensity);
    mesh.current.scale.setScalar(pulse);
    mesh.current.rotation.y = t * 0.45;
    mesh.current.rotation.z = t * 0.18;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, 24]} />
      <MeshDistortMaterial
        color="#3d7fd6"
        emissive="#1d4b8f"
        emissiveIntensity={0.55}
        roughness={0.25}
        metalness={0.15}
        distort={0.28 + intensity * 0.22}
        speed={2 + intensity * 2.5}
      />
    </mesh>
  );
}

export default function Blob({ intensity = 0.5 }: { intensity?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 40 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 2, 4]} intensity={30} color="#7c5cff" />
      <pointLight position={[-3, -1, 2]} intensity={22} color="#4a9eff" />
      <BlobMesh intensity={intensity} />
    </Canvas>
  );
}
