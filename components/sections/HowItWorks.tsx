import Card from "../ui/Card";
import Reveal from "../ui/Reveal";
import type { Translation } from "@/lib/translations";

export default function HowItWorks({ t }: { t: Translation }) {
  return (
    // 450vh desktop : cette section est la piste de scroll de la simulation
    // "dans l'écran" (V3B) — son texte HTML est recouvert par la démo,
    // qui raconte la même chose en action
    <section id="comment" className="relative min-h-screen px-6 md:min-h-[450vh]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center py-14">
        <Reveal>
          {/* Titre volontairement décalé à gauche, pas centré (mission 0.8) */}
          <h2 className="font-serif text-4xl font-semibold tracking-tight sm:pl-[4%] sm:text-5xl">
            {t.howItWorks.title}
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {t.howItWorks.steps.map((step, i) => (
            <Reveal key={step.title} effect="flip" delay={i * 0.18}>
              {/* grille cassée : la carte du milieu déborde un peu des autres */}
              <Card
                className={`flex h-full flex-col gap-4 ${
                  i === 1 ? "md:-translate-y-3 md:scale-[1.045]" : ""
                }`}
              >
                <span
                  className={`font-heading text-sm font-bold tabular-nums text-accent-hot ${
                    i === 1 ? "inline-block w-fit -rotate-3" : ""
                  }`}
                >
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
