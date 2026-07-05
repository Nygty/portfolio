"use client";

import { useEffect, useRef } from "react";
import LoginWindow from "./LoginWindow";
import Inbox from "./Inbox";
import EmailDetail from "./EmailDetail";
import AIPanel from "./AIPanel";
import SendCursor from "./SendCursor";
import { playDing, playSwoosh } from "@/lib/sound";
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
  const windowRef = useRef<HTMLDivElement>(null);

  // Sons : joués une fois au franchissement (en descendant uniquement)
  const prevP = useRef(0);
  useEffect(() => {
    const prev = prevP.current;
    prevP.current = p;
    if (prev < 0.592 && p >= 0.592) playDing(); // connexion validée
    if (prev < 0.857 && p >= 0.857) playSwoosh(); // email envoyé
  }, [p]);

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

  // Chorégraphie de la phase "ai" (65 → 80%)
  const aiSlideP = seg(p, 0.652, 0.672); // le panneau IA s'ouvre
  const thinkP = seg(p, 0.672, 0.72); // le blob réfléchit
  const typeP = seg(p, 0.72, 0.79); // la réponse s'écrit

  // Chorégraphie de la phase "send" (80 → 90%)
  const moveP = seg(p, 0.8, 0.845); // le curseur glisse vers Send
  const hoverP = seg(p, 0.843, 0.852); // survol du bouton
  const clickP = seg(p, 0.852, 0.862); // clic (compression + ondulation)
  const sentP = seg(p, 0.865, 0.888); // l'email glisse hors de l'écran
  const toastP = seg(p, 0.872, 0.888); // toast "✓ Message sent"

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
            ref={windowRef}
            className="relative flex h-[72vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1a1e27] shadow-2xl"
            style={{ opacity: inboxFade }}
          >
            {/* Barre de titre neutre */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-[#141821] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="ml-3 text-xs text-[#8a93a5]">
                Mail — Front Desk
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
                <>
                  {/* Après l'envoi : l'inbox réapparaît derrière, email traité */}
                  {sentP > 0 && (
                    <div className="absolute inset-0">
                      <Inbox arriveP={1} openP={0} read />
                    </div>
                  )}

                  {/* L'email + le panneau IA (glissent vers la droite à l'envoi) */}
                  <div
                    className="absolute inset-0 flex bg-[#1a1e27]"
                    style={
                      sentP > 0
                        ? {
                            transform: `translateX(${sentP * sentP * 110}%)`,
                            opacity: 1 - sentP * 0.25,
                          }
                        : undefined
                    }
                  >
                    <div className="min-w-0 flex-1">
                      <EmailDetail p={detailP} />
                    </div>
                    {aiSlideP > 0 && (
                      <AIPanel
                        slideP={aiSlideP}
                        thinkP={thinkP}
                        typeP={typeP}
                        hoverP={hoverP}
                        clickP={clickP}
                      />
                    )}
                  </div>

                  {/* Toast de confirmation */}
                  {toastP > 0 && (
                    <div
                      className="absolute right-4 top-4 rounded-lg border border-white/10 bg-[#1f2735] px-4 py-2.5 text-xs font-medium text-[#d9e2ee] shadow-xl"
                      style={{
                        opacity: toastP,
                        transform: `translateY(${(1 - toastP) * -8}px)`,
                      }}
                    >
                      <span className="mr-1.5 text-[#5dd39e]">✓</span>
                      Message sent
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Le curseur autonome, par-dessus tout le contenu de la fenêtre */}
            {moveP > 0 && sentP < 0.4 && (
              <SendCursor
                moveP={moveP}
                clickP={clickP}
                containerRef={windowRef}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
