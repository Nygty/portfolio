import Button from "../ui/Button";
import Reveal from "../ui/Reveal";
import type { Translation } from "@/lib/translations";

// Soulignement "tracé à la main" sous le mot-clé : ondulation irrégulière
// dorée, volontairement pas droite (mission 0.8 — anti-template).
function WavyUnderline() {
  return (
    <svg
      className="absolute -bottom-1 left-0 w-full sm:-bottom-2"
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M3 8.5 Q 22 3.5, 46 7 T 96 6.5 T 148 7.5 T 197 5.5"
        fill="none"
        stroke="#d4a574"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

export default function Hero({ t }: { t: Translation }) {
  return (
    // Asymétrie intentionnelle (mission 0.8) : le bloc est ancré à gauche
    // avec un retrait en vw, l'air reste à droite — l'hôtel 3D y respire.
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-center px-6 sm:pl-[7vw] sm:pr-6"
    >
      {/* Accent décoratif asymétrique : point doré, seul, volontairement décentré */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-[9%] top-[17%] h-2 w-2 rounded-full bg-[#d4a574]/70 shadow-[0_0_12px_rgba(212,165,116,0.5)]"
      />

      <div className="max-w-[52rem] text-left">
        <Reveal>
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.35em] text-muted sm:text-sm">
            {t.hero.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif text-[clamp(2.9rem,7vw,5rem)] font-semibold leading-[1.06] tracking-tight">
            {t.hero.titleStart}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-accent to-accent-hot bg-clip-text text-transparent">
                {t.hero.titleAccent}
              </span>
              <WavyUnderline />
            </span>
          </h1>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-7 max-w-xl text-lg text-muted sm:text-xl">
            {t.hero.subtitle}
          </p>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="#agent">{t.hero.ctaPrimary}</Button>
            <Button href="#contact" variant="ghost">
              {t.hero.ctaSecondary}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
