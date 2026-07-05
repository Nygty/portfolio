"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { translations, type Locale } from "@/lib/translations";

// CTA flottant "Réserver une démo" : apparaît une fois le hero passé
// (glissement depuis la droite), reste fixe, mène au formulaire de contact
// (le clic passe par l'interception Lenis → scroll fluide).
export default function FloatingCta({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#contact"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-accent px-5 py-3 font-heading text-sm font-semibold text-white shadow-[0_0_24px_rgba(74,158,255,0.45)] transition-shadow hover:shadow-[0_0_34px_rgba(74,158,255,0.65)]"
        >
          {translations[locale].ui.bookDemo}
        </motion.a>
      )}
    </AnimatePresence>
  );
}
