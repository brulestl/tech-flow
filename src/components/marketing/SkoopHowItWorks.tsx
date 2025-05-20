'use client';

const steps = [
  {
    icon: '📦',
    title: 'Install the Agent',
    desc: 'Copy a single line of code into your repo.'
  },
  {
    icon: '🔍',
    title: 'Index & Analyze',
    desc: 'SKOOP scans commits, issues and pull requests.'
  },
  {
    icon: '🤝',
    title: 'Collaborate & Deploy',
    desc: 'Invite teammates, ask questions, ship features.'
  }
];

export default function SkoopHowItWorks() {
  return (
    <section id="how-it-works" className="max-w-5xl mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-12 text-center">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <div key={step.title} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:-translate-y-1.5 transition-transform">
            <div className="text-4xl mb-4">{step.icon}</div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-blue text-white font-bold text-lg mb-3">{i+1}</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">{step.title}</h3>
            <p className="text-slate-500 text-base text-center">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 