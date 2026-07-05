"use client";

import { WireBox, WireBoxes, GlowPlane, GlowQuads } from "./primitives";
import LobbyFloor from "./LobbyFloor";
import LobbyCeiling from "./LobbyCeiling";
import LobbyProps from "./LobbyProps";
import LobbyDecor from "./LobbyDecor";

// Le hall d'entrée : structure (volume, colonnes, comptoir, casier à clés)
// + sous-ensembles : LobbyFloor (dallage), LobbyCeiling (poutres, spots,
// corniche ambrée), LobbyProps (poste de travail), LobbyDecor (mobilier).
// Style : bleu néon dominant, liserés laiton #d4a574 (référence luxe).
// Coordonnées locales : sol à y = 0, le hall s'étend derrière la façade.

const W = 9;
const D = 8;
const H = 3.4;
const AMBER = "#d4a574";

// Structure statique fusionnée (colonnes, rythme du mur du fond, tapis)
// → 1 seul draw call au lieu de 10
const STRUCTURE_BOXES = [
  ...[
    [-2.8, -2],
    [2.8, -2],
    [-2.8, 2],
    [2.8, 2],
  ].map(([x, z]) => ({
    size: [0.18, H, 0.18] as [number, number, number],
    position: [x, H / 2, z] as [number, number, number],
  })),
  ...[-3.2, -1.6, 1.6, 3.2].map((x) => ({
    size: [0.02, H, 0.02] as [number, number, number],
    position: [x, H / 2, -D / 2 + 0.02] as [number, number, number],
  })),
  { size: [3, 0.004, 2] as [number, number, number], position: [0, 0.02, 0.6] as [number, number, number] },
  { size: [2.4, 0.003, 1.5] as [number, number, number], position: [0, 0.018, 0.6] as [number, number, number] },
];

// Casier à clés : cases fusionnées par couleur → 2 draw calls au lieu de 12
const KEY_QUADS = Array.from({ length: 12 }, (_, i) => ({
  index: i,
  position: [
    -0.45 + (i % 4) * 0.3,
    1.66 - Math.floor(i / 4) * 0.21,
    -D / 2 + 0.08,
  ] as [number, number, number],
  size: [0.09, 0.09] as [number, number],
}));
const KEY_LIT = KEY_QUADS.filter((q) => q.index % 5 === 0);
const KEY_DARK = KEY_QUADS.filter((q) => q.index % 5 !== 0);

export default function Lobby() {
  return (
    <group position={[0, 0, -3.5]}>
      {/* Volume de la pièce */}
      <WireBox size={[W, H, D]} position={[0, H / 2, 0]} opacity={0.24} />

      <LobbyFloor />
      <LobbyCeiling />
      <LobbyProps />
      <LobbyDecor />

      {/* Colonnes + rythme mural + tapis : structure fusionnée */}
      <WireBoxes boxes={STRUCTURE_BOXES} opacity={0.4} />

      {/* Chemin lumineux au sol, de la porte vers le comptoir */}
      <GlowPlane
        size={[0.03, 4.6]}
        color="#4a9eff"
        opacity={0.5}
        position={[-0.8, 0.016, 1.2]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <GlowPlane
        size={[0.03, 4.6]}
        color="#4a9eff"
        opacity={0.5}
        position={[0.8, 0.016, 1.2]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* Comptoir de réception + liserés laiton (haut et socle) */}
      <WireBox
        size={[2.6, 1.05, 0.7]}
        position={[0, 0.525, -1]}
        opacity={0.85}
      />
      <GlowPlane
        size={[2.56, 0.04]}
        color={AMBER}
        opacity={0.7}
        position={[0, 0.98, -0.63]}
      />
      <GlowPlane
        size={[2.56, 0.03]}
        color={AMBER}
        opacity={0.45}
        position={[0, 0.06, -0.63]}
      />

      {/* Suspensions lumineuses au plafond */}
      {[-2.4, 0, 2.4].map((x) => (
        <GlowPlane
          key={x}
          size={[0.5, 0.04]}
          color="#7c5cff"
          opacity={0.55}
          position={[x, H - 0.5, 1]}
        />
      ))}

      {/* Œuvre lumineuse du mur du fond */}
      <GlowPlane
        size={[2.8, 0.07]}
        color="#7c5cff"
        opacity={0.6}
        position={[0, 2.3, -D / 2 + 0.03]}
      />
      <GlowPlane
        size={[2.2, 0.05]}
        color="#4a9eff"
        opacity={0.45}
        position={[0, 2.12, -D / 2 + 0.03]}
      />

      {/* Casier à clés derrière le comptoir */}
      <WireBox
        size={[1.3, 0.7, 0.04]}
        position={[0, 1.45, -D / 2 + 0.05]}
        opacity={0.6}
      />
      <GlowQuads quads={KEY_LIT} color="#a8d2ff" opacity={0.85} />
      <GlowQuads quads={KEY_DARK} color="#22314d" opacity={0.85} />

      {/* Coin salon : deux fauteuils + table basse lumineuse */}
      {[1.1, -0.1].map((z) => (
        <group key={`chair-${z}`} position={[-3.1, 0, z]}>
          <WireBox
            size={[0.55, 0.35, 0.55]}
            position={[0, 0.175, 0]}
            opacity={0.6}
          />
          <WireBox
            size={[0.08, 0.5, 0.55]}
            position={[-0.24, 0.55, 0]}
            opacity={0.6}
          />
        </group>
      ))}
      <WireBox size={[0.7, 0.28, 0.7]} position={[-2.2, 0.14, 0.5]} opacity={0.6} />
      <GlowPlane
        size={[0.6, 0.6]}
        color="#4a9eff"
        opacity={0.18}
        position={[-2.2, 0.285, 0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* Appliques sur les colonnes — ambre chaud (références luxe) */}
      {[
        [-2.8, -2],
        [2.8, -2],
        [-2.8, 2],
        [2.8, 2],
      ].map(([x, z]) => (
        <GlowPlane
          key={`sconce-${x}-${z}`}
          size={[0.08, 0.28]}
          color="#e8c79a"
          opacity={0.65}
          position={[x, 2.25, z + 0.11]}
        />
      ))}
    </group>
  );
}
