"use client";
import React from "react";
import { DashboardData, mockDashboardData } from "./mockData";
import RealtimeSimulation from "./RealtimeSimulation";

// Simple inline chart implementations (SVG) to avoid adding heavy deps now.
// Later can be swapped with visx / nivo / recharts.

type BarProps = { label: string; value: number; total: number; color?: string };
const Bar: React.FC<BarProps> = ({ label, value, total, color = "#0A2A6A" }) => {
  const pct = total === 0 ? 0 : value / total;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-medium text-slate-600">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 w-full rounded bg-slate-200/70 overflow-hidden">
        <div className="h-full" style={{ width: (pct * 100).toFixed(2)+"%", background: color }} />
      </div>
    </div>
  );
};

const StackBar: React.FC<{ segments: { key: string; value: number; color: string }[]; total: number } > = ({ segments, total }) => {
  return (
    <div className="h-3 w-full flex rounded overflow-hidden border border-slate-200 bg-slate-100">
      {segments.map(s => {
        const w = total === 0 ? 0 : (s.value / total) * 100;
        return <div key={s.key} title={`${s.key}: ${s.value}`} style={{ width: w+"%", background: s.color }} className="transition-[width]" />;
      })}
    </div>
  )
}

const MiniSpark: React.FC<{ points: number[]; color?: string; height?: number }> = ({ points, color = "#0A2A6A", height = 30 }) => {
  const max = Math.max(1, ...points);
  const w = points.length - 1;
  const d = points.map((p,i) => `${i===0? 'M':'L'}${(i/w)*100},${height - (p/max)*height}`).join(" ");
  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full h-[30px]">
      <path d={d} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

export default function AdminDashboard() {
  const [data, setData] = React.useState<DashboardData>(() => mockDashboardData());
  const [realtime, setRealtime] = React.useState(true);

  const refresh = React.useCallback(() => {
    setData(d => ({ ...mockDashboardData(), timeseries: d.timeseries }));
  }, []);

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-xl font-semibold text-slate-800">Admin – Realtime Votes</h1>
        <button onClick={refresh} className="px-3 py-1.5 rounded bg-midnight text-offwhite text-sm hover:brightness-110">Mock Refresh</button>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={realtime} onChange={e => setRealtime(e.target.checked)} /> Realtime simulation
        </label>
      </div>

      <RealtimeSimulation enabled={realtime} onTick={(delta) => {
        setData(() => delta as DashboardData);
      }} />

      {/* High level stats */}
      <section className="grid md:grid-cols-4 gap-4">
        <div className="rounded-lg bg-offwhite p-4 shadow-sm border border-slate-200/60">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Votes</p>
          <p className="text-2xl font-bold text-midnight">{data.totals.all.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Registered: {data.totals.registered} / Guest: {data.totals.guest}</p>
        </div>
        {data.choiceTotals.map(c => (
          <div key={c.key} className="rounded-lg bg-offwhite p-4 shadow-sm border border-slate-200/60">
            <p className="text-xs uppercase tracking-wide text-slate-500">{c.key}</p>
            <p className="text-xl font-semibold text-midnight">{c.total}</p>
            <StackBar total={c.total} segments={c.sources.map(s => ({ key: s.source, value: s.count, color: s.source==="guest"? '#2EC5B6':'#0A2A6A' }))} />
          </div>
        ))}
      </section>

      {/* Distribution across choices */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-lg bg-offwhite p-5 shadow-sm border border-slate-200/60 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Choice Share</h2>
          {data.choiceShare.map(cs => (
            <Bar key={cs.key} label={cs.key} value={cs.count} total={data.totals.all} color={cs.color} />
          ))}
        </div>

        <div className="rounded-lg bg-offwhite p-5 shadow-sm border border-slate-200/60 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Recent Momentum (Last 15 buckets)</h2>
          <div className="space-y-2">
            {data.momentum.map(m => (
              <div key={m.key} className="flex items-center gap-2 text-xs">
                <span className="w-28 text-slate-600 font-medium">{m.key}</span>
                <MiniSpark points={m.series} color={m.color} />
                <span className="tabular-nums text-slate-700 w-10 text-right">{m.series.at(-1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-offwhite p-5 shadow-sm border border-slate-200/60 flex flex-col">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Guest vs Registered %</h2>
          <div className="flex-1 flex flex-col justify-center gap-4">
            {(() => {
              const total = data.totals.all || 1;
              const guestPct = (data.totals.guest / total) * 100;
              const regPct = 100 - guestPct;
              return (
                <div>
                  <div className="h-6 w-full rounded overflow-hidden flex border border-slate-300">
                    <div className="bg-teal h-full" style={{ width: guestPct+"%" }} />
                    <div className="bg-midnight h-full" style={{ width: regPct+"%" }} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Guest {guestPct.toFixed(1)}% / Reg {regPct.toFixed(1)}%</p>
                </div>
              )
            })()}
          </div>
        </div>
      </section>

      {/* Country ranking */}
      <section className="rounded-lg bg-offwhite p-5 shadow-sm border border-slate-200/60">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Top Countries (by votes)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {data.topCountries.map(c => {
            const total = c.choices.reduce((a,b)=>a+b.count,0);
            return (
              <div key={c.code} className="border border-slate-200 rounded p-3 bg-white space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>{c.code} – {c.name}</span>
                  <span className="text-slate-500">{total}</span>
                </div>
                <StackBar total={total} segments={c.choices.map(ch => ({ key: ch.key, value: ch.count, color: data.choiceShare.find(cs => cs.key===ch.key)?.color || '#0A2A6A' }))} />
              </div>
            )
          })}
        </div>
      </section>

      {/* Timeseries area (simplified) */}
      <section className="rounded-lg bg-offwhite p-5 shadow-sm border border-slate-200/60">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Votes per Minute (stacked)</h2>
        <div className="w-full overflow-x-auto">
          <svg className="min-w-[600px] h-56" viewBox="0 0 600 200" role="img" aria-label="Stacked bars of votes per minute by scenario">
            {(() => {
              const buckets = data.timeseries.buckets; // oldest -> newest
              const keys = data.timeseries.keys;
              const colors = Object.fromEntries(data.choiceShare.map(c => [c.key, c.color] as const));
              const max = Math.max(1, ...buckets.map(b => b.total));
              const barW = 600 / buckets.length;
              return (
                <g>
                  {buckets.map((b, i) => {
                    let yCursor = 200;
                    return b.values.map((v: number, j: number) => {
                      const h = (v / max) * 190;
                      yCursor -= h;
                      const choiceKey = keys[j];
                      return (
                        <rect
                          key={`${i}-${j}`}
                          x={i * barW}
                          y={yCursor}
                          width={barW - 1}
                          height={h}
                          fill={colors[choiceKey] || '#999'}
                        />
                      );
                    });
                  })}
                </g>
              )
            })()}
          </svg>
        </div>
      </section>

    </div>
  );
}
