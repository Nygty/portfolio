"use client";

import Facade from "./hotel/Facade";

// L'hôtel complet, posé sur la grille du sol (y = -2.4).
// Chaque lieu est un "plateau de tournage" à ses propres coordonnées ;
// la caméra voyagera de l'un à l'autre au fil du scroll (étape 2+).
export default function Hotel() {
  return (
    <group position={[0, -2.4, 0]}>
      <Facade />
      {/* Hall + ordinateur de réception : étape 2 */}
    </group>
  );
}
