import HeroSection from "@/features/landing/HeroSection";
import HowItWorksSection from "@/features/landing/HowItWorksSection";
import InvestmentOptionsSection from "@/features/landing/InvestmentOptionsSection";
import AIFeaturesSection from "@/features/landing/AIFeaturesSection";
import FeaturesSection from "@/features/landing/FeaturesSection";
import FooterSection from "@/features/landing/FooterSection";
import Navbar from "@/features/landing/Navbar";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Seo.home");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords"),
  };
}

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <InvestmentOptionsSection />
      <AIFeaturesSection />
      <FeaturesSection />
      <FooterSection />
    </main>
  );
}
