"use client";

// L'email de Sarah, ouvert. p : fondu d'apparition 0→1.
// Le panneau IA (blob + réponse) viendra se greffer à droite à l'étape 5.

export default function EmailDetail({ p }: { p: number }) {
  return (
    <div className="flex h-full flex-col" style={{ opacity: p }}>
      <div className="border-b border-white/10 px-6 py-4">
        <h3 className="text-base font-semibold text-[#e8edf5]">
          Booking request for August 15th
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-[#8a93a5]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3a4a63] text-[10px] font-semibold text-[#c9d3e0]">
            SM
          </span>
          <span className="text-[#a9b2c2]">
            Sarah Miller &lt;sarah.m@gmail.com&gt;
          </span>
          <span>·</span>
          <span>Today, 09:14</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 px-6 py-5 text-sm leading-relaxed text-[#c9d3e0]">
        <p>Hello,</p>
        <p>
          Do you have availability for 2 people on August 15th? We&apos;re
          looking for a room with a sea view if possible.
        </p>
        <p>
          Best regards,
          <br />
          Sarah
        </p>
      </div>
    </div>
  );
}
