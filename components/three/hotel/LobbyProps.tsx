"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { WireBox, GlowPlane, WireCylinder } from "./primitives";
import { screenHover } from "@/lib/screen-hover";

// Le poste de travail de la réception, enrichi : écran qui respire,
// clavier, lampe de bureau chaude, tasse, stylo, post-it "MEMO" qui pulse
// imperceptiblement (l'appât qui prépare le zoom écran), orbes-lampes
// dorées et vase fleuri sur le comptoir.
// Coordonnées locales au hall (comptoir à z = -1, plateau à y = 1.05).

const AMBER = "#d4a574";
const WARM_WHITE = "#f0e0c0";

export default function LobbyProps() {
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const postItMat = useRef<THREE.MeshBasicMaterial>(null);
  const boost = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // easter egg : au survol de l'écran, la pulsation s'intensifie
    boost.current += (screenHover.boost - boost.current) * 0.08;
    const b = boost.current;
    if (screenMat.current) {
      screenMat.current.opacity =
        0.8 + b * 0.12 + Math.sin(t * (2.2 + b * 2.5)) * (0.2 + b * 0.08);
    }
    if (postItMat.current) {
      postItMat.current.opacity = 0.55 + Math.sin(t * 1.1) * 0.07;
    }
  });

  // Grille de touches du clavier : une seule géométrie de lignes
  const keysGeometry = useMemo(() => {
    const points: number[] = [];
    const w = 0.44;
    const d = 0.13;
    const y = 0.014;
    for (let i = 1; i < 4; i++) {
      const z = -d / 2 + (d / 4) * i;
      points.push(-w / 2, y, z, w / 2, y, z);
    }
    for (let i = 1; i < 10; i++) {
      const x = -w / 2 + (w / 10) * i;
      points.push(x, y, -d / 2, x, y, d / 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return g;
  }, []);

  return (
    <group>
      {/* Écran : pied, dalle qui respire, cadre */}
      <WireBox
        size={[0.04, 0.18, 0.04]}
        position={[0, 1.14, -1.1]}
        opacity={0.8}
      />
      <mesh position={[0, 1.32, -1.1]} rotation={[-0.08, 0, 0]}>
        <planeGeometry args={[0.6, 0.38]} />
        <meshBasicMaterial
          ref={screenMat}
          color="#d6ecff"
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      <WireBox
        size={[0.66, 0.44, 0.03]}
        position={[0, 1.32, -1.11]}
        rotation={[-0.08, 0, 0]}
        opacity={0.9}
      />

      {/* Post-it "MEMO" au coin de l'écran : jaune-vert, pulse doucement */}
      <group position={[0.31, 1.46, -1.07]} rotation={[-0.08, 0, 0.1]}>
        <mesh>
          <planeGeometry args={[0.09, 0.09]} />
          <meshBasicMaterial
            ref={postItMat}
            color="#cbd075"
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
        {[0.02, 0, -0.02].map((y) => (
          <GlowPlane
            key={y}
            size={[0.05, 0.004]}
            color="#3a3f22"
            opacity={0.8}
            position={[0, y, 0.002]}
          />
        ))}
      </group>

      {/* Clavier : socle + grille de touches */}
      <WireBox
        size={[0.5, 0.02, 0.16]}
        position={[0, 1.065, -0.86]}
        opacity={0.7}
      />
      <lineSegments geometry={keysGeometry} position={[0, 1.065, -0.86]}>
        <lineBasicMaterial color="#4a9eff" transparent opacity={0.35} />
      </lineSegments>

      {/* Lampe de bureau : socle, bras articulé, tête coudée, halo chaud */}
      <group position={[-0.75, 1.05, -1.05]}>
        <WireCylinder
          radius={0.07}
          height={0.02}
          position={[0, 0.01, 0]}
          opacity={0.7}
        />
        <WireBox
          size={[0.02, 0.32, 0.02]}
          position={[0.05, 0.17, 0]}
          rotation={[0, 0, -0.35]}
          opacity={0.7}
        />
        <WireBox
          size={[0.02, 0.26, 0.02]}
          position={[0.16, 0.4, 0]}
          rotation={[0, 0, 0.6]}
          opacity={0.7}
        />
        <WireBox
          size={[0.12, 0.05, 0.09]}
          position={[0.24, 0.47, 0]}
          rotation={[0, 0, 0.25]}
          opacity={0.8}
        />
        <GlowPlane
          size={[0.09, 0.05]}
          color={WARM_WHITE}
          opacity={0.9}
          position={[0.24, 0.44, 0]}
          rotation={[Math.PI / 2 - 0.3, 0, 0]}
        />
        <mesh position={[0.24, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.22, 20]} />
          <meshBasicMaterial
            color={AMBER}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Tasse de café (anse comprise) + stylo posé */}
      <group position={[0.42, 1.05, -0.82]}>
        <WireCylinder
          radius={0.035}
          height={0.08}
          position={[0, 0.04, 0]}
          opacity={0.65}
        />
        <WireBox
          size={[0.02, 0.045, 0.015]}
          position={[0.05, 0.04, 0]}
          opacity={0.55}
        />
      </group>
      <WireBox
        size={[0.012, 0.14, 0.012]}
        position={[0.56, 1.06, -0.9]}
        rotation={[0, 0.4, 1.45]}
        opacity={0.6}
      />

      {/* Orbes-lampes dorées aux extrémités du comptoir */}
      {[-1.05, 1.05].map((x) => (
        <group key={x} position={[x, 1.05, -1.02]}>
          <WireCylinder
            radius={0.045}
            height={0.03}
            position={[0, 0.015, 0]}
            color={AMBER}
            opacity={0.6}
          />
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.07, 16, 12]} />
            <meshBasicMaterial color={WARM_WHITE} transparent opacity={0.85} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.12, 16, 12]} />
            <meshBasicMaterial
              color={AMBER}
              transparent
              opacity={0.18}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {/* Vase filaire + fleurs stylisées (3 tiges, pointes lumineuses) */}
      <group position={[0.82, 1.05, -1.12]}>
        <WireCylinder
          radius={0.05}
          height={0.22}
          position={[0, 0.11, 0]}
          opacity={0.65}
        />
        {[
          { tilt: -0.3, h: 0.32 },
          { tilt: 0.05, h: 0.38 },
          { tilt: 0.35, h: 0.3 },
        ].map((stem, i) => (
          <group key={i} position={[0, 0.2, 0]} rotation={[0, 0, stem.tilt]}>
            <WireBox
              size={[0.006, stem.h, 0.006]}
              position={[0, stem.h / 2, 0]}
              color="#8fd4c8"
              opacity={0.5}
            />
            <GlowPlane
              size={[0.035, 0.035]}
              color="#b892ff"
              opacity={0.8}
              position={[0, stem.h + 0.02, 0]}
            />
          </group>
        ))}
      </group>
    </group>
  );
}
