"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Charge la scène 3D uniquement dans le navigateur (ssr: false).
// Next.js impose que ce dynamic() vive dans un composant client, d'où ce fichier.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function SceneLoader() {
  const [ready, setReady] = useState(false);

  // On attend que le navigateur soit inactif avant de démarrer la 3D :
  // le contenu s'affiche instantanément, Three.js ne bloque jamais le
  // chargement (Lighthouse TBT). Fallback timeout pour Safari (pas de rIC).
  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), {
        timeout: 1500,
      });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setReady(true), 350);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;

  // Fondu d'apparition : la scène arrive en douceur, pas d'un coup
  return (
    <div className="animate-[scene-fade-in_1.2s_ease-out]">
      <Scene />
    </div>
  );
}
