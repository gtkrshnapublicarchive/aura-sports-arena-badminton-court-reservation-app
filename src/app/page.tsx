import { Navbar } from "@/components/ui/navbar";
import { getCurrentUser } from "@/core/auth/session";
import { HeroSection } from "@/features/landing/hero-section";
import { CourtSpecsSection } from "@/features/landing/court-specs-section";
import { GearShowcaseSection } from "@/features/landing/gear-showcase-section";
import { LoungeAmenitiesSection } from "@/features/landing/lounge-amenities-section";
import { PricingRulesSection } from "@/features/landing/pricing-rules-section";
import { TestimonialsSection } from "@/features/landing/testimonials-section";
import { FaqSection } from "@/features/landing/faq-section";
import { CtaBanner } from "@/features/landing/cta-banner";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa]">
      <Navbar />

      <main className="flex-1">
        <HeroSection user={user} />
        <CourtSpecsSection />
        <GearShowcaseSection />
        <LoungeAmenitiesSection />
        <PricingRulesSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaBanner />
      </main>

      <footer className="border-t border-black/8 py-10 bg-white text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="font-serif font-semibold text-[#252724] text-sm">
              Aura Sports Arena
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              12 Veloce Boulevard, Aurelia City - Fictional Case Study. Currency: Aurum (AUR).
            </p>
          </div>

          <div className="text-[11px] text-neutral-400 font-mono text-center sm:text-right">
            Open Monday - Sunday, 07:00 - 23:00 - 4 Tournament Courts
          </div>
        </div>
      </footer>
    </div>
  );
}
