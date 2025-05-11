'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-background/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-accent-purple">TechVault</Link>
        <nav className="hidden gap-8 md:flex">
          {['Features','How it Works','Pricing','Reviews','FAQ'].map(s => (
            <a key={s} href={`#${s.toLowerCase().replace(/ /g,'-')}`}
               className="text-sm font-medium hover:text-accent-purple transition">{s}</a>
          ))}
        </nav>
        <Button asChild size="sm">
          <a href="/login">Open App</a>
        </Button>
      </div>
    </header>
  );
}
