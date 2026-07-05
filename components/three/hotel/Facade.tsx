"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { WireBox, WireBoxes, GlowPlane, GlowQuads } from "./primitives";
import { sceneState } from "@/lib/scroll-timeline";
import { cinematicLength } from "@/lib/use-scroll-state";

// La façade de l'hôtel de nuit — version optimisée perf :
// tous les éléments répétés statiques (fenêtres sombres, balcons,
// corniches, toiture) sont FUSIONNÉS en une géométrie chacun (1 draw call
// au lieu de dizaines). Seules les fenêtres "vivantes" restent des objets
// individuels (leurs matériaux sont animés).
// reflection : version reflet — uniquement les éléments lumineux
// (les fenêtres éteintes étaient invisibles à 20% d'opacité).

const FLOORS = 6;
const FLOOR_H = 1.1;
const WIDTH = 4;
const DEPTH = 2.5;
const HEIGHT = FLOORS * FLOOR_H;

const WIN_W = 0.34;
const WIN_H = 0.5;
const FRONT_COLS = 6;
const SIDE_COLS = 3;

// Fenêtres allumées fixes : intensité propre à chacune. warm : ambrée.
const LIT: Record<string, { intensity: number; warm?: boolean }> = {
  "1-1": { intensity: 0.85, warm: true },
  "5-5": { intensity: 0.7 },
  "0-5": { intensity: 1 },
  "3-0": { intensity: 0.6, warm: true },
};

const PULSING = [
  { key: "2-4", speed: 1.6, base: 0.72, amp: 0.26, phase: 0 },
  { key: "4-2", speed: 0.9, base: 0.6, amp: 0.3, phase: 2.1 },
];

const SCROLL_TOGGLE = [
  { key: "3-3", from: 0.045, to: 0.075, mode: "on" },
  { key: "0-0", from: 0.08, to: 0.11, mode: "off" },
  { key: "4-5", from: 0.115, to: 0.145, mode: "on" },
] as const;

const BALCONIES = new Set(["2-1", "2-4", "4-0", "4-3"]);

const DARK_GLASS = "#0e1a30";
const LIT_GLASS = "#a8d2ff";
const WARM_GLASS = "#e8b77a";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function frontWindowX(col: number) {
  return -WIDTH / 2 + 0.55 + col * ((WIDTH - 1.1) / (FRONT_COLS - 1));
}
function windowY(floor: number) {
  return floor * FLOOR_H + 0.62;
}

const LIVING_KEYS = new Set([
  ...PULSING.map((p) => p.key),
  ...SCROLL_TOGGLE.map((t) => t.key),
]);

// ---- Listes fusionnées, calculées une fois au chargement du module ----

type Quad = {
  position: [number, number, number];
  size: [number, number];
  rotY?: number;
};
type Box = { size: [number, number, number]; position: [number, number, number] };

// Toutes les fenêtres SOMBRES (avant + côtés) → un seul mesh
const DARK_QUADS: Quad[] = (() => {
  const quads: Quad[] = [];
  for (let floor = 0; floor < FLOORS; floor++) {
    for (let col = 0; col < FRONT_COLS; col++) {
      if (floor === 0 && (col === 2 || col === 3)) continue;
      const key = `${floor}-${col}`;
      if (LIT[key] || LIVING_KEYS.has(key)) continue;
      quads.push({
        position: [frontWindowX(col), windowY(floor), DEPTH / 2 + 0.02],
        size: [WIN_W, WIN_H],
      });
    }
  }
  for (const side of [-1, 1]) {
    for (let floor = 0; floor < FLOORS; floor++) {
      for (let col = 0; col < SIDE_COLS; col++) {
        quads.push({
          position: [
            side * (WIDTH / 2 + 0.02),
            windowY(floor),
            -DEPTH / 2 + 0.6 + col * 0.65,
          ],
          size: [WIN_W, WIN_H],
          rotY: (side * Math.PI) / 2,
        });
      }
    }
  }
  return quads;
})();

// Balcons complets (dalle + main courante + barreaudage) → un seul objet
const BALCONY_BOXES: Box[] = (() => {
  const boxes: Box[] = [];
  BALCONIES.forEach((key) => {
    const [floor, col] = key.split("-").map(Number);
    const x = frontWindowX(col);
    const y = windowY(floor) - WIN_H / 2 - 0.13;
    const z = DEPTH / 2 + 0.11;
    boxes.push({ size: [0.52, 0.02, 0.2], position: [x, y, z] });
    boxes.push({ size: [0.52, 0.015, 0.015], position: [x, y + 0.2, z + 0.09] });
    for (const bx of [-0.18, -0.06, 0.06, 0.18]) {
      boxes.push({
        size: [0.012, 0.2, 0.012],
        position: [x + bx, y + 0.1, z + 0.09],
      });
    }
  });
  return boxes;
})();

// Séparations d'étages fines → un seul objet
const FAINT_LINES: Box[] = Array.from({ length: FLOORS - 1 }, (_, i) => i + 1)
  .filter((f) => f % 2 !== 0)
  .map((f) => ({
    size: [WIDTH, 0.001, DEPTH] as [number, number, number],
    position: [0, f * FLOOR_H, 0] as [number, number, number],
  }));

// Structure saillante (corniches, pilastres, auvent, toiture, enseigne) → un seul objet
const STRONG_LINES: Box[] = [
  { size: [WIDTH + 0.24, 0.14, DEPTH + 0.24], position: [0, HEIGHT + 0.07, 0] },
  ...[2, 4].map((f) => ({
    size: [WIDTH + 0.12, 0.04, DEPTH + 0.12] as [number, number, number],
    position: [0, f * FLOOR_H, 0] as [number, number, number],
  })),
  { size: [0.12, HEIGHT, 0.12], position: [-(WIDTH / 2 + 0.06), HEIGHT / 2, DEPTH / 2 + 0.02] },
  { size: [0.12, HEIGHT, 0.12], position: [WIDTH / 2 + 0.06, HEIGHT / 2, DEPTH / 2 + 0.02] },
  { size: [1.6, 0.06, 0.7], position: [0, 1.06, DEPTH / 2 + 0.35] },
  { size: [0.03, 1.06, 0.03], position: [-0.7, 0.53, DEPTH / 2 + 0.66] },
  { size: [0.03, 1.06, 0.03], position: [0.7, 0.53, DEPTH / 2 + 0.66] },
  { size: [2.6, 0.62, 0.05], position: [0, HEIGHT + 0.42, 0] },
  { size: [1.2, 0.35, 0.8], position: [-1.1, HEIGHT + 0.175, -0.5] },
  { size: [0.4, 0.25, 0.4], position: [0.9, HEIGHT + 0.125, -0.7] },
  { size: [0.4, 0.25, 0.4], position: [1.45, HEIGHT + 0.125, -0.7] },
  { size: [0.02, 0.9, 0.02], position: [1.5, HEIGHT + 0.45, 0.6] },
];

// Lettres néon "HOTEL"
const LETTER_STROKES: Record<string, [number, number, number, number][]> = {
  H: [
    [0, 0, 0, 0.8],
    [0.5, 0, 0.5, 0.8],
    [0, 0.4, 0.5, 0.4],
  ],
  O: [
    [0, 0, 0.5, 0],
    [0.5, 0, 0.5, 0.8],
    [0.5, 0.8, 0, 0.8],
    [0, 0.8, 0, 0],
  ],
  T: [
    [0, 0.8, 0.5, 0.8],
    [0.25, 0, 0.25, 0.8],
  ],
  E: [
    [0, 0, 0, 0.8],
    [0, 0.8, 0.45, 0.8],
    [0, 0.4, 0.38, 0.4],
    [0, 0, 0.45, 0],
  ],
  L: [
    [0, 0.8, 0, 0],
    [0, 0, 0.45, 0],
  ],
};

function NeonSign({ text, dim }: { text: string; dim: number }) {
  const geometry = useMemo(() => {
    const S = 0.6;
    const SPACING = 0.45;
    const points: number[] = [];
    const totalW = (text.length - 1) * SPACING + 0.5 * S;
    text.split("").forEach((letter, i) => {
      const strokes = LETTER_STROKES[letter];
      if (!strokes) return;
      const ox = i * SPACING - totalW / 2;
      strokes.forEach(([x1, y1, x2, y2]) => {
        points.push(ox + x1 * S, y1 * S, 0, ox + x2 * S, y2 * S, 0);
      });
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return g;
  }, [text]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#7c5cff" transparent opacity={0.95 * dim} />
    </lineSegments>
  );
}

export default function Facade({ reflection = false }: { reflection?: boolean }) {
  const dim = reflection ? 0.22 : 1;
  const o = (v: number) => v * dim;

  const pulsingMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const toggleMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const antennaMat = useRef<THREE.MeshBasicMaterial>(null);
  const frame = useRef(0);

  useFrame(({ clock }) => {
    // animations décoratives : 1 frame sur 2 suffit largement
    frame.current = (frame.current + 1) % 2;
    if (frame.current !== 0) return;

    const t = clock.getElapsedTime();
    const fade = sceneState.facadeOpacity * dim;

    PULSING.forEach((pulse, i) => {
      const mat = pulsingMats.current[i];
      if (!mat) return;
      mat.userData.skipFade = true;
      mat.opacity =
        (pulse.base + Math.sin(t * pulse.speed + pulse.phase) * pulse.amp) *
        fade;
    });

    const progress = clamp01(window.scrollY / cinematicLength());
    SCROLL_TOGGLE.forEach((toggle, i) => {
      const mat = toggleMats.current[i];
      if (!mat) return;
      mat.userData.skipFade = true;
      const v = clamp01((progress - toggle.from) / (toggle.to - toggle.from));
      const lit = toggle.mode === "on" ? v : 1 - v;
      mat.opacity = (0.06 + lit * 0.88) * fade;
    });

    if (antennaMat.current) {
      antennaMat.current.userData.skipFade = true;
      const on = t % 4 < 2 ? 0.45 : 0.06;
      antennaMat.current.opacity +=
        (on * fade - antennaMat.current.opacity) * 0.22;
    }
  });

  // Fenêtres vivantes : objets individuels (matériaux animés)
  const pulsingKeys: string[] = PULSING.map((p) => p.key);
  const toggleKeys: string[] = SCROLL_TOGGLE.map((s) => s.key);
  const livingWindows: React.ReactNode[] = [];
  LIVING_KEYS.forEach((key) => {
    const [floor, col] = key.split("-").map(Number);
    const pulseIndex = pulsingKeys.indexOf(key);
    const toggleIndex = toggleKeys.indexOf(key);
    livingWindows.push(
      <mesh
        key={key}
        position={[frontWindowX(col), windowY(floor), DEPTH / 2 + 0.02]}
      >
        <planeGeometry args={[WIN_W, WIN_H]} />
        <meshBasicMaterial
          ref={(mat) => {
            if (pulseIndex >= 0) pulsingMats.current[pulseIndex] = mat;
            else toggleMats.current[toggleIndex] = mat;
          }}
          color={LIT_GLASS}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  });

  return (
    <group>
      {/* Volume principal */}
      <WireBox
        size={[WIDTH, HEIGHT, DEPTH]}
        position={[0, HEIGHT / 2, 0]}
        opacity={o(0.9)}
      />
      {/* Structure fusionnée : corniches, pilastres, auvent, toiture (1 draw call) */}
      <WireBoxes boxes={STRONG_LINES} opacity={o(0.55)} />

      {/* Éléments invisibles dans le reflet : économisés */}
      {!reflection && (
        <>
          <WireBoxes boxes={FAINT_LINES} opacity={0.28} />
          <GlowQuads quads={DARK_QUADS} color={DARK_GLASS} opacity={0.9} />
          <WireBoxes boxes={BALCONY_BOXES} opacity={0.5} />
        </>
      )}

      {/* Fenêtres allumées fixes */}
      {Object.entries(LIT).map(([key, lit]) => {
        const [floor, col] = key.split("-").map(Number);
        return (
          <GlowPlane
            key={key}
            size={[WIN_W, WIN_H]}
            color={lit.warm ? WARM_GLASS : LIT_GLASS}
            opacity={o(lit.intensity)}
            position={[frontWindowX(col), windowY(floor), DEPTH / 2 + 0.02]}
          />
        );
      })}
      {livingWindows}

      {/* Porte d'entrée + seuil lumineux */}
      <WireBox
        size={[0.45, 0.95, 0.02]}
        position={[-0.24, 0.48, DEPTH / 2 + 0.02]}
        color="#7c5cff"
        opacity={o(0.9)}
      />
      <WireBox
        size={[0.45, 0.95, 0.02]}
        position={[0.24, 0.48, DEPTH / 2 + 0.02]}
        color="#7c5cff"
        opacity={o(0.9)}
      />
      <GlowPlane
        size={[1.1, 0.04]}
        color="#7c5cff"
        opacity={o(0.8)}
        position={[0, 0.015, DEPTH / 2 + 0.05]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* Sous-face lumineuse de l'auvent + enseigne d'entrée */}
      <GlowPlane
        size={[1.5, 0.62]}
        color="#4a9eff"
        opacity={o(0.35)}
        position={[0, 1.02, DEPTH / 2 + 0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <GlowPlane
        size={[1.7, 0.12]}
        color="#4a9eff"
        opacity={o(0.9)}
        position={[0, 1.5, DEPTH / 2 + 0.03]}
      />

      {/* Spots au sol : dans la version principale uniquement */}
      {!reflection &&
        [-1.5, 1.5].map((x) => (
          <group key={`spot-${x}`} position={[x, 0, DEPTH / 2 + 1.3]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
              <circleGeometry args={[0.09, 12]} />
              <meshBasicMaterial
                color="#a8d2ff"
                transparent
                opacity={0.9}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, 1.05, -0.5]} rotation={[Math.PI - 0.38, 0, 0]}>
              <coneGeometry args={[0.55, 2.3, 14, 1, true]} />
              <meshBasicMaterial
                color="#4a9eff"
                transparent
                opacity={0.07}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        ))}

      {/* Néon "HOTEL" sur le toit */}
      <group position={[0, HEIGHT + 0.18, 0.04]}>
        <NeonSign text="HOTEL" dim={dim} />
      </group>

      {/* Feu d'antenne clignotant */}
      <mesh position={[1.5, HEIGHT + 0.93, 0.6]}>
        <planeGeometry args={[0.06, 0.06]} />
        <meshBasicMaterial
          ref={antennaMat}
          color="#ff6b6b"
          transparent
          opacity={o(0.45)}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
