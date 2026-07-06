"use client";

// Fenêtre de connexion de l'app "Mail" (neutre, aucune marque).
// p : progression 0→1 de la séquence, pilotée par le scroll.
// Jalons : apparition → email tapé → mot de passe → clic "Sign in".

const EMAIL = "reception@hotel-demo.com";
const PASSWORD_LENGTH = 10;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

function Caret({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span className="ml-0.5 inline-block h-4 w-px animate-[caret-blink_1s_steps(1)_infinite] bg-[#8ab8f0] align-middle" />
  );
}

export default function LoginWindow({ p }: { p: number }) {
  const appear = clamp(p / 0.08);
  const emailChars = Math.round(clamp((p - 0.12) / 0.36) * EMAIL.length);
  const passwordChars = Math.round(
    clamp((p - 0.54) / 0.2) * PASSWORD_LENGTH
  );
  const typingEmail = p >= 0.12 && p < 0.54;
  const typingPassword = p >= 0.54 && p < 0.78;
  const hovered = p > 0.87; // le curseur arrive sur le bouton à ~0.88
  const pressed = p > 0.9;

  const fieldClasses =
    "mt-1 flex h-10 items-center rounded-md border border-white/10 bg-[#12151c] px-3 text-sm text-[#d7dee9]";

  return (
    <div
      className="mx-auto w-80 rounded-xl border border-white/10 bg-[#1a1e27] p-8 shadow-2xl"
      style={{ opacity: appear, transform: `scale(${0.95 + appear * 0.05})` }}
    >
      {/* Logo enveloppe + nom d'app neutres */}
      <div className="flex items-center gap-2.5">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="#8ab8f0" strokeWidth="1.6" />
          <path d="M3 7l9 6 9-6" stroke="#8ab8f0" strokeWidth="1.6" />
        </svg>
        <span className="text-lg font-semibold text-[#e8edf5]">Mail</span>
      </div>
      <p className="mt-1 text-xs text-[#8a93a5]">Sign in to your inbox</p>

      <label className="mt-6 block text-xs font-medium text-[#8a93a5]">
        Email
      </label>
      <div className={fieldClasses}>
        {EMAIL.slice(0, emailChars)}
        <Caret active={typingEmail} />
      </div>

      <label className="mt-4 block text-xs font-medium text-[#8a93a5]">
        Password
      </label>
      <div className={`${fieldClasses} tracking-[0.2em]`}>
        {"●".repeat(passwordChars)}
        <Caret active={typingPassword} />
      </div>

      <button
        id="sim-signin-button"
        type="button"
        tabIndex={-1}
        className={`mt-6 h-10 w-full rounded-md text-sm font-semibold text-white transition-colors duration-200 ${
          hovered ? "bg-[#3d8be0] shadow-[0_0_18px_rgba(74,158,255,0.35)]" : "bg-[#2f6cb4]"
        }`}
        style={{
          transform: pressed ? "scale(0.96)" : "scale(1)",
          transition: "transform 150ms",
        }}
      >
        Sign in
      </button>
    </div>
  );
}
