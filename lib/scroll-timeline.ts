import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// État de la scène V3B, écrit par GSAP au fil du scroll et lu à chaque
// frame par Scene.tsx : la caméra voyage de la façade vers l'intérieur.
// Les valeurs par défaut = la pose de départ (et la pose mobile/reduced-motion).
export const sceneState = {
  // position de la caméra
  camX: 0,
  camY: -1.3,
  camZ: 10.5,
  // point regardé
  lookX: 0,
  lookY: -0.1,
  lookZ: 0,
  fov: 45,
  // amplitude du balancement orbital (1 devant la façade → 0 en approche)
  sway: 1,
  // la façade s'efface quand la caméra la traverse
  facadeOpacity: 1,
  // 0 → 1 : zoom final dans l'écran + bascule HTML (étape 3)
  screenZoom: 0,
};

// Timeline maître. Durées en % du scroll total de la page (0 → 100),
// calées sur les phases de la mission V3B.
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

  // Phase 1 (0 → 15%) : contemplation de la façade, lente approche,
  // le balancement s'atténue
  tl.to(
    sceneState,
    { camZ: 7.5, camY: -1.45, lookY: -1.0, sway: 0.35, duration: 15 },
    0
  );

  // Phase 2 (15 → 30%) : approche de la porte puis traversée vers le hall
  tl.to(
    sceneState,
    {
      camY: -1.35,
      camZ: 2.0,
      lookY: -1.4,
      lookZ: -3,
      sway: 0,
      duration: 8,
      ease: "power1.inOut",
    },
    15
  );
  tl.to(
    sceneState,
    {
      camZ: -1.2,
      lookY: -1.15,
      lookZ: -4.6,
      duration: 7,
      ease: "power1.out",
    },
    23
  );
  // La façade s'efface pendant la traversée de la porte
  tl.to(sceneState, { facadeOpacity: 0, duration: 5, ease: "power1.in" }, 18);

  // 30 → 100% : la caméra reste posée dans le hall pour l'instant.
  // Ce tween vide fixe la durée totale à 100 pour que les % restent justes
  // quand les étapes 3+ ajouteront leurs keyframes.
  tl.to({}, { duration: 70 }, 30);

  return tl;
}
