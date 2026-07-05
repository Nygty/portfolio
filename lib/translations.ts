// Dictionnaire de traduction FR/EN.
// Le français est la référence : son type définit la forme exacte que
// l'anglais doit respecter (clé manquante ou en trop = erreur de build).

const fr = {
  meta: {
    title: "Enzo Cosnard — Agent Concierge IA pour hôtels boutique",
    description:
      "L'agent IA qui répond aux emails de votre réception 24/7, en 5 langues, avec le ton de votre maison. En production à l'IBB Hotel Palazzo Bettina (Malte).",
  },
  hero: {
    eyebrow: "Enzo Cosnard — Agent concierge IA",
    titleStart: "Concierge IA pour ",
    titleAccent: "hôtels boutique",
    subtitle:
      "L'agent qui répond à vos emails 24/7, en 5 langues, avec le ton de votre maison.",
    ctaPrimary: "Voir la démo",
    ctaSecondary: "Contact",
  },
  agent: {
    titleStart: "Un membre de plus dans votre équipe. ",
    titleAccent: "Sans le salaire.",
    bullets: [
      "Lit chaque email entrant en < 2 secondes",
      "Propose une réponse rédigée, prête à envoyer",
      "Apprend le ton de votre réception au fil des semaines",
    ],
  },
  howItWorks: {
    title: "En 3 étapes",
    steps: [
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
    ],
  },
  caseStudy: {
    eyebrow: "En production chez",
    hotel: "IBB Hotel Palazzo Bettina",
    location: "Birgu, Malte",
    stats: [
      { value: 13, prefix: "", suffix: "", label: "chambres" },
      { value: 5, prefix: "", suffix: "", label: "langues traitées" },
      {
        value: 2,
        prefix: "~",
        suffix: "h/jour",
        label: "économisées à la réception",
      },
    ],
  },
  about: {
    name: "Enzo Cosnard",
    photoAlt: "Enzo Cosnard",
    lines: [
      "20 ans, étudiant, actuellement en stage à IBB Palazzo Bettina (Malte).",
      "Développe et vend un agent concierge IA pour hôtels boutique.",
      "Basé entre la France et Malte, ouvert aux missions freelance et partenariats.",
    ],
    links: {
      github: "GitHub",
      linkedin: "LinkedIn",
      email: "Email",
    },
  },
  pricing: {
    title: "3 formules. Pas de surprise.",
    perMonth: " / mois",
    plans: [
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
    ],
    contactTitle: "Parlons de votre réception.",
    form: {
      name: "Votre nom",
      email: "Votre email",
      message: "Votre message",
      submit: "Envoyer",
      mailSubjectPrefix: "Contact portfolio — ",
      noName: "sans nom",
    },
  },
  localeSwitcher: {
    ariaLabel: "Changer de langue",
  },
  footer: "© 2026 Enzo Cosnard — Fait avec Next.js & Three.js",
};

// Le type de référence : l'anglais DOIT avoir exactement cette forme.
export type Translation = typeof fr;
export type Locale = "fr" | "en";

const en: Translation = {
  meta: {
    title: "Enzo Cosnard — AI Concierge Agent for boutique hotels",
    description:
      "The AI agent that answers your front desk emails 24/7, in 5 languages, with the voice of your house. Live at IBB Hotel Palazzo Bettina (Malta).",
  },
  hero: {
    eyebrow: "Enzo Cosnard — AI concierge agent",
    titleStart: "AI concierge for ",
    titleAccent: "boutique hotels",
    subtitle:
      "The agent that answers your emails 24/7, in 5 languages, with the voice of your house.",
    ctaPrimary: "See the demo",
    ctaSecondary: "Contact",
  },
  agent: {
    titleStart: "One more team member. ",
    titleAccent: "Without the salary.",
    bullets: [
      "Reads every incoming email in < 2 seconds",
      "Drafts a written reply, ready to send",
      "Learns the tone of your front desk week after week",
    ],
  },
  howItWorks: {
    title: "3 steps",
    steps: [
      {
        title: "Connect",
        text: "We plug the agent into your mailbox (Outlook, Gmail) within 24 hours.",
      },
      {
        title: "Listen",
        text: "The agent reads your emails and sorts them: booking, complaint, question, spam.",
      },
      {
        title: "Reply",
        text: "You approve the draft in one click. Sent.",
      },
    ],
  },
  caseStudy: {
    eyebrow: "Live at",
    hotel: "IBB Hotel Palazzo Bettina",
    location: "Birgu, Malta",
    stats: [
      { value: 13, prefix: "", suffix: "", label: "rooms" },
      { value: 5, prefix: "", suffix: "", label: "languages handled" },
      {
        value: 2,
        prefix: "~",
        suffix: "h/day",
        label: "saved at the front desk",
      },
    ],
  },
  about: {
    name: "Enzo Cosnard",
    photoAlt: "Enzo Cosnard",
    lines: [
      "20 years old, student, currently interning at IBB Palazzo Bettina (Malta).",
      "Builds and sells an AI concierge agent for boutique hotels.",
      "Based between France and Malta, open to freelance work and partnerships.",
    ],
    links: {
      github: "GitHub",
      linkedin: "LinkedIn",
      email: "Email",
    },
  },
  pricing: {
    title: "3 plans. No surprise.",
    perMonth: " / month",
    plans: [
      {
        name: "Standard",
        setup: "800€ setup",
        monthly: "80€",
        features: [
          "Automatic sorting of incoming emails",
          "Reply drafts in 5 languages",
          "Monitoring dashboard",
        ],
      },
      {
        name: "Premium",
        setup: "800€ setup",
        monthly: "120€",
        features: [
          "Everything in Standard",
          "Automatic weekly improvement",
          "Monthly report",
        ],
      },
      {
        name: "Premium+",
        setup: "1200€ setup",
        monthly: "150€",
        features: [
          "Everything in Premium",
          "Training on your front desk's real conversations",
        ],
      },
    ],
    contactTitle: "Let's talk about your front desk.",
    form: {
      name: "Your name",
      email: "Your email",
      message: "Your message",
      submit: "Send",
      mailSubjectPrefix: "Portfolio contact — ",
      noName: "no name",
    },
  },
  localeSwitcher: {
    ariaLabel: "Switch language",
  },
  footer: "© 2026 Enzo Cosnard — Built with Next.js & Three.js",
};

export const translations: Record<Locale, Translation> = { fr, en };
