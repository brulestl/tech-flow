import HeroSection from '@/components/marketing/HeroSection';
import ProblemSection from '@/components/marketing/ProblemSection';
import SolutionSection from '@/components/marketing/SolutionSection';
import HowItWorks from '@/components/marketing/HowItWorks';
import MetricsComparison from '@/components/marketing/MetricsComparison';
import Testimonials from '@/components/marketing/Testimonials';
import BuiltForSection from '@/components/marketing/BuiltForSection';
import CTABanner from '@/components/marketing/CTABanner';
import StickyCTA from '@/components/marketing/StickyCTA';

export const metadata = { title: 'TechVault – Turn Saved Posts into Shippable Code' };

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <MetricsComparison />
      <Testimonials />
      <BuiltForSection />
      <CTABanner />
      <StickyCTA />
    </>
  );
}
