"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { cinematicLength } from "@/lib/use-scroll-state";

// Poussière volumétrique du hall : ~60 points minuscules qui dérivent
// très lentement. Ils se révèlent pendant la traversée du hall (comme
// des grains dans les rayons de lumière) et s'estompent ailleurs.
// Desktop uniquement (monté conditionnellement par Hotel.tsx).

const COUNT = 60;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function DustParticles() {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);

  const { base, speeds, phases, positions } = useMemo(() => {
    const base = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      base[i * 3] = (Math.random() - 0.5) * 7;
      base[i * 3 + 1] = 0.3 + Math.random() * 2.6;
      base[i * 3 + 2] = (Math.random() - 0.5) * 7;
      speeds[i] = 0.1 + Math.random() * 0.25;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { base, speeds, phases, positions: base.slice() };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (points.current) {
      const attr = points.current.geometry.attributes
        .position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        arr[i * 3] = base[i * 3] + Math.sin(t * speeds[i] + phases[i]) * 0.3;
        arr[i * 3 + 1] =
          base[i * 3 + 1] +
          Math.sin(t * speeds[i] * 0.6 + phases[i] * 2) * 0.25;
        arr[i * 3 + 2] =
          base[i * 3 + 2] + Math.cos(t * speeds[i] * 0.8 + phases[i]) * 0.2;
      }
      attr.needsUpdate = true;
    }

    if (material.current) {
      // Visibles surtout pendant la traversée du hall (13-50% du scroll)
      const progress = clamp01(window.scrollY / cinematicLength());
      const inHall = progress > 0.13 && progress < 0.5 ? 1 : 0.25;
      material.current.opacity +=
        (0.5 * inHall - material.current.opacity) * 0.04;
    }
  });

  // Même repère local que le hall (groupe à z = -3.5 dans Hotel)
  return (
    <points ref={points} position={[0, 0, -3.5]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        size={0.025}
        color="#bcd6f5"
        transparent
        opacity={0.2}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
