"use client";

import { memo } from "react";
import Brain from "../three/Brain";

// Panneau latéral de l'agent (façon Copilot) : le cerveau neuronal
// s'illumine pendant la réflexion, puis la réponse s'écrit en typewriter,
// avec le bouton Send en bas (cliqué par le curseur autonome).
// slideP : ouverture du panneau. thinkP : l'IA réfléchit. typeP : rédaction.

const REPLY = `Dear Sarah,

Thank you for your inquiry. We have a Sea View Deluxe room available on August 15th at €280 per night, breakfast included.

Would you like me to hold the reservation for you?

Warm regards,
The Reception Team`;

// memo : ne re-rend que quand une progression change réellement
export default memo(AIPanel);

function AIPanel({
  slideP,
  thinkP,
  typeP,
  hoverP = 0,
  clickP = 0,
}: {
  slideP: number;
  thinkP: number;
  typeP: number;
  /** Survol simulé du bouton Send (curseur de l'étape 6). */
  hoverP?: number;
  /** Clic simulé sur le bouton Send. */
  clickP?: number;
}) {
  const press = Math.sin(Math.min(1, clickP) * Math.PI);
  const thinking = thinkP > 0 && typeP <= 0;
  const chars = Math.round(typeP * REPLY.length);
  const status = thinking
    ? "Reading the email…"
    : typeP >= 1
      ? "Draft ready"
      : typeP > 0
        ? "Writing a reply…"
        : "";

  return (
    <div
      className="h-full shrink-0 overflow-hidden border-l border-white/10 bg-[#151923]"
      style={{ width: `${slideP * 18}rem`, opacity: Math.min(1, slideP * 1.5) }}
    >
      <div className="flex h-full w-72 flex-col">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="text-sm text-[#8ab8f0]">✦</span>
          <span className="text-sm font-semibold text-[#e8edf5]">
            AI Concierge
          </span>
        </div>

        {/* Le cerveau : impulsions rapides pendant la réflexion, calmes ensuite */}
        <div className="mx-auto mt-4 h-28 w-28">
          <Brain intensity={thinking ? 0.9 : 0.3} />
        </div>
        <p className="mt-2 h-4 text-center text-xs text-[#8a93a5]">{status}</p>

        {/* La réponse, tapée caractère par caractère */}
        <div className="mx-4 mt-3 flex-1 overflow-hidden rounded-lg border border-white/10 bg-[#12151c] p-3">
          <p className="whitespace-pre-line text-xs leading-relaxed text-[#c9d3e0]">
            {REPLY.slice(0, chars)}
            {typeP > 0 && typeP < 1 && (
              <span className="ml-0.5 inline-block h-3 w-px animate-[caret-blink_1s_steps(1)_infinite] bg-[#8ab8f0] align-middle" />
            )}
          </p>
        </div>

        <div className="flex justify-end gap-2 px-4 py-3">
          <span
            id="sim-send-button"
            className={`rounded-md px-5 py-2 text-xs font-semibold text-white transition-all duration-200 ${
              typeP < 1
                ? "bg-[#2f6cb4] opacity-40"
                : hoverP > 0.5
                  ? "bg-[#3d8be0] opacity-100 shadow-[0_0_16px_rgba(74,158,255,0.45)]"
                  : "bg-[#2f6cb4] opacity-100"
            }`}
            style={{ transform: `scale(${1 - press * 0.1})` }}
          >
            Send
          </span>
        </div>
      </div>
    </div>
  );
}
