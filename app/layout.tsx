import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Layout racine minimal : html + body + fonts.
// Les metadata SEO vivent dans app/[locale]/layout.tsx (par langue).
// lang="fr" par défaut ; SetHtmlLang le met à jour selon la locale affichée.

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
