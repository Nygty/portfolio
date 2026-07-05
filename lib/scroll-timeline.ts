import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// État de la scène 3D, écrit par GSAP au fil du scroll et lu à chaque
// frame par les composants Three.js. C'est le pont entre le scroll et la 3D.
export const sceneState = {
  x: 0,
  y: 0,
  z: 0,
  scale: 1,
  spin: 0.12, // vitesse de rotation du noyau
  cameraZ: 4.2,
  fragmentation: 0, // 0 → 1, câblé à l'étape 5 (éclatement en 3 groupes)
};

// Durées proportionnelles à la hauteur des sections (en vh) :
// hero 100 / agent 150 / comment 200 / cas client 100 / à propos 100 / tarifs 150
export function buildScrollTimeline(): gsap.core.Timeline | null {
  if (typeof window === "undefined") return null;

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
    },
  });

  // Hero → Agent : le noyau glisse vers la droite, la caméra avance un peu
  tl.to(sceneState, { x: 1.6, cameraZ: 3.7, duration: 100 }, 0);
  // Agent : léger drift vers le haut, le noyau grossit doucement
  tl.to(sceneState, { y: 0.35, scale: 1.08, duration: 150 }, 100);
  // Comment ça marche : passage à gauche, rotation accélérée
  // (la fragmentation en 3 groupes remplacera ceci à l'étape 5)
  tl.to(
    sceneState,
    { x: -1.4, y: 0, scale: 1.15, spin: 0.4, duration: 200 },
    250
  );
  // Cas client : retour au centre, calme
  tl.to(
    sceneState,
    { x: 0, scale: 1, spin: 0.12, cameraZ: 4.2, duration: 100 },
    450
  );
  // À propos : le noyau recule en arrière-plan
  tl.to(sceneState, { z: -2.5, y: 0.4, duration: 100 }, 550);
  // Tarifs : il remonte, discret, derrière les cartes
  tl.to(sceneState, { z: -0.8, y: -0.7, x: 0, duration: 150 }, 650);

  return tl;
}
