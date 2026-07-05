"use client";

import { usePathname, useRouter } from "next/navigation";
import { translations, type Locale } from "@/lib/translations";

const LOCALES: Locale[] = ["fr", "en"];

// Switch de langue fixe en haut à droite, sur toutes les pages.
// Clic → nouvelle URL (/fr ↔ /en) sans rechargement complet + cookie
// mémorisé 1 an (le middleware le lira à la prochaine visite).
export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (target: Locale) => {
    if (target === locale) return;
    document.cookie = `NEXT_LOCALE=${target}; max-age=31536000; path=/`;
    const rest = pathname.replace(/^\/(fr|en)/, "");
    // scroll: false → on reste au même endroit de la page, transition douce
    router.push(`/${target}${rest}`, { scroll: false });
  };

  return (
    <nav
      aria-label={translations[locale].localeSwitcher.ariaLabel}
      className="fixed right-6 top-6 z-50 flex items-center gap-1.5 rounded-full border border-accent/15 bg-surface/60 px-2.5 py-1 text-xs backdrop-blur-sm sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-sm"
    >
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5 sm:gap-2">
          {i > 0 && <span className="text-muted">·</span>}
          <button
            onClick={() => switchTo(l)}
            aria-current={l === locale ? "true" : undefined}
            className={
              l === locale
                ? "cursor-default font-bold text-accent"
                : "cursor-pointer text-muted transition-colors hover:text-text"
            }
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </nav>
  );
}
