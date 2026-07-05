"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/scroll-timeline";

// Le "Noyau Concierge" : sphère de particules qui respire, cœur lumineux,
// anneaux orbitaux. Piloté par sceneState (écrit par GSAP au scroll) :
// - déplacement / échelle / recul dans la profondeur,
// - fragmentation 0 → 1 : les particules migrent vers 3 groupes distincts
//   (un par carte de la section "En 3 étapes"), puis se reforment.

const PARTICLE_COUNT = 4000;
const PARTICLE_COUNT_MOBILE = 1200;
const RADIUS = 1.3;

// Centres des 3 groupes une fois le noyau fragmenté (alignés sur les 3 cartes)
const CLUSTERS = [
  new THREE.Vector3(-2.3, 0.4, 0),
  new THREE.Vector3(0, 0.15, 0.3),
  new THREE.Vector3(2.3, 0.4, 0),
];
const FRAGMENT_SCALE = 0.48; // taille d'un groupe par rapport au noyau entier

const ACCENT = new THREE.Color("#4a9eff");
const ACCENT_HOT = new THREE.Color("#7c5cff");
const TWO_PI = Math.PI * 2;

type SignatureProps = {
  /** Mobile : moins de particules, noyau réduit centré, pas de chorégraphie scroll. */
  simple?: boolean;
  /** prefers-reduced-motion : aucune animation, pose figée. */
  frozen?: boolean;
};

export default function Signature({
  simple = false,
  frozen = false,
}: SignatureProps) {
  const count = simple ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT;
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const geometry = useRef<THREE.BufferGeometry>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringAMat = useRef<THREE.MeshBasicMaterial>(null);
  const ringBMat = useRef<THREE.MeshBasicMaterial>(null);
  const lastFragmentation = useRef(-1);

  // Trois tableaux calculés une seule fois :
  // - sphere : position de chaque particule dans le noyau entier
  // - fragmented : sa position cible dans son groupe (1 particule sur 3 par groupe)
  // - current : copie de travail affichée à l'écran (mutée à chaque frame de morph)
  const { sphere, fragmented, current, colors } = useMemo(() => {
    const sphere = new Float32Array(count * 3);
    const fragmented = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Point aléatoire sur la sphère, léger relief organique
      const theta = TWO_PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = RADIUS * (0.95 + Math.random() * 0.1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      sphere[i * 3] = x;
      sphere[i * 3 + 1] = y;
      sphere[i * 3 + 2] = z;

      // Même forme en miniature autour du centre de son groupe
      const c = CLUSTERS[i % 3];
      fragmented[i * 3] = c.x + x * FRAGMENT_SCALE;
      fragmented[i * 3 + 1] = c.y + y * FRAGMENT_SCALE;
      fragmented[i * 3 + 2] = c.z + z * FRAGMENT_SCALE;

      // Dégradé bleu → violet selon la hauteur
      color.lerpColors(ACCENT, ACCENT_HOT, (y / RADIUS + 1) / 2);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { sphere, fragmented, current: sphere.slice(), colors };
  }, [count]);

  // Géométrie reconstruite (passage desktop ↔ mobile) : le morph doit
  // être recalculé au prochain frame
  useEffect(() => {
    lastFragmentation.current = -1;
  }, [count]);

  useFrame(({ clock }, delta) => {
    // Reduced motion : pose figée, rien ne bouge
    if (frozen) return;

    const t = clock.getElapsedTime();

    // Mobile : simple rotation + respiration, noyau réduit et centré,
    // pas de scroll-3D
    if (simple) {
      const breath = 1 + Math.sin(t * 0.7) * 0.035;
      if (group.current) {
        group.current.scale.setScalar(0.72 * breath);
        group.current.position.set(0, 0, 0);
      }
      if (inner.current) inner.current.rotation.y += delta * 0.12;
      if (ringA.current) ringA.current.rotation.y += delta * 0.25;
      if (ringB.current) ringB.current.rotation.y -= delta * 0.18;
      return;
    }

    const f = sceneState.fragmentation;

    if (group.current) {
      const breath = 1 + Math.sin(t * 0.7) * 0.035;
      group.current.scale.setScalar(breath * sceneState.scale);
      group.current.position.set(sceneState.x, sceneState.y, sceneState.z);
    }

    if (inner.current) {
      // La rotation ralentit et se réaligne pendant la fragmentation,
      // pour que les 3 groupes restent en face de leurs cartes
      inner.current.rotation.y += delta * sceneState.spin * (1 - f);
      if (f > 0.001) {
        const aligned = Math.round(inner.current.rotation.y / TWO_PI) * TWO_PI;
        inner.current.rotation.y +=
          (aligned - inner.current.rotation.y) * 0.12 * f;
      }
    }

    // Morph sphère ↔ 3 groupes — recalculé seulement quand la valeur bouge
    if (geometry.current && Math.abs(f - lastFragmentation.current) > 0.0005) {
      lastFragmentation.current = f;
      const attr = geometry.current.attributes
        .position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < arr.length; i++) {
        arr[i] = sphere[i] + (fragmented[i] - sphere[i]) * f;
      }
      attr.needsUpdate = true;
    }

    // Le cœur lumineux s'éteint quand le noyau éclate, se rallume après
    if (core.current) {
      core.current.scale.setScalar(Math.max(0.001, 1 - f));
    }

    // Anneaux : précession lente, fondu pendant la fragmentation
    if (ringA.current) ringA.current.rotation.y += delta * 0.25;
    if (ringB.current) ringB.current.rotation.y -= delta * 0.18;
    if (ringAMat.current) ringAMat.current.opacity = 0.35 * (1 - f);
    if (ringBMat.current) ringBMat.current.opacity = 0.22 * (1 - f);
  });

  return (
    <group ref={group}>
      <group ref={inner}>
        {/* key={count} : reconstruit proprement la géométrie si on passe
            de la version desktop à la version mobile (ou l'inverse) */}
        <points key={count}>
          <bufferGeometry ref={geometry}>
            <bufferAttribute attach="attributes-position" args={[current, 3]} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={simple ? 0.028 : 0.022}
            vertexColors
            transparent
            opacity={0.9}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      {/* Cœur lumineux : halo diffus + noyau brillant */}
      <group ref={core}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshBasicMaterial
            color="#4a9eff"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshBasicMaterial color="#cfe3ff" transparent opacity={0.85} />
        </mesh>
      </group>

      {/* Anneaux orbitaux, très fins, en précession lente */}
      <mesh ref={ringA} rotation={[1.15, 0, 0.2]}>
        <torusGeometry args={[1.75, 0.006, 8, 160]} />
        <meshBasicMaterial
          ref={ringAMat}
          color="#4a9eff"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ringB} rotation={[-0.9, 0.4, 0]}>
        <torusGeometry args={[2.05, 0.005, 8, 160]} />
        <meshBasicMaterial
          ref={ringBMat}
          color="#7c5cff"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
