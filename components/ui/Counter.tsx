"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  /** true : décompte de value vers 0, puis affiche "prefix value suffix"
      (ex. 30…0 puis "< 30 s"). false : count-up classique de 0 vers value. */
  countdown?: boolean;
};

/** Chiffre clé animé quand il devient visible : count-up, ou countdown. */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  label,
  countdown = false,
}: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(countdown ? value : 0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    // Réglage "réduire les animations" : état final directement
    if (reducedMotion) {
      setDisplay(value);
      setDone(true);
      return;
    }
    const controls = animate(countdown ? value : 0, countdown ? 0 : value, {
      duration: countdown ? 2 : 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [inView, value, reducedMotion, countdown]);

  // countdown : chiffre brut pendant le décompte, puis forme finale stable
  const text = countdown
    ? done
      ? `${prefix}${value}${suffix}`
      : `${display}`
    : `${prefix}${display}${suffix}`;

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-5xl font-bold tabular-nums text-accent sm:text-6xl">
        {text}
      </div>
      <div className="mt-3 text-muted">{label}</div>
    </div>
  );
}
