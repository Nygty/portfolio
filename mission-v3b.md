# 🎯 MISSION V3B — L'expérience "Zoom Into The Machine"

**⚠️ Ce prompt REMPLACE la mission V3 précédente.** Le concept a évolué avec Enzo. On ne fait plus une visite d'hôtel section par section, on fait une **séquence cinématographique unique** qui zoome dans l'ordinateur du réceptionniste pour montrer l'agent en action.

## Le concept en une phrase

Le visiteur du site scrolle → la caméra se pose sur la façade de l'hôtel → entre dans le hall → **zoome dans l'écran de l'ordinateur de la réception** → prend en main l'ordinateur (POV première personne) → une fenêtre Outlook s'ouvre, un email arrive, l'IA (représentée par un blob organique lumineux) réfléchit et propose une réponse, un clic de souris envoie le mail avec un "ding" sonore → **dézoome fluide** → le site normal reprend son cours avec cas client, about et tarifs en HTML classique.

**Toute la magie visuelle se joue dans les sections 1 à 3.** Les sections 4 à 6 sont en HTML classique (comme aujourd'hui) par-dessus une scène qui s'estompe.

---

# 📍 CONTEXTE DU PROJET

- Repo : `github.com/Nygty/portfolio` (V2 actuellement en prod sur `https://enzo-cosnard.vercel.app`)
- Répertoire local : `~/Desktop/portfolio`
- Stack en place : Next.js 15 App Router bilingue FR/EN, R3F + drei, GSAP ScrollTrigger, Lenis, Framer Motion, Tailwind v4
- Photo Enzo dans `public/enzo.jpg`, LinkedIn en place
- Bilingue FR/EN + middleware + LocaleSwitcher intacts, on n'y touche pas

**Fichiers 3D actuels à remplacer** :
- `components/three/Signature.tsx` : le noyau de particules → **à supprimer**
- `components/three/Scene.tsx` : wrapper Canvas → **à adapter**
- `components/three/Environment.tsx` : fog, lights → **à adapter**

**Fichier pilote scroll** :
- `lib/scroll-timeline.ts` : timeline GSAP maître → **structure conservée, contenu remplacé**

**Décisions prises par Enzo (à respecter strictement)** :
1. POV première personne — on ne montre jamais le réceptionniste, on est dans ses yeux
2. Robot IA = **blob organique lumineux qui pulse et se déforme** (style abstrait tech, sci-fi contemporain)
3. Emails avec animation fluide (voir section technique plus bas)
4. Bouton "Enable sound" en haut de la page, autorise les effets sonores
5. Sections 4-5-6 = zoom out arrière, contenu HTML classique par-dessus scène qui s'estompe
6. **Micro-légendes pendant l'animation** + infos détaillées dans les sections HTML

---

# 🎬 LA SÉQUENCE COMPLÈTE, SCROLL PAR SCROLL

## Phase 1 — La façade (0% → 15% du scroll)
- Vue extérieure de l'hôtel de nuit, filaire bleu néon
- Bâtiment stylisé (parallélépipède 4 étages, fenêtres émissives, quelques allumées en bleu)
- Caméra en légère contre-plongée, rotation orbitale très lente
- Contenu HTML par-dessus : titre du hero + sous-titre + 2 CTA (comme aujourd'hui)
- **Micro-légende (en bas d'écran, discrète) : aucune**. Le hero HTML est déjà le "carton titre".

## Phase 2 — Entrée dans le hall (15% → 30%)
- La caméra avance vers l'entrée de l'hôtel, traverse les portes vitrées
- Découverte du hall : sol filaire, réception au fond, comptoir avec un ordinateur dont l'écran émet une lumière bleu-blanc plus brillante que le reste
- Caméra en travelling avant continu
- **Micro-légende (fade-in en bas centre) : "L'agent est déjà à son poste"** (FR) / **"The agent is already at its post"** (EN)

## Phase 3 — Zoom dans l'écran (30% → 45%)
- La caméra continue d'avancer, focalisée sur l'écran de l'ordinateur
- L'écran grossit jusqu'à **occuper 100% du viewport**
- Transition douce : le canvas 3D fade légèrement vers noir, et une **couche HTML** prend le relais avec une simulation d'interface Outlook réaliste mais légèrement stylisée (fond gris foncé, police système)
- **Micro-légende (fade-out) : "..."** (elle disparaît, on est "dans l'écran")

## Phase 4 — La session Outlook (45% → 65%)
Séquence chorégraphiée en HTML par-dessus le canvas noir :

1. Une fenêtre de connexion Outlook apparaît (logo Outlook stylisé, champs email/password)
2. Le champ email se remplit **tout seul** avec `reception@palazzo-bettina.mt` (effet typewriter, ~40ms par caractère)
3. Le champ password se remplit tout seul (visible en points ●●●●●●●●, curseur qui clignote)
4. Le bouton "Sign In" se met en surbrillance puis se clique tout seul (effet clic visible : légère compression)
5. **"Ding"** de validation joue (si le son est activé)
6. La fenêtre de login se ferme en fondu, la boîte de réception Outlook apparaît
7. Un email arrive **avec un léger effet de glissement de haut en bas** (Framer Motion, spring soft) :
   - Expéditeur : `Sarah Miller <sarah.m@gmail.com>`
   - Objet : `Booking request for August 15th`
   - Preview : `Hello, do you have availability for 2 people on...`
   - L'email non lu est en gras avec un point bleu à gauche
8. L'email s'ouvre tout seul (clic simulé sur la ligne), on voit le contenu complet :
   > *"Hello,*
   > *Do you have availability for 2 people on August 15th? We're looking for a room with a sea view if possible.*
   > *Best regards,*
   > *Sarah"*

**Micro-légende (fade-in en haut) : "Un email arrive"** (FR) / **"An email arrives"** (EN)

## Phase 5 — L'IA réfléchit (65% → 80%)
- Une bulle latérale apparaît à droite de l'email (comme un panneau Copilot)
- Au centre de cette bulle, le **blob organique lumineux** apparaît en 3D (via un `<Canvas>` R3F imbriqué OU une animation SVG animée — voir contraintes techniques)
- Le blob pulse doucement pendant ~1.5 secondes (l'IA "réfléchit")
- Puis un texte de réponse apparaît en effet typewriter à côté du blob :
  > *"Dear Sarah,*
  > *Thank you for your inquiry. We have a Sea View Deluxe room available on August 15th at €280 per night, breakfast included.*
  > *Would you like me to hold the reservation for you?*
  > *Warm regards,*
  > *IBB Palazzo Bettina — Reception"*

**Micro-légende (fade-in centre) : "L'agent rédige une réponse"** (FR) / **"The agent drafts a reply"** (EN)

## Phase 6 — Envoi (80% → 90%)
- Le curseur souris (dessiné en SVG blanc) se déplace **tout seul** de manière fluide vers le bouton "Send"
- Le bouton se surbrille (hover state) au survol
- **Clic** : le bouton se compresse, un "swoosh" sonore joue (si son activé)
- L'email s'envoie avec un effet visuel (l'email glisse hors de l'écran vers la droite)
- Un toast "✓ Message sent" apparaît en haut à droite

**Micro-légende (fade-in bas) : "Envoyé en 5 secondes"** (FR) / **"Sent in 5 seconds"** (EN)

## Phase 7 — Dézoom (90% → 100%)
- La couche HTML Outlook fade out
- Le canvas 3D revient : dézoom fluide qui recule de l'écran, ressort du hall, sort de l'hôtel
- La façade réapparaît de plus en plus loin
- Puis fondu global vers noir profond
- Les sections HTML classiques (cas client, about, tarifs) apparaissent par-dessus une scène apaisée (juste la façade en très petit format au loin dans le fond, en flou)

---

# 🛠️ IMPLÉMENTATION TECHNIQUE

## Architecture proposée

Le mélange 3D pur / HTML par-dessus est complexe. Voici l'architecture recommandée :

```
components/three/
├── Scene.tsx              # Canvas R3F principal (fixed, z-index -1)
├── Hotel.tsx              # Contient Façade + Hall + Ordinateur (géométrie procédurale)
├── Blob.tsx               # Le blob organique lumineux (à réutiliser dans la bulle Copilot)
└── Environment.tsx        # Fog, lights, Bloom

components/simulation/     # NOUVEAU DOSSIER pour la séquence Outlook HTML
├── OutlookScene.tsx       # Container qui apparaît quand le scroll atteint 30-90%
├── LoginWindow.tsx        # Fenêtre de connexion
├── Inbox.tsx              # Boîte de réception + email qui arrive
├── EmailDetail.tsx        # Vue détaillée de l'email
├── AIPanel.tsx            # Panneau latéral avec le blob et la réponse
└── SendCursor.tsx         # Curseur souris SVG qui bouge et clique

components/ui/
├── SoundToggle.tsx        # Bouton "Enable sound" en haut
└── Caption.tsx            # Micro-légendes bilingues qui apparaissent au scroll

lib/
├── scroll-timeline.ts     # Timeline GSAP maître, expose SceneState
├── sound.ts               # Gestion des effets sonores (Web Audio API)
└── translations.ts        # Ajouter les captions FR/EN
```

## Points techniques clés

### 1. Transition 3D → HTML dans Phase 3
Quand le scroll atteint ~30%, le canvas 3D **ne disparaît pas** — il continue de rendre en arrière-plan (avec un fade progressif de son opacité de 100% à 30%). Par-dessus, `<OutlookScene />` apparaît avec `pointer-events: none` (on ne clique rien, tout est piloté par le scroll).

Utilise `useScrollState` (à créer) qui expose la valeur scroll normalisée 0-1 et un état dérivé `phase: 'facade' | 'lobby' | 'zoomIn' | 'outlook' | 'ai' | 'send' | 'zoomOut'`. Chaque sous-composant lit ce state et anime en conséquence.

### 2. Le blob organique lumineux
Deux options :
- **A. Blob 3D R3F** : sphère avec `MeshDistortMaterial` de drei, ou shader custom avec bruit Perlin. Rendu dans un mini-Canvas imbriqué dans le panneau HTML.
- **B. Blob SVG animé** : shape morphique avec `<animate>` SVG ou Framer Motion path morph. Plus léger, mais moins bluffant.

→ Fais un prototype rapide avec l'option A. Si ça fait ramer, bascule sur B.

### 3. Textes qui bougent
Enzo veut des animations d'emails **fluides**. Utilise Framer Motion pour :
- Le glissement de l'email entrant : `initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', damping: 20 }}`
- L'effet typewriter : soit `Framer Motion` avec délai par caractère, soit une petite lib type `react-type-animation` (autorisée exceptionnellement si vraiment plus simple)
- L'ouverture de la fenêtre : `scale: 0.95 → 1` avec spring
- Les fondus entre phases : `AnimatePresence` + `motion.div`

### 4. Le son
Fichier `lib/sound.ts` avec :
- Un contexte `SoundProvider` React qui expose `playDing()`, `playSwoosh()`
- État `enabled: boolean` piloté par le bouton `<SoundToggle />`
- Charge 2 samples courts et légers (< 20 KB chacun) hébergés en `/public/sounds/`
- **Si `enabled` est `false`, `play*()` ne fait rien** — pas d'erreur console, silencieux
- Assets libres de droits : utilise Freesound ou générez-en avec Web Audio API (préférable — zéro fichier à ajouter). Un simple `AudioContext.createOscillator()` avec fréquence 880Hz + fade envelope suffit pour un "ding" propre.

### 5. Les micro-légendes bilingues
Nouveau composant `<Caption />` qui reçoit `id` et lit `translations[locale].captions[id]`. Positionnement fixed en bas ou en haut selon la phase. Fade in/out lié au scroll GSAP.

Ajoute dans `translations.ts` :
```ts
captions: {
  agentAtPost: { fr: "L'agent est déjà à son poste", en: "The agent is already at its post" },
  emailArrives: { fr: "Un email arrive", en: "An email arrives" },
  agentDrafts: { fr: "L'agent rédige une réponse", en: "The agent drafts a reply" },
  sent: { fr: "Envoyé en 5 secondes", en: "Sent in 5 seconds" }
}
```

### 6. Le curseur souris qui bouge tout seul
SVG blanc avec ombre portée subtile, piloté par GSAP :
```ts
gsap.to(cursorRef.current, {
  x: sendButtonX, y: sendButtonY,
  duration: 1.2, ease: 'power2.inOut',
  scrollTrigger: { trigger: '#phase-send', scrub: true }
})
```
À la fin du chemin, animation de clic (scale 1 → 0.85 → 1).

## Fallback mobile
Sur mobile (<768px), la séquence complète est **trop coûteuse et trop petite pour être lisible**. On la remplace par :
- La façade statique reste en fond flou
- Les sections HTML restent parfaitement lisibles
- La séquence Outlook devient une **suite d'images statiques** (3-4 screenshots de la séquence) qui apparaissent en fade au scroll — pas d'animation complexe

Utilise `useMediaQuery` pour détecter et rendre `<OutlookSceneMobile />` au lieu de la version desktop.

## Fallback `prefers-reduced-motion`
- Pas d'animation caméra
- Pas de typewriter
- Pas de curseur qui bouge
- La séquence Outlook affiche directement l'état final (email répondu, envoyé)
- Contenu HTML pleinement accessible

---

# ⚠️ CONTRAINTES DURES

- **Branche Git dédiée** : `git checkout -b v3b-zoom-into-machine`. Ne pas toucher à `main` avant validation d'Enzo sur la preview Vercel. **Note** : si tu as déjà créé une branche `v3-hotel` précédemment, supprime-la (`git branch -D v3-hotel`) parce que le concept a changé.
- **Ne pas casser le bilingue** : middleware, `app/[locale]/*`, `LocaleSwitcher`, `translations.ts` — rien de tout ça ne bouge dans son architecture. On ajoute juste des clés `captions.*`.
- **Ne pas casser les sections HTML 4-5-6** : Cas Client, About, Tarifs — leur contenu reste identique.
- **Aucun modèle 3D binaire dans `public/`** — tout géométrie procédurale.
- **Sons via Web Audio API (`OscillatorNode`)** — pas de fichier audio ajouté au repo.
- **Packages autorisés en plus** : `@react-three/postprocessing` (Bloom) et éventuellement `react-type-animation` si le typewriter maison est fragile.
- **Perf** : cible Lighthouse ≥ 70 desktop (repli acceptable, l'expérience justifie). Si tu descends en dessous de 65, alerte Enzo avant de continuer.
- **Aucune donnée personnelle réelle dans les emails simulés** : `sarah.m@gmail.com` est un exemple, ne mets aucun VRAI email. `reception@palazzo-bettina.mt` est le domaine de son stage → autorisé exceptionnellement, mais si tu as un doute, mets `reception@hotel-demo.com`.
- **Aucune logo/asset Microsoft/Outlook officielle**. Recrée une interface "inspirée" mais avec des couleurs et typos différentes de la vraie Outlook. Écris "Mail" ou "Inbox" au lieu de "Outlook". C'est pour éviter tout problème de marque.

---

# 📦 LIVRABLES

Fichiers créés :
- `components/three/Hotel.tsx`
- `components/three/Blob.tsx`
- `components/simulation/OutlookScene.tsx` (+ sous-composants LoginWindow, Inbox, EmailDetail, AIPanel, SendCursor)
- `components/ui/SoundToggle.tsx`
- `components/ui/Caption.tsx`
- `lib/sound.ts`
- Éventuellement `components/three/hotel/Facade.tsx`, `Lobby.tsx` pour lisibilité

Fichiers modifiés :
- `components/three/Scene.tsx`
- `components/three/Environment.tsx`
- `lib/scroll-timeline.ts`
- `lib/translations.ts` (ajout captions)
- `app/[locale]/page.tsx` (montage `<OutlookScene />` en overlay + `<SoundToggle />`)
- `package.json` (ajout `@react-three/postprocessing`, éventuellement `react-type-animation`)

Fichiers **supprimés** :
- `components/three/Signature.tsx` (remplacé)

Branche : `v3b-zoom-into-machine`
Commits attendus : 6-8 commits logiques

À la fin :
- `npm run build` compile sans erreur
- Preview Vercel accessible sur `enzo-cosnard-git-v3b-zoom-into-machine-*.vercel.app`
- **NE PAS MERGER DANS MAIN** — Enzo décidera après avoir vu la preview

---

# 🚀 DÉMARRAGE

1. **Crée la branche** : `git checkout -b v3b-zoom-into-machine`. Si `v3-hotel` existe déjà en local, supprime-la : `git branch -D v3-hotel`. Push la nouvelle branche vide pour créer la preview Vercel.

2. **Propose-moi ton plan d'implémentation en 7-9 étapes numérotées** avant de coder. Chaque étape doit laisser le site fonctionnel — approche incrémentale :
   - Étape 1 : bascule branche + Scene wrapper adapté + Signature.tsx supprimé + façade statique visible (comme si on était devant l'hôtel)
   - Étape 2 : géométrie Hall + travelling caméra qui entre dans le hall (sans zoom écran encore)
   - Étape 3 : zoom dans l'écran + apparition de la couche HTML noire (mais vide)
   - Étape 4 : simulation Outlook complète (login → email → réponse → envoi) sans son ni curseur
   - Étape 5 : le blob organique dans le panneau IA + effets typewriter fluides
   - Étape 6 : curseur souris animé + son via Web Audio API + bouton SoundToggle
   - Étape 7 : dézoom + micro-légendes bilingues
   - Étape 8 : fallback mobile + reduced-motion
   - Étape 9 : polish (Bloom réglé, fog ajusté, cleanup)

3. **Attends ma validation** du plan avant de coder.

4. Implémente étape par étape, `git commit` + `git push` après chaque étape. Vercel me générera une URL preview différente à chaque push → j'en profite pour te dire "ça casse" ou "continue" avant que tu enchaînes.

5. À chaque étape terminée, dis-moi **exactement** ce que je dois aller voir sur la preview Vercel. Une phrase suffit : "Va sur l'URL preview et scrolle lentement, tu dois voir X".

---

**Rappel important** : Enzo n'est pas développeur. Explique en français à chaque étape ce que tu fais et pourquoi. Si un choix technique est fragile (par exemple : "le blob 3D imbriqué dans du HTML fait ramer"), documente le problème et présente deux alternatives.

**Sur l'ambition** : c'est le projet le plus complexe de la série. Prends ton temps sur les étapes 4-5-6 (la simulation Outlook, le blob, le son) — c'est là que se joue tout le "wow" du site. Si une étape prend 30 min de plus, tant pis, ça vaut le coup.

**Sur les erreurs** : si tu bloques, n'invente pas de workaround miracle. Documente le blocage, propose 2 alternatives, laisse Enzo choisir. Il a demandé explicitement : "arrête de me dire que ça va fonctionner pour me faire plaisir".
