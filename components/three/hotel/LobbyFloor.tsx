"use client";

import { useMemo } from "react";
import * as THREE from "three";

// Dallage du hall : grille filaire + damier subtil (un carreau sur deux
// légèrement teinté). Une seule géométrie fusionnée par couche —
// 2 draw calls pour 72 carreaux.

const W = 9;
const D = 8;
const TILE = 1;

export default function LobbyFloor() {
  const gridGeometry = useMemo(() => {
    const points: number[] = [];
    for (let x = -W / 2; x <= W / 2; x += TILE) {
      points.push(x, 0.012, -D / 2, x, 0.012, D / 2);
    }
    for (let z = -D / 2; z <= D / 2; z += TILE) {
      points.push(-W / 2, 0.012, z, W / 2, 0.012, z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return g;
  }, []);

  const checkerGeometry = useMemo(() => {
    const positions: number[] = [];
    const y = 0.008;
    for (let i = 0; i < W / TILE; i++) {
      for (let j = 0; j < D / TILE; j++) {
        if ((i + j) % 2 === 0) continue;
        const x0 = -W / 2 + i * TILE + 0.04;
        const z0 = -D / 2 + j * TILE + 0.04;
        const x1 = x0 + TILE - 0.08;
        const z1 = z0 + TILE - 0.08;
        positions.push(x0, y, z0, x1, y, z0, x1, y, z1);
        positions.push(x0, y, z0, x1, y, z1, x0, y, z1);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  return (
    <group>
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial color="#23406b" transparent opacity={0.4} />
      </lineSegments>
      <mesh geometry={checkerGeometry}>
        <meshBasicMaterial
          color="#0f1c33"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
