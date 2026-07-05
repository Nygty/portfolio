"use client";

import * as THREE from "three";
import { WireBox, GlowPlane } from "./primitives";

// Plafond du hall : poutres filaires croisées, spots encastrés alignés
// (disque chaud au plafond + cercle de lumière projeté au sol), et
// corniche lumineuse ambrée indirecte sur le pourtour — la signature
// "luxe feutré" des références, en version blueprint.

const W = 9;
const D = 8;
const H = 3.4;
const AMBER = "#d4a574";
const WARM_WHITE = "#f0e0c0";

const SPOTS: [number, number][] = [
  [-2.2, -1.2],
  [0, -1.2],
  [2.2, -1.2],
  [-2.2, 1.6],
  [0, 1.6],
  [2.2, 1.6],
];

export default function LobbyCeiling() {
  return (
    <group>
      {/* Poutres transversales et longitudinales */}
      {[-3, -1, 1, 3].map((z) => (
        <WireBox
          key={`t-${z}`}
          size={[W - 0.3, 0.14, 0.14]}
          position={[0, H - 0.07, z]}
          opacity={0.38}
        />
      ))}
      {[-2.2, 2.2].map((x) => (
        <WireBox
          key={`l-${x}`}
          size={[0.12, 0.12, D - 0.3]}
          position={[x, H - 0.2, 0]}
          opacity={0.28}
        />
      ))}

      {/* Spots encastrés + cercles de lumière chauds projetés au sol */}
      {SPOTS.map(([x, z]) => (
        <group key={`${x}-${z}`}>
          <mesh position={[x, H - 0.16, z]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.07, 16]} />
            <meshBasicMaterial
              color={WARM_WHITE}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.5, 24]} />
            <meshBasicMaterial
              color={AMBER}
              transparent
              opacity={0.06}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {/* Corniche lumineuse ambrée indirecte (pourtour du plafond) */}
      <GlowPlane
        size={[W - 0.6, 0.05]}
        color={AMBER}
        opacity={0.45}
        position={[0, H - 0.3, -D / 2 + 0.08]}
      />
      <GlowPlane
        size={[W - 0.6, 0.05]}
        color={AMBER}
        opacity={0.35}
        position={[0, H - 0.3, D / 2 - 0.08]}
      />
      <GlowPlane
        size={[D - 0.6, 0.05]}
        color={AMBER}
        opacity={0.4}
        position={[-W / 2 + 0.08, H - 0.3, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <GlowPlane
        size={[D - 0.6, 0.05]}
        color={AMBER}
        opacity={0.4}
        position={[W / 2 - 0.08, H - 0.3, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
}
