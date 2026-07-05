"use client";

import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Reveal from "../ui/Reveal";
import type { Translation } from "@/lib/translations";

export default function Pricing({ t }: { t: Translation }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Pas de backend : le bouton ouvre le client mail du visiteur,
  // pré-rempli avec le contenu du formulaire (sujet et corps traduits).
  const mailtoHref = `mailto:enzo26cosnard@gmail.com?subject=${encodeURIComponent(
    `${t.pricing.form.mailSubjectPrefix}${nom || t.pricing.form.noName}`
  )}&body=${encodeURIComponent(`${message}\n\n—\n${nom}\n${email}`)}`;

  const inputClasses =
    "w-full rounded-xl border border-accent/15 bg-surface/80 px-5 py-3 text-text placeholder:text-muted outline-none backdrop-blur-sm transition-colors focus:border-accent/60";

  return (
    <section id="tarifs" className="relative min-h-screen px-6 pb-10 md:min-h-[150vh]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center py-20">
        <Reveal>
          <h2 className="text-center font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            {t.pricing.title}
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {t.pricing.plans.map((plan, i) => (
            <Reveal key={plan.name} effect="flip" delay={i * 0.18}>
              <Card className="flex h-full flex-col">
                <h3 className="font-heading text-xl font-bold text-text">
                  {plan.name}
                </h3>
                <div className="mt-6">
                  <span className="font-heading text-5xl font-bold tabular-nums text-accent">
                    {plan.monthly}
                  </span>
                  <span className="text-muted">{t.pricing.perMonth}</span>
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
            {t.pricing.contactTitle}
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
            placeholder={t.pricing.form.name}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className={inputClasses}
          />
          <input
            type="email"
            placeholder={t.pricing.form.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClasses}
          />
          <textarea
            placeholder={t.pricing.form.message}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className={`${inputClasses} resize-none`}
          />
          <Button type="submit" className="self-center">
            {t.pricing.form.submit}
          </Button>
        </form>
      </div>

      <footer className="mt-28 border-t border-accent/10 pt-8 text-center text-sm text-muted">
        {t.footer}
      </footer>
    </section>
  );
}
