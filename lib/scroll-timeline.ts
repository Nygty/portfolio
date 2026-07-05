import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cinematicLength } from "./use-scroll-state";

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
};

// Timeline maître. Durées en % de la CINÉMATIQUE (0 → 100), qui couvre
// les 3 premières sections — même référentiel que lib/use-scroll-state.ts.
export function buildScrollTimeline(): gsap.core.Timeline | null {
  if (typeof window === "undefined") return null;

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: () => `+=${cinematicLength()}`,
      scrub: 1.2,
      invalidateOnRefresh: true,
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

  // Phase 3 (30 → 45%) : zoom dans l'écran de l'ordinateur — la caméra
  // s'aligne sur le centre de l'écran (monde : 0, -1.08, -4.6) et s'en
  // approche jusqu'à ce qu'il remplisse le viewport. La couche HTML
  // (OutlookScene) prend le relais en fondu à partir de ~38%.
  tl.to(
    sceneState,
    {
      camY: -1.08,
      camZ: -4.2,
      lookY: -1.08,
      lookZ: -4.6,
      fov: 36,
      duration: 15,
      ease: "power1.inOut",
    },
    30
  );

  // 45 → 100% : la caméra reste dans l'écran (la simulation HTML joue).
  // Le dézoom (90-100%) arrive à l'étape 7. Ce tween vide fixe la durée
  // totale à 100 pour que les % restent justes.
  tl.to({}, { duration: 55 }, 45);

  return tl;
}
