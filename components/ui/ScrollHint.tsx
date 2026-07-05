"use client";

import { useEffect, useState } from "react";
import { translations, type Locale } from "@/lib/translations";
import { usePrefersReducedMotion } from "@/lib/use-media";

// "Défiler pour explorer ↓" : pulse doucement en bas du hero,
// disparaît dès les premiers pixels de scroll.
export default function ScrollHint({ locale }: { locale: Locale }) {
  const [hidden, setHidden] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed bottom-8 left-1/2 z-20 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted transition-opacity duration-500 ${
        hidden
          ? "opacity-0"
          : reducedMotion
            ? "opacity-80"
            : "animate-[hint-pulse_2.2s_ease-in-out_infinite]"
      }`}
    >
      {translations[locale].ui.scrollHint}
    </div>
  );
}
