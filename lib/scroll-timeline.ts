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
  // Comment ça marche : retour au centre, la caméra recule,
  // et le noyau ÉCLATE en 3 groupes — un par carte
  tl.to(
    sceneState,
    {
      x: 0,
      y: 0.15,
      scale: 1,
      spin: 0.05,
      cameraZ: 4.9,
      fragmentation: 1,
      duration: 130,
      ease: "power2.inOut",
    },
    250
  );
  // (380 → 450 : les 3 groupes restent en place pendant la lecture des cartes)
  // Cas client : reformation du noyau au centre
  tl.to(
    sceneState,
    {
      fragmentation: 0,
      y: 0,
      spin: 0.12,
      cameraZ: 4.2,
      duration: 100,
      ease: "power2.inOut",
    },
    450
  );
  // À propos : le noyau recule en arrière-plan, mangé par le fog
  tl.to(sceneState, { z: -2.5, y: 0.4, duration: 100 }, 550);
  // Tarifs : il remonte, discret, derrière les cartes
  tl.to(sceneState, { z: -0.8, y: -0.7, x: 0, duration: 150 }, 650);

  return tl;
}
