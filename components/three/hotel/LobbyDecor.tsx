"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { WireBox, GlowPlane, WireCylinder } from "./primitives";

// Décor du hall : murs latéraux rythmés, miroirs muraux, horloge à
// l'heure réelle du navigateur, plantes stylisées, canapé d'accueil,
// tableau abstrait lumineux, éventails Art Déco dorés (référence luxe).

const W = 9;
const D = 8;
const H = 3.4;
const AMBER = "#d4a574";

// Éventail Art Déco : rayons + arc en corde, une seule géométrie de lignes
function ArtDecoFan({
  position,
  radius = 0.5,
}: {
  position: [number, number, number];
  radius?: number;
}) {
  const geometry = useMemo(() => {
    const points: number[] = [];
    const rays = 7;
    let prev: [number, number] | null = null;
    for (let i = 0; i < rays; i++) {
      const angle = Math.PI / 6 + (i * ((Math.PI * 2) / 3)) / (rays - 1);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      points.push(0, 0, 0, x, y, 0);
      if (prev) points.push(prev[0], prev[1], 0, x, y, 0);
      prev = [x, y];
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return g;
  }, [radius]);

  return (
    <lineSegments geometry={geometry} position={position}>
      <lineBasicMaterial color={AMBER} transparent opacity={0.35} />
    </lineSegments>
  );
}

// Horloge filaire : cadran + 12 marques + aiguilles à l'heure réelle
function WallClock({ position }: { position: [number, number, number] }) {
  const hourHand = useRef<THREE.Group>(null);
  const minuteHand = useRef<THREE.Group>(null);

  const faceGeometry = useMemo(() => {
    const points: number[] = [];
    const R = 0.28;
    const SEG = 40;
    for (let i = 0; i < SEG; i++) {
      const a1 = (i / SEG) * Math.PI * 2;
      const a2 = ((i + 1) / SEG) * Math.PI * 2;
      points.push(
        Math.cos(a1) * R,
        Math.sin(a1) * R,
        0,
        Math.cos(a2) * R,
        Math.sin(a2) * R,
        0
      );
    }
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      points.push(
        Math.cos(a) * (R - 0.045),
        Math.sin(a) * (R - 0.045),
        0,
        Math.cos(a) * R,
        Math.sin(a) * R,
        0
      );
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return g;
  }, []);

  useFrame(() => {
    const now = new Date();
    const minutes = now.getMinutes() + now.getSeconds() / 60;
    const hours = (now.getHours() % 12) + minutes / 60;
    if (minuteHand.current) {
      minuteHand.current.rotation.z = -(minutes / 60) * Math.PI * 2;
    }
    if (hourHand.current) {
      hourHand.current.rotation.z = -(hours / 12) * Math.PI * 2;
    }
  });

  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <lineSegments geometry={faceGeometry}>
        <lineBasicMaterial color="#4a9eff" transparent opacity={0.6} />
      </lineSegments>
      <group ref={hourHand}>
        <GlowPlane
          size={[0.016, 0.14]}
          color="#a8d2ff"
          opacity={0.8}
          position={[0, 0.07, 0.005]}
        />
      </group>
      <group ref={minuteHand}>
        <GlowPlane
          size={[0.012, 0.2]}
          color="#a8d2ff"
          opacity={0.7}
          position={[0, 0.1, 0.005]}
        />
      </group>
    </group>
  );
}

export default function LobbyDecor() {
  return (
    <group>
      {/* Cadres verticaux des murs latéraux */}
      {[-1, 1].flatMap((side) =>
        [-2.4, -0.8, 0.8, 2.4].map((z) => (
          <WireBox
            key={`${side}-${z}`}
            size={[0.02, H, 0.02]}
            position={[side * (W / 2 - 0.03), H / 2, z]}
            opacity={0.3}
          />
        ))
      )}

      {/* Miroirs muraux : cadre filaire + panneau légèrement lumineux */}
      {[
        { x: -W / 2 + 0.06, z: -1.6, ry: Math.PI / 2 },
        { x: W / 2 - 0.06, z: 0.2, ry: -Math.PI / 2 },
      ].map((mirror, i) => (
        <group
          key={i}
          position={[mirror.x, 1.6, mirror.z]}
          rotation={[0, mirror.ry, 0]}
        >
          <WireBox size={[0.74, 1.7, 0.03]} opacity={0.55} />
          <GlowPlane
            size={[0.62, 1.56]}
            color="#1d3050"
            opacity={0.55}
            position={[0, 0, 0.02]}
          />
          {/* reflet diagonal suggéré */}
          <GlowPlane
            size={[0.05, 1.4]}
            color="#4a9eff"
            opacity={0.22}
            position={[-0.16, 0, 0.03]}
            rotation={[0, 0, 0.18]}
          />
        </group>
      ))}

      {/* Horloge murale à l'heure réelle */}
      <WallClock position={[-W / 2 + 0.06, 2.35, 1.8]} />

      {/* Tableau abstrait lumineux (mur droit) */}
      <group position={[W / 2 - 0.06, 1.9, -2.2]} rotation={[0, -Math.PI / 2, 0]}>
        <WireBox size={[1.3, 0.9, 0.04]} opacity={0.7} />
        <GlowPlane
          size={[0.7, 0.05]}
          color="#4a9eff"
          opacity={0.9}
          position={[-0.15, 0.18, 0.03]}
          rotation={[0, 0, -0.35]}
        />
        <GlowPlane
          size={[0.5, 0.04]}
          color="#7c5cff"
          opacity={0.85}
          position={[0.2, -0.05, 0.03]}
          rotation={[0, 0, 0.5]}
        />
        <GlowPlane
          size={[0.35, 0.035]}
          color={AMBER}
          opacity={0.8}
          position={[-0.25, -0.22, 0.03]}
        />
      </group>

      {/* Canapé d'accueil (côté droit, face au coin salon existant) */}
      <group position={[3.2, 0, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <WireBox size={[1.9, 0.32, 0.75]} position={[0, 0.16, 0]} opacity={0.55} />
        <WireBox
          size={[1.9, 0.5, 0.1]}
          position={[0, 0.55, -0.32]}
          opacity={0.55}
        />
        {[-0.62, 0, 0.62].map((x) => (
          <WireBox
            key={x}
            size={[0.56, 0.13, 0.6]}
            position={[x, 0.38, 0.03]}
            opacity={0.45}
          />
        ))}
      </group>

      {/* Plantes stylisées dans les coins du fond */}
      {[
        [-W / 2 + 0.7, -D / 2 + 0.7],
        [W / 2 - 0.7, -D / 2 + 0.7],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <WireCylinder
            radius={0.18}
            height={0.3}
            position={[0, 0.15, 0]}
            opacity={0.5}
          />
          {[
            { tilt: -0.35, h: 0.75 },
            { tilt: -0.12, h: 0.95 },
            { tilt: 0.15, h: 0.85 },
            { tilt: 0.4, h: 0.7 },
          ].map((stem, j) => (
            <group
              key={j}
              position={[0, 0.28, 0]}
              rotation={[0, j * 1.4, stem.tilt]}
            >
              <WireBox
                size={[0.008, stem.h, 0.008]}
                position={[0, stem.h / 2, 0]}
                color="#5bbfae"
                opacity={0.45}
              />
              {/* feuille : triangle (cercle à 3 segments) */}
              <mesh position={[0, stem.h, 0]} rotation={[0, 0, 0.5]}>
                <circleGeometry args={[0.07, 3]} />
                <meshBasicMaterial
                  color="#5bbfae"
                  transparent
                  opacity={0.35}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Éventails Art Déco dorés, mur du fond */}
      <ArtDecoFan position={[-2.4, 1.7, -D / 2 + 0.04]} />
      <ArtDecoFan position={[2.4, 1.7, -D / 2 + 0.04]} radius={0.6} />
      <ArtDecoFan position={[-2.4, 2.45, -D / 2 + 0.04]} radius={0.35} />
      <ArtDecoFan position={[2.4, 2.55, -D / 2 + 0.04]} radius={0.35} />
    </group>
  );
}
