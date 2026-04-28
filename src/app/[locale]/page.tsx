import HeroSection from "@/features/landing/HeroSection";
import HowItWorksSection from "@/features/landing/HowItWorksSection";
import InvestmentOptionsSection from "@/features/landing/InvestmentOptionsSection";
import AIFeaturesSection from "@/features/landing/AIFeaturesSection";
import FeaturesSection from "@/features/landing/FeaturesSection";
import FooterSection from "@/features/landing/FooterSection";
import Navbar from "@/features/landing/Navbar";

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
