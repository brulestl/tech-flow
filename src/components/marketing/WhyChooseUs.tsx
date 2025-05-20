import { ShieldCheck, Infinity, Clock } from 'lucide-react';
const reasons = [
  { icon: ShieldCheck, title: 'Secure by design', text: 'Your knowledge stays yours.' },
  { icon: Infinity, title: 'Limitless storage', text: 'Save as many resources as you want.' },
  { icon: Clock, title: 'Save hours', text: 'Stop hunting links – learn instead.' },
];
export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="bg-muted bg-opacity-30 px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-16 text-center text-3xl font-bold">Why choose TechVault?</h2>
        <div className="grid gap-12 md:grid-cols-3">
          {reasons.map(r => (
            <div key={r.title} className="text-center">
              <r.icon className="mx-auto mb-4 h-10 w-10 text-accent-purple" />
              <h3 className="text-xl font-semibold">{r.title}</h3>
              <p className="mt-2 text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
