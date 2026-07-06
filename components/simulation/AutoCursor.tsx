"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

// Curseur souris SVG blanc qui glisse tout seul vers un élément cible
// puis clique (compression + ondulation). Il mesure la vraie position
// de la cible dans le conteneur au montage — pas de coordonnées en dur.
// moveP : trajet 0→1. clickP : animation de clic 0→1.
// startX/startY : point de départ, en fraction du conteneur.

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

type Path = { sx: number; sy: number; tx: number; ty: number };

export default function AutoCursor({
  moveP,
  clickP,
  containerRef,
  targetId,
  startX = 0.42,
  startY = 0.48,
}: {
  moveP: number;
  clickP: number;
  containerRef: RefObject<HTMLDivElement | null>;
  targetId: string;
  startX?: number;
  startY?: number;
}) {
  const [path, setPath] = useState<Path | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const target = document.getElementById(targetId);
    if (!container || !target) return;
    const c = container.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    setPath({
      sx: c.width * startX,
      sy: c.height * startY,
      tx: b.left - c.left + b.width / 2,
      ty: b.top - c.top + b.height / 2,
    });
  }, [containerRef, targetId, startX, startY]);

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
