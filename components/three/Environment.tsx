"use client";

import { Grid } from "@react-three/drei";

// Ambiance de la scène : brouillard assorti au fond du site, lumières,
// et grille en perspective infinie sous le noyau (cyberspace discret —
// couleurs volontairement très sombres, le fog mange l'horizon).
// showGrid={false} sur mobile : la grille est ce qui coûte le plus à dessiner.
export default function Environment({ showGrid = true }: { showGrid?: boolean }) {
  return (
    <>
      {/* Caméra désormais à ~10 unités de la façade : le fog démarre plus loin */}
      <fog attach="fog" args={["#05060a", 9, 30]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 4]} intensity={12} color="#4a9eff" />
      <pointLight position={[-4, -2, -4]} intensity={8} color="#7c5cff" />

      {showGrid && <Grid
        position={[0, -2.4, 0]}
        infiniteGrid
        cellSize={0.7}
        cellThickness={0.6}
        cellColor="#141d30"
        sectionSize={3.5}
        sectionThickness={1}
        sectionColor="#23406b"
        fadeDistance={28}
        fadeStrength={2.5}
      />}
    </>
  );
}
