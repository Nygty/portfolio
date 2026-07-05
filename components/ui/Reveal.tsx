"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** "fade" : fondu + remontée. "flip" : rotation Y 3D + fondu (cartes). */
  effect?: "fade" | "flip";
  /** Décalage en secondes, pour faire apparaître des éléments en cascade. */
  delay?: number;
  className?: string;
};

// Fait apparaître son contenu quand il entre dans le viewport (une seule fois).
export default function Reveal({
  children,
  effect = "fade",
  delay = 0,
  className,
}: RevealProps) {
  // Réglage système "réduire les animations" : contenu affiché directement
  const reducedMotion = useReducedMotion();
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={
        effect === "flip"
          ? { opacity: 0, rotateY: 40, y: 40 }
          : { opacity: 0, y: 36 }
      }
      whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.6, 0.35, 1] }}
      style={effect === "flip" ? { transformPerspective: 900 } : undefined}
    >
      {children}
    </motion.div>
  );
}
