"use client";

import { useScrollState } from "@/lib/use-scroll-state";
import { translations, type Locale, type Translation } from "@/lib/translations";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/use-media";

// Micro-légendes bilingues de la cinématique : discrètes, en fondu,
// calées sur les phases du scroll. Note : la légende "L'agent rédige"
// est placée en bas centre (le panneau IA occupe le côté droit).

type CaptionId = keyof Translation["captions"];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, from: number, to: number) =>
  clamp((p - from) / (to - from));

const CUES: { id: CaptionId; from: number; to: number; position: "top" | "bottom" }[] = [
  { id: "agentAtPost", from: 0.17, to: 0.29, position: "bottom" },
  { id: "emailArrives", from: 0.6, to: 0.66, position: "top" },
  { id: "agentDrafts", from: 0.7, to: 0.79, position: "bottom" },
  { id: "sent", from: 0.868, to: 0.905, position: "bottom" },
];

export default function Caption({ locale }: { locale: Locale }) {
  const { progress: p } = useScrollState();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  if (isMobile || reducedMotion) return null;

  const captions = translations[locale].captions;

  return (
    <>
      {CUES.map((cue) => {
        const fadeIn = seg(p, cue.from, cue.from + 0.02);
        const fadeOut = 1 - seg(p, cue.to - 0.015, cue.to);
        const opacity = Math.min(fadeIn, fadeOut);
        if (opacity <= 0) return null;
        return (
          <div
            key={cue.id}
            aria-hidden
            className={`pointer-events-none fixed left-1/2 z-20 -translate-x-1/2 ${
              cue.position === "top" ? "top-16" : "bottom-12"
            }`}
            style={{ opacity }}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-[#cfe0f5] [text-shadow:0_2px_12px_rgba(0,0,0,0.85)] sm:text-sm">
              {captions[cue.id]}
            </p>
          </div>
        );
      })}
    </>
  );
}
