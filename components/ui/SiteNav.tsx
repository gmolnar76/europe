"use client";
import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const NAV_LINKS: { href: string; label: string }[] = [
  { href: '/', label: 'Főoldal' },
  { href: '#scenarios', label: 'Szcenáriók' },
  { href: '#vote', label: 'Szavazás' },
  { href: '#support', label: 'Támogatás' },
  { href: '/admin', label: 'Admin' },
];

export default function SiteNav() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <header className="w-full border-b border-black/5 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-midnight/50 rounded">
            <Logo width={132} height={34} />
            <span className="sr-only">EUROPA.VOTE</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="px-3 py-1.5 rounded text-slate-600 hover:text-midnight hover:bg-midnight/5 focus:outline-none focus:ring-2 focus:ring-midnight/40 transition text-xs font-medium">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login" className="px-3 py-1.5 rounded border border-midnight/20 text-midnight text-xs font-medium hover:bg-midnight/5 focus:outline-none focus:ring-2 focus:ring-midnight/40">Belépés</Link>
          <Link href="/register" className="px-3 py-1.5 rounded bg-midnight text-offwhite text-xs font-medium hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-midnight/40">Regisztráció</Link>
        </div>
        <button aria-label="Menü" aria-expanded={open} aria-controls="mobile-nav-panel" onClick={() => setOpen(o=>!o)} className="md:hidden inline-flex items-center justify-center p-2 rounded border border-midnight/20 text-midnight hover:bg-midnight/5 focus:outline-none focus:ring-2 focus:ring-midnight/40">
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      <div className={`md:hidden fixed inset-0 z-40 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div onClick={close} className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
        <div id="mobile-nav-panel" className={`absolute top-0 left-0 h-full w-72 max-w-[80%] bg-offwhite border-r border-black/10 shadow-xl flex flex-col gap-4 p-5 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-midnight">Menü</span>
            <button onClick={close} className="p-1 rounded hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-midnight/40" aria-label="Bezárás">
              <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(l => (
              <Link onClick={close} key={l.href} href={l.href} className="px-3 py-2 rounded text-slate-700 hover:bg-midnight/5 focus:outline-none focus:ring-2 focus:ring-midnight/40 text-sm font-medium">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-2">
            <Link onClick={close} href="/login" className="px-3 py-2 rounded border border-midnight/30 text-midnight text-sm font-medium hover:bg-midnight/5 focus:outline-none focus:ring-2 focus:ring-midnight/40">Belépés</Link>
            <Link onClick={close} href="/register" className="px-3 py-2 rounded bg-midnight text-offwhite text-sm font-medium hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-midnight/50">Regisztráció</Link>
          </div>
          <div className="mt-auto pt-4 border-t border-black/10 text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
            <Link href="/en" className="hover:text-midnight">EN</Link>
            <Link href="/ru" className="hover:text-midnight">RU</Link>
            <span className="text-slate-400">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
