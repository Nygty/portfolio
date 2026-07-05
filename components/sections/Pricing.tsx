"use client";

import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Reveal from "../ui/Reveal";

const plans = [
  {
    name: "Standard",
    setup: "800€ setup",
    monthly: "80€",
    features: [
      "Tri automatique des emails entrants",
      "Brouillons de réponse en 5 langues",
      "Dashboard de suivi",
    ],
  },
  {
    name: "Premium",
    setup: "800€ setup",
    monthly: "120€",
    features: [
      "Tout Standard",
      "Amélioration automatique hebdomadaire",
      "Rapport mensuel",
    ],
  },
  {
    name: "Premium+",
    setup: "1200€ setup",
    monthly: "150€",
    features: [
      "Tout Premium",
      "Formation sur les vrais échanges de votre réception",
    ],
  },
];

export default function Pricing() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Pas de backend : le bouton ouvre le client mail du visiteur,
  // pré-rempli avec le contenu du formulaire.
  const mailtoHref = `mailto:enzo26cosnard@gmail.com?subject=${encodeURIComponent(
    `Contact portfolio — ${nom || "sans nom"}`
  )}&body=${encodeURIComponent(`${message}\n\n—\n${nom}\n${email}`)}`;

  const inputClasses =
    "w-full rounded-xl border border-accent/15 bg-surface/80 px-5 py-3 text-text placeholder:text-muted outline-none backdrop-blur-sm transition-colors focus:border-accent/60";

  return (
    <section id="tarifs" className="relative min-h-[150vh] px-6 pb-10">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center">
        <Reveal>
          <h2 className="text-center font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            3 formules. Pas de surprise.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} effect="flip" delay={i * 0.18}>
              <Card className="flex h-full flex-col">
                <h3 className="font-heading text-xl font-bold text-text">
                  {plan.name}
                </h3>
                <div className="mt-6">
                  <span className="font-heading text-5xl font-bold tabular-nums text-accent">
                    {plan.monthly}
                  </span>
                  <span className="text-muted"> / mois</span>
                </div>
                <p className="mt-1 text-sm text-muted">{plan.setup}</p>
                <ul className="mt-8 space-y-3 text-sm text-muted">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 text-accent">◆</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>

      <div id="contact" className="mx-auto max-w-xl scroll-mt-24 pt-24">
        <Reveal>
          <h2 className="text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Parlons de votre réception.
          </h2>
        </Reveal>
        <form
          className="mt-10 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = mailtoHref;
          }}
        >
          <input
            type="text"
            placeholder="Votre nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className={inputClasses}
          />
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClasses}
          />
          <textarea
            placeholder="Votre message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className={`${inputClasses} resize-none`}
          />
          <Button type="submit" className="self-center">
            Envoyer
          </Button>
        </form>
      </div>

      <footer className="mt-28 border-t border-accent/10 pt-8 text-center text-sm text-muted">
        © 2026 Enzo Cosnard — Fait avec Next.js &amp; Three.js
      </footer>
    </section>
  );
}
