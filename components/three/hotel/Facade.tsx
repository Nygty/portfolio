"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { WireBox, GlowPlane } from "./primitives";
import { sceneState } from "@/lib/scroll-timeline";
import { cinematicLength } from "@/lib/use-scroll-state";

// La façade de l'hôtel de nuit : 6 étages filaires, fenêtres aux vies
// irrégulières (intensités variées, pulsations asynchrones, allumages
// liés au scroll), balcons à garde-corps, corniches, néon "HOTEL" en
// lettres filaires violettes, spots au sol.
// reflection : rend la même façade à 16% d'opacité (reflet au sol).

const FLOORS = 6;
const FLOOR_H = 1.1;
const WIDTH = 4;
const DEPTH = 2.5;
const HEIGHT = FLOORS * FLOOR_H;

const WIN_W = 0.34;
const WIN_H = 0.5;
const FRONT_COLS = 6;
const SIDE_COLS = 3;

// Fenêtres allumées fixes : chacune a sa propre intensité (vies différentes).
// warm : lumière ambrée chaude (luxe hôtelier) au lieu du bleu-blanc.
const LIT: Record<string, { intensity: number; warm?: boolean }> = {
  "1-1": { intensity: 0.85, warm: true },
  "5-5": { intensity: 0.7 },
  "0-5": { intensity: 1 },
  "3-0": { intensity: 0.6, warm: true },
};

// Deux fenêtres qui respirent, à des rythmes et phases différents
const PULSING = [
  { key: "2-4", speed: 1.6, base: 0.72, amp: 0.26, phase: 0 },
  { key: "4-2", speed: 0.9, base: 0.6, amp: 0.3, phase: 2.1 },
];

// Fenêtres qui s'allument ou s'éteignent à des moments précis du scroll
const SCROLL_TOGGLE = [
  { key: "3-3", from: 0.045, to: 0.075, mode: "on" },
  { key: "0-0", from: 0.08, to: 0.11, mode: "off" },
  { key: "4-5", from: 0.115, to: 0.145, mode: "on" },
] as const;

// Balcons avec garde-corps ajouré
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

// Lettres en segments filaires (coordonnées unitaires 0..0.5 × 0..0.8)
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
    const S = 0.6; // échelle : lettres de 0.48 de haut
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
  // Le reflet est une copie très atténuée : tout passe par ce facteur
  // (0.22 : effet marbre poli accentué, demandé par la mission full-upgrade)
  const dim = reflection ? 0.22 : 1;
  const o = (v: number) => v * dim;

  const pulsingMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const toggleMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const antennaMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const fade = sceneState.facadeOpacity * dim;

    // Fenêtres qui respirent (asynchrones)
    PULSING.forEach((pulse, i) => {
      const mat = pulsingMats.current[i];
      if (!mat) return;
      mat.userData.skipFade = true;
      mat.opacity =
        (pulse.base + Math.sin(t * pulse.speed + pulse.phase) * pulse.amp) *
        fade;
    });

    // Fenêtres qui s'allument/s'éteignent au fil du scroll
    const progress = clamp01(window.scrollY / cinematicLength());
    SCROLL_TOGGLE.forEach((toggle, i) => {
      const mat = toggleMats.current[i];
      if (!mat) return;
      mat.userData.skipFade = true;
      const v = clamp01((progress - toggle.from) / (toggle.to - toggle.from));
      const lit = toggle.mode === "on" ? v : 1 - v;
      mat.opacity = (0.06 + lit * 0.88) * fade;
    });

    // Feu d'antenne : 2s allumé / 2s éteint, atténué, transition adoucie
    if (antennaMat.current) {
      antennaMat.current.userData.skipFade = true;
      const on = t % 4 < 2 ? 0.45 : 0.06;
      antennaMat.current.opacity +=
        (on * fade - antennaMat.current.opacity) * 0.12;
    }
  });

  const pulsingKeys: string[] = PULSING.map((p) => p.key);
  const toggleKeys: string[] = SCROLL_TOGGLE.map((s) => s.key);

  const frontWindows: React.ReactNode[] = [];
  const balconies: React.ReactNode[] = [];
  for (let floor = 0; floor < FLOORS; floor++) {
    for (let col = 0; col < FRONT_COLS; col++) {
      // au rez-de-chaussée, les colonnes centrales laissent place à la porte
      if (floor === 0 && (col === 2 || col === 3)) continue;
      const key = `${floor}-${col}`;
      const x = frontWindowX(col);
      const y = windowY(floor);
      const position: [number, number, number] = [x, y, DEPTH / 2 + 0.02];

      const pulseIndex = pulsingKeys.indexOf(key);
      const toggleIndex = toggleKeys.indexOf(key);

      if (pulseIndex >= 0 || toggleIndex >= 0) {
        // fenêtre "vivante" : matériau piloté dans useFrame
        frontWindows.push(
          <mesh key={key} position={position}>
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
      } else {
        const lit = LIT[key];
        frontWindows.push(
          <GlowPlane
            key={key}
            size={[WIN_W, WIN_H]}
            color={lit ? (lit.warm ? WARM_GLASS : LIT_GLASS) : DARK_GLASS}
            opacity={o(lit?.intensity ?? 0.9)}
            position={position}
          />
        );
      }

      if (BALCONIES.has(key)) {
        balconies.push(
          <group
            key={`b-${key}`}
            position={[x, y - WIN_H / 2 - 0.13, DEPTH / 2 + 0.11]}
          >
            {/* dalle, main courante, barreaudage ajouré */}
            <WireBox size={[0.52, 0.02, 0.2]} opacity={o(0.55)} />
            <WireBox
              size={[0.52, 0.015, 0.015]}
              position={[0, 0.2, 0.09]}
              opacity={o(0.5)}
            />
            {[-0.18, -0.06, 0.06, 0.18].map((bx) => (
              <WireBox
                key={bx}
                size={[0.012, 0.2, 0.012]}
                position={[bx, 0.1, 0.09]}
                opacity={o(0.38)}
              />
            ))}
          </group>
        );
      }
    }
  }

  const sideWindows: React.ReactNode[] = [];
  for (const side of [-1, 1]) {
    for (let floor = 0; floor < FLOORS; floor++) {
      for (let col = 0; col < SIDE_COLS; col++) {
        sideWindows.push(
          <GlowPlane
            key={`${side}-${floor}-${col}`}
            size={[WIN_W, WIN_H]}
            color={DARK_GLASS}
            opacity={o(0.9)}
            position={[
              side * (WIDTH / 2 + 0.02),
              windowY(floor),
              -DEPTH / 2 + 0.6 + col * 0.65,
            ]}
            rotation={[0, (side * Math.PI) / 2, 0]}
          />
        );
      }
    }
  }

  return (
    <group>
      {/* Volume principal + corniche sommitale */}
      <WireBox
        size={[WIDTH, HEIGHT, DEPTH]}
        position={[0, HEIGHT / 2, 0]}
        opacity={o(0.9)}
      />
      <WireBox
        size={[WIDTH + 0.24, 0.14, DEPTH + 0.24]}
        position={[0, HEIGHT + 0.07, 0]}
        opacity={o(0.7)}
      />
      {/* Séparations d'étages — une corniche saillante un étage sur deux */}
      {Array.from({ length: FLOORS - 1 }, (_, i) => {
        const strong = (i + 1) % 2 === 0;
        return (
          <WireBox
            key={i}
            size={
              strong ? [WIDTH + 0.12, 0.04, DEPTH + 0.12] : [WIDTH, 0.001, DEPTH]
            }
            position={[0, (i + 1) * FLOOR_H, 0]}
            opacity={o(strong ? 0.5 : 0.28)}
          />
        );
      })}
      {/* Pilastres d'angle */}
      {[-1, 1].map((side) => (
        <WireBox
          key={side}
          size={[0.12, HEIGHT, 0.12]}
          position={[side * (WIDTH / 2 + 0.06), HEIGHT / 2, DEPTH / 2 + 0.02]}
          opacity={o(0.45)}
        />
      ))}

      {frontWindows}
      {balconies}
      {sideWindows}

      {/* Porte d'entrée : double battant filaire + seuil lumineux */}
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

      {/* Auvent au-dessus de l'entrée + sous-face lumineuse */}
      <WireBox
        size={[1.6, 0.06, 0.7]}
        position={[0, 1.06, DEPTH / 2 + 0.35]}
        opacity={o(0.7)}
      />
      <GlowPlane
        size={[1.5, 0.62]}
        color="#4a9eff"
        opacity={o(0.35)}
        position={[0, 1.02, DEPTH / 2 + 0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      {[-0.7, 0.7].map((x) => (
        <WireBox
          key={x}
          size={[0.03, 1.06, 0.03]}
          position={[x, 0.53, DEPTH / 2 + 0.66]}
          opacity={o(0.5)}
        />
      ))}

      {/* Enseigne au-dessus de l'auvent */}
      <GlowPlane
        size={[1.7, 0.12]}
        color="#4a9eff"
        opacity={o(0.9)}
        position={[0, 1.5, DEPTH / 2 + 0.03]}
      />

      {/* Spots au sol devant l'entrée : disque brillant + faisceau conique */}
      {[-1.5, 1.5].map((x) => (
        <group key={`spot-${x}`} position={[x, 0, DEPTH / 2 + 1.3]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
            <circleGeometry args={[0.09, 16]} />
            <meshBasicMaterial
              color="#a8d2ff"
              transparent
              opacity={o(0.9)}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 1.05, -0.5]} rotation={[Math.PI - 0.38, 0, 0]}>
            <coneGeometry args={[0.55, 2.3, 20, 1, true]} />
            <meshBasicMaterial
              color="#4a9eff"
              transparent
              opacity={o(0.07)}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* Néon "HOTEL" sur le toit : lettres filaires violettes */}
      <WireBox
        size={[2.6, 0.62, 0.05]}
        position={[0, HEIGHT + 0.42, 0]}
        opacity={o(0.6)}
      />
      <group position={[0, HEIGHT + 0.18, 0.04]}>
        <NeonSign text="HOTEL" dim={dim} />
      </group>

      {/* Toit : édicule technique, unités AC, antenne à feu rouge */}
      <WireBox
        size={[1.2, 0.35, 0.8]}
        position={[-1.1, HEIGHT + 0.175, -0.5]}
        opacity={o(0.6)}
      />
      <WireBox
        size={[0.4, 0.25, 0.4]}
        position={[0.9, HEIGHT + 0.125, -0.7]}
        opacity={o(0.5)}
      />
      <WireBox
        size={[0.4, 0.25, 0.4]}
        position={[1.45, HEIGHT + 0.125, -0.7]}
        opacity={o(0.5)}
      />
      <WireBox
        size={[0.02, 0.9, 0.02]}
        position={[1.5, HEIGHT + 0.45, 0.6]}
        opacity={o(0.7)}
      />
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
