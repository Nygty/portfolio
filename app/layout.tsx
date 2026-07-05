import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

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

const description =
  "L'agent IA qui répond aux emails de votre réception 24/7, en 5 langues, avec le ton de votre maison. En production à l'IBB Hotel Palazzo Bettina (Malte).";

export const metadata: Metadata = {
  // TODO: remplacer par le domaine définitif après le déploiement Vercel
  // (ou par le nom de domaine acheté plus tard)
  metadataBase: new URL("https://portfolio-nygty.vercel.app"),
  title: "Enzo Cosnard — Agent Concierge IA pour hôtels boutique",
  description,
  openGraph: {
    title: "Enzo Cosnard — Agent Concierge IA pour hôtels boutique",
    description,
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enzo Cosnard — Agent Concierge IA pour hôtels boutique",
    description,
    images: ["/og-image.png"],
  },
};

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
