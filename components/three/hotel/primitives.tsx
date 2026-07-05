"use client";

import { useMemo } from "react";
import * as THREE from "three";

// Briques de base du style "blueprint néon" : tout l'hôtel est construit
// avec ces deux primitives — des arêtes lumineuses et des plans émissifs.

type Vec3 = [number, number, number];

/** Boîte filaire : seules les arêtes sont dessinées, en ligne néon. */
export function WireBox({
  size,
  color = "#4a9eff",
  opacity = 0.85,
  position,
  rotation,
}: {
  size: Vec3;
  color?: string;
  opacity?: number;
  position?: Vec3;
  rotation?: Vec3;
}) {
  const [w, h, d] = size;
  const geometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)),
    [w, h, d]
  );
  return (
    <lineSegments position={position} rotation={rotation} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}

/** Cylindre filaire : tasse, vase, pot de plante… */
export function WireCylinder({
  radius,
  height,
  color = "#4a9eff",
  opacity = 0.7,
  segments = 10,
  position,
  rotation,
}: {
  radius: number;
  height: number;
  color?: string;
  opacity?: number;
  segments?: number;
  position?: Vec3;
  rotation?: Vec3;
}) {
  const geometry = useMemo(
    () =>
      new THREE.EdgesGeometry(
        new THREE.CylinderGeometry(radius, radius, height, segments)
      ),
    [radius, height, segments]
  );
  return (
    <lineSegments position={position} rotation={rotation} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}

/** Plan émissif : fenêtre allumée, écran, enseigne… (les foyers de lumière). */
export function GlowPlane({
  size,
  color = "#a8d2ff",
  opacity = 1,
  position,
  rotation,
}: {
  size: [number, number];
  color?: string;
  opacity?: number;
  position?: Vec3;
  rotation?: Vec3;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
