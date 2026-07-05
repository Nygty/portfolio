"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

/** Chiffre clé avec count-up : compte de 0 à la valeur quand il devient visible. */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  label,
}: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-5xl font-bold tabular-nums text-accent sm:text-6xl">
        {prefix}
        {display}
        {suffix}
      </div>
      <div className="mt-3 text-muted">{label}</div>
    </div>
  );
}
