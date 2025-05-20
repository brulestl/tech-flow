export default function SkoopHero() {
  return (
    <section id="hero" className="relative flex flex-col items-center justify-center py-28 px-4 text-center">
      <h1 className="font-sans text-slate-800 text-[48px] md:text-[56px] font-semibold leading-tight mb-4">Connect. Learn. Ship.</h1>
      <p className="text-slate-600 text-lg md:text-xl font-normal max-w-2xl mx-auto mb-6">Turn your team's ideas into production-ready code in minutes—no context-switching required.</p>
      <div className="flex flex-wrap gap-4 justify-center items-center text-base font-medium text-slate-700 mb-8">
        <span className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-1 shadow-inner"><span>🚀</span> Real-time collaboration</span>
        <span className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-1 shadow-inner"><span>📚</span> Instant code insights</span>
        <span className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-1 shadow-inner"><span>🔄</span> One-click deployments</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a href="#features" className="rounded-full bg-accent-blue text-white font-semibold px-8 py-3 text-lg shadow-lg hover:bg-accent-blue/90 transition-all">Get Started Free</a>
        <a href="#demo" className="text-accent-blue text-lg font-medium underline underline-offset-2 hover:text-accent-blue/80">Request a Demo</a>
      </div>
    </section>
  );
} 