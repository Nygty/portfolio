import Reveal from "../ui/Reveal";

const points = [
  "Lit chaque email entrant en < 2 secondes",
  "Propose une réponse rédigée, prête à envoyer",
  "Apprend le ton de votre réception au fil des semaines",
];

export default function Agent() {
  return (
    <section id="agent" className="relative min-h-[150vh] px-6">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center">
        <Reveal>
          <h2 className="max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Un membre de plus dans votre équipe.{" "}
            <span className="text-accent">Sans le salaire.</span>
          </h2>
        </Reveal>
        <ul className="mt-14 space-y-8">
          {points.map((point, i) => (
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
