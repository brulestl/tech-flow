'use client';

const testimonials = [
  {
    avatar: '👩🏽‍💻',
    name: 'Priya Patel',
    title: 'Senior Engineer',
    quote: 'I used to jump between five different tools—now SKOOP\'s chat answers all my code questions instantly.'
  },
  {
    avatar: '👨🏻‍💼',
    name: 'Carlos Mendez',
    title: 'DevOps Lead',
    quote: 'One-click deploys have saved us hours every sprint.'
  },
  {
    avatar: '👩🏻‍🔬',
    name: 'Sara Li',
    title: 'Product Manager',
    quote: 'The insights dashboard helped me prioritize the right features for v3.0.'
  }
];

export default function SkoopTestimonials() {
  return (
    <section id="testimonials" className="w-full py-20 px-4 bg-gradient-to-br from-blue-50/60 to-cyan-50/40">
      <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-12 text-center">What our developers say</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map(t => (
          <div key={t.name} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:-translate-y-1.5 transition-transform">
            <div className="text-5xl mb-4">{t.avatar}</div>
            <div className="font-semibold text-lg text-slate-700 mb-1">{t.name}</div>
            <div className="text-slate-500 text-sm mb-3">{t.title}</div>
            <blockquote className="text-slate-600 text-base text-center">"{t.quote}"</blockquote>
          </div>
        ))}
      </div>
    </section>
  );
} 