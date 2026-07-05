"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

// Le cerveau neuronal de l'agent : nuage de points en forme de cerveau
// (deux hémisphères séparés par une fissure, relief plissé) relié par des
// connexions dont certaines s'illuminent en impulsions — l'IA qui pense,
// littéralement. 100% procédural, rendu dans son propre mini-canvas.
// intensity 0-1 : fréquence des impulsions (réflexion intense vs rédaction).

const NEURONS = 320;
const MAX_LINKS = 260;
const LINK_DIST = 0.42;

const DIM = new THREE.Color("#25476f");
const BRIGHT = new THREE.Color("#bfe0ff");
const VIOLET = new THREE.Color("#a78bff");
const RED = new THREE.Color("#ff5b5b");

function brainPoint(): THREE.Vector3 {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const v = new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta)
  );
  // relief plissé (pseudo-bruit de sinus superposés)
  const wrinkle =
    0.5 * Math.sin(5 * v.x + 1.1) +
    0.3 * Math.sin(7 * v.y + 2.3) +
    0.2 * Math.sin(6 * v.z + 4.2);
  v.multiplyScalar(0.92 + wrinkle * 0.07 + Math.random() * 0.04);
  // anatomie : plus large que haut, fissure centrale, base aplatie
  v.x *= 1.2;
  v.y *= 0.82;
  v.z *= 1.05;
  v.x += Math.sign(v.x) * 0.07;
  if (v.y < -0.35) v.y = -0.35 - (Math.abs(v.y) - 0.35) * 0.4;
  return v;
}

type Link = {
  a: number;
  b: number;
  phase: number;
  speed: number;
  violet: boolean;
  /** position 0→1 de la connexion dans la vague d'écriture (balayage
      gauche → droite du cerveau, avec un peu de désordre organique) */
  order: number;
};

function BrainMesh({
  intensity,
  activity,
}: {
  intensity: number;
  activity: number;
}) {
  const group = useRef<THREE.Group>(null);
  const linkGeometry = useRef<THREE.BufferGeometry>(null);
  const color = useRef(new THREE.Color());

  const data = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < NEURONS; i++) pts.push(brainPoint());

    const positions = new Float32Array(NEURONS * 3);
    pts.forEach((p, i) => positions.set([p.x, p.y, p.z], i * 3));

    // connexions : paires de neurones voisins
    const links: Link[] = [];
    outer: for (let i = 0; i < NEURONS; i++) {
      for (let j = i + 1; j < NEURONS; j++) {
        if (pts[i].distanceTo(pts[j]) < LINK_DIST && Math.random() < 0.35) {
          const midX = (pts[i].x + pts[j].x) / 2;
          const spatial = Math.min(1, Math.max(0, (midX + 1.35) / 2.7));
          links.push({
            a: i,
            b: j,
            phase: Math.random() * Math.PI * 2,
            speed: 0.7 + Math.random() * 1.6,
            violet: Math.random() < 0.15,
            order: spatial * 0.85 + Math.random() * 0.15,
          });
          if (links.length >= MAX_LINKS) break outer;
        }
      }
    }

    const linkPositions = new Float32Array(links.length * 6);
    links.forEach((l, i) => {
      linkPositions.set(
        [pts[l.a].x, pts[l.a].y, pts[l.a].z, pts[l.b].x, pts[l.b].y, pts[l.b].z],
        i * 6
      );
    });
    const linkColors = new Float32Array(links.length * 6);

    return { positions, links, linkPositions, linkColors };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (group.current) {
      group.current.rotation.y = t * 0.25;
      const breath = 1 + Math.sin(t * 1.8) * 0.015 * (0.5 + intensity);
      group.current.scale.setScalar(breath);
    }

    // impulsions : chaque connexion flashe selon sa phase, d'autant plus
    // vite que l'agent réfléchit fort
    const geo = linkGeometry.current;
    if (!geo) return;
    const attr = geo.attributes.color as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const speedMul = 0.6 + intensity * 1.6;
    const c = color.current;

    // vague ROUGE synchronisée avec l'écriture de la réponse (activity =
    // progression du typewriter, pilotée par le scroll) : un front
    // d'impulsions balaye le cerveau, position = avancement du texte
    const waving = activity > 0.001 && activity < 0.999;

    data.links.forEach((link, i) => {
      const flash = Math.pow(
        Math.max(0, Math.sin(t * link.speed * speedMul + link.phase)),
        8
      );
      c.copy(DIM).lerp(link.violet ? VIOLET : BRIGHT, flash);
      if (waving) {
        // gaussienne centrée sur le front + scintillement rapide
        const distance = (link.order - activity) * 7;
        const wave =
          Math.exp(-distance * distance) *
          (0.75 + 0.25 * Math.sin(t * 9 + link.phase * 3));
        c.lerp(RED, Math.min(1, wave));
      }
      arr[i * 6] = c.r;
      arr[i * 6 + 1] = c.g;
      arr[i * 6 + 2] = c.b;
      arr[i * 6 + 3] = c.r;
      arr[i * 6 + 4] = c.g;
      arr[i * 6 + 5] = c.b;
    });
    attr.needsUpdate = true;
  });

  return (
    <group ref={group}>
      {/* les neurones */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#7fb3ef"
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      {/* les connexions synaptiques (couleurs animées par vertex) */}
      <lineSegments>
        <bufferGeometry ref={linkGeometry}>
          <bufferAttribute
            attach="attributes-position"
            args={[data.linkPositions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[data.linkColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.9} />
      </lineSegments>
    </group>
  );
}

export default function Brain({
  intensity = 0.5,
  activity = 0,
}: {
  intensity?: number;
  /** 0→1 : progression de l'écriture de la réponse (vague rouge synchro) */
  activity?: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.25, 2.9], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
    >
      <BrainMesh intensity={intensity} activity={activity} />
    </Canvas>
  );
}
