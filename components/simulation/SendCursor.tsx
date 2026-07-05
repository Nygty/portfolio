"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

// Curseur souris SVG blanc qui glisse tout seul vers le bouton "Send"
// puis clique (compression + ondulation). Il mesure la vraie position
// du bouton dans la fenêtre au montage — pas de coordonnées en dur.
// moveP : trajet 0→1. clickP : animation de clic 0→1.

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

type Path = { sx: number; sy: number; tx: number; ty: number };

export default function SendCursor({
  moveP,
  clickP,
  containerRef,
}: {
  moveP: number;
  clickP: number;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const [path, setPath] = useState<Path | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const button = document.getElementById("sim-send-button");
    if (!container || !button) return;
    const c = container.getBoundingClientRect();
    const b = button.getBoundingClientRect();
    setPath({
      sx: c.width * 0.42,
      sy: c.height * 0.48,
      tx: b.left - c.left + b.width / 2,
      ty: b.top - c.top + b.height / 2,
    });
  }, [containerRef]);

  if (!path) return null;

  const e = easeInOut(moveP);
  const x = path.sx + (path.tx - path.sx) * e;
  const y = path.sy + (path.ty - path.sy) * e;
  const press = Math.sin(Math.min(1, clickP) * Math.PI);

  return (
    <div
      className="absolute z-20"
      style={{
        left: x,
        top: y,
        opacity: Math.min(1, moveP * 4),
        transform: `scale(${1 - press * 0.18})`,
      }}
    >
      {/* Ondulation du clic */}
      <span
        className="absolute -left-2.5 -top-2.5 h-8 w-8 rounded-full border border-white/70"
        style={{
          opacity: press * 0.7,
          transform: `scale(${0.4 + press * 0.9})`,
        }}
      />
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))" }}
        aria-hidden
      >
        <path
          d="M5 3l6 14 2.2-5.8L19 9z"
          fill="#ffffff"
          stroke="#1a1a1a"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
