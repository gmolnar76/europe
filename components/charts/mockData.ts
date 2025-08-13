// Mock data generator aligned with db schema concepts
// polls -> pollChoices -> votes aggregated

export type ChoiceKey = 'scenario_eu_states' | 'scenario_use' | 'scenario_ea_ez';
export interface ChoiceSourceBreakdown { source: 'guest' | 'registered'; count: number }
export interface ChoiceTotal { key: ChoiceKey; total: number; sources: ChoiceSourceBreakdown[] }
export interface ChoiceShare { key: ChoiceKey; count: number; color: string }
export interface MomentumItem { key: ChoiceKey; series: number[]; color: string }
export interface TopCountryItem { code: string; name: string; choices: { key: ChoiceKey; count: number }[] }

export interface TimeseriesBucket { ts: number; values: number[]; total: number } // values aligned with keys order
export interface TimeseriesData { keys: ChoiceKey[]; buckets: TimeseriesBucket[] }

export interface DashboardData {
  totals: { all: number; guest: number; registered: number };
  choiceTotals: ChoiceTotal[];
  choiceShare: ChoiceShare[];
  momentum: MomentumItem[];
  topCountries: TopCountryItem[];
  timeseries: TimeseriesData;
}

export const choiceKeys: ChoiceKey[] = ['scenario_eu_states','scenario_use','scenario_ea_ez'];
export const choiceColors: Record<ChoiceKey,string> = {
  scenario_eu_states: '#0A2A6A',
  scenario_use: '#FFCC00',
  scenario_ea_ez: '#2EC5B6'
};

function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random()*arr.length)]; }

const COUNTRY_POOL: TopCountryItem[] = [
  { code: 'DE', name: 'Germany', choices: [] },
  { code: 'FR', name: 'France', choices: [] },
  { code: 'IT', name: 'Italy', choices: [] },
  { code: 'ES', name: 'Spain', choices: [] },
  { code: 'PL', name: 'Poland', choices: [] },
  { code: 'RO', name: 'Romania', choices: [] },
  { code: 'NL', name: 'Netherlands', choices: [] },
  { code: 'BE', name: 'Belgium', choices: [] },
];

export function mockDashboardData(): DashboardData {
  // per choice totals with source splits
  const choiceTotals: ChoiceTotal[] = choiceKeys.map(k => {
    const guest = randInt(100, 900);
    const registered = randInt(200, 1000);
    return { key: k, total: guest + registered, sources: [
      { source: 'guest', count: guest },
      { source: 'registered', count: registered }
    ]};
  });
  const totalsAll = choiceTotals.reduce((a,b)=>a+b.total,0);
  const totalsGuest = choiceTotals.reduce((a,b)=>a + b.sources.find(s=>s.source==='guest')!.count,0);
  const totalsReg = totalsAll - totalsGuest;
  const choiceShare: ChoiceShare[] = choiceTotals.map(ct => ({ key: ct.key, count: ct.total, color: choiceColors[ct.key] }));

  const momentum: MomentumItem[] = choiceKeys.map(k => ({ key: k, color: choiceColors[k], series: Array.from({ length: 15 }, () => randInt(0, 120)) }));

  // country ranking sample
  const topCountries: TopCountryItem[] = COUNTRY_POOL.slice(0,6).map(c => ({ ...c, choices: choiceKeys.map(k => ({ key: k, count: randInt(50,600) })) }));

  // timeseries buckets (values aligned with choiceKeys order)
  const buckets = Array.from({ length: 40 }).map((_,i) => {
    const values = choiceKeys.map(() => randInt(0,150));
    const total = values.reduce((a,b)=>a+b,0);
    return { ts: Date.now() - (40-i)*60000, values, total };
  });
  const timeseries: TimeseriesData = { keys: choiceKeys, buckets };

  return {
    totals: { all: totalsAll, guest: totalsGuest, registered: totalsReg },
    choiceTotals,
    choiceShare,
    momentum,
    topCountries,
    timeseries
  };
}

// realtime incremental update simulation
export function applyRandomDelta(prev: DashboardData): DashboardData {
  const next = { ...prev };
  // choose random choice & source
  const choice = pick(choiceKeys);
  const source: 'guest' | 'registered' = Math.random() < 0.45 ? 'guest' : 'registered';
  const inc = randInt(1,4);
  const ct = next.choiceTotals.find(c => c.key === choice)!;
  const srcObj = ct.sources.find(s => s.source === source)!;
  srcObj.count += inc;
  ct.total += inc;
  next.totals.all += inc;
  next.totals[source] += inc;
  // update choiceShare count
  const cs = next.choiceShare.find(c => c.key === choice)!; cs.count = ct.total;
  // update momentum latest value
  const m = next.momentum.find(m => m.key === choice)!; m.series.push(randInt(0,120)); m.series = m.series.slice(-15);
  // country random injection
  const country = pick(next.topCountries);
  const cc = country.choices.find(cc => cc.key === choice)!; cc.count += inc;
  // timeseries last bucket
  const lastBucket = next.timeseries.buckets[next.timeseries.buckets.length - 1];
  const idx = next.timeseries.keys.indexOf(choice);
  lastBucket.values[idx] += inc; lastBucket.total += inc;
  return next;
}
