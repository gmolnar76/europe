"use client";
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface SourceRow { choice_key: string; source: string; cnt: string | number; }
interface TotalRow { choice_key: string; total: string | number; }
interface CountryRow { choice_key: string; country_code: string; cnt: string | number; }
interface ResultsResponse {
  pollId: string;
  pollSlug: string;
  bySource: SourceRow[];
  totals: TotalRow[];
  byCountry: CountryRow[];
}

export interface ChoiceDef { key: string; label: string; desc?: string }
export interface VoteWidgetProps {
  pollSlug: string;
  title?: string;
  description?: string;
  choices: ChoiceDef[];
  layoutCols?: number; // explicit grid cols override
  className?: string;
}

type Aggregated = {
  byChoice: Record<string, { total: number; sources: Record<string, number>; meta: ChoiceDef }>
  grandTotal: number;
};

export default function VoteWidget({ pollSlug, title = 'Szavazás', description, choices, layoutCols, className }: VoteWidgetProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<ResultsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [already, setAlready] = useState(false);

  const fetchResults = useCallback(async () => {
    try {
      const r = await fetch(`/api/results?pollSlug=${encodeURIComponent(pollSlug)}`, { cache: 'no-store' });
      if (!r.ok) return;
      const data: ResultsResponse = await r.json();
      setResults(data);
    } catch (_) { /* silent */ }
  }, [pollSlug]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  const agg: Aggregated | null = useMemo(() => {
    if (!results) return null;
    const byChoice: Aggregated['byChoice'] = {};
    for (const c of choices) byChoice[c.key] = { total: 0, sources: {}, meta: c };
    let grand = 0;
    for (const t of results.totals) {
      const total = Number(t.total);
      if (byChoice[t.choice_key]) {
        byChoice[t.choice_key].total = total;
        grand += total;
      }
    }
    for (const s of results.bySource) {
      const cnt = Number(s.cnt);
      const row = byChoice[s.choice_key];
      if (row) row.sources[s.source] = cnt;
    }
    return { byChoice, grandTotal: grand };
  }, [results, choices]);

  const handleVote = async () => {
    if (!selected || submitting) return;
    setSubmitting(true); setError(null);
    try {
      const r = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollSlug, choiceKey: selected })
      });
      if (r.status === 409) {
        setAlready(true);
      } else if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setError(j.error || 'Hiba');
      } else {
        setAlready(true);
      }
      await fetchResults();
    } catch (_) {
      setError('Hálózati hiba');
    } finally { setSubmitting(false); }
  };

  const cols = layoutCols || (choices.length === 4 ? 4 : choices.length === 2 ? 2 : Math.min(3, choices.length));

  return (
    <div className={`rounded-lg bg-white p-6 border border-black/5 shadow-sm ${className || ''}`} aria-live="polite">
      <h3 className="text-xl font-semibold text-midnight mb-1">{title}</h3>
      {description && <p className="text-xs text-black/60 mb-4 leading-relaxed">{description}</p>}
      <div className="space-y-4">
        <fieldset className={`grid gap-3 md:grid-cols-${cols}`}>
          {choices.map(c => {
            const checked = selected === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelected(c.key)}
                aria-pressed={checked}
                className={`text-left p-4 rounded border transition focus:outline-none focus:ring-2 focus:ring-midnight/60 hover:bg-offwhite ${checked ? 'bg-offwhite border-midnight' : 'border-black/10'}`}
              >
                <span className="font-medium block text-midnight">{c.label}</span>
                {c.desc && <span className="block text-xs text-black/60 mt-1 leading-snug">{c.desc}</span>}
              </button>
            );
          })}
        </fieldset>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleVote}
            disabled={!selected || submitting || already}
            className="px-5 py-2.5 rounded bg-midnight text-white disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90"
          >
            {already ? 'Szavazat rögzítve' : submitting ? 'Küldés...' : 'Szavazok'}
          </button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
        <ResultsPanel agg={agg} />
      </div>
    </div>
  );
}

function ResultsPanel({ agg }: { agg: Aggregated | null }) {
  if (!agg) return <p className="text-sm text-black/50">Eredmények betöltése...</p>;
  if (agg.grandTotal === 0) return <p className="text-sm text-black/50">Még nincs szavazat.</p>;
  const sourcesSet = new Set<string>();
  Object.values(agg.byChoice).forEach(r => Object.keys(r.sources).forEach(s => sourcesSet.add(s)));
  const sources = Array.from(sourcesSet).sort();
  return (
    <div className="mt-4 space-y-3">
      {Object.entries(agg.byChoice).map(([key, data]) => {
        const pct = data.total ? (data.total / agg.grandTotal) * 100 : 0;
        return (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-xs text-black/60">
              <span>{data.meta.label}</span>
              <span>{data.total} • {pct.toFixed(1)}%</span>
            </div>
            <div className="h-3 w-full rounded bg-offwhite overflow-hidden flex">
              {sources.map(src => {
                const val = data.sources[src] || 0;
                const w = agg.grandTotal ? (val / agg.grandTotal) * 100 : 0;
                const color = src === 'guest' ? 'bg-teal' : 'bg-gold';
                return <div key={src} className={`${color} h-full`} style={{ width: `${w}%` }} title={`${src}: ${val}`} />;
              })}
            </div>
          </div>
        );
      })}
      <p className="text-[11px] text-black/40">Színek: teal = vendég, gold = regisztrált (később).</p>
    </div>
  );
}
