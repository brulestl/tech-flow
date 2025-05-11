import HeroSection      from '@/components/marketing/HeroSection';
import LogosStrip       from '@/components/marketing/LogosStrip';
import FeatureGrid      from '@/components/marketing/FeatureGrid';
import WhyChooseUs      from '@/components/marketing/WhyChooseUs';
import Testimonials     from '@/components/marketing/Testimonials';
import FAQ              from '@/components/marketing/FAQ';
import CTABanner        from '@/components/marketing/CTABanner';

export const metadata = { title: 'TechVault – Scoop knowledge like a pro' };

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <LogosStrip />
      <FeatureGrid />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </>
  );
}
