"use client";

// Boîte de réception : quelques emails déjà lus, puis celui de Sarah
// qui glisse depuis le haut (non lu : gras + point bleu) et s'ouvre.
// arriveP : 0→1 arrivée de l'email. openP : 0→1 clic simulé sur la ligne.

const READ_EMAILS = [
  {
    from: "Booking platform",
    subject: "Weekly performance summary",
    preview: "Your occupancy rate for the past week…",
    time: "08:47",
  },
  {
    from: "Maintenance",
    subject: "Pool inspection completed",
    preview: "The scheduled inspection was completed…",
    time: "08:12",
  },
  {
    from: "Guest reviews",
    subject: "New 5-star review received",
    preview: "A guest has left a new review of their stay…",
    time: "Yesterday",
  },
];

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Inbox({
  arriveP,
  openP,
}: {
  arriveP: number;
  openP: number;
}) {
  const eased = easeOutCubic(arriveP);
  const highlighted = openP > 0.3;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-3">
        <span className="text-sm font-semibold text-[#e8edf5]">Inbox</span>
        <span className="ml-2 text-xs text-[#8a93a5]">
          reception@palazzo-bettina.mt
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        {/* L'email de Sarah glisse depuis le haut */}
        {arriveP > 0 && (
          <div
            className={`flex items-center gap-3 border-b border-white/5 px-5 py-3.5 ${
              highlighted ? "bg-[#243043]" : "bg-[#1d2330]"
            }`}
            style={{
              opacity: eased,
              transform: `translateY(${-36 * (1 - eased)}px)`,
              transition: "background-color 200ms",
            }}
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#4a9eff]" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm font-bold text-[#e8edf5]">
                  Sarah Miller
                </span>
                <span className="shrink-0 text-xs text-[#8a93a5]">09:14</span>
              </div>
              <div className="truncate text-sm font-bold text-[#c9d3e0]">
                Booking request for August 15th
              </div>
              <div className="truncate text-xs text-[#8a93a5]">
                Hello, do you have availability for 2 people on…
              </div>
            </div>
          </div>
        )}

        {READ_EMAILS.map((mail) => (
          <div
            key={mail.subject}
            className="flex items-center gap-3 border-b border-white/5 px-5 py-3.5"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-transparent" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm text-[#a9b2c2]">
                  {mail.from}
                </span>
                <span className="shrink-0 text-xs text-[#6c7485]">{mail.time}</span>
              </div>
              <div className="truncate text-sm text-[#a9b2c2]">
                {mail.subject}
              </div>
              <div className="truncate text-xs text-[#6c7485]">
                {mail.preview}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
