"use client";
import React from "react";

export default function IntroDisclosure() {
  const [open, setOpen] = React.useState(true);
  const [tab, setTab] = React.useState<"overview" | "history">("overview");

  return (
    <div className="w-full relative isolate">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-xl border border-black/5 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden transition-colors">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-midnight/50"
          >
            <span className="text-sm font-medium tracking-wide text-midnight">
              Projekt összefoglaló & cél (kattints a {open ? 'bezáráshoz' : 'megnyitáshoz'})
            </span>
            <svg
              className={`h-5 w-5 text-midnight transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div
            className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
          >
            <div className="overflow-hidden">
              <div className="px-5 pb-6 pt-0 text-sm leading-relaxed text-slate">
                {/* Tabs */}
                <div role="tablist" aria-label="Bevezető szekció fülek" className="flex gap-2 pt-2 pb-4 border-b border-black/5">
                  <button
                    role="tab"
                    aria-selected={tab === 'overview'}
                    onClick={() => setTab('overview')}
                    className={`px-3 py-1.5 rounded text-xs font-medium tracking-wide transition ${tab === 'overview' ? 'bg-midnight text-white shadow-sm' : 'hover:bg-black/5 text-midnight'}`}
                  >
                    Áttekintés
                  </button>
                  <button
                    role="tab"
                    aria-selected={tab === 'history'}
                    onClick={() => setTab('history')}
                    className={`px-3 py-1.5 rounded text-xs font-medium tracking-wide transition ${tab === 'history' ? 'bg-midnight text-white shadow-sm' : 'hover:bg-black/5 text-midnight'}`}
                  >
                    Történelmi háttér
                  </button>
                </div>
                {/* Panels */}
                {tab === 'overview' && (
                  <div role="tabpanel" className="space-y-4" aria-label="Áttekintés">
                    <p>
                      A EUROPA.VOTE egy kísérleti platform, amely Európa jövőjének különböző lehetséges irányait vizualizálja három szcenárión keresztül. Célja, hogy párbeszédet indítson és adatalapú nézőpontot adjon a közös jövőről.
                    </p>
                    <p>
                      Az interaktív térkép valós időben mutat különböző politikai-kulturális konfigurációkat. A szavazások lehetővé teszik a vendég és regisztrált részvételt, elkülönített megjelenítéssel. Később több nyelv és mélyebb analitika kerül hozzáadásra.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-midnight text-white px-3 py-1 text-xs font-medium">Térkép</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold/90 text-slate px-3 py-1 text-xs font-medium">Szcenáriók</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal/90 text-white px-3 py-1 text-xs font-medium">Vendég szavazás</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate text-offwhite px-3 py-1 text-xs font-medium">Adatok</span>
                    </div>
                  </div>
                )}
                {tab === 'history' && (
                  <div role="tabpanel" className="space-y-4" aria-label="Történelmi háttér">
                    <p>
                      A régió története sokrétű: birodalmi struktúrák, szuverén államok, integrációs kísérletek és gazdasági-kulturális együttműködések váltották egymást. A modern európai együttműködés célja, hogy a konfliktusok csökkentése mellett közös normákat és stabil fejlődési pályát biztosítson.
                    </p>
                    <p>
                      A platform történelmi kontextus füle semleges nézőpontból jelzi azokat a főbb folyamatokat (integráció, határnyitás, gazdasági összekapcsolódás), amelyek befolyásolják a jelenlegi döntési tereket. Nem minősít, hanem keretet ad a saját vélemény kialakításához.
                    </p>
                    <p className="text-xs text-black/50">
                      Megjegyzés: A történeti összefoglaló rövidített és további forrásokkal később bővülhet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Decorative subtle gradient stripe */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-full -z-10 bg-gradient-to-b from-midnight/5 via-teal/5 to-transparent" />
    </div>
  );
}
