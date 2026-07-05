import Reveal from "../ui/Reveal";

const links = [
  { label: "GitHub", href: "https://github.com/Nygty" },
  { label: "LinkedIn", href: "#" }, // TODO: ajouter l'URL LinkedIn
  { label: "Email", href: "mailto:enzo26cosnard@gmail.com" },
];

export default function About() {
  return (
    <section id="a-propos" className="relative min-h-screen px-6">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center text-center">
        <Reveal>
          {/* TODO: remplacer par vraie photo — remplacer ce <div> par
              <Image src="/photo.jpg" alt="Enzo Cosnard" width={144} height={144}
                     className="h-36 w-36 rounded-full object-cover" />
              (mettre le fichier photo.jpg dans le dossier public/) */}
          <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-hot shadow-[0_0_60px_rgba(74,158,255,0.35)]">
            <span className="font-heading text-5xl font-bold text-bg">EC</span>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <h2 className="mt-10 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Enzo Cosnard
          </h2>
          <div className="mt-6 space-y-2 text-lg text-muted">
            <p>
              20 ans, étudiant, actuellement en stage à IBB Palazzo Bettina
              (Malte).
            </p>
            <p>Développe et vend un agent concierge IA pour hôtels boutique.</p>
            <p>
              Basé entre la France et Malte, ouvert aux missions freelance et
              partenariats.
            </p>
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
