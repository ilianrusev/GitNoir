import { useAuth } from "../context/AuthContext";
import FAQSection from "../components/landing/FAQSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import LandingNavigation from "../components/landing/LandingNavigation";
import LandingFooter from "../components/landing/LandingFooter";
import LandingCasesPreview from "../components/landing/LandingCasesPreview";
import LandingHeroSection from "../components/landing/LandingHeroSection";
import LandingCTASection from "../components/landing/LandingCTASection";
import Header from "../components/Header";

export default function LandingPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-(--background)">
      <div className="md:hidden sticky top-0 z-50">
        <Header variant="landing" />
      </div>

      <LandingNavigation user={user} logout={logout} />
      <LandingHeroSection user={user} />
      <FeaturesSection />
      <LandingCasesPreview />
      <FAQSection />
      <LandingCTASection />
      <LandingFooter />
    </div>
  );
}
