const testimonials = Array.from({ length: 3 }).map((_, i) => ({
  name: ['Alice','Bob','Carla'][i],
  country: ['US','UK','DE'][i],
  quote: [
    'TechVault changed how my team shares knowledge.',
    'The search is crazy fast – love it!',
    'Importing threads is literally one click.',
  ][i],
}));
export default function Testimonials() {
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-4 py-24">
      <h2 className="mb-12 text-center text-3xl font-bold">What users say</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map(t => (
          <div key={t.name} className="rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-all">
            <p className="italic">"{t.quote}"</p>
            <div className="mt-4 flex items-center gap-3">
              <img className="h-10 w-10 rounded-full"
                   src={`https://source.unsplash.com/random/40x40?face&sig=${t.name}`} />
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.country}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
