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
  // segments plafonnés à 8 : suffisant en filaire, moitié moins de lignes
  const capped = Math.min(8, segments);
  const geometry = useMemo(
    () =>
      new THREE.EdgesGeometry(
        new THREE.CylinderGeometry(radius, radius, height, capped)
      ),
    [radius, height, capped]
  );
  return (
    <lineSegments position={position} rotation={rotation} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}

/** Fusion de boîtes filaires en UNE seule géométrie (1 draw call).
    Pour tous les éléments répétés statiques : fenêtres de structure,
    séparations d'étages, balcons, poutres… Le tableau `boxes` doit être
    stable (module-level ou useMemo côté appelant). */
export function WireBoxes({
  boxes,
  color = "#4a9eff",
  opacity = 0.5,
}: {
  boxes: { size: Vec3; position: Vec3 }[];
  color?: string;
  opacity?: number;
}) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    boxes.forEach((b) => {
      const box = new THREE.BoxGeometry(...b.size);
      const edges = new THREE.EdgesGeometry(box);
      const arr = edges.attributes.position.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        positions.push(
          arr[i] + b.position[0],
          arr[i + 1] + b.position[1],
          arr[i + 2] + b.position[2]
        );
      }
      box.dispose();
      edges.dispose();
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, [boxes]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}

/** Fusion de plans émissifs en UNE seule géométrie (1 draw call).
    rotY : plan vertical tourné. horizontal : plan posé à plat. */
export function GlowQuads({
  quads,
  color = "#a8d2ff",
  opacity = 1,
}: {
  quads: {
    position: Vec3;
    size: [number, number];
    rotY?: number;
    horizontal?: boolean;
  }[];
  color?: string;
  opacity?: number;
}) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    quads.forEach((q) => {
      const [cx, cy, cz] = q.position;
      const [w, h] = q.size;
      const rot = q.rotY ?? 0;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      // vecteurs demi-largeur / demi-hauteur selon l'orientation
      const rx = cos * (w / 2);
      const rz = -sin * (w / 2);
      const ux = q.horizontal ? sin * (h / 2) : 0;
      const uy = q.horizontal ? 0 : h / 2;
      const uz = q.horizontal ? cos * (h / 2) : 0;
      const corners = [
        [cx - rx - ux, cy - uy, cz - rz - uz],
        [cx + rx - ux, cy - uy, cz + rz - uz],
        [cx + rx + ux, cy + uy, cz + rz + uz],
        [cx - rx + ux, cy + uy, cz - rz + uz],
      ];
      const [a, b, c, d] = corners;
      positions.push(...a, ...b, ...c, ...a, ...c, ...d);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, [quads]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
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
