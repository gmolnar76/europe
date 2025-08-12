import Map from "@/components/map/Map";
import ScenariosCards from "@/components/ScenariosCards";
import IntroDisclosure from "@/components/IntroDisclosure";
import SupportBar from "@/components/SupportBar";
import VoteWidget, { ChoiceDef } from "@/components/ui/VoteWidget";

// Konfiguráció a több poll megjelenítéséhez
const pollBlocks: {
  anchor: string;
  heading: string;
  intro?: string;
  pollSlug: string;
  choices: ChoiceDef[];
}[] = [
  {
    anchor: 'vote',
    heading: 'Integrációs forgatókönyvek',
    intro: 'Három vízió az európai integráció lehetséges irányairól.',
    pollSlug: 'eu-integration-scenarios',
    choices: [
      { key: 'scenario_eu_states', label: 'Szuverén államok együttműködése', desc: 'Laza, államközi kooperáció erős nemzeti hatáskörökkel.' },
      { key: 'scenario_united_europe', label: 'Európai Egyesült Államok', desc: 'Föderális struktúra egységes intézményi kerettel.' },
      { key: 'scenario_ea_ez_overlay', label: 'Euroatlanti + Eurázsiai overlay', desc: 'Kettős civilizációs / geopolitikai integrációs réteg.' }
    ]
  },
  {
    anchor: 'leadership',
    heading: 'EU politikai vezetés – transznacionális listák',
    intro: 'Véleményed az EP választási rendszer lehetséges reformjáról.',
    pollSlug: 'leadership-transnational-lists',
    choices: [
      { key: 'yes', label: 'Igen' },
      { key: 'no', label: 'Nem' },
      { key: 'unsure', label: 'Bizonytalan' }
    ]
  },
  {
    anchor: 'leadership2',
    heading: 'EU politikai vezetés – Bizottság elnök kiválasztása',
    intro: 'Különböző modellek a Bizottság elnökének legitimitására.',
    pollSlug: 'leadership-commission-selection',
    choices: [
      { key: 'direct', label: 'Közvetlen választás' },
      { key: 'spitzen', label: 'Spitzenkandidat' },
      { key: 'council', label: 'Tanács jelölje' },
      { key: 'unsure', label: 'Nem tudom' }
    ]
  },
  {
    anchor: 'leadership3',
    heading: 'EU politikai vezetés – uniós népszavazás',
    intro: 'Legyen-e uniós szintű referendum eszköz?',
    pollSlug: 'leadership-eu-referendum',
    choices: [
      { key: 'support', label: 'Támogatom' },
      { key: 'conditional', label: 'Feltételekkel' },
      { key: 'oppose', label: 'Ellenzem' }
    ]
  },
  {
    anchor: 'migration',
    heading: 'Migráció – szolidaritási mechanizmus',
    intro: 'Preferált megoldás a tagállami tehermegosztásra.',
    pollSlug: 'migration-solidarity-mechanism',
    choices: [
      { key: 'quota', label: 'Elosztási kvóta' },
      { key: 'financial', label: 'Pénzügyi hozzájárulás' },
      { key: 'mixed', label: 'Vegyes modell' },
      { key: 'unsure', label: 'Nem tudom' }
    ]
  },
  {
    anchor: 'migration2',
    heading: 'Migráció – készségpartnerségek',
    intro: 'Legális munkaerő-migráció csatornáinak bővítése.',
    pollSlug: 'migration-skill-partnerships',
    choices: [
      { key: 'yes', label: 'Igen' },
      { key: 'conditional', label: 'Feltételekkel' },
      { key: 'no', label: 'Nem' }
    ]
  },
  {
    anchor: 'migration3',
    heading: 'Migráció – befogadó központ standardok',
    intro: 'Egységes minimum standardok kérdése.',
    pollSlug: 'migration-host-standards',
    choices: [
      { key: 'high', label: 'Igen, magas szint' },
      { key: 'basic', label: 'Igen, alap szint' },
      { key: 'no', label: 'Nem' }
    ]
  },
  {
    anchor: 'who',
    heading: 'WHO – közös stratégiai készlet',
    intro: 'Egységes EU stockpile igénye.',
    pollSlug: 'who-stockpile',
    choices: [
      { key: 'yes', label: 'Igen' },
      { key: 'partial', label: 'Részben (kritikus termékek)' },
      { key: 'national', label: 'Maradjon nemzeti' },
      { key: 'unsure', label: 'Nem tudom' }
    ]
  },
  {
    anchor: 'who2',
    heading: 'WHO – közös tárgyalási álláspont',
    intro: 'Pandémiás egyezmény EU álláspont.',
    pollSlug: 'who-common-position',
    choices: [
      { key: 'support', label: 'Támogatom' },
      { key: 'conditional', label: 'Feltételekkel' },
      { key: 'oppose', label: 'Ellenzem' }
    ]
  },
  {
    anchor: 'who3',
    heading: 'WHO – genomadat megosztás',
    intro: 'Valós idejű genom szekvenálási adatok megosztása.',
    pollSlug: 'who-genomic-sharing',
    choices: [
      { key: 'yes', label: 'Igen' },
      { key: 'privacy', label: 'Igen, adatvédelmi garanciákkal' },
      { key: 'no', label: 'Nem' }
    ]
  }
];

export default function Home() {
  return (
    <div className="min-h-[calc(100dvh-64px)] bg-offwhite">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-12 grid gap-6 lg:grid-cols-2 items-center">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold text-midnight">
            Szavazz Európa jövőjéről
          </h1>
          <p className="text-base md:text-lg text-black/70">
            Három vízió, egy egységes felület. Valós idejű eredmények, 3D térképek
            és vizuális grafikonok.
          </p>
          <div className="flex gap-3">
            <a
              href="#vote"
              className="px-5 py-2.5 rounded bg-midnight text-white hover:opacity-90"
            >
              Szavazz most
            </a>
            <a
              href="#scenarios"
              className="px-5 py-2.5 rounded border border-midnight/20 text-midnight hover:bg-midnight/5"
            >
              Szcenáriók
            </a>
          </div>
        </div>
        <div className="aspect-[16/10] rounded-lg bg-white shadow-sm border border-black/5 grid place-items-center">
          <span className="text-sm text-black/50">3D térkép helye (Map)</span>
        </div>
      </section>

      {/* Map above selectable cards */}
      <IntroDisclosure />
      <section className="mx-auto max-w-6xl px-4 mt-6">
        <Map height={420} />
        <p className="mt-2 text-sm text-black/60">A fenti vezérlővel válts a három szcenárió között.</p>
      </section>

      {/* Scenarios */}
      <ScenariosCards />

      {/* Dinamikus poll blokkok */}
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-12">
        {pollBlocks.map(block => (
          <section key={block.anchor} id={block.anchor} className="scroll-mt-24">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-midnight mb-1">{block.heading}</h2>
              {block.intro && <p className="text-sm text-black/60 max-w-2xl">{block.intro}</p>}
            </div>
            <VoteWidget
              pollSlug={block.pollSlug}
              title={block.heading}
              description={block.intro}
              choices={block.choices}
            />
          </section>
        ))}
      </div>

      {/* Charts placeholder */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-lg bg-white p-6 border border-black/5 shadow-sm">
          <h2 className="text-2xl font-semibold text-midnight mb-4">
            Eredmények (realtime)
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="aspect-[16/10] rounded bg-teal/10 border border-teal/30 grid place-items-center text-sm text-teal">
              Vendég vs. regisztrált megoszlás (diagram helye)
            </div>
            <div className="aspect-[16/10] rounded bg-gold/10 border border-gold/30 grid place-items-center text-sm text-midnight">
              Opciós eloszlás és idősor (diagram helye)
            </div>
          </div>
        </div>
      </section>

      {/* Support / Donation */}
      <section id="support" className="mx-auto max-w-6xl px-4 pb-24">
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-midnight via-midnight/70 to-slate shadow-lg">
          <div className="relative rounded-[1.05rem] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,204,0,0.15),transparent_60%),radial-gradient(circle_at_80%_60%,rgba(46,197,182,0.18),transparent_65%)]" />
            <div className="absolute inset-0 backdrop-blur-md bg-white/5" />
            <div className="relative px-6 pt-6 pb-7 text-offwhite">
              <h2 className="text-lg font-semibold tracking-wide mb-1 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-teal animate-pulse" />
                Támogatás (Beta)
              </h2>
              <p className="text-xs text-offwhite/70 max-w-xl mb-5">
                Segítsd a fejlesztést. Válassz gyors összeget vagy másold ki az adatokat. A fizetési integrációk hamarosan aktiválva lesznek.
              </p>
              <SupportBar />
              <div className="mt-6 grid gap-3 sm:grid-cols-3 text-[10px] uppercase tracking-wide text-offwhite/40">
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex flex-col gap-0.5">
                  <span className="text-offwhite/60 font-medium text-[11px]">Státusz</span>
                  <span className="text-offwhite/80">Prototípus</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex flex-col gap-0.5">
                  <span className="text-offwhite/60 font-medium text-[11px]">Átláthatóság</span>
                  <span className="text-offwhite/80">Open roadmap</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex flex-col gap-0.5">
                  <span className="text-offwhite/60 font-medium text-[11px]">Következő</span>
                  <span className="text-offwhite/80">Stripe / Sponsors</span>
                </div>
              </div>
            </div>
            <div className="relative flex items-stretch divide-x divide-white/10 border-t border-white/10">
              <button className="group flex-1 py-3 text-center text-xs font-medium text-offwhite/70 hover:text-white hover:bg-white/5 transition">
                <span>Roadmap</span>
              </button>
              <button className="group flex-1 py-3 text-center text-xs font-medium text-offwhite/70 hover:text-white hover:bg-white/5 transition">
                <span>GitHub</span>
              </button>
              <button className="group flex-1 py-3 text-center text-xs font-medium text-offwhite/70 hover:text-white hover:bg-white/5 transition">
                <span>Kapcsolat</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
