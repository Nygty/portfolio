"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import Facade from "./hotel/Facade";
import Lobby from "./hotel/Lobby";
import DustParticles from "./DustParticles";
import { sceneState } from "@/lib/scroll-timeline";
import { useIsMobile } from "@/lib/use-media";

// La façade s'estompe quand la caméra la traverse (sceneState.facadeOpacity).
// Chaque matériau garde son opacité d'origine en mémoire (userData) et est
// multiplié par le fade. Les matériaux marqués skipFade (fenêtre qui pulse)
// gèrent leur fade eux-mêmes.
function FadingFacade() {
  const group = useRef<THREE.Group>(null);
  const applied = useRef(-1);
  const materials = useRef<THREE.Material[] | null>(null);
  const isMobile = useIsMobile();

  useFrame(() => {
    const f = sceneState.facadeOpacity;
    if (!group.current || Math.abs(f - applied.current) < 0.001) return;
    applied.current = f;
    group.current.visible = f > 0.001;
    // la liste des matériaux à fader est stable : on ne traverse qu'une fois
    if (!materials.current) {
      const list: THREE.Material[] = [];
      group.current.traverse((obj) => {
        const mat = (obj as THREE.Mesh).material as THREE.Material | undefined;
        if (!mat || !("opacity" in mat) || mat.userData.skipFade) return;
        mat.userData.baseOpacity = mat.opacity;
        list.push(mat);
      });
      materials.current = list;
    }
    for (const mat of materials.current) {
      mat.opacity = (mat.userData.baseOpacity as number) * f;
    }
  });

  return (
    <group ref={group}>
      <Facade />
      {/* Sol miroir : le bâtiment inversé sous le sol, très atténué —
          effet marbre poli. Desktop uniquement (coût de rendu doublé). */}
      {!isMobile && (
        <group scale={[1, -1, 1]}>
          <Facade reflection />
        </group>
      )}
    </group>
  );
}

// L'hôtel complet, posé sur la grille du sol (y = -2.4).
// La caméra voyage de la façade vers le hall au fil du scroll.
export default function Hotel({ dust = true }: { dust?: boolean }) {
  return (
    <group position={[0, -2.4, 0]}>
      <FadingFacade />
      <Lobby />
      {dust && <DustParticles />}
    </group>
  );
}
