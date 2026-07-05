"use client";

import * as THREE from "three";
import { WireBoxes, GlowQuads } from "./primitives";

// Plafond du hall — version optimisée : poutres fusionnées (1 draw call),
// disques de spots fusionnés (1), corniche ambrée fusionnée (1).
// Seuls les 6 cercles de lumière au sol restent individuels (additifs).

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

const BEAM_BOXES = [
  ...[-3, -1, 1, 3].map((z) => ({
    size: [W - 0.3, 0.14, 0.14] as [number, number, number],
    position: [0, H - 0.07, z] as [number, number, number],
  })),
  ...[-2.2, 2.2].map((x) => ({
    size: [0.12, 0.12, D - 0.3] as [number, number, number],
    position: [x, H - 0.2, 0] as [number, number, number],
  })),
];

const SPOT_QUADS = SPOTS.map(([x, z]) => ({
  position: [x, H - 0.16, z] as [number, number, number],
  size: [0.14, 0.14] as [number, number],
  horizontal: true,
}));

const COVE_QUADS = [
  {
    position: [0, H - 0.3, -D / 2 + 0.08] as [number, number, number],
    size: [W - 0.6, 0.05] as [number, number],
  },
  {
    position: [0, H - 0.3, D / 2 - 0.08] as [number, number, number],
    size: [W - 0.6, 0.05] as [number, number],
  },
  {
    position: [-W / 2 + 0.08, H - 0.3, 0] as [number, number, number],
    size: [D - 0.6, 0.05] as [number, number],
    rotY: Math.PI / 2,
  },
  {
    position: [W / 2 - 0.08, H - 0.3, 0] as [number, number, number],
    size: [D - 0.6, 0.05] as [number, number],
    rotY: Math.PI / 2,
  },
];

export default function LobbyCeiling() {
  return (
    <group>
      <WireBoxes boxes={BEAM_BOXES} opacity={0.34} />
      <GlowQuads quads={SPOT_QUADS} color={WARM_WHITE} opacity={0.9} />
      <GlowQuads quads={COVE_QUADS} color={AMBER} opacity={0.42} />

      {/* Cercles de lumière chauds projetés au sol */}
      {SPOTS.map(([x, z]) => (
        <mesh
          key={`${x}-${z}`}
          position={[x, 0.02, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.5, 16]} />
          <meshBasicMaterial
            color={AMBER}
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
