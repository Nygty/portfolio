# 🎯 MISSION V3 — L'expérience "Traversée d'hôtel"

Remplacer la scène 3D actuelle (Noyau Concierge — particules qui se fragmentent) par une **traversée cinématographique d'un hôtel** pilotée au scroll. À la place d'un objet abstrait qui bouge, la caméra se déplace **à l'intérieur d'un hôtel 3D** — un lieu par section. C'est plus narratif, plus mémorable, et ça raconte directement ce que fait l'agent (il vit dans l'hôtel avec l'équipe).

**Attention forte** : c'est ambitieux visuellement, mais on ne cherche PAS le photo-réalisme. On cherche un **style stylisé, corporate, futuriste** — cohérent avec le design system actuel (bleu néon sur noir profond). Pense **hologramme / blueprint tech / architecture néon**, pas jeu vidéo AAA.

---

# 📍 CONTEXTE DU PROJET

- Repo : `github.com/Nygty/portfolio` (V2 actuellement en prod sur `https://enzo-cosnard.vercel.app`)
- Répertoire local : `~/Desktop/portfolio`
- Stack déjà en place : Next.js 15 App Router bilingue FR/EN, R3F + drei, GSAP ScrollTrigger, Lenis, Framer Motion, Tailwind v4
- Photo Enzo dans `public/enzo.jpg`, LinkedIn en place
- 9 commits sur `main`, dernier commit propre

**Fichiers 3D actuels à retravailler** :
- `components/three/Scene.tsx` : monte la scène, boucle de rendu, wrapper Canvas
- `components/three/Signature.tsx` : le noyau de particules + fragmentation + reformation → **c'est ce fichier qu'on remplace**
- `components/three/Environment.tsx` : brouillard, lumières, grille → **on garde et on adapte**

**Fichier pilote scroll** :
- `lib/scroll-timeline.ts` : timeline GSAP maître avec un objet `sceneState` que la scène lit à chaque frame. Aujourd'hui elle expose : position sphère, rotation, zoom caméra, fragmentation, opacité anneaux. → **on garde ce pattern, on remplace les champs pour piloter la caméra sur un chemin**

**Ce qui ne change PAS** :
- Les 6 sections HTML et tous leurs textes (bilingue FR/EN intact)
- Le middleware et le routing `/fr` `/en`
- Le design system (palette, fonts, composants UI)
- La photo Enzo, le formulaire mailto, le compteur count-up
- Lenis + timeline GSAP maître (on modifie son contenu, pas sa structure)

---

# 🎯 LE CONCEPT CRÉATIF

## Direction visuelle imposée : "Blueprint holographique"

L'hôtel est rendu en **filaire / low-poly stylisé** avec matériaux **émissifs bleu néon** (`#4a9eff`) et accents violets (`#7c5cff`). Comme un plan d'architecte holographique qui flotte dans le noir. Pas de textures photo, pas de PBR, pas de modèles GLTF téléchargés — **tout est géométrie procédurale Three.js pure**.

Références mentales :
- Interfaces holographiques des films Marvel (Iron Man, Doctor Strange)
- Blueprints animés de Apple (les vues explosées de leur site produit)
- Style low-poly émissif type Beeple minimaliste

Ce que ce n'est **PAS** :
- Un modèle 3D photo-réaliste d'hôtel
- Un jeu vidéo à la première personne
- Un truc kitsch avec palmiers et lit avec matelas texturé

## Les 6 lieux, un par section

**Section 1 — HERO — La façade**
- Vue extérieure de l'hôtel de nuit
- Bâtiment stylisé (parallélépipède avec fenêtres émissives, quelques étages)
- 3-4 fenêtres allumées bleu néon
- Caméra en léger contre-plongée, lente rotation orbitale
- Ambiance : silence, promesse

**Section 2 — L'AGENT — Le hall d'entrée**
- La caméra "entre" dans l'hôtel (traversée des portes)
- Vue du hall : comptoir de réception simplifié, ordinateur avec écran émissif brillant plus fort que le reste (c'est l'agent)
- L'écran de l'ordinateur pulse doucement (représente l'IA qui "respire")
- Caméra en travelling vers le comptoir

**Section 3 — COMMENT ÇA MARCHE — Le couloir aux 3 portes**
- Couloir de chambres en perspective forte
- 3 portes qui s'illuminent successivement au scroll (une par étape : Connexion / Écoute / Réponse)
- Chaque porte a un pictogramme filaire au-dessus (enveloppe / œil / avion papier)
- Caméra en travelling latéral qui longe le couloir

**Section 4 — CAS CLIENT — La chambre luxueuse**
- Intérieur d'une chambre stylisée : lit filaire simple, grande fenêtre
- Par la fenêtre : silhouette holographique de La Valette (créneaux, dôme, mer) — Malte évoquée sans être décrite
- Caméra en travelling latéral, la fenêtre "défile" à l'écran
- Les chiffres du count-up (13 / 5 / ~2h) apparaissent flottants dans la pièce

**Section 5 — QUI SUIS-JE — Le bureau / rooftop**
- Petite scène atelier : un bureau, un écran, une chaise (tout en filaire émissif)
- OU alternative : rooftop de l'hôtel, vue sur les toits et la mer
- Choisis ce qui matche le mieux visuellement avec la photo circulaire d'Enzo qui apparaît en overlay HTML par-dessus la scène 3D
- Caméra fixe ou légère rotation

**Section 6 — TARIFS — Les 3 suites en enfilade**
- Vue en coupe : 3 suites côte à côte, chacune de plus en plus luxueuse
- Suite Standard : basique, une fenêtre
- Suite Premium : plus grande, deux fenêtres
- Suite Premium+ : la meilleure, terrasse
- Les cartes de prix HTML apparaissent devant chaque suite
- Caméra en travelling latéral final

---

# 🛠️ COMMENT LE CONSTRUIRE (TECHNIQUE)

## 1. Un unique fichier de géométrie "Hotel"

Nouveau fichier : `components/three/Hotel.tsx`

Il contient TOUTE la géométrie procédurale du bâtiment et de son intérieur, structurée en sous-composants React :

```tsx
<group>
  <Facade />         // section 1
  <Lobby />          // section 2
  <Corridor />       // section 3
  <Room />           // section 4
  <Office />         // section 5
  <SuitesRow />      // section 6
</group>
```

Chaque sous-composant est monté dans l'espace 3D à des coordonnées prédéfinies. La caméra se déplace ENTRE ces zones. Les zones peuvent être physiquement distantes (pas besoin qu'elles forment un vrai bâtiment cohérent — la caméra "coupe" de l'une à l'autre au montage).

Toutes les géométries : `<boxGeometry>`, `<planeGeometry>`, `<cylinderGeometry>`, `<edgesGeometry>` pour les filaires. Matériaux : `<meshBasicMaterial>` ou `<meshStandardMaterial>` avec `emissive` réglé haut et `emissiveIntensity` modulé.

**Aucun modèle GLTF/GLB à charger.** Zéro fichier binaire ajouté au repo.

## 2. Caméra pilotée par le scroll (le cœur du travail)

Dans `lib/scroll-timeline.ts`, remplace les champs `sceneState` actuels par :

```ts
type SceneState = {
  cameraPosition: [number, number, number]
  cameraLookAt: [number, number, number]
  cameraFov: number
  // effets d'ambiance
  fogDensity: number
  screenPulse: number  // 0-1, intensité du pulse de l'écran hall
  doorReveal: [number, number, number]  // opacité des 3 portes couloir
}
```

Puis, une timeline GSAP qui interpole ces valeurs entre 6 keyframes (une par section). Le `scrub: 1.2` reste identique — c'est ce qui donne l'effet moelleux TikTok.

Dans `Scene.tsx`, à chaque `useFrame`, lis `sceneState` et applique-le à la caméra R3F. Pense au `lerp` doux si nécessaire pour lisser encore.

## 3. Ambiance visuelle

- **Environnement** : garder `Environment.tsx`, adapter → brouillard bleu profond dense, une lumière ambiante très faible (le monde est presque noir hors des zones émissives), 1-2 point lights colorées qui bougent doucement pour ne pas être statiques
- **Post-processing** : ajouter `@react-three/postprocessing` avec un léger **Bloom** (les zones émissives glow). C'est LE truc qui va rendre le blueprint magique. Petite intensité (0.5-0.8), threshold moyen. Attention au poids performance (voir contraintes).
- **Pas d'ombres** (coûteux et inutile en style filaire)

## 4. Un fallback mobile drastique

Sur mobile (<768px) : au lieu de la traversée complète, montre **une seule vue statique de la façade** avec la fenêtre allumée qui pulse, et point. Zéro travelling scroll, zéro Bloom. Le contenu HTML reste lisible et le site reste fluide.

Réutilise le pattern déjà en place (media query + rendu conditionnel dans `Scene.tsx`).

## 5. `prefers-reduced-motion`

Idem V1/V2 : si activé, une image quasi statique de la façade + contenu HTML sans anim. Rien à réinventer.

---

# ⚠️ CONTRAINTES DURES

- **Branche Git dédiée** : `git checkout -b v3-hotel` avant de commencer. Ne pas toucher à `main`. Vercel te donnera automatiquement une URL preview du type `enzo-cosnard-git-v3-hotel-nygty.vercel.app` à chaque push sur cette branche. Enzo testera la V3 dessus. On mergera dans `main` seulement quand la V3 sera validée.
- **Ne pas casser le bilingue** : le middleware, `app/[locale]/*`, `LocaleSwitcher`, `translations.ts` — rien de tout ça ne bouge.
- **Ne pas casser le contenu HTML** : les 6 sections, le formulaire mailto, la photo Enzo, le count-up, le lien LinkedIn — rien ne bouge côté DOM.
- **Perf** : cible Lighthouse Performance ≥ 75 desktop (léger repli acceptable vs 88 actuel à cause du Bloom). Si ça descend en dessous, désactive le Bloom.
- **Poids build** : le bundle JS client ne doit pas dépasser +150 KB par rapport à la V2. Si `postprocessing` fait exploser le poids, propose une alternative sans Bloom.
- **Accessibilité** : la scène 3D est décorative, elle reste `aria-hidden`. Aucune information critique n'est portée par la 3D — tout est aussi dans le texte des sections.
- **Pas de nouveau modèle 3D binaire dans `public/`**. Tout en géométrie procédurale.
- **Un seul package npm autorisé en plus** : `@react-three/postprocessing` pour le Bloom. Rien d'autre.

---

# 📦 LIVRABLES

Fichiers créés :
- `components/three/Hotel.tsx` (grosse pièce, ~300-500 lignes)
- Éventuellement `components/three/hotel/Facade.tsx`, `Lobby.tsx`, `Corridor.tsx`, `Room.tsx`, `Office.tsx`, `SuitesRow.tsx` (si tu veux découper Hotel en sous-composants pour la lisibilité — préférable)

Fichiers modifiés :
- `components/three/Scene.tsx` : remplace `<Signature />` par `<Hotel />`, ajoute `<EffectComposer><Bloom /></EffectComposer>`, adapte la caméra
- `components/three/Environment.tsx` : ajuste fog, lights, retire les anneaux orbitaux (spécifiques à la sphère)
- `lib/scroll-timeline.ts` : nouveau `SceneState` orienté caméra + effets
- `package.json` : ajout `@react-three/postprocessing`

Fichiers **supprimés** :
- `components/three/Signature.tsx` (remplacé par Hotel) — supprime-le, ne le laisse pas orphelin

Branche : `v3-hotel`
Commits attendus : 4-6 commits logiques (`feat: hotel base geometry`, `feat: camera path scrolling`, `feat: bloom + ambience`, `feat: mobile fallback`, `fix: reduced motion`, `chore: cleanup old signature`)

À la fin :
- `npm run build` compile sans erreur
- Preview Vercel accessible sur `enzo-cosnard-git-v3-hotel-*.vercel.app`
- **NE PAS MERGER DANS MAIN** — Enzo décidera après avoir vu la preview

---

# 🚀 DÉMARRAGE

1. **Crée la branche** : `git checkout -b v3-hotel`

2. **Propose-moi d'abord 2 directions créatives possibles** avant de coder. Par exemple :
   - Direction A : hôtel en filaire pur (edges only, très minimaliste type Iron Man HUD)
   - Direction B : hôtel low-poly avec faces émissives légères (plus tangible, plus "solide")
   
   Explique en 3 lignes chaque direction, avec un avis. Je choisirai.

3. **Propose-moi ton plan d'implémentation en 5-7 étapes numérotées** avant de coder. Chaque étape doit laisser le site fonctionnel — approche incrémentale :
   - Étape 1 : bascule sur branche + création du fichier Hotel avec juste la façade statique visible dans le hero
   - Étape 2 : ajout des 6 zones géométriques dans l'espace (visible en scrollant sans caméra pilotée encore)
   - Étape 3 : câblage de la caméra sur le scroll (le travelling commence à marcher)
   - Étape 4 : ambiance (Bloom, fog, lights réglés)
   - Étape 5 : détails animés (pulse de l'écran hall, révélation des 3 portes, chiffres flottants)
   - Étape 6 : fallback mobile + reduced-motion
   - Étape 7 : nettoyage (suppression Signature.tsx, retrait anneaux, vérifs perf)

4. **Attends ma validation** de la direction ET du plan avant de coder.

5. Implémente étape par étape, `git commit` explicite après chaque étape, `git push` à la fin de chaque étape pour que Vercel me génère une preview intermédiaire. Comme ça je peux te dire "l'étape 3 casse quelque chose sur mobile" avant que tu enchaînes.

**Rappel important** : Enzo n'est pas développeur. À chaque étape, dis-lui :
- Ce que tu viens de faire en une phrase
- Ce qu'il peut vérifier visuellement sur le preview Vercel (une URL nouvelle à chaque push)
- Si un doute technique se présente, présente-lui deux options et laisse-le trancher

**Sur la créativité** : sois audacieux dans le concept mais rigoureux dans l'exécution. Un blueprint bleu-néon minimaliste bien fait battra un hôtel low-poly texturé mal fait. Priorité à la **cohérence visuelle** avec le design system actuel.

**Sur les erreurs** : si tu bloques sur un point technique (par exemple : "le Bloom fait ramer la scène"), n'invente pas de workaround miracle. Documente le blocage dans le chat, propose 2 alternatives, laisse Enzo choisir.
