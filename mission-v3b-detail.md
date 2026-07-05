# 🎯 MISSION V3B-DETAIL — Enrichissement visuel de la façade et du hall

**Contexte** : la V3B est en cours (branche `v3b-zoom-into-machine`). Les étapes 1 et 2 sont poussées : façade filaire bleu néon 4 étages + hall intérieur (colonnes, comptoir, écran qui pulse) + caméra qui plonge de l'extérieur vers l'intérieur au scroll. Preview : `https://portfolio-git-v3b-zoom-into-machine-nygtyo.vercel.app/fr`

Enzo trouve le rendu actuel **trop pauvre visuellement**. Avant d'attaquer l'étape 3 (zoom dans l'écran + couche Outlook), on fait une passe de densification esthétique sur ce qui existe. Objectif : que la scène soit **belle à regarder même immobile**, pas juste une illustration technique.

**On reste dans le style "blueprint holographique bleu néon" (Direction A) et sur la contrainte "tout procédural, zéro modèle 3D téléchargé".** On ne change PAS le concept, on l'enrichit.

---

# 📍 CE QU'IL FAUT AJOUTER

## 1. Façade (Phase 1 du scroll — hero)

**État actuel** : parallélépipède 4 étages, 20 fenêtres sombres + 4 allumées, double porte, enseigne, antenne. Rotation orbitale lente.

**À ajouter** :
- **Passer à 6 étages** (au lieu de 4) → l'hôtel a plus de présence, moins "cabane"
- **Fenêtres irrégulières** : varier l'intensité lumineuse de chaque fenêtre allumée (pas toutes à la même valeur). Certaines pulsent lentement de manière asynchrone (habitants qui vivent), d'autres restent fixes. Ajouter 2-3 fenêtres qui "s'allument" ou "s'éteignent" ponctuellement au fil du scroll (petit détail vivant).
- **Balcons filaires** aux 2ème et 4ème étages → ligne horizontale en léger surplomb avec garde-corps ajouré
- **Corniches** entre les étages → simple ligne d'edges plus épaisse toutes les X unités de hauteur
- **Store/marquise** au-dessus de l'entrée → simple ligne inclinée en L filaire
- **Éclairage au sol** devant l'entrée : 2 petits spots au sol qui projettent une lueur bleue vers le bâtiment (petits cônes ou plans lumineux)
- **Sol reflet** : un plan au sol devant la façade avec un léger effet miroir (reflet du bâtiment inversé, opacité faible ~15%, fade progressif). Simule un sol en marbre poli. Utilise `MeshReflectorMaterial` de drei si tu veux, ou une simple duplicata inversée en opacity 0.15.
- **Enseigne lumineuse** actuelle → la rendre plus visible : lettres stylisées "PALAZZO" en filaire lumineux violet, comme un néon
- **Antenne rouge** actuelle : la garder mais atténuer l'intensité pour ne pas voler la vedette au reste

## 2. Ciel/environnement autour de la façade

**État actuel** : fond noir profond avec fog.

**À ajouter** :
- **Étoiles/particules très fines** en background — champ de ~200 petits points blancs/bleu clair, très petits, immobiles (ou dérive extrêmement lente). Utilise un `BufferGeometry` avec `Points`.
- **Nuages/brume basse** : quelques plans horizontaux transparents en dégradé bleu foncé qui flottent très lentement au niveau du sol, pour donner une impression d'atmosphère.
- **Lune ou halo lointain** en haut à droite → grand cercle bleu très diffus, faible opacité, immobile. Ambiance nuit.

## 3. Hall (Phase 2 du scroll)

**État actuel** : 4 colonnes, chemin lumineux au sol, comptoir avec liseré, suspensions violettes, écran qui pulse.

**À ajouter** :
- **Sol : dallage** → grille de carreaux au sol (lignes filaires perpendiculaires) plutôt qu'un simple plan. Motif damier subtil (variations d'intensité entre carreaux clairs et foncés) sans être criard.
- **Plafond structuré** → grille de poutres au plafond avec spots encastrés qui projettent des cercles de lumière au sol. Aligne les spots pour créer un rythme visuel.
- **Murs latéraux** → actuellement le hall semble ouvert sur les côtés. Ajouter 2 murs partiels avec des cadres verticaux (colonnes) et de petits éléments décoratifs : miroirs muraux stylisés (rectangles verticaux légèrement lumineux), une horloge murale filaire (cercle avec 12 marques et 2 aiguilles fines qui tournent très lentement)
- **Comptoir enrichi** → ajouter derrière le comptoir : une étagère avec 5-6 cases rectangulaires (les casiers à clés d'un vieil hôtel), 1-2 orbes lumineux posés sur le comptoir (lampes), un vase filaire haut avec quelques traits représentant des fleurs
- **Ordinateur enrichi** → actuellement c'est un écran qui pulse. Ajouter :
  - Un clavier en dessous (rectangle plat avec grille de touches)
  - Une petite lampe de bureau à côté (bras articulé stylisé + tête coudée + halo lumineux jaune-blanc)
  - Une tasse de café à côté du clavier (cylindre avec anse)
  - Un stylo posé (petit cylindre incliné)
  - Un post-it au coin de l'écran (petit carré jaune-vert avec une ligne filaire "MEMO")
- **Plantes vertes** : 2 grandes plantes filaires stylisées dans les coins du hall (pot cylindrique + tiges verticales avec quelques feuilles triangulaires). Émissive vert-cyan très faible.
- **Fauteuils/canapé d'accueil** : côté opposé du comptoir, un canapé filaire stylisé (base + 3 coussins carrés). Pas besoin de détails, juste des edges.
- **Tableau/oeuvre d'art sur un mur** : rectangle filaire avec quelques traits abstraits à l'intérieur, très lumineux (accroche l'œil).
- **Particules de poussière** flottant dans l'air : quelques dizaines de points minuscules qui dérivent très lentement dans les rayons lumineux (donne l'impression que la lumière est volumétrique).

## 4. Éclairage général

**État actuel** : quelques lumières ponctuelles, fog bleu.

**À ajouter** :
- **Point lights supplémentaires** aux emplacements des lampes ajoutées (lampe de bureau, orbes du comptoir) → chacune projette une lueur locale qui donne du modelé.
- **Rim light** discret sur les colonnes et le comptoir → simule un contre-jour subtil qui détache les éléments du fond.
- **Fog** : légèrement plus dense pour renforcer la profondeur (le fond du hall doit être perceptiblement plus flou que le comptoir).
- **Bloom** (si pas encore installé) → **installer `@react-three/postprocessing`** et activer un Bloom léger (intensity 0.4-0.6, threshold moyen). C'est LUI qui va rendre la scène "photo" plutôt que "wireframe brut". C'est la modif la plus impactante de toute cette étape.

## 5. Détails cinématographiques au scroll

- Pendant la Phase 1 (façade), l'antenne clignote lentement en rouge (2s on, 2s off)
- Pendant la Phase 2 (hall), les particules de poussière sont plus visibles (elles ont besoin de la lumière du hall pour être perçues)
- L'horloge murale : les aiguilles avancent en temps réel (heure du navigateur)
- Le post-it "MEMO" pulse imperceptiblement (comme s'il attendait qu'on le lise) — ça crée un point d'attention qui prépare l'étape 3 (le zoom sur l'écran juste à côté)

---

# ⚠️ CONTRAINTES

- **Contrainte principale respectée** : tout en géométrie procédurale Three.js. **Zéro modèle 3D téléchargé, zéro texture image**. Uniquement des `boxGeometry`, `planeGeometry`, `cylinderGeometry`, `edgesGeometry`, `bufferGeometry` avec `Points`, éventuellement `MeshDistortMaterial` de drei pour les fleurs/plantes.
- **Palette respectée** : bleu néon `#4a9eff`, violet accent `#7c5cff`, blanc-bleu pour les fortes émissions, vert-cyan très discret pour les plantes, jaune-vert très discret pour le post-it, rouge pour l'antenne, jaune-blanc pour la lampe de bureau. **Pas d'autres couleurs**.
- **Nouveau package autorisé** : `@react-three/postprocessing` (pour le Bloom). C'est le seul.
- **Perf** : cible Lighthouse ≥ 70 desktop. Si l'ajout de tous ces éléments fait chuter en dessous de 65, désactive le Bloom en premier, puis les particules de poussière, puis les étoiles.
- **Ne pas casser** :
  - Le fondu de la façade quand la caméra la traverse (astuce cinéma déjà en place)
  - Le mouvement de caméra existant
  - Le contenu HTML bilingue par-dessus
  - Le compte du build (si `npm run build` casse, corrige avant de push)
- **Structure de code** : découpe la géométrie en sous-composants React dans `components/three/hotel/` pour rester lisible. Genre : `Facade.tsx`, `Sky.tsx`, `Lobby.tsx`, `LobbyFloor.tsx`, `LobbyCeiling.tsx`, `LobbyProps.tsx` (comptoir, ordi, lampe...), `LobbyDecor.tsx` (plantes, canapé, tableau).
- **Ne touche pas à** : la timeline scroll (`lib/scroll-timeline.ts`), le bilingue, les sections HTML, la photo Enzo, le formulaire.

---

# 📦 LIVRABLES

Fichiers créés :
- `components/three/hotel/Sky.tsx` (étoiles + lune + brume basse)
- `components/three/hotel/LobbyFloor.tsx` (dallage + reflet)
- `components/three/hotel/LobbyCeiling.tsx` (poutres + spots)
- `components/three/hotel/LobbyProps.tsx` (ordinateur enrichi + lampe + tasse + stylo + post-it)
- `components/three/hotel/LobbyDecor.tsx` (plantes + canapé + tableau + horloge + miroirs)
- `components/three/DustParticles.tsx` (particules de poussière volumétriques)

Fichiers modifiés :
- `components/three/hotel/Facade.tsx` (6 étages, balcons, corniches, marquise, néon PALAZZO, sol miroir)
- `components/three/hotel/Lobby.tsx` (murs latéraux, comptoir enrichi, fauteuil)
- `components/three/Environment.tsx` (Bloom via EffectComposer, fog ajusté, rim lights)
- `package.json` (ajout `@react-three/postprocessing`)

Commits : 3-4 commits logiques, exemple :
- `feat(v3b): enrich facade with balconies, cornices, neon sign, reflective floor`
- `feat(v3b): add sky with stars, moon, low fog atmosphere`
- `feat(v3b): densify lobby with floor pattern, ceiling lights, decor and props`
- `feat(v3b): add bloom postprocessing and dust particles`

Branche : reste sur `v3b-zoom-into-machine` (on ne crée pas de nouvelle branche).
Push : après chaque commit, pour que Vercel régénère la preview et qu'Enzo puisse voir la progression.

---

# 🚀 DÉMARRAGE

1. **Confirme d'abord que tu es bien sur la branche `v3b-zoom-into-machine`**. Si non, `git checkout v3b-zoom-into-machine`.

2. **Propose-moi ton plan en 4-6 étapes numérotées** avant de coder. L'ordre suggéré :
   - Étape 1 : installation du Bloom + réglages fog/lights → **impact visuel immédiat maximal** avec peu de code
   - Étape 2 : enrichissement façade (étages, balcons, corniches, marquise, néon PALAZZO, sol miroir)
   - Étape 3 : ciel/environnement (étoiles, lune, brume)
   - Étape 4 : sol et plafond du hall (dallage, poutres, spots)
   - Étape 5 : mobilier et décor du hall (comptoir enrichi, ordinateur + lampe + tasse + post-it, plantes, canapé, tableau, horloge)
   - Étape 6 : particules de poussière + détails animés (antenne clignotante, aiguilles horloge en temps réel, post-it qui pulse)

3. **Attends ma validation** du plan avant de coder.

4. Implémente étape par étape, `git commit` + `git push` à la fin de chaque étape. Chaque push génère une preview Vercel qu'Enzo peut aller voir.

5. À chaque étape terminée, dis-moi en une phrase ce que je dois aller voir sur la preview.

---

**Rappel important** : Enzo n'est pas développeur, réponds en français, explique en langage clair ce que tu fais et pourquoi. Si un élément visuel te semble compliqué à réaliser proprement en procédural (par exemple : les feuilles de plantes qui rendent moches), simplifie-le et documente ton choix — mieux vaut moins d'éléments bien faits que plein d'éléments approximatifs.

**Rappel priorité** : l'étape 1 (Bloom) est **la plus impactante visuellement pour l'effort le plus faible**. Ne la saute surtout pas. Sans Bloom, une scène filaire reste "wireframe" ; avec Bloom, elle devient "hologramme cinéma".

**Sur le rendu photo-réaliste** : Enzo aurait voulu plus de réalisme mais on reste dans les contraintes procédurales. Fais du mieux possible sans compromettre la perf. Si à la fin il n'est toujours pas satisfait, on ouvrira une V4 séparée où on autorise les modèles GLTF.
