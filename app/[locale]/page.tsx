import SceneLoader from "@/components/three/SceneLoader";
import OutlookScene from "@/components/simulation/OutlookScene";
import OutlookSceneMobile from "@/components/simulation/OutlookSceneMobile";
import Caption from "@/components/ui/Caption";
import ScrollHint from "@/components/ui/ScrollHint";
import ProgressBar from "@/components/ui/ProgressBar";
import ScreenEasterEgg from "@/components/ui/ScreenEasterEgg";
import FloatingCta from "@/components/ui/FloatingCta";
import Hero from "@/components/sections/Hero";
import Agent from "@/components/sections/Agent";
import HowItWorks from "@/components/sections/HowItWorks";
import CaseStudy from "@/components/sections/CaseStudy";
import About from "@/components/sections/About";
import Pricing from "@/components/sections/Pricing";
import { translations, type Locale } from "@/lib/translations";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // dynamicParams = false (layout) : seuls "fr" et "en" peuvent arriver ici
  const locale = (await params).locale as Locale;
  const t = translations[locale];

  return (
    <main className="relative">
      <SceneLoader />
      <OutlookScene />
      <Caption locale={locale} />
      <ScrollHint locale={locale} />
      <ProgressBar />
      <ScreenEasterEgg locale={locale} />
      <FloatingCta locale={locale} />
      <Hero t={t} />
      <Agent t={t} />
      <HowItWorks t={t} />
      <OutlookSceneMobile locale={locale} />
      <CaseStudy t={t} />
      <About t={t} />
      <Pricing t={t} />
    </main>
  );
}
