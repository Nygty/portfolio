"use client";

// Ambiance de la scène : brouillard assorti au fond du site + lumières.
// La grille en perspective arrivera à l'étape 5.
export default function Environment() {
  return (
    <>
      <fog attach="fog" args={["#05060a", 6, 14]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 4]} intensity={12} color="#4a9eff" />
      <pointLight position={[-4, -2, -4]} intensity={8} color="#7c5cff" />
    </>
  );
}
