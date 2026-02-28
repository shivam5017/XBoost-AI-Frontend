// page.tsx — compose all sections in order
// Each section is self-contained with its own scroll-triggered animations

import HeroSection from "./pages/HeroSection";
import SocialProofBar from "./pages/SocialProofbar";
import FeaturesSection from "./pages/FeatureSection";
import HowItWorksSection from "./pages/HowItWorksSection";
import TestimonialsSection from "./pages/TestimonialSection";
import PricingSection from "./pages/PricingSection";
import FAQAndCTASection from "./pages/FAQSection";
import Footer from "./pages/FooterSection";
import Navbar from "./pages/Navbar";

export default function Page() {
  return (
    <main>
      <Navbar />
      {/* 1. Hero — big headline + 3D card stack */}
      <HeroSection />

      {/* 2. Trust bar — "as featured in" logos */}
      <SocialProofBar />

      {/* 3. Features — 6-card grid */}
      <FeaturesSection />

      {/* 4. How it works — 4-step timeline */}
      <HowItWorksSection />

      {/* 5. Testimonials — masonry tweet cards */}
      <TestimonialsSection />

      {/* 6. Pricing — 3-tier cards */}
      <PricingSection />

      {/* 7. FAQ accordion + final CTA banner */}
      <FAQAndCTASection />

      <Footer />
    </main>
  );
}