import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SkoopFeaturePanels() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="rounded-2xl shadow-lg hover:-translate-y-1.5 transition-transform bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800 text-2xl font-semibold">Connect Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-4">
            <span className="bg-slate-100 rounded-full p-2"><img src="/github-mark.svg" alt="GitHub" className="w-6 h-6" /></span>
            <span className="bg-slate-100 rounded-full p-2"><img src="/vscode.svg" alt="VS Code" className="w-6 h-6" /></span>
            <span className="bg-slate-100 rounded-full p-2"><img src="/figma.svg" alt="Figma" className="w-6 h-6" /></span>
          </div>
          <p className="text-slate-600 mb-2 font-medium">Hook up your repos, issue trackers and design files in one click.</p>
          <p className="text-slate-500 text-sm">Link GitHub, GitLab, Jira, Figma and more—then watch SKOOP auto-index your entire codebase and project history.</p>
        </CardContent>
      </Card>
      <Card className="rounded-2xl shadow-lg hover:-translate-y-1.5 transition-transform bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800 text-2xl font-semibold">Learn Smarter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 mb-4">
            <span className="bg-slate-100 rounded-lg px-3 py-2 text-slate-700 text-sm w-fit">💬 "What changed in v2.1?"</span>
            <span className="bg-slate-100 rounded-lg px-3 py-2 text-slate-700 text-sm w-fit">🤖 "Where is this function called?"</span>
            <span className="bg-green-100 rounded-lg px-3 py-2 text-green-700 text-xs w-fit">Coverage ↑ 14%</span>
          </div>
          <p className="text-slate-600 mb-2 font-medium">Ask natural-language questions about your code.</p>
          <p className="text-slate-500 text-sm">Whether you need a high-level overview or a deep dive, SKOOP's AI chat delivers instant, accurate answers.</p>
        </CardContent>
      </Card>
      <Card className="rounded-2xl shadow-lg hover:-translate-y-1.5 transition-transform bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800 text-2xl font-semibold">Ship Faster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 mb-4">
            <span className="bg-blue-100 rounded-lg px-3 py-2 text-blue-700 text-xs w-fit">Deployed in 30s</span>
            <span className="bg-slate-100 rounded-lg px-3 py-2 text-slate-700 text-sm w-fit">🖥️ CI/CD Pipeline</span>
            <span className="bg-slate-100 rounded-lg px-3 py-2 text-slate-700 text-sm w-fit">🔄 Rollbacks & Monitoring</span>
          </div>
          <p className="text-slate-600 mb-2 font-medium">Deploy without the hassle.</p>
          <p className="text-slate-500 text-sm">From staging to production, automate your entire CI/CD pipeline—complete with tests, rollbacks and monitoring—in a single click.</p>
        </CardContent>
      </Card>
    </section>
  );
} 