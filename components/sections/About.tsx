"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "../ui/Reveal";
import type { Translation } from "@/lib/translations";

export default function About({ t }: { t: Translation }) {
  const links = [
    { label: t.about.links.github, href: "https://github.com/Nygty" },
    { label: t.about.links.linkedin, href: "#" }, // TODO: ajouter l'URL LinkedIn
    { label: t.about.links.email, href: "mailto:enzo26cosnard@gmail.com" },
  ];

  return (
    <section id="a-propos" className="relative min-h-screen px-6">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center text-center">
        <Reveal>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-fit"
          >
            {/* Photo : public/enzo.jpg. Pour la remplacer, écrase le fichier en gardant le même nom. */}
            <Image
              src="/enzo.jpg"
              alt={t.about.photoAlt}
              width={224}
              height={224}
              className="h-40 w-40 rounded-full border-2 border-accent/30 object-cover object-[center_30%] shadow-[0_0_60px_rgba(74,158,255,0.25)] sm:h-56 sm:w-56"
            />
          </motion.div>
        </Reveal>

        <Reveal delay={0.15}>
          <h2 className="mt-10 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            {t.about.name}
          </h2>
          <div className="mt-6 space-y-2 text-lg text-muted">
            {t.about.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex justify-center gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-accent underline-offset-4 transition-colors hover:text-accent-hot hover:underline"
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
