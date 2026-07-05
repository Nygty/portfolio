import type { ReactNode } from "react";
import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import SetHtmlLang from "@/components/SetHtmlLang";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import SoundToggle from "@/components/ui/SoundToggle";
import { translations, type Locale } from "@/lib/translations";

// SEO par langue : titre, description, OG image et locale adaptés,
// + alternates.languages pour dire à Google que les deux versions existent.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = translations[locale];
  const ogImage = locale === "fr" ? "/og-fr.png" : "/og-en.png";

  return {
    metadataBase: new URL("https://enzo-cosnard.vercel.app"),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      languages: { "fr-FR": "/fr", "en-US": "/en" },
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      images: [ogImage],
    },
  };
}

// Les deux seules locales du site sont pré-générées en statique ;
// toute autre valeur dans l'URL (/de, /xyz…) renvoie un 404.
export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}
export const dynamicParams = false;

// Lenis (SmoothScroll) est monté ici, au niveau du layout par locale :
// il reste actif quelle que soit la langue affichée.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // dynamicParams = false : seuls "fr" et "en" peuvent arriver ici
  const locale = (await params).locale as Locale;

  return (
    <SmoothScroll>
      <SetHtmlLang locale={locale} />
      <LocaleSwitcher locale={locale} />
      <SoundToggle />
      {children}
    </SmoothScroll>
  );
}
