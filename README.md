# Portfolio — Enzo Cosnard

Site one-page présentant l'agent concierge IA pour hôtels boutique.
Next.js 15 · React Three Fiber · GSAP ScrollTrigger · Lenis · Tailwind CSS · Framer Motion.

## Lancer en local

```bash
npm install
npm run dev     # → http://localhost:3000
npm run build   # vérifier que le build de production passe
```

## Customiser

- **Contenus des sections** : `components/sections/` (un fichier par section, textes en clair).
- **Photo de profil** : voir le `TODO` dans `components/sections/About.tsx` (+ lien LinkedIn à renseigner).
- **Tarifs** : tableau `plans` en haut de `components/sections/Pricing.tsx`.
- **Palette / fonts** : bloc `@theme` dans `app/globals.css`.
- **Chorégraphie 3D au scroll** : `lib/scroll-timeline.ts`.

## Déployer sur Vercel

1. Pousser ce repo sur GitHub (`Nygty/portfolio`).
2. Sur [vercel.com](https://vercel.com) : **Add New → Project → importer le repo** — Vercel détecte Next.js, aucun réglage à changer, **Deploy**.
3. Le site est en ligne sur `*.vercel.app`. Ensuite, mettre à jour `metadataBase` dans `app/layout.tsx` avec l'URL définitive (voir le `TODO`).
