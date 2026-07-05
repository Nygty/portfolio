# 🎯 MISSION

Construire de zéro un site web portfolio one-page pour Enzo Cosnard, un site futuriste-corporate qui présente son agent concierge IA et rapidement qui il est. L'expérience clé : **tout l'univers visuel doit être en 3D et bouger au scroll** (à la Awwwards / TikTok "3D scroll website"). Le site doit donner l'impression d'une agence tech haut de gamme, pas d'un portfolio étudiant.

Cible du site : hôtels boutique 4-5 étoiles (Méditerranée) qui découvrent l'agent, et recruteurs / partenaires potentiels. Le site doit inspirer confiance et donner envie de contacter Enzo dans les 30 premières secondes.

---

# 📍 CONTEXTE DU PROJET

**Propriétaire** : Enzo Cosnard, 20 ans, étudiant en stage à IBB Hotel Palazzo Bettina (Malte, hôtel boutique 5★ 13 chambres, PMS Mews). Vend son agent IA en SaaS aux hôtels boutique.

**Produit à présenter (l'agent concierge)** :
- Agent IA (Anthropic Claude Haiku 3.5) qui lit les emails de la boîte réception hôtelière et propose des réponses en 5 langues
- Déployé sur Render.com, connecté à Outlook via Make.com
- Dashboard V3.0 avec 5 onglets : Inbox, Analyze, History, Reservations (Mews API), Invoices (OCR)
- Fait gagner ~2h/jour à la réception (mail-tri + brouillons de réponse pré-écrits)

**Pricing (à afficher sur le site)** :
- Standard : 800€ setup + 80€/mois
- Premium : 800€ setup + 120€/mois (amélioration automatique hebdo + rapport mensuel)
- Premium+ : 1200€ setup + 150€/mois (idem + formation sur les vrais échanges de la réception)

**Enzo en 3 lignes (section About)** :
- 20 ans, étudiant, actuellement en stage à IBB Palazzo Bettina (Malte)
- Développe et vend un agent concierge IA pour hôtels boutique
- Basé entre la France et Malte, ouvert aux missions freelance et partenariats

**Contact** : enzo26cosnard@gmail.com

**Repo GitHub cible** : `Nygty/portfolio` (à créer, public)
**Hébergement cible** : Vercel (déploiement gratuit, connecté au repo GitHub)
**Nom de domaine** : à choisir plus tard (Vercel donnera un `.vercel.app` en attendant)

**Ce qui n'existe PAS encore** : ce projet démarre from scratch, aucun code préexistant. Répertoire de travail : `~/Desktop/portfolio` (à créer).

---

# 🎯 CE QU'IL FAUT CONSTRUIRE

## 1. Stack technique (à utiliser exactement)

- **Next.js 15** (App Router, TypeScript)
- **React Three Fiber** (`@react-three/fiber`) + **drei** (`@react-three/drei`) pour la 3D
- **GSAP** + **ScrollTrigger** pour lier les animations au scroll
- **Lenis** (`@studio-freight/lenis` ou `lenis`) pour le smooth scroll fluide
- **Tailwind CSS** pour le style
- **Framer Motion** pour les micro-animations UI (fades, hovers de boutons)
- **next/font** avec `Space Grotesk` (titres) + `Inter` (corps de texte)

Pas de CMS, pas de backend, pas de base de données. Tout est statique et déployable sur Vercel gratuitement.

## 2. Structure du site (one-page, scroll vertical)

Le site est une seule page avec 6 sections. Le scroll pilote une timeline GSAP globale qui contrôle une scène Three.js unique montée en `position: fixed` sur toute la hauteur.

**Section 1 — HERO** (100vh)
- Titre géant : "Concierge IA pour hôtels boutique"
- Sous-titre : "L'agent qui répond à vos emails 24/7, en 5 langues, avec le ton de votre maison."
- CTA principal : bouton "Voir la démo" (scroll vers section 2)
- CTA secondaire : bouton "Contact" (scroll vers section 6)
- Élément 3D dominant à l'écran (voir section 3 ci-dessous)

**Section 2 — L'AGENT CONCIERGE** (150vh, plus long car scroll animé)
- Titre : "Un membre de plus dans votre équipe. Sans le salaire."
- 3 bullet points animés (apparaissent au scroll) :
  1. "Lit chaque email entrant en < 2 secondes"
  2. "Propose une réponse rédigée, prête à envoyer"
  3. "Apprend le ton de votre réception au fil des semaines"
- L'objet 3D principal se transforme / se déplace pendant cette section

**Section 3 — COMMENT ÇA MARCHE** (200vh, feature reveal au scroll)
- Titre : "En 3 étapes"
- Trois grosses cartes qui apparaissent une par une avec effet 3D (rotation Y + fade) :
  1. **Connexion** — "On branche l'agent à votre boîte mail (Outlook, Gmail) en 24h"
  2. **Écoute** — "L'agent lit vos emails et catégorise (résa, plainte, question, spam)"
  3. **Réponse** — "Vous validez le brouillon en un clic. Envoyé."

**Section 4 — CAS CLIENT** (100vh)
- Titre : "En production chez"
- Logo / nom : "IBB Hotel Palazzo Bettina — Birgu, Malte ★★★★★"
- Chiffres clés animés (count-up au scroll) :
  - "13 chambres"
  - "5 langues traitées"
  - "~2h/jour économisées à la réception"
- Note : ne pas inventer d'autres clients. Cette section reste discrète tant qu'Enzo n'en a qu'un.

**Section 5 — QUI SUIS-JE** (100vh)
- Photo circulaire / avatar 3D optionnel
- Nom : "Enzo Cosnard"
- Pitch en 3 lignes (voir contexte plus haut)
- Liens : GitHub (`github.com/Nygty`), LinkedIn (placeholder `#`), Email

**Section 6 — TARIFS + CONTACT** (150vh)
- Titre : "3 formules. Pas de surprise."
- 3 cartes tarifaires en 3D (Standard / Premium / Premium+) avec le pricing exact ci-dessus
- Formulaire de contact SIMPLE : nom + email + message + bouton "Envoyer"
- Le formulaire envoie via **`mailto:`** direct vers `enzo26cosnard@gmail.com` (pas de backend). Voir section Contraintes pour la logique exacte.
- Footer minimal : "© 2026 Enzo Cosnard — Fait avec Next.js & Three.js"

## 4. L'expérience 3D (le cœur du site)

**Une seule scène Three.js** est montée en `position: fixed; inset: 0; z-index: -1` derrière le contenu. Cette scène persiste sur toute la hauteur du site et ses éléments s'animent en fonction du scroll global.

**Ce que je te demande de proposer, Claude Code** (choisis une direction cohérente, futuriste, corporate, épurée — pas de kitsch, pas de licorne) :
- Un ou deux objets 3D "signature" qui incarnent l'agent IA (sphère organique déformée par du bruit, orbe pulsant, cristal, particules organisées, réseau de nœuds lumineux, etc.)
- Un environnement (grille en perspective infinie, fog, glow, éclairage volumétrique)
- Une palette 3D cohérente avec la palette UI (voir Contraintes)

**Comportements au scroll (à câbler avec GSAP ScrollTrigger)** :
- Section 1 → l'objet est centré, en rotation lente
- Section 1 → 2 : l'objet se déplace vers la droite, la caméra dolly légèrement
- Section 2 → 3 : l'objet se fragmente / se démultiplie pour illustrer "les 3 étapes"
- Section 3 → 4 : reformation de l'objet
- Section 4 → 5 : l'objet passe en background flou
- Section 5 → 6 : l'objet remonte, les cartes de prix apparaissent devant

Utilise `useScroll` de drei ou une timeline GSAP maître avec `scrollTrigger: { scrub: true }`. Le scrub doit être fluide (valeur `scrub: 1` ou `scrub: 1.5`).

## 5. Design system

**Palette** (à définir dans `tailwind.config.ts`) :
- `bg` : `#05060a` (noir bleuté profond)
- `surface` : `#0d1017` (cartes)
- `accent` : `#4a9eff` (cyan-bleu néon)
- `accent-hot` : `#7c5cff` (violet secondaire pour highlights)
- `text` : `#e6ecf5`
- `muted` : `#7a869a`

**Typographie** :
- Titres : Space Grotesk 600/700, letter-spacing serré
- Corps : Inter 400/500
- Chiffres : Space Grotesk 700, tabular-nums

**Composants UI** :
- Boutons : fond `accent`, texte noir, hover = glow + léger scale
- Cartes : `surface` avec bordure `1px solid rgba(74,158,255,0.15)`, glassmorphism très léger (`backdrop-blur-sm`)
- Micro-interactions Framer Motion sur tous les CTA

**Ton éditorial (français, tutoiement absent, tournures courtes et affirmatives)** :
- ✅ "L'agent qui répond à vos emails, 24/7."
- ❌ "Bienvenue sur mon site où vous pourrez découvrir mon super agent"

---

# 🛠️ CONTRAINTES

- **Responsive mobile** : la scène 3D DOIT dégrader gracieusement sur mobile. Sur écran < 768px : baisser drastiquement le nombre de particules / la géométrie, ou remplacer par une version simplifiée (une seule sphère qui tourne, pas de scroll-3D complexe). Le site doit rester utilisable sur iPhone.
- **Performance** : cible Lighthouse Performance ≥ 80 sur desktop. Lazy-load la scène 3D (`dynamic(() => import('./Scene'), { ssr: false })`). Pas de modèle GLTF lourd téléchargé — préfère de la géométrie procédurale Three.js pure.
- **Accessibility** : respecter `prefers-reduced-motion` — si l'utilisateur a activé cette option système, désactiver toutes les animations scroll-3D et afficher les sections en statique.
- **Pas de backend** : le formulaire de contact utilise `mailto:` en construisant `href="mailto:enzo26cosnard@gmail.com?subject=...&body=..."` avec les valeurs du formulaire encodées en URL. Pas de service tiers, pas d'API à configurer.
- **SEO minimal** : `<title>Enzo Cosnard — Agent Concierge IA pour hôtels boutique</title>`, meta description, OG image (peut être un screenshot du hero, à générer en placeholder).
- **Pas de credentials, pas de tokens, pas de secrets** dans le code ou les commits.
- **Style de code** : TypeScript strict, composants React fonctionnels, hooks. Fichiers en `.tsx`. Chaque section = un composant dans `components/sections/`.
- **Langue** : tout le contenu utilisateur en **français**. Les commentaires du code peuvent être en français ou anglais, mais reste cohérent dans un même fichier.
- **Pas de librairie de composants** type shadcn / MUI. Tout en Tailwind + composants maison, pour garder le contrôle du style futuriste.

---

# 📦 LIVRABLES ATTENDUS

Structure du projet à créer :

```
portfolio/
├── app/
│   ├── layout.tsx           # RootLayout avec fonts, metadata SEO
│   ├── page.tsx             # One-pager qui assemble toutes les sections
│   └── globals.css          # Tailwind base + custom scrollbar
├── components/
│   ├── three/
│   │   ├── Scene.tsx        # Scène R3F principale, montée en fixed
│   │   ├── Signature.tsx    # L'objet 3D "signature" (à ton choix)
│   │   └── Environment.tsx  # Fog, lights, background 3D
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Agent.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── CaseStudy.tsx
│   │   ├── About.tsx
│   │   └── Pricing.tsx      # Contient aussi le form contact
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Counter.tsx      # Count-up animé au scroll
│   └── SmoothScroll.tsx     # Wrapper Lenis
├── lib/
│   └── scroll-timeline.ts   # Timeline GSAP maître qui pilote la scène 3D
├── public/
│   └── og-image.png         # Placeholder OG (peut être généré simple)
├── tailwind.config.ts       # Palette + fonts custom
├── next.config.js
├── tsconfig.json
├── package.json
├── README.md                # Instructions de lancement local + déploiement Vercel
└── .gitignore
```

**À la fin, le site doit** :
1. Se lancer en local avec `npm run dev` sur `http://localhost:3000`
2. Se builder sans erreur avec `npm run build`
3. Être prêt à pusher sur `github.com/Nygty/portfolio` et à connecter à Vercel en 2 clics
4. Contenir un `README.md` qui explique en 10 lignes comment le lancer, le customiser et le déployer

---

# 🚀 DÉMARRAGE

1. **Lis ce fichier en entier**, puis pose-moi toutes les questions ambiguës avant de coder. Ne devine pas.
2. **Propose-moi un plan d'implémentation en 6-8 étapes numérotées** avant de toucher au clavier. Chaque étape doit produire un site fonctionnel (approche incrémentale) :
   - Étape 1 : projet Next.js vide qui affiche le hero en HTML plat
   - Étape 2 : ajout Tailwind + design system + toutes les sections en statique
   - Étape 3 : intégration Three.js (une sphère qui tourne, sans scroll)
   - Étape 4 : Lenis + GSAP ScrollTrigger (timeline maître, scrub)
   - Étape 5 : la scène 3D signature avec ta proposition créative
   - Étape 6 : responsive + `prefers-reduced-motion` + optimisation perf
   - Étape 7 : SEO, README, prêt-à-déployer
3. **Attends ma validation du plan** avant de commencer.
4. **Implémente étape par étape**. À la fin de chaque étape : `git commit` avec un message clair (`feat: hero section`, `feat: three.js scene`, etc.) et un rapide résumé de ce que je peux tester en local (`npm run dev` → ouvre `localhost:3000` → tu dois voir X).
5. **À la fin de tout** : `git push` sur la branche `main` du repo `Nygty/portfolio` (à créer via `gh repo create` si `gh` est installé, sinon me donner les commandes manuelles). README à jour. Site prêt à déployer sur Vercel.

**Rappel important** : je ne suis pas développeur. Explique-moi en français chaque étape avant de la faire, et signale-moi si tu vas installer un paquet npm que je ne connais pas. Si un choix a plusieurs options (par exemple : "on peut faire ça avec drei OU avec du R3F pur"), présente-moi les deux et laisse-moi trancher.

**Sur la 3D signature** : sois audacieux mais cohérent. Un site futuriste-corporate ne veut pas dire un site tape-à-l'œil — pense Stripe, Linear, Vercel, plutôt qu'un jeu vidéo. Moins peut être plus.
