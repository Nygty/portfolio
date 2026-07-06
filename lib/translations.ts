// Dictionnaire de traduction FR/EN.
// Le français est la référence : son type définit la forme exacte que
// l'anglais doit respecter (clé manquante ou en trop = erreur de build).

const fr = {
  meta: {
    title: "Enzo Cosnard — Agent Concierge IA pour hôtels boutique",
    description:
      "J'ai construit un agent IA qui répond aux emails de votre réception pendant que vous dormez — dans la langue du client, avec le ton de votre maison. Testé en conditions réelles dans un hôtel boutique 5★.",
  },
  hero: {
    eyebrow: "Enzo Cosnard — Agent concierge IA",
    titleStart: "Concierge IA pour ",
    titleAccent: "hôtels boutique",
    subtitle:
      "Vos clients reçoivent une réponse avant d'avoir fini leur café. Même à 3h du matin. Dans leur langue.",
    ctaPrimary: "Voir la démo",
    ctaSecondary: "Contact",
  },
  agent: {
    titleStart: "Un membre de plus dans votre équipe. ",
    titleAccent: "Sans le salaire.",
    bullets: [
      "Un email arrive à 3h du matin ? La réponse est prête à 3h01.",
      "Il rédige, vous relisez, vous cliquez. C'est envoyé.",
      "Il apprend le ton de votre maison semaine après semaine — et il ne bâille jamais.",
    ],
  },
  howItWorks: {
    title: "Trois étapes. Pas une de plus.",
    steps: [
      {
        title: "Connexion",
        text: "Je branche l'agent sur votre boîte mail — Outlook ou Gmail — en 10 minutes. Rien à installer.",
      },
      {
        title: "Écoute",
        text: "Il lit tout ce qui arrive et trie : réservation, plainte, question, spam.",
      },
      {
        title: "Réponse",
        text: "Vous validez le brouillon en un clic. Envoyé.",
      },
    ],
  },
  caseStudy: {
    stats: [
      {
        value: 30,
        prefix: "< ",
        suffix: " s",
        label: "pour répondre",
        countdown: true,
      },
      {
        value: 100,
        prefix: "",
        suffix: " %",
        label: "multilingue",
        countdown: false,
      },
      {
        value: 2,
        prefix: "~",
        suffix: "h/jour",
        label: "économisées à la réception",
        countdown: false,
      },
    ],
  },
  about: {
    name: "Enzo Cosnard",
    photoAlt: "Enzo Cosnard",
    lines: [
      "20 ans, étudiant, en stage dans un hôtel boutique 5★ en Méditerranée.",
      "Je construis et je vends un agent concierge IA — testé sur de vrais clients, pas en labo.",
      "Basé en Europe, ouvert aux missions freelance et aux partenariats.",
    ],
    links: {
      github: "GitHub",
      linkedin: "LinkedIn",
      email: "Email",
    },
  },
  pricing: {
    title: "Trois formules. Pas de ligne cachée.",
    perMonth: " / mois",
    plans: [
      {
        name: "Standard",
        setup: "800€ setup",
        monthly: "80€",
        features: [
          "Tri automatique des emails entrants",
          "Brouillons de réponse multilingues",
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
    contactTitle: "On parle de votre réception ?",
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
  // Micro-légendes de la cinématique V3B
  captions: {
    agentAtPost: "L'agent est déjà à son poste",
    emailArrives: "Un email arrive",
    agentDrafts: "L'agent rédige une réponse",
    sent: "Envoyé en 5 secondes",
  },
  // Éléments d'interface (V3B full-upgrade)
  ui: {
    scrollHint: "Défiler pour explorer ↓",
    agentReady: "L'agent est prêt",
    bookDemo: "Réserver une démo",
  },
  footer: "© 2026 Enzo Cosnard — Fait avec Next.js & Three.js",
  footerVersion: "v3.2 — fait main, avec beaucoup de ☕",
};

// Le type de référence : l'anglais DOIT avoir exactement cette forme.
export type Translation = typeof fr;
export type Locale = "fr" | "en";

const en: Translation = {
  meta: {
    title: "Enzo Cosnard — AI Concierge Agent for boutique hotels",
    description:
      "I built an AI agent that answers your front desk emails while you sleep — in the guest's language, with the voice of your house. Tested in real conditions at a 5★ boutique hotel.",
  },
  hero: {
    eyebrow: "Enzo Cosnard — AI concierge agent",
    titleStart: "AI concierge for ",
    titleAccent: "boutique hotels",
    subtitle:
      "Your guests get a reply before they finish their coffee. Even at 3am. In their own language.",
    ctaPrimary: "See the demo",
    ctaSecondary: "Contact",
  },
  agent: {
    titleStart: "One more team member. ",
    titleAccent: "Without the salary.",
    bullets: [
      "An email lands at 3am? The reply is ready by 3:01.",
      "It drafts, you proofread, you click. Sent.",
      "It learns the voice of your house week after week — and it never yawns.",
    ],
  },
  howItWorks: {
    title: "Three steps. Not one more.",
    steps: [
      {
        title: "Connect",
        text: "I plug the agent into your mailbox — Outlook or Gmail — in 10 minutes. Nothing to install.",
      },
      {
        title: "Listen",
        text: "It reads everything that comes in and sorts it: booking, complaint, question, spam.",
      },
      {
        title: "Reply",
        text: "You approve the draft in one click. Sent.",
      },
    ],
  },
  caseStudy: {
    stats: [
      {
        value: 30,
        prefix: "< ",
        suffix: "s",
        label: "to reply",
        countdown: true,
      },
      {
        value: 100,
        prefix: "",
        suffix: "%",
        label: "multilingual",
        countdown: false,
      },
      {
        value: 2,
        prefix: "~",
        suffix: "h/day",
        label: "saved at the front desk",
        countdown: false,
      },
    ],
  },
  about: {
    name: "Enzo Cosnard",
    photoAlt: "Enzo Cosnard",
    lines: [
      "20 years old, student, interning at a 5★ boutique hotel in the Mediterranean.",
      "I build and sell an AI concierge agent — tested on real guests, not in a lab.",
      "Based in Europe, open to freelance work and partnerships.",
    ],
    links: {
      github: "GitHub",
      linkedin: "LinkedIn",
      email: "Email",
    },
  },
  pricing: {
    title: "Three plans. No hidden line.",
    perMonth: " / month",
    plans: [
      {
        name: "Standard",
        setup: "800€ setup",
        monthly: "80€",
        features: [
          "Automatic sorting of incoming emails",
          "Multilingual reply drafts",
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
    contactTitle: "Shall we talk about your front desk?",
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
  captions: {
    agentAtPost: "The agent is already at its post",
    emailArrives: "An email arrives",
    agentDrafts: "The agent drafts a reply",
    sent: "Sent in 5 seconds",
  },
  ui: {
    scrollHint: "Scroll to explore ↓",
    agentReady: "Agent ready",
    bookDemo: "Book a demo",
  },
  footer: "© 2026 Enzo Cosnard — Built with Next.js & Three.js",
  footerVersion: "v3.2 — handmade, with plenty of ☕",
};

export const translations: Record<Locale, Translation> = { fr, en };
