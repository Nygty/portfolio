"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Le "Noyau Concierge" : sphère de particules lumineuses qui respire
// lentement, dégradé bleu → violet, avec un cœur brillant au centre.
// Version étape 3 : rotation + respiration seulement.
// La fragmentation et les mouvements liés au scroll arrivent à l'étape 5.

const PARTICLE_COUNT = 4000;
const RADIUS = 1.3;

const ACCENT = new THREE.Color("#4a9eff");
const ACCENT_HOT = new THREE.Color("#7c5cff");

export default function Signature() {
  const group = useRef<THREE.Group>(null);

  // Positions et couleurs des particules, calculées une seule fois
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const color = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Point aléatoire sur la sphère (distribution uniforme)
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      // Léger relief aléatoire pour un aspect organique, pas géométrique
      const r = RADIUS * (0.95 + Math.random() * 0.1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // Dégradé bleu → violet selon la hauteur du point
      const blend = (positions[i * 3 + 1] / RADIUS + 1) / 2;
      color.lerpColors(ACCENT, ACCENT_HOT, blend);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  // Animation continue : rotation lente + "respiration"
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.12;
    group.current.scale.setScalar(1 + Math.sin(t * 0.7) * 0.035);
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.022}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Cœur lumineux : halo diffus + noyau brillant */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial
          color="#4a9eff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshBasicMaterial color="#cfe3ff" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}
