import Counter from "../ui/Counter";

export default function CaseStudy() {
  return (
    <section id="cas-client" className="relative min-h-screen px-6">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center text-center">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-muted sm:text-sm">
          En production chez
        </p>
        <h2 className="mt-6 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          IBB Hotel Palazzo Bettina
        </h2>
        <p className="mt-2 text-muted">
          Birgu, Malte <span className="text-accent">★★★★★</span>
        </p>
        <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
          <Counter value="13" label="chambres" />
          <Counter value="5" label="langues traitées" />
          <Counter value="~2h/jour" label="économisées à la réception" />
        </div>
      </div>
    </section>
  );
}
