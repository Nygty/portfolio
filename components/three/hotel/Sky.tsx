"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Le ciel nocturne : ~220 étoiles en points fins (dérive imperceptible),
// halo de lune diffus en haut à droite, nappes de brume basse qui
// flottent lentement. Tous les matériaux ignorent le fog (fog={false}) :
// le ciel est LOIN derrière la limite du brouillard, il serait invisible sinon.

const STAR_COUNT = 220;

const MISTS = [
  { z: -10, y: -1.3, width: 30, height: 1.8, opacity: 0.05, speed: 0.05, phase: 0 },
  { z: -16, y: -1.1, width: 38, height: 2.4, opacity: 0.04, speed: 0.035, phase: 2 },
  { z: -24, y: -0.9, width: 46, height: 3, opacity: 0.035, speed: 0.02, phase: 4 },
];

export default function Sky() {
  const stars = useRef<THREE.Points>(null);
  const mistRefs = useRef<(THREE.Mesh | null)[]>([]);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const white = new THREE.Color("#cfe0f5");
    const blue = new THREE.Color("#8ab8f0");
    const color = new THREE.Color();

    for (let i = 0; i < STAR_COUNT; i++) {
      // dôme autour de la scène, biaisé vers le haut
      const theta = Math.random() * Math.PI * 2;
      const radius = 38 + Math.random() * 14;
      const y = 3 + Math.random() * 34;
      const horizontal = Math.sqrt(Math.max(4, radius * radius - y * y));
      positions[i * 3] = Math.cos(theta) * horizontal;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * horizontal;

      color.lerpColors(white, blue, Math.random());
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  useFrame(({ clock }, delta) => {
    if (stars.current) stars.current.rotation.y += delta * 0.0025;
    const t = clock.getElapsedTime();
    MISTS.forEach((mist, i) => {
      const mesh = mistRefs.current[i];
      if (!mesh) return;
      mesh.position.x = Math.sin(t * mist.speed + mist.phase) * 3;
    });
  });

  return (
    <group>
      {/* Étoiles */}
      <points ref={stars}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          fog={false}
        />
      </points>

      {/* Halo de lune, haut droite : trois cercles concentriques diffus */}
      <group position={[14, 9, -32]}>
        {[
          { r: 2.2, opacity: 0.14 },
          { r: 4, opacity: 0.06 },
          { r: 6.2, opacity: 0.03 },
        ].map(({ r, opacity }) => (
          <mesh key={r}>
            <circleGeometry args={[r, 40]} />
            <meshBasicMaterial
              color="#a8c8f0"
              transparent
              opacity={opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              fog={false}
            />
          </mesh>
        ))}
      </group>

      {/* Brume basse : nappes qui dérivent au ras du sol */}
      {MISTS.map((mist, i) => (
        <mesh
          key={mist.z}
          ref={(mesh) => {
            mistRefs.current[i] = mesh;
          }}
          position={[0, mist.y, mist.z]}
        >
          <planeGeometry args={[mist.width, mist.height]} />
          <meshBasicMaterial
            color="#1c2f52"
            transparent
            opacity={mist.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            fog={false}
          />
        </mesh>
      ))}
    </group>
  );
}
