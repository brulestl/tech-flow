'use client';
import { useState } from 'react';

const navLinks = [
  { label: 'Home', href: '#hero', pill: true },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
  { label: 'Sign In', href: '/login' },
];

export default function SkoopHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full bg-[#E6EDF1]/80 backdrop-blur">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <span className="text-3xl font-extrabold tracking-tight text-slate-700 select-none">skoop<span className="text-accent-blue">.</span></span>
        <nav className="hidden md:flex gap-2 items-center">
          {navLinks.map(link => link.pill ? (
            <a key={link.label} href={link.href} className="border border-slate-300 rounded-full px-5 py-2 font-semibold text-slate-700 bg-white/80 shadow-inner hover:bg-slate-100 transition-all text-base outline-none focus:ring-2 focus:ring-accent-blue" style={{boxShadow:'0 2px 8px 0 #e6edf1'}}>Home</a>
          ) : (
            <a key={link.label} href={link.href} className="px-4 py-2 text-base font-medium text-slate-600 hover:text-accent-blue transition-all">{link.label}</a>
          ))}
        </nav>
        <button className="md:hidden flex flex-col gap-1.5" aria-label="Open menu" onClick={()=>setOpen(!open)}>
          <span className="w-7 h-0.5 bg-slate-500 rounded"/>
          <span className="w-7 h-0.5 bg-slate-500 rounded"/>
          <span className="w-7 h-0.5 bg-slate-500 rounded"/>
        </button>
        {open && (
          <div className="absolute top-16 right-4 bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 md:hidden border border-slate-200 z-50">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className={`text-lg font-medium ${link.pill ? 'border border-slate-300 rounded-full px-5 py-2 bg-slate-50' : 'px-2 py-1'}`}>{link.label}</a>
            ))}
          </div>
        )}
        {/* Abstract geometric bg shapes */}
        <div className="absolute -z-10 left-[-60px] top-[-40px] w-40 h-40 bg-gradient-to-br from-slate-200/60 to-white rounded-full blur-2xl"/>
        <div className="absolute -z-10 right-[-40px] bottom-[-30px] w-24 h-24 bg-gradient-to-tr from-accent-blue/30 to-white rounded-full blur-2xl"/>
      </div>
    </header>
  );
} 