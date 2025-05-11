import { Layers, Zap, Search } from 'lucide-react';
const features = [
  { icon: Layers, title: 'Import anything', text: 'Tweets, articles, YouTube – one click.' },
  { icon: Search, title: 'Semantic search', text: 'Find any saved insight in milliseconds.' },
  { icon: Zap, title: 'Learn efficiently', text: 'Spaced-repetition sessions built-in.' },
];
export default function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24">
      <h2 className="mb-12 text-center text-3xl font-bold">Features</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {features.map(f => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-8 hover:shadow-md transition-all">
            <f.icon className="mb-4 h-10 w-10 text-accent-purple" />
            <h3 className="text-xl font-semibold">{f.title}</h3>
            <p className="mt-2 text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
