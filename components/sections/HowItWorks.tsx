import Card from "../ui/Card";

const steps = [
  {
    title: "Connexion",
    text: "On branche l'agent à votre boîte mail (Outlook, Gmail) en 24h.",
  },
  {
    title: "Écoute",
    text: "L'agent lit vos emails et catégorise : résa, plainte, question, spam.",
  },
  {
    title: "Réponse",
    text: "Vous validez le brouillon en un clic. Envoyé.",
  },
];

export default function HowItWorks() {
  return (
    <section id="comment" className="relative min-h-[200vh] px-6">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center">
        <h2 className="text-center font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          En 3 étapes
        </h2>
        {/* Les cartes — l'effet 3D (rotation Y + fade) arrive à l'étape 5 */}
        <div className="mt-16 grid gap-8 md:grid-cols-3" data-steps>
          {steps.map((step, i) => (
            <Card key={step.title} className="flex flex-col gap-4">
              <span className="font-heading text-sm font-bold tabular-nums text-accent-hot">
                0{i + 1}
              </span>
              <h3 className="font-heading text-2xl font-bold text-accent">
                {step.title}
              </h3>
              <p className="text-muted">{step.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
