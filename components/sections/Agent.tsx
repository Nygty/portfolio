import Reveal from "../ui/Reveal";
import type { Translation } from "@/lib/translations";

export default function Agent({ t }: { t: Translation }) {
  return (
    <section id="agent" className="relative min-h-screen px-6 md:min-h-[150vh]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center">
        <Reveal>
          <h2 className="max-w-3xl font-serif text-4xl font-semibold tracking-tight sm:text-[3.4rem] sm:leading-[1.1]">
            {t.agent.titleStart}
            <span className="italic text-accent">{t.agent.titleAccent}</span>
          </h2>
        </Reveal>
        <ul className="mt-14 space-y-8">
          {t.agent.bullets.map((point, i) => (
            <li key={point}>
              <Reveal delay={i * 0.15} className="flex items-start gap-5">
                <span className="mt-1 font-heading text-sm font-bold tabular-nums text-accent-hot">
                  0{i + 1}
                </span>
                <p className="text-xl text-text sm:text-2xl">{point}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
