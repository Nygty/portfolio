"use client";

import dynamic from "next/dynamic";

// Charge la scène 3D uniquement dans le navigateur (ssr: false) et en
// différé : le contenu HTML s'affiche immédiatement, la 3D arrive juste après.
// Next.js impose que ce dynamic() vive dans un composant client, d'où ce fichier.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function SceneLoader() {
  return <Scene />;
}
