import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

/** Carte glassmorphism légère : surface sombre, fine bordure accent, blur. */
export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-accent/15 bg-surface/80 p-8 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
