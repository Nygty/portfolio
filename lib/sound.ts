"use client";

// Effets sonores générés en Web Audio API — zéro fichier audio dans le repo.
// Muet par défaut ; le bouton SoundToggle active. Si désactivé, play*()
// ne fait rien, silencieusement.

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

/** "Ding" de validation : deux sinus (880 + 1320 Hz) avec enveloppe douce. */
export function playDing() {
  if (!enabled) return;
  const ac = ensureContext();
  const t0 = ac.currentTime;
  [880, 1320].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(i === 0 ? 0.16 : 0.05, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.7);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + 0.75);
  });
}

/** "Swoosh" d'envoi : bruit blanc filtré dont la fréquence file vers l'aigu. */
export function playSwoosh() {
  if (!enabled) return;
  const ac = ensureContext();
  const t0 = ac.currentTime;
  const duration = 0.35;

  const buffer = ac.createBuffer(1, ac.sampleRate * duration, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const source = ac.createBufferSource();
  source.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(500, t0);
  filter.frequency.exponentialRampToValueAtTime(2600, t0 + duration);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(0.22, t0 + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ac.destination);
  source.start(t0);
}
