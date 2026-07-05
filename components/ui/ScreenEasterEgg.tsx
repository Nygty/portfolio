"use client";

import { useEffect, useState } from "react";
import { screenHover } from "@/lib/screen-hover";
import { translations, type Locale } from "@/lib/translations";
import {
  useIsMobile,
  useMediaQuery,
  usePrefersReducedMotion,
} from "@/lib/use-media";

// Easter egg : quand la souris survole l'ordinateur du hall (pendant la
// phase hall uniquement), l'écran 3D pulse plus fort et "L'agent est prêt"
// apparaît. La position de l'écran vient de la sonde 3D (lib/screen-hover).
export default function ScreenEasterEgg({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = usePrefersReducedMotion();
  const active = !isMobile && finePointer && !reducedMotion;

  useEffect(() => {
    if (!active) return;
    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    let raf = 0;
    const tick = () => {
      const near =
        screenHover.inPhase &&
        Math.hypot(mouse.x - screenHover.x, mouse.y - screenHover.y) < 90;
      screenHover.boost = near ? 1 : 0;
      setVisible((v) => (v === near ? v : near));
      if (near) setPos({ x: screenHover.x, y: screenHover.y });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      screenHover.boost = 0;
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-20 -translate-x-1/2 text-xs uppercase tracking-[0.25em] text-[#cfe0f5] transition-opacity duration-300 [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]"
      style={{ left: pos.x, top: pos.y - 70, opacity: visible ? 1 : 0 }}
    >
      {translations[locale].ui.agentReady}
    </div>
  );
}
