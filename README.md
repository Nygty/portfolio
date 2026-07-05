# Portfolio — Enzo Cosnard

Site one-page bilingue (FR/EN) présentant l'agent concierge IA pour hôtels boutique.
Next.js 15 · React Three Fiber · GSAP ScrollTrigger · Lenis · Tailwind CSS · Framer Motion.
Production : [enzo-cosnard.vercel.app](https://enzo-cosnard.vercel.app)

## Lancer en local

```bash
npm install
npm run dev     # → http://localhost:3000
npm run build   # vérifier que le build de production passe
```

## Customiser

- **Textes du site (FR et EN)** : tout est dans `lib/translations.ts` — plus aucun texte en dur dans les sections.
- **Photo de profil** : écraser `public/enzo.jpg` en gardant le même nom (+ lien LinkedIn à renseigner dans `components/sections/About.tsx`).
- **Tarifs** : tableau `plans` en haut de `components/sections/Pricing.tsx`.
- **Palette / fonts** : bloc `@theme` dans `app/globals.css`.
- **Chorégraphie 3D au scroll** : `lib/scroll-timeline.ts`.

## Bilingual site

Le site est bilingue FR/EN sans librairie i18n : routing App Router (`app/[locale]/`),
dictionnaire `lib/translations.ts`, détection auto dans `middleware.ts` (cookie
`NEXT_LOCALE` puis `Accept-Language`), switch manuel `components/LocaleSwitcher.tsx`.

Pour ajouter une 3ᵉ langue (ex. italien) :

1. `lib/translations.ts` : dupliquer le bloc `en`, le traduire, l'ajouter à
   `translations` et ajouter `"it"` au type `Locale`.
2. `middleware.ts` et `components/LocaleSwitcher.tsx` : ajouter `"it"` à `LOCALES`.
3. `app/[locale]/layout.tsx` : ajouter `{ locale: "it" }` à `generateStaticParams`,
   l'OG image (`public/og-it.png`) et la locale OG dans `generateMetadata`.

## Déployer sur Vercel

1. Pousser ce repo sur GitHub (`Nygty/portfolio`).
2. Sur [vercel.com](https://vercel.com) : **Add New → Project → importer le repo** — Vercel détecte Next.js, aucun réglage à changer, **Deploy**.
3. Chaque push sur `main` redéploie automatiquement. Si le domaine change un jour,
   mettre à jour `metadataBase` dans `app/[locale]/layout.tsx`.
