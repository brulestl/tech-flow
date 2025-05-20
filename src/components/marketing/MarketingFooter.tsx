export default function MarketingFooter() {
  return (
    <footer className="border-t border-border px-4 py-12 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <p>&copy; {new Date().getFullYear()} TechVault. All rights reserved.</p>
        <nav className="flex gap-6">
          {['LinkedIn','Instagram','Facebook','Twitter'].map(s => (
            <a key={s} href="#" className="hover:text-accent-purple transition">{s}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
