import SkoopHeader from './SkoopHeader';
import SkoopHero from './SkoopHero';
import SkoopFeaturePanels from './SkoopFeaturePanels';
import SkoopHowItWorks from './SkoopHowItWorks';
import SkoopTrustedBy from './SkoopTrustedBy';
import SkoopTestimonials from './SkoopTestimonials';
import SkoopFAQ from './SkoopFAQ';
import SkoopFinalCTA from './SkoopFinalCTA';
import SkoopFooter from './SkoopFooter';

export default function SkoopLanding() {
  return (
    <div className="bg-[#E6EDF1] min-h-screen w-full overflow-x-hidden">
      <SkoopHeader />
      <main>
        <SkoopHero />
        <SkoopFeaturePanels />
        <SkoopHowItWorks />
        <SkoopTrustedBy />
        <SkoopTestimonials />
        <SkoopFAQ />
        <SkoopFinalCTA />
      </main>
      <SkoopFooter />
    </div>
  );
} 