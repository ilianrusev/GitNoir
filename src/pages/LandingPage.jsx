import { useAuth } from "../context/AuthContext";
import FAQSection from "../components/landing/FAQSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import LandingFooter from "../components/landing/LandingFooter";
import LandingCasesPreview from "../components/landing/LandingCasesPreview";
import LandingHeroSection from "../components/landing/LandingHeroSection";
import LandingCTASection from "../components/landing/LandingCTASection";
import Header from "../components/Header";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-(--background)">
      <Header variant="landing" />
      <LandingHeroSection user={user} />
      <FeaturesSection />
      <LandingCasesPreview />
      <FAQSection />
      <LandingCTASection />
      <LandingFooter />
    </div>
  );
}
