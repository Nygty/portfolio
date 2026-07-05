"use client";

import { Grid } from "@react-three/drei";

// Ambiance de la scène : brouillard assorti au fond du site, lumières,
// et grille en perspective infinie sous le noyau (cyberspace discret —
// couleurs volontairement très sombres, le fog mange l'horizon).
export default function Environment() {
  return (
    <>
      <fog attach="fog" args={["#05060a", 6, 14]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 4]} intensity={12} color="#4a9eff" />
      <pointLight position={[-4, -2, -4]} intensity={8} color="#7c5cff" />

      <Grid
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
      />
    </>
  );
}
