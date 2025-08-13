"use client";
import * as React from "react";

export interface ScenariosCardsProps {
  pollSlug: string;
  choiceMap?: Partial<Record<ScenarioKey, string>>; // map scenario -> choice key in poll (defaults to same id)
  autoVoteOnSelect?: boolean; // default false now
  className?: string;
  eventName?: string; // custom event channel (default europa:set-scenario)
}

type ScenarioKey = "sovereign" | "federal" | "overlay";

export default function ScenariosCards(props: ScenariosCardsProps) {
  const { pollSlug, choiceMap, autoVoteOnSelect = false, className, eventName = "europa:set-scenario" } = props;
  const [selected, setSelected] = React.useState<ScenarioKey | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [already, setAlready] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [justVoted, setJustVoted] = React.useState<ScenarioKey | null>(null);
  const liveRef = React.useRef<HTMLDivElement | null>(null);

  const resolveChoiceKey = (scenario: ScenarioKey) => (choiceMap && choiceMap[scenario]) || scenario;

  const voteScenario = React.useCallback(async (scenario: ScenarioKey) => {
    if (!pollSlug || submitting || already) return;
    setSubmitting(true); setError(null); setJustVoted(null);
    try {
      const choiceKey = resolveChoiceKey(scenario);
      const r = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollSlug, choiceKey })
      });
      if (r.status === 409) {
        setAlready(true);
      } else if (!r.ok) {
        const j = await r.json().catch(()=>({}));
        setError(j.error || 'Hiba');
      } else {
        setAlready(true); setJustVoted(scenario);
      }
    } catch {
      setError('Hálózati hiba');
    } finally { setSubmitting(false); }
  }, [pollSlug, submitting, already, choiceMap]);

  const emit = (detail: ScenarioKey) => {
    setSelected(detail);
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
    if (autoVoteOnSelect) voteScenario(detail);
  };

  const handleSubmit = () => { if (selected && !autoVoteOnSelect) voteScenario(selected); };

  // Glass + gradient style base
  const baseBtn = "group relative rounded-2xl p-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 transition disabled:opacity-50 disabled:cursor-not-allowed";
  const inner = (active: boolean) => `relative w-full h-full rounded-[1.05rem] px-5 py-5 text-left overflow-hidden backdrop-blur-md border border-white/10
    ${active ? 'bg-gradient-to-br from-midnight/70 via-slate/70 to-midnight/60 shadow-lg ring-1 ring-gold/40' : 'bg-white/5 hover:bg-white/10'}
    text-offwhite`;

  const items: { key: ScenarioKey; title: string; desc: string; gradient: string }[] = [
    { key: 'sovereign', title: 'Szuverén nemzetállamok kooperatív közössége (EU konföderáció)', desc: 'Decentralizált együttműködés, szuverenitás elsődleges.', gradient: 'from-midnight/50 via-teal/30 to-gold/40' },
    { key: 'federal', title: 'Európai Egyesült Államok competitív föderációja', desc: 'Föderális struktúra, integrált intézményi keretek.', gradient: 'from-gold/40 via-midnight/40 to-teal/40' },
    { key: 'overlay', title: 'Euroatlanti és Eurázsiai egységes civilizáció', desc: 'Kiterjesztett geo‑kulturális integrációs keret.', gradient: 'from-teal/40 via-midnight/40 to-gold/50' },
  ];

  return (
    <section id="scenarios" className={`mx-auto max-w-6xl px-4 py-10 ${className || ''}`}>      
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-midnight via-midnight/80 to-slate shadow-lg" role="group" aria-label="Szcenárió szavazás">
        <div className="relative rounded-[1.1rem] overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-md bg-white/5" />
          <div className="relative p-6 space-y-6 text-offwhite">
            <header className="flex flex-wrap items-center gap-3 justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-offwhite/80">Szcenáriók</h2>
              {selected && <span className="text-[11px] text-offwhite/60">Aktív: {selected}</span>}
              <div className="flex items-center gap-2 text-[11px] text-offwhite/60">
                {submitting && <span>Küldés...</span>}
                {already && <span>Szavazat rögzítve</span>}
                {error && <span className="text-red-300">{error}</span>}
              </div>
            </header>
            <div className="grid gap-5 md:grid-cols-3" role="radiogroup" aria-disabled={already || submitting}>
              {items.map(it => {
                const active = selected === it.key;
                return (
                  <button
                    key={it.key}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={it.title + (already ? ' – szavazat leadva' : '')}
                    disabled={submitting || (already && !active)}
                    onClick={() => emit(it.key)}
                    className={baseBtn}
                  >
                    <span className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${it.gradient} opacity-25 group-hover:opacity-40 transition`} aria-hidden />
                    <span className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" aria-hidden />
                    <div className={inner(active)}>
                      <h3 className="font-semibold leading-snug mb-1 pr-4">{it.title}</h3>
                      <p className="text-xs text-offwhite/60 max-w-xs">{it.desc}</p>
                      {justVoted === it.key && <span className="mt-2 inline-block text-[10px] uppercase tracking-wide text-gold/80">Szavazat mentve</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            {!autoVoteOnSelect && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!selected || submitting || already}
                  className="px-5 py-2.5 rounded bg-midnight text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90"
                >
                  {already ? 'Szavazat leadva' : submitting ? 'Küldés...' : 'Szavazat elküldése'}
                </button>
                <p className="mt-1 text-[11px] text-offwhite/50">Válassz egy víziót, majd küldd el a szavazatot.</p>
              </div>
            )}
            <div ref={liveRef} className="sr-only" aria-live="polite">{justVoted && `Szavazat rögzítve: ${justVoted}`}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
