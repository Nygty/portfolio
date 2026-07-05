"use client";

// Effets sonores générés en Web Audio API — zéro fichier audio dans le repo.
// Muet par défaut ; le bouton SoundToggle active. Si désactivé, play*()
// ne fait rien, silencieusement.
// v2 "percutant" : attaques nettes, deux notes montantes, pop de fin d'envoi.

let ctx: AudioContext | null = null;
let enabled = false;

function ensureContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
  // créé/réveillé ici : le clic sur le bouton est le "geste utilisateur"
  // que les navigateurs exigent pour autoriser l'audio
  if (value) void ensureContext().resume();
}

/** Note sinusoïdale brève : attaque rapide + harmonique brillante. */
function pling(
  ac: AudioContext,
  start: number,
  freq: number,
  peak: number,
  duration: number
) {
  [
    { f: freq, gain: peak },
    { f: freq * 2, gain: peak * 0.3 }, // harmonique : la brillance
  ].forEach(({ f, gain }) => {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain, start + 0.006); // attaque nette
    g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  });
}

/** Micro-transitoire de bruit : le "clic" perceptif qui rend un son punchy. */
function click(ac: AudioContext, start: number, gainValue: number) {
  const duration = 0.025;
  const buffer = ac.createBuffer(1, ac.sampleRate * duration, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = ac.createBufferSource();
  source.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 2500;
  const g = ac.createGain();
  g.gain.setValueAtTime(gainValue, start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(filter);
  filter.connect(g);
  g.connect(ac.destination);
  source.start(start);
}

/** "Ding" de validation : clic percutant + deux notes montantes joyeuses. */
export function playDing() {
  if (!enabled) return;
  const ac = ensureContext();
  const t0 = ac.currentTime;
  click(ac, t0, 0.07);
  pling(ac, t0, 660, 0.24, 0.4); // mi
  pling(ac, t0 + 0.085, 990, 0.26, 0.55); // quinte au-dessus : la montée
}

/** "Swoosh" d'envoi : balayage de bruit rapide et franc + "pop" grave
    au moment où l'email part. */
export function playSwoosh() {
  if (!enabled) return;
  const ac = ensureContext();
  const t0 = ac.currentTime;

  // le souffle
  const duration = 0.26;
  const buffer = ac.createBuffer(1, ac.sampleRate * duration, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = ac.createBufferSource();
  source.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1;
  filter.frequency.setValueAtTime(350, t0);
  filter.frequency.exponentialRampToValueAtTime(3400, t0 + duration);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(0.3, t0 + 0.035);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ac.destination);
  source.start(t0);

  // le "pop" : chute grave brève, la sensation d'objet qui part
  const pop = ac.createOscillator();
  const popGain = ac.createGain();
  pop.type = "sine";
  pop.frequency.setValueAtTime(380, t0 + 0.1);
  pop.frequency.exponentialRampToValueAtTime(150, t0 + 0.19);
  popGain.gain.setValueAtTime(0, t0 + 0.1);
  popGain.gain.linearRampToValueAtTime(0.22, t0 + 0.115);
  popGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
  pop.connect(popGain);
  popGain.connect(ac.destination);
  pop.start(t0 + 0.1);
  pop.stop(t0 + 0.25);
}
