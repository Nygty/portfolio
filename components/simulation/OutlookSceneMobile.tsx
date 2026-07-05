"use client";

import type { ReactNode } from "react";
import Reveal from "../ui/Reveal";
import { translations, type Locale } from "@/lib/translations";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/use-media";

// Fallback mobile + prefers-reduced-motion : la cinématique "dans l'écran"
// est remplacée par 3 vignettes statiques (états clés de la séquence) qui
// apparaissent en fondu au scroll. Aucune image ajoutée : du HTML stylé.
// Invisible sur desktop animé (OutlookScene joue la vraie séquence).

function WindowFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1e27] font-sans shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#141821] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 text-[10px] text-[#8a93a5]">
          Mail — hotel.reception@gmail.com
        </span>
      </div>
      {children}
    </div>
  );
}

function Label({ text }: { text: string }) {
  return (
    <p className="mb-3 text-center text-xs uppercase tracking-[0.25em] text-muted">
      {text}
    </p>
  );
}

export default function OutlookSceneMobile({ locale }: { locale: Locale }) {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  // Desktop animé : la vraie séquence joue, pas de vignettes
  if (!isMobile && !reducedMotion) return null;

  const captions = translations[locale].captions;
  const field =
    "flex h-9 items-center rounded-md border border-white/10 bg-[#12151c] px-3 text-xs text-[#d7dee9]";

  return (
    <section aria-hidden className="relative px-6 pb-8">
      <div className="mx-auto max-w-sm space-y-12">
        {/* 1 — L'agent se connecte */}
        <Reveal>
          <Label text={captions.agentAtPost} />
          <WindowFrame>
            <div className="space-y-3 p-5">
              <div className={field}>hotel.reception@gmail.com</div>
              <div className={`${field} tracking-[0.2em]`}>●●●●●●●●●●</div>
              <div className="flex h-9 items-center justify-center rounded-md bg-[#2f6cb4] text-xs font-semibold text-white">
                Sign in
              </div>
            </div>
          </WindowFrame>
        </Reveal>

        {/* 2 — Un email arrive */}
        <Reveal>
          <Label text={captions.emailArrives} />
          <WindowFrame>
            <div className="flex items-center gap-2.5 bg-[#1d2330] px-4 py-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#4a9eff]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-xs font-bold text-[#e8edf5]">
                    Sarah Miller
                  </span>
                  <span className="text-[10px] text-[#8a93a5]">09:14</span>
                </div>
                <div className="truncate text-xs font-bold text-[#c9d3e0]">
                  Booking request for August 15th
                </div>
                <div className="truncate text-[10px] text-[#8a93a5]">
                  Hello, do you have availability for 2 people on…
                </div>
              </div>
            </div>
          </WindowFrame>
        </Reveal>

        {/* 3 — L'agent répond, envoyé */}
        <Reveal>
          <Label text={captions.agentDrafts} />
          <WindowFrame>
            <div className="relative p-5">
              <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-[radial-gradient(circle_at_35%_35%,#8ab8f0,#4a9eff_45%,#7c5cff_80%)] shadow-[0_0_28px_rgba(74,158,255,0.5)]" />
              <div className="rounded-lg border border-white/10 bg-[#12151c] p-3 text-[10px] leading-relaxed text-[#c9d3e0]">
                Dear Sarah,
                <br />
                Thank you for your inquiry. We have a Sea View Deluxe room
                available on August 15th at €280 per night, breakfast included.
                <br />
                Warm regards — IBB Palazzo Bettina, Reception
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-md border border-white/10 bg-[#1f2735] px-2.5 py-1.5 text-[10px] font-medium text-[#d9e2ee]">
                  <span className="mr-1 text-[#5dd39e]">✓</span>
                  {captions.sent}
                </span>
                <span className="rounded-md bg-[#2f6cb4] px-4 py-1.5 text-[10px] font-semibold text-white">
                  Send
                </span>
              </div>
            </div>
          </WindowFrame>
        </Reveal>
      </div>
    </section>
  );
}
