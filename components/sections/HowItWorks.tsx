import Card from "../ui/Card";
import Reveal from "../ui/Reveal";
import type { Translation } from "@/lib/translations";

export default function HowItWorks({ t }: { t: Translation }) {
  return (
    <section id="comment" className="relative min-h-screen px-6 md:min-h-[200vh]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center py-20">
        <Reveal>
          <h2 className="text-center font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            {t.howItWorks.title}
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {t.howItWorks.steps.map((step, i) => (
            <Reveal key={step.title} effect="flip" delay={i * 0.18}>
              <Card className="flex h-full flex-col gap-4">
                <span className="font-heading text-sm font-bold tabular-nums text-accent-hot">
                  0{i + 1}
                </span>
                <h3 className="font-heading text-2xl font-bold text-accent">
                  {step.title}
                </h3>
                <p className="text-muted">{step.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
