"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { WireBox, GlowPlane } from "./primitives";

// La façade de l'hôtel de nuit : volumes filaires bleu néon, grille de
// fenêtres sombres, quelques-unes allumées (dont une qui pulse doucement).
// Base du bâtiment à y = 0 — le parent (Hotel.tsx) le pose sur le sol.

const FLOORS = 4;
const FLOOR_H = 1.1;
const WIDTH = 4;
const DEPTH = 2.5;
const HEIGHT = FLOORS * FLOOR_H;

const WIN_W = 0.34;
const WIN_H = 0.5;
const FRONT_COLS = 6;
const SIDE_COLS = 3;

// Fenêtres allumées de la façade avant : "étage-colonne"
const LIT = new Set(["1-1", "2-4", "3-2", "0-5"]);
const PULSING = "2-4"; // celle-ci respire

const DARK_GLASS = "#0e1a30";
const LIT_GLASS = "#a8d2ff";

function frontWindowX(col: number) {
  return -WIDTH / 2 + 0.55 + col * ((WIDTH - 1.1) / (FRONT_COLS - 1));
}

export default function Facade() {
  const pulsingMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (!pulsingMat.current) return;
    const t = clock.getElapsedTime();
    pulsingMat.current.opacity = 0.75 + Math.sin(t * 1.6) * 0.25;
  });

  const frontWindows: React.ReactNode[] = [];
  for (let floor = 0; floor < FLOORS; floor++) {
    for (let col = 0; col < FRONT_COLS; col++) {
      // au rez-de-chaussée, les colonnes centrales laissent place à la porte
      if (floor === 0 && (col === 2 || col === 3)) continue;
      const key = `${floor}-${col}`;
      const lit = LIT.has(key);
      const position: [number, number, number] = [
        frontWindowX(col),
        floor * FLOOR_H + 0.62,
        DEPTH / 2 + 0.02,
      ];
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
      {/* Volume principal */}
      <WireBox
        size={[WIDTH, HEIGHT, DEPTH]}
        position={[0, HEIGHT / 2, 0]}
        opacity={0.9}
      />
      {/* Séparations d'étages (rectangles filaires plats) */}
      {Array.from({ length: FLOORS - 1 }, (_, i) => (
        <WireBox
          key={i}
          size={[WIDTH, 0.001, DEPTH]}
          position={[0, (i + 1) * FLOOR_H, 0]}
          opacity={0.35}
        />
      ))}

      {frontWindows}
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

      {/* Enseigne au-dessus de la porte */}
      <GlowPlane
        size={[1.7, 0.12]}
        color="#4a9eff"
        opacity={0.9}
        position={[0, 1.22, DEPTH / 2 + 0.03]}
      />

      {/* Toit : édicule technique + antenne */}
      <WireBox
        size={[1.2, 0.35, 0.8]}
        position={[-0.9, HEIGHT + 0.175, -0.3]}
        opacity={0.6}
      />
      <WireBox
        size={[0.02, 0.9, 0.02]}
        position={[1.3, HEIGHT + 0.45, 0.4]}
        opacity={0.7}
      />
      <GlowPlane
        size={[0.06, 0.06]}
        color="#ff6b6b"
        opacity={0.9}
        position={[1.3, HEIGHT + 0.93, 0.4]}
      />
    </group>
  );
}
