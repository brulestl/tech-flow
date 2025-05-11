import { Button } from '@/components/ui/button';
import AnimatedFadeUp from './AnimatedFadeUp';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent-purple/20 to-accent-purple/5">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-24 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <AnimatedFadeUp>
            <span className="mb-4 inline-block rounded-full bg-accent-purple/10 px-3 py-1 text-xs font-semibold text-accent-purple">
              Achievement · Rated Top App of 2025
            </span>
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              All your tech knowledge <span className="text-accent-purple">scooped</span> in one place.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Capture threads, docs, tweets & code snippets, then learn them on your own terms.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg">Get Started Free</Button>
              <Button variant="secondary" size="lg">Watch Demo</Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">200k+ downloads</p>
          </AnimatedFadeUp>
        </div>
        <div className="h-80 w-full rounded-xl bg-[url(https://source.unsplash.com/collection/190727/600x800)] bg-cover bg-center shadow-lg md:h-auto" />
      </div>
    </section>
  );
}
