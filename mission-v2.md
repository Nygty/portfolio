# 🎯 MISSION V2

Deux évolutions du site en un seul sprint :

1. **Rendre le site bilingue FR/EN** avec détection automatique de la langue du navigateur et switch manuel visible
2. **Remplacer l'avatar placeholder "EC"** dans la section "Qui suis-je" par une vraie photo d'Enzo

Contrainte principale : ne rien casser du site actuel. Toutes les animations 3D, le scroll GSAP, la scène Three.js, le design system doivent rester strictement identiques. On ne touche qu'à la couche i18n et à l'avatar.

---

# 📍 CONTEXTE

- Site actuel : one-pager Next.js 15 (App Router, TypeScript), déployé sur `https://enzo-cosnard.vercel.app`
- Repo : `github.com/Nygty/portfolio` branche `main`
- Répertoire local : `~/Desktop/portfolio`
- Stack : Next.js 15 App Router, Tailwind v4, R3F + drei, GSAP ScrollTrigger, Lenis, Framer Motion
- Contenu actuel : intégralement en français, dans les 6 composants sous `components/sections/`

**Photo d'Enzo** : elle est déjà placée dans `~/Desktop/portfolio/public/enzo.jpg` (Enzo l'a déposée manuellement via AirDrop avant de lancer cette mission). Si le fichier n'existe pas quand tu commences, arrête-toi et demande-le-lui.

---

# 🎯 CE QU'IL FAUT FAIRE

## 1. Extraction du texte dans un dictionnaire de traduction

Créer `lib/translations.ts` qui exporte un objet TypeScript typé strict :

```ts
export const translations = {
  fr: {
    nav: { ... },
    hero: { title: "Concierge IA pour hôtels boutique", subtitle: "...", ctaPrimary: "Voir la démo", ctaSecondary: "Contact" },
    agent: { title: "...", bullets: ["...", "...", "..."] },
    howItWorks: { ... },
    caseStudy: { ... },
    about: { ... },
    pricing: { ... , form: { ... } },
    footer: "..."
  },
  en: {
    // mêmes clés, textes en anglais
  }
} as const

export type Locale = "fr" | "en"
export type Translation = typeof translations.fr
```

**Traductions anglaises à écrire toi-même** (ne pas passer par un service externe). Ton attendu : professionnel, corporate, court. Style Stripe/Linear/Vercel. Quelques choix éditoriaux à respecter :

- "Concierge IA pour hôtels boutique" → **"AI concierge for boutique hotels"**
- "L'agent qui répond à vos emails 24/7, en 5 langues, avec le ton de votre maison." → **"The agent that answers your emails 24/7, in 5 languages, with the voice of your house."**
- "Un membre de plus dans votre équipe. Sans le salaire." → **"One more team member. Without the salary."**
- "En production chez" → **"Live at"**
- "13 chambres" → **"13 rooms"** / "5 langues traitées" → **"5 languages handled"** / "~2h/jour économisées à la réception" → **"~2h/day saved at the front desk"**
- "Qui suis-je" → **"About"**
- "3 formules. Pas de surprise." → **"3 plans. No surprise."**
- Pricing : garde les mots "Standard / Premium / Premium+" identiques. Traduis seulement les descriptions.

Sois cohérent : anglais britannique acceptable, mais pas de mélange. Reste sobre, pas d'exclamation, pas de "amazing" ou "revolutionary".

## 2. Routing i18n via App Router

Utilise le **routing App Router natif** de Next.js 15, PAS de librairie externe (pas de `next-intl`, pas de `next-i18next`). On veut zéro dépendance en plus.

Structure attendue :

```
app/
├── [locale]/
│   ├── layout.tsx      # Layout par locale (metadata, fonts, providers)
│   ├── page.tsx        # Le one-pager, prend `params.locale` et pioche dans translations
│   └── not-found.tsx   # 404 par locale (optionnel)
├── layout.tsx          # Root layout minimal (html+body)
└── page.tsx            # Redirect racine → /fr ou /en selon navigateur (voir middleware)
```

Le hook côté client :
```ts
// lib/useTranslation.ts
export function useTranslation(locale: Locale) {
  return translations[locale]
}
```

Passe `locale` en prop aux sections plutôt que via context (plus simple, moins de re-renders).

## 3. Détection automatique de la langue au premier chargement

Créer un `middleware.ts` à la racine du projet qui :

1. Détecte si l'URL contient déjà `/fr` ou `/en` → laisse passer
2. Sinon, lit le header `Accept-Language` de la requête
3. Redirige (`NextResponse.redirect`) vers `/en` si la langue préférée commence par `en`, sinon vers `/fr` (fallback FR par défaut, notre marché de base)
4. Mémorise le choix dans un cookie `NEXT_LOCALE` (durée 1 an) pour que le visiteur qui revient tombe direct sur sa langue même s'il a switché manuellement

Utilise `matcher` pour exclure `/api`, `/_next`, les assets, l'OG image. Sinon la redirection casse les ressources statiques.

## 4. Switch de langue manuel

Petit composant `<LocaleSwitcher />` visible sur toutes les pages, en **haut à droite fixe** (position: fixed, top-6 right-6, z-index élevé). Deux boutons `FR` / `EN` côte à côte, séparés par un `·`, celui de la locale active en `text-accent` gras, l'autre en `text-muted`.

Un clic sur la locale inactive :
- Change l'URL de `/fr/...` à `/en/...` (ou l'inverse) via `router.push`
- Écrit le nouveau cookie `NEXT_LOCALE` pour la mémoire
- Ne recharge PAS la page complète (transition douce)

Sur mobile : mêmes boutons mais placés en haut à droite avec un padding un peu réduit.

## 5. Photo d'Enzo dans la section "About"

Fichier source : `public/enzo.jpg` (déjà placé par Enzo).

Remplacer l'avatar "EC" dans `components/sections/About.tsx` par un rendu propre :
- Utilise `next/image` pour l'optimisation auto
- Crop **circulaire** (borderRadius: 50%) avec `object-cover` et `object-position: center 30%` (pour bien cadrer le visage, la photo est un portrait avec la tête en haut)
- Taille visible : 200-240 px de diamètre sur desktop, 160 px sur mobile
- Bordure : 2 px `rgba(74,158,255,0.3)` (bleu accent 30% opacité)
- Halo/glow externe : `box-shadow: 0 0 60px rgba(74,158,255,0.25)`
- Léger effet de flottement au survol (framer-motion, translation Y -4px sur 300ms)

Alt text : "Enzo Cosnard" (FR) / "Enzo Cosnard" (EN — identique, c'est un nom propre).

Ajoute un commentaire au-dessus du composant Image :
```tsx
{/* Photo : public/enzo.jpg. Pour la remplacer, écrase le fichier en gardant le même nom. */}
```

## 6. SEO bilingue

Dans `app/[locale]/layout.tsx`, générer les metadata dynamiquement :

- `title` FR : "Enzo Cosnard — Agent Concierge IA pour hôtels boutique"
- `title` EN : "Enzo Cosnard — AI Concierge Agent for boutique hotels"
- `description` traduite dans les deux langues
- `alternates.languages` : `{ 'fr-FR': '/fr', 'en-US': '/en' }` pour dire à Google que les deux versions existent
- `openGraph.locale` : `fr_FR` ou `en_US` selon la page

Balise `<html lang={locale}>` dynamique dans le layout par locale.

## 7. Vérifications finales

- `npm run build` doit compiler sans erreur et sans warning nouveau
- `npm run dev` → `localhost:3000` doit rediriger auto vers `/fr` ou `/en` selon ton Chrome
- Test manuel : va sur `/fr` puis clique `EN` → transition douce, cookie posé, refresh de la page → tu restes en EN
- Aucune régression visible : sphère 3D toujours là, scroll fluide, sections identiques, count-up qui marche, formulaire mailto fonctionnel dans les 2 langues (le sujet et le body du mail doivent être traduits aussi)

---

# 🛠️ CONTRAINTES

- **Aucune librairie i18n externe**. App Router pur + un fichier `translations.ts`.
- **Ne touche pas aux fichiers `components/three/*`**. La scène 3D n'a pas de texte à traduire, elle doit rester exactement comme aujourd'hui.
- **Ne touche pas à `lib/scroll-timeline.ts` ni à `SmoothScroll.tsx`**. Les hooks scroll doivent continuer de marcher avec le nouveau routing (attention à Lenis qui doit être monté au niveau `app/[locale]/layout.tsx` pour rester actif).
- **Ne touche pas au design system** (palette, fonts, composants UI). Le switch de langue reprend les classes existantes.
- **URL racine** `/` redirige immédiatement vers `/fr` ou `/en` selon Accept-Language.
- **URL de production** : `https://enzo-cosnard.vercel.app`. Mets à jour `metadataBase` en conséquence si ce n'est pas déjà fait.

---

# 📦 LIVRABLES

Fichiers créés :
- `middleware.ts` (racine)
- `app/[locale]/layout.tsx`
- `app/[locale]/page.tsx`
- `lib/translations.ts`
- `lib/useTranslation.ts` (ou fonction utilitaire simple)
- `components/LocaleSwitcher.tsx`

Fichiers modifiés :
- `app/layout.tsx` (devient minimal)
- `app/page.tsx` (devient un redirect racine)
- Chaque `components/sections/*.tsx` : prend une prop `t: Translation` et affiche `t.hero.title` au lieu du texte en dur
- `components/sections/About.tsx` : remplace l'avatar EC par `<Image src="/enzo.jpg" ... />`
- `README.md` : ajoute une section "Bilingual site" qui explique comment ajouter une 3ème langue plus tard

À la fin :
- 1 commit unique bien nommé : `feat: bilingual FR/EN site + Enzo photo`
- Push sur `main`
- Vercel redéploiera tout seul (~1 min)

---

# 🚀 DÉMARRAGE

1. Vérifie que `public/enzo.jpg` existe. Si non, dis-le à Enzo et attends.
2. Lis les 6 composants de section pour lister tous les strings à extraire dans `translations.ts`.
3. **Propose-moi ton plan en 5-6 étapes numérotées avant de coder**. Chaque étape doit laisser le site dans un état fonctionnel (approche incrémentale).
4. Attends ma validation du plan.
5. Implémente proprement, teste `npm run build` avant le commit, puis push.

Rappel : Enzo n'est pas développeur. Explique en français à chaque étape ce que tu fais et pourquoi. Si un choix technique a deux options viables (par exemple : "on peut mettre le switch dans le layout ou dans un provider client"), présente les deux et laisse-le trancher.
