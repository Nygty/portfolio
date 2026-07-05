"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import Facade from "./hotel/Facade";
import Lobby from "./hotel/Lobby";
import { sceneState } from "@/lib/scroll-timeline";
import { useIsMobile } from "@/lib/use-media";

// La façade s'estompe quand la caméra la traverse (sceneState.facadeOpacity).
// Chaque matériau garde son opacité d'origine en mémoire (userData) et est
// multiplié par le fade. Les matériaux marqués skipFade (fenêtre qui pulse)
// gèrent leur fade eux-mêmes.
function FadingFacade() {
  const group = useRef<THREE.Group>(null);
  const applied = useRef(-1);
  const isMobile = useIsMobile();

  useFrame(() => {
    const f = sceneState.facadeOpacity;
    if (!group.current || Math.abs(f - applied.current) < 0.001) return;
    applied.current = f;
    group.current.visible = f > 0.001;
    group.current.traverse((obj) => {
      const mat = (obj as THREE.Mesh).material as THREE.Material | undefined;
      if (!mat || !("opacity" in mat) || mat.userData.skipFade) return;
      if (mat.userData.baseOpacity === undefined) {
        mat.userData.baseOpacity = mat.opacity;
      }
      mat.opacity = (mat.userData.baseOpacity as number) * f;
    });
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
export default function Hotel() {
  return (
    <group position={[0, -2.4, 0]}>
      <FadingFacade />
      <Lobby />
      {/* Zoom écran + simulation : étape 3 */}
    </group>
  );
}
