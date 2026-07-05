import Counter from "../ui/Counter";
import Reveal from "../ui/Reveal";
import type { Translation } from "@/lib/translations";

export default function CaseStudy({ t }: { t: Translation }) {
  return (
    <section id="cas-client" className="relative min-h-screen px-6">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center py-20 text-center">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-muted sm:text-sm">
            {t.caseStudy.eyebrow}
          </p>
          <h2 className="mt-6 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {t.caseStudy.hotel}
          </h2>
          <p className="mt-2 text-muted">
            {t.caseStudy.location} <span className="text-accent">★★★★★</span>
          </p>
        </Reveal>
        <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {t.caseStudy.stats.map((stat) => (
            <Counter
              key={stat.label}
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              label={stat.label}
              countdown={stat.countdown}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
