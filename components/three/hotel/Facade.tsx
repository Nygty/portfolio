"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { WireBox, GlowPlane } from "./primitives";
import { sceneState } from "@/lib/scroll-timeline";

// La façade de l'hôtel de nuit : volumes filaires bleu néon, 6 étages,
// grille de fenêtres, balcons, auvent d'entrée, corniche, enseigne néon
// sur le toit. Quelques fenêtres allumées, dont une qui pulse.
// Base du bâtiment à y = 0 — le parent (Hotel.tsx) le pose sur le sol.

const FLOORS = 6;
const FLOOR_H = 1.1;
const WIDTH = 4;
const DEPTH = 2.5;
const HEIGHT = FLOORS * FLOOR_H;

const WIN_W = 0.34;
const WIN_H = 0.5;
const FRONT_COLS = 6;
const SIDE_COLS = 3;

// Fenêtres allumées de la façade avant : "étage-colonne"
const LIT = new Set(["1-1", "2-4", "3-0", "4-2", "5-5", "0-5"]);
const PULSING = "2-4"; // celle-ci respire

// Balcons : quelques fenêtres des étages intermédiaires
const BALCONIES = new Set(["2-1", "2-4", "4-0", "4-3"]);

const DARK_GLASS = "#0e1a30";
const LIT_GLASS = "#a8d2ff";

function frontWindowX(col: number) {
  return -WIDTH / 2 + 0.55 + col * ((WIDTH - 1.1) / (FRONT_COLS - 1));
}

export default function Facade() {
  const pulsingMat = useRef<THREE.MeshBasicMaterial>(null);
  const antennaMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const fade = sceneState.facadeOpacity;

    if (pulsingMat.current) {
      // skipFade : ce matériau gère lui-même le fade de la façade
      pulsingMat.current.userData.skipFade = true;
      pulsingMat.current.opacity = (0.75 + Math.sin(t * 1.6) * 0.25) * fade;
    }

    if (antennaMat.current) {
      // Feu d'antenne : 2s allumé / 2s éteint, atténué (il ne doit pas
      // voler la vedette), transition adoucie
      antennaMat.current.userData.skipFade = true;
      const on = t % 4 < 2 ? 0.45 : 0.06;
      antennaMat.current.opacity +=
        (on * fade - antennaMat.current.opacity) * 0.12;
    }
  });

  const frontWindows: React.ReactNode[] = [];
  const balconies: React.ReactNode[] = [];
  for (let floor = 0; floor < FLOORS; floor++) {
    for (let col = 0; col < FRONT_COLS; col++) {
      // au rez-de-chaussée, les colonnes centrales laissent place à la porte
      if (floor === 0 && (col === 2 || col === 3)) continue;
      const key = `${floor}-${col}`;
      const lit = LIT.has(key);
      const x = frontWindowX(col);
      const y = floor * FLOOR_H + 0.62;
      const position: [number, number, number] = [x, y, DEPTH / 2 + 0.02];

      if (key === PULSING) {
        frontWindows.push(
          <mesh key={key} position={position}>
            <planeGeometry args={[WIN_W, WIN_H]} />
            <meshBasicMaterial
              ref={pulsingMat}
              color={LIT_GLASS}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      } else {
        frontWindows.push(
          <GlowPlane
            key={key}
            size={[WIN_W, WIN_H]}
            color={lit ? LIT_GLASS : DARK_GLASS}
            opacity={lit ? 1 : 0.9}
            position={position}
          />
        );
      }

      if (BALCONIES.has(key)) {
        balconies.push(
          <WireBox
            key={`b-${key}`}
            size={[WIN_W + 0.18, 0.22, 0.2]}
            position={[x, y - WIN_H / 2 - 0.02, DEPTH / 2 + 0.11]}
            opacity={0.55}
          />
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
            opacity={0.9}
            position={[
              side * (WIDTH / 2 + 0.02),
              floor * FLOOR_H + 0.62,
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
      {/* Volume principal + corniche */}
      <WireBox
        size={[WIDTH, HEIGHT, DEPTH]}
        position={[0, HEIGHT / 2, 0]}
        opacity={0.9}
      />
      <WireBox
        size={[WIDTH + 0.24, 0.14, DEPTH + 0.24]}
        position={[0, HEIGHT + 0.07, 0]}
        opacity={0.7}
      />
      {/* Séparations d'étages */}
      {Array.from({ length: FLOORS - 1 }, (_, i) => (
        <WireBox
          key={i}
          size={[WIDTH, 0.001, DEPTH]}
          position={[0, (i + 1) * FLOOR_H, 0]}
          opacity={0.3}
        />
      ))}
      {/* Pilastres d'angle */}
      {[-1, 1].map((side) => (
        <WireBox
          key={side}
          size={[0.12, HEIGHT, 0.12]}
          position={[side * (WIDTH / 2 + 0.06), HEIGHT / 2, DEPTH / 2 + 0.02]}
          opacity={0.45}
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
        opacity={0.9}
      />
      <WireBox
        size={[0.45, 0.95, 0.02]}
        position={[0.24, 0.48, DEPTH / 2 + 0.02]}
        color="#7c5cff"
        opacity={0.9}
      />
      <GlowPlane
        size={[1.1, 0.04]}
        color="#7c5cff"
        opacity={0.8}
        position={[0, 0.015, DEPTH / 2 + 0.05]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* Auvent au-dessus de l'entrée + sous-face lumineuse */}
      <WireBox
        size={[1.6, 0.06, 0.7]}
        position={[0, 1.06, DEPTH / 2 + 0.35]}
        opacity={0.7}
      />
      <GlowPlane
        size={[1.5, 0.62]}
        color="#4a9eff"
        opacity={0.35}
        position={[0, 1.02, DEPTH / 2 + 0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      {[-0.7, 0.7].map((x) => (
        <WireBox
          key={x}
          size={[0.03, 1.06, 0.03]}
          position={[x, 0.53, DEPTH / 2 + 0.66]}
          opacity={0.5}
        />
      ))}

      {/* Enseigne au-dessus de l'auvent */}
      <GlowPlane
        size={[1.7, 0.12]}
        color="#4a9eff"
        opacity={0.9}
        position={[0, 1.5, DEPTH / 2 + 0.03]}
      />

      {/* Enseigne néon sur le toit */}
      <WireBox
        size={[2.6, 0.45, 0.05]}
        position={[0, HEIGHT + 0.42, 0]}
        opacity={0.7}
      />
      <GlowPlane
        size={[2.4, 0.3]}
        color="#4a9eff"
        opacity={0.85}
        position={[0, HEIGHT + 0.42, 0.04]}
      />

      {/* Toit : édicule technique, unités AC, antenne à feu rouge */}
      <WireBox
        size={[1.2, 0.35, 0.8]}
        position={[-1.1, HEIGHT + 0.175, -0.5]}
        opacity={0.6}
      />
      <WireBox
        size={[0.4, 0.25, 0.4]}
        position={[0.9, HEIGHT + 0.125, -0.7]}
        opacity={0.5}
      />
      <WireBox
        size={[0.4, 0.25, 0.4]}
        position={[1.45, HEIGHT + 0.125, -0.7]}
        opacity={0.5}
      />
      <WireBox
        size={[0.02, 0.9, 0.02]}
        position={[1.5, HEIGHT + 0.45, 0.6]}
        opacity={0.7}
      />
      <mesh position={[1.5, HEIGHT + 0.93, 0.6]}>
        <planeGeometry args={[0.06, 0.06]} />
        <meshBasicMaterial
          ref={antennaMat}
          color="#ff6b6b"
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
