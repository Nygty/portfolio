"use client";

import { useState } from "react";
import { setSoundEnabled } from "@/lib/sound";

// Bouton "Enable sound" fixe en haut, à gauche du switch FR·EN.
// Le son est muet par défaut — jamais de son sans geste explicite.
export default function SoundToggle() {
  const [on, setOn] = useState(false);

  const toggle = () => {
    const next = !on;
    setOn(next);
    setSoundEnabled(next);
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      className="fixed right-[6.4rem] top-6 z-50 flex cursor-pointer items-center gap-1.5 rounded-full border border-accent/15 bg-surface/60 px-2.5 py-1 text-xs text-muted backdrop-blur-sm transition-colors hover:text-text sm:right-[8.2rem] sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-sm"
    >
      <span aria-hidden>{on ? "🔊" : "🔇"}</span>
      <span>{on ? "Sound on" : "Enable sound"}</span>
    </button>
  );
}
