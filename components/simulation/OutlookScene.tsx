"use client";

import LoginWindow from "./LoginWindow";
import Inbox from "./Inbox";
import EmailDetail from "./EmailDetail";
import { useScrollState } from "@/lib/use-scroll-state";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/use-media";

// La couche "dans l'écran" : prend le relais du canvas 3D quand la caméra
// a fini de zoomer sur l'ordinateur, joue la simulation (login → inbox →
// email → IA → envoi), puis s'efface au dézoom.
// Tout est fonction pure du scroll : la séquence se rejoue à l'identique
// dans les deux sens. pointer-events-none : rien n'est cliquable.
// Desktop uniquement — les fallbacks mobile/reduced-motion arrivent à l'étape 8.

const clamp = (v: number) => Math.min(1, Math.max(0, v));
/** Progression 0→1 entre deux bornes de la cinématique. */
const seg = (p: number, from: number, to: number) =>
  clamp((p - from) / (to - from));

function overlayOpacity(p: number): number {
  if (p < 0.38 || p > 0.97) return 0;
  if (p < 0.45) return seg(p, 0.38, 0.45); // fondu entrant
  if (p > 0.9) return 1 - seg(p, 0.9, 0.97); // fondu sortant (dézoom)
  return 1;
}

export default function OutlookScene() {
  const { progress: p } = useScrollState();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  if (isMobile || reducedMotion) return null;

  const opacity = overlayOpacity(p);
  if (opacity <= 0) return null;

  // Chorégraphie de la phase "outlook" (45 → 65% de la cinématique)
  const loginP = seg(p, 0.455, 0.575); // apparition + saisie + clic
  const loginFade = 1 - seg(p, 0.578, 0.595); // la fenêtre de login s'efface
  const inboxFade = seg(p, 0.592, 0.605); // la boîte de réception apparaît
  const arriveP = seg(p, 0.607, 0.627); // l'email de Sarah glisse
  const openP = seg(p, 0.632, 0.648); // clic simulé sur la ligne
  const detailP = seg(p, 0.644, 0.664); // vue détaillée en fondu

  const showLogin = p < 0.595;
  const showInbox = p >= 0.592 && detailP < 1;
  const showDetail = detailP > 0;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 font-sans"
      style={{ opacity }}
      aria-hidden
    >
      {/* L'intérieur de l'écran : fond sombre + halo froid */}
      <div className="absolute inset-0 bg-[#07090d]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,158,255,0.07),transparent_65%)]" />

      {/* Le "bureau" : fenêtre d'app centrée */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        {showLogin ? (
          <div style={{ opacity: loginFade }}>
            <LoginWindow p={loginP} />
          </div>
        ) : (
          <div
            className="relative flex h-[72vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1a1e27] shadow-2xl"
            style={{ opacity: inboxFade }}
          >
            {/* Barre de titre neutre */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-[#141821] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="ml-3 text-xs text-[#8a93a5]">
                Mail — IBB Palazzo Bettina
              </span>
            </div>

            <div className="relative flex-1">
              {showInbox && (
                <div
                  className="absolute inset-0"
                  style={{ opacity: 1 - detailP }}
                >
                  <Inbox arriveP={arriveP} openP={openP} />
                </div>
              )}
              {showDetail && (
                <div className="absolute inset-0 bg-[#1a1e27]">
                  <EmailDetail p={detailP} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
