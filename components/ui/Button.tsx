"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
  className?: string;
};

const base =
  "inline-flex items-center justify-center rounded-full px-7 py-3 font-heading font-semibold tracking-tight transition-shadow duration-300 cursor-pointer";

const variants = {
  primary:
    "bg-accent text-bg hover:shadow-[0_0_32px_rgba(74,158,255,0.5)]",
  ghost:
    "border border-accent/30 text-text hover:border-accent/80 hover:shadow-[0_0_24px_rgba(74,158,255,0.25)]",
};

// Micro-interactions Framer Motion : léger scale au survol, appui au clic.
const interaction = {
  whileHover: { scale: 1.045 },
  whileTap: { scale: 0.96 },
  transition: { type: "spring", stiffness: 400, damping: 22 },
} as const;

/** Bouton maison : rendu <a> si href est fourni, sinon <button>. */
export default function Button({
  children,
  href,
  variant = "primary",
  type = "button",
  className = "",
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <motion.a href={href} className={classes} {...interaction}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button type={type} className={classes} {...interaction}>
      {children}
    </motion.button>
  );
}
