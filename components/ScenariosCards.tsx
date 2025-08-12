"use client";
import * as React from "react";

export default function ScenariosCards() {
  const [selected, setSelected] = React.useState<"sovereign" | "federal" | "overlay" | null>(null);
  const emit = (detail: "sovereign" | "federal" | "overlay") => {
    setSelected(detail);
    console.log("[ScenariosCards] click:", detail);
    window.dispatchEvent(new CustomEvent("europa:set-scenario", { detail }));
  };

  // Glass + gradient style base
  const baseBtn = "group relative rounded-2xl p-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 transition";
  const inner = (active: boolean) => `relative w-full h-full rounded-[1.05rem] px-5 py-5 text-left overflow-hidden backdrop-blur-md border border-white/10
    ${active ? 'bg-gradient-to-br from-midnight/70 via-slate/70 to-midnight/60 shadow-lg ring-1 ring-gold/40' : 'bg-white/5 hover:bg-white/10'}
    text-offwhite`;

  return (
    <section id="scenarios" className="mx-auto max-w-6xl px-4 py-10">
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-midnight via-midnight/80 to-slate shadow-lg">
        <div className="relative rounded-[1.1rem] overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-md bg-white/5" />
          <div className="relative p-6 space-y-6 text-offwhite">
            <header className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-offwhite/80">Szcenáriók</h2>
              {selected && <span className="text-[11px] text-offwhite/60">Aktív: {selected}</span>}
            </header>
            <div className="grid gap-5 md:grid-cols-3">
              <button type="button" onClick={() => emit("sovereign")} className={baseBtn} aria-pressed={selected === "sovereign"}>
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-midnight/50 via-teal/30 to-gold/40 opacity-25 group-hover:opacity-40 transition" aria-hidden />
                <span className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" aria-hidden />
                <div className={inner(selected === "sovereign")}> 
                  <h3 className="font-semibold leading-snug mb-1 pr-4">Szuverén nemzetállamok kooperatív közössége (EU konföderáció)</h3>
                  <p className="text-xs text-offwhite/60 max-w-xs">Decentralizált együttműködés, szuverenitás elsődleges.</p>
                </div>
              </button>
              <button type="button" onClick={() => emit("federal")} className={baseBtn} aria-pressed={selected === "federal"}>
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/40 via-midnight/40 to-teal/40 opacity-25 group-hover:opacity-40 transition" aria-hidden />
                <span className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" aria-hidden />
                <div className={inner(selected === "federal")}> 
                  <h3 className="font-semibold leading-snug mb-1 pr-4">Európai Egyesült Államok competitív föderációja</h3>
                  <p className="text-xs text-offwhite/60 max-w-xs">Föderális struktúra, integrált intézményi keretek.</p>
                </div>
              </button>
              <button type="button" onClick={() => emit("overlay")} className={baseBtn} aria-pressed={selected === "overlay"}>
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal/40 via-midnight/40 to-gold/50 opacity-25 group-hover:opacity-40 transition" aria-hidden />
                <span className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" aria-hidden />
                <div className={inner(selected === "overlay")}> 
                  <h3 className="font-semibold leading-snug mb-1 pr-4">Euroatlanti és Eurázsiai egységes civilizáció</h3>
                  <p className="text-xs text-offwhite/60 max-w-xs">Kiterjesztett geo‑kulturális integrációs keret.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
