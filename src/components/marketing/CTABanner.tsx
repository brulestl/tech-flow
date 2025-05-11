import { Button } from '@/components/ui/button';
export default function CTABanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 text-center">
      <div className="rounded-2xl bg-accent-purple bg-opacity-10 p-12">
        <h2 className="text-3xl font-bold">Ready to scoop your knowledge?</h2>
        <p className="mt-2 text-muted-foreground">Start saving resources in less than two minutes.</p>
        <Button size="lg" className="mt-6">Create your free account</Button>
      </div>
    </section>
  );
}
