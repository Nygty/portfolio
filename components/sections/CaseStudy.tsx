import Counter from "../ui/Counter";
import type { Translation } from "@/lib/translations";

export default function CaseStudy({ t }: { t: Translation }) {
  return (
    <section id="cas-client" className="relative min-h-screen px-6">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center py-20 text-center">
        <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
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
