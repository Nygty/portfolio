// État partagé entre la sonde 3D (qui projette chaque frame la position
// de l'écran du hall en coordonnées de fenêtre) et l'easter egg HTML.
// Mutation directe, lecture à chaque frame — même pattern que sceneState.
export const screenHover = {
  x: -9999, // position de l'écran du hall, en pixels fenêtre
  y: -9999,
  inPhase: false, // la caméra est dans la phase hall (easter egg possible)
  boost: 0, // 0 → 1 : survol actif, l'écran pulse plus fort
};
