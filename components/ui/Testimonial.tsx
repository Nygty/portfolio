"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-media";

// Témoignage placeholder (aucun vrai client cité) : la citation se tape
// en typewriter à l'entrée dans le viewport, sur un fond dégradé flouté
// (pas de photo). La mention "représentatif" reste toujours visible.

type TestimonialProps = {
  quote: string;
  author: string;
  disclaimer: string;
};

export default function Testimonial({
  quote,
  author,
  disclaimer,
}: TestimonialProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reducedMotion = usePrefersReducedMotion();
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      setChars(quote.length);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setChars(i);
      if (i >= quote.length) window.clearInterval(id);
    }, 24);
    return () => window.clearInterval(id);
  }, [inView, quote, reducedMotion]);

  return (
    <div
      ref={ref}
      className="relative mx-auto mt-16 w-full max-w-2xl overflow-hidden rounded-2xl border border-accent/15 p-8 text-left backdrop-blur-sm"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/10 via-surface/80 to-[#d4a574]/10" />
      <blockquote className="min-h-[5.5rem] text-lg leading-relaxed text-text sm:min-h-[4.5rem] sm:text-xl">
        “{quote.slice(0, chars)}
        {chars < quote.length ? (
          <span className="ml-0.5 inline-block h-4 w-px animate-[caret-blink_1s_steps(1)_infinite] bg-accent align-middle" />
        ) : (
          "”"
        )}
      </blockquote>
      <p className="mt-4 text-sm font-medium text-accent">{author}</p>
      <p className="mt-2 text-xs italic text-muted">{disclaimer}</p>
    </div>
  );
}
