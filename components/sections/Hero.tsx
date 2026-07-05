import Button from "../ui/Button";
import Reveal from "../ui/Reveal";
import type { Translation } from "@/lib/translations";

export default function Hero({ t }: { t: Translation }) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <Reveal>
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.35em] text-muted sm:text-sm">
          {t.hero.eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className="max-w-4xl font-heading text-5xl font-bold tracking-tight sm:text-7xl">
          {t.hero.titleStart}
          <span className="bg-gradient-to-r from-accent to-accent-hot bg-clip-text text-transparent">
            {t.hero.titleAccent}
          </span>
        </h1>
      </Reveal>
      <Reveal delay={0.25}>
        <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
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
    </section>
  );
}
