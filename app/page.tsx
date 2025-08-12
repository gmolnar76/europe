import Map from "@/components/map/Map";
import ScenariosCards from "@/components/ScenariosCards";
import IntroDisclosure from "@/components/IntroDisclosure";
import SupportBar from "@/components/SupportBar";

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

      {/* Vote placeholder */}
      <section id="vote" className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-lg bg-white p-6 border border-black/5 shadow-sm text-slate">
          <h2 className="text-2xl font-semibold text-midnight mb-4">
            Válassz egy opciót
          </h2>
          <form className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-2 p-3 border rounded hover:bg-black/5 cursor-pointer">
              <input type="radio" name="choice" value="sovereign" />
              <span>
                Szuverén nemzetállamok közössége (EU együttműködés)
              </span>
            </label>
            <label className="flex items-center gap-2 p-3 border rounded hover:bg-black/5 cursor-pointer">
              <input type="radio" name="choice" value="federal" />
              <span>Európai Egyesült Államok</span>
            </label>
            <label className="flex items-center gap-2 p-3 border rounded hover:bg-black/5 cursor-pointer">
              <input type="radio" name="choice" value="civilizational" />
              <span>Euroatlanti és Eurázsiai egységes civilizáció</span>
            </label>
            <div className="md:col-span-3 flex items-center gap-3 mt-2">
              <button
                type="button"
                className="px-5 py-2.5 rounded bg-midnight text-white"
              >
                Beküldés
              </button>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked /> Vendégszavazás engedélyezése
              </label>
            </div>
          </form>
        </div>
      </section>

      {/* NEW: EU Political Leadership voting section */}
      <section id="leadership" className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-lg bg-white p-6 border border-black/5 shadow-sm text-slate space-y-6">
          <header>
            <h2 className="text-2xl font-semibold text-midnight mb-2">EU politikai vezetés</h2>
            <p className="text-sm text-black/60">Próbakérdések a lehetséges intézményi és demokratikus reformokról.</p>
          </header>
          <form className="space-y-6" aria-labelledby="leadership-heading">
            <fieldset className="space-y-3">
              <legend id="leadership-q1" className="font-medium text-midnight">1. Támogatnád a transznacionális EP listák bevezetését?</legend>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { v: "yes", l: "Igen" },
                  { v: "no", l: "Nem" },
                  { v: "unsure", l: "Bizonytalan" },
                ].map(o => (
                  <label key={o.v} className="flex items-center gap-2 p-3 border rounded hover:bg-black/5 cursor-pointer">
                    <input type="radio" name="leadership_q1" value={o.v} />
                    <span>{o.l}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="space-y-3">
              <legend className="font-medium text-midnight">2. Legyen közvetlenül választott uniós Bizottság-elnök?</legend>
              <div className="grid md:grid-cols-4 gap-3">
                {[
                  { v: "direct", l: "Közvetlen választás" },
                  { v: "spitzen", l: "Spitzenkandidat" },
                  { v: "council", l: "Tanács jelölje" },
                  { v: "unsure", l: "Nem tudom" },
                ].map(o => (
                  <label key={o.v} className="flex items-center gap-2 p-3 border rounded hover:bg-black/5 cursor-pointer">
                    <input type="radio" name="leadership_q2" value={o.v} />
                    <span>{o.l}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="space-y-3">
              <legend className="font-medium text-midnight">3. Egyetértesz az uniós népszavazás (EU-wide referendum) lehetőségével?</legend>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { v: "support", l: "Támogatom" },
                  { v: "conditional", l: "Feltételekkel" },
                  { v: "oppose", l: "Ellenzem" },
                ].map(o => (
                  <label key={o.v} className="flex items-center gap-2 p-3 border rounded hover:bg-black/5 cursor-pointer">
                    <input type="radio" name="leadership_q3" value={o.v} />
                    <span>{o.l}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex items-center gap-4 pt-2">
              <button type="button" className="px-5 py-2.5 rounded bg-midnight text-white">Válaszok mentése</button>
              <span className="text-xs text-black/50">(Prototype – nem végleges tárolás)</span>
            </div>
          </form>
        </div>
      </section>

      {/* NEW: Migration voting section */}
      <section id="migration" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-lg bg-white p-6 border border-black/5 shadow-sm text-slate space-y-6">
            <header>
              <h2 className="text-2xl font-semibold text-midnight mb-2">Migráció és menekültügy</h2>
              <p className="text-sm text-black/60">Próbakérdések a közös uniós migrációs politika elemeiről.</p>
            </header>
            <form className="space-y-6" aria-labelledby="migration-heading">
              <fieldset className="space-y-3">
                <legend className="font-medium text-midnight">1. Milyen szolidaritási mechanizmust támogatnál?</legend>
                <div className="grid md:grid-cols-4 gap-3">
                  {[
                    { v: "quota", l: "Elosztási kvóta" },
                    { v: "financial", l: "Pénzügyi hozzájárulás" },
                    { v: "mixed", l: "Vegyes modell" },
                    { v: "unsure", l: "Nem tudom" },
                  ].map(o => (
                    <label key={o.v} className="flex items-center gap-2 p-3 border rounded hover:bg-black/5 cursor-pointer">
                      <input type="radio" name="migration_q1" value={o.v} />
                      <span>{o.l}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="space-y-3">
                <legend className="font-medium text-midnight">2. Bővítsük a legális munkaerő-migrációs csatornákat célzott készségpartnerségekkel?</legend>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { v: "yes", l: "Igen" },
                    { v: "conditional", l: "Feltételekkel" },
                    { v: "no", l: "Nem" },
                  ].map(o => (
                    <label key={o.v} className="flex items-center gap-2 p-3 border rounded hover:bg-black/5 cursor-pointer">
                      <input type="radio" name="migration_q2" value={o.v} />
                      <span>{o.l}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="space-y-3">
                <legend className="font-medium text-midnight">3. Szükség van-e egységes minimum standardokra a befogadó központokban?</legend>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { v: "high", l: "Igen, magas szint" },
                    { v: "basic", l: "Igen, alap szint" },
                    { v: "no", l: "Nem" },
                  ].map(o => (
                    <label key={o.v} className="flex items-center gap-2 p-3 border rounded hover:bg-black/5 cursor-pointer">
                      <input type="radio" name="migration_q3" value={o.v} />
                      <span>{o.l}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="flex items-center gap-4 pt-2">
                <button type="button" className="px-5 py-2.5 rounded bg-midnight text-white">Válaszok mentése</button>
                <span className="text-xs text-black/50">(Prototype – nem végleges tárolás)</span>
              </div>
            </form>
        </div>
      </section>

      {/* NEW: WHO / Globális egészség szekció */}
      <section id="who" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-lg bg-white p-6 border border-black/5 shadow-sm text-slate space-y-6">
          <header>
            <h2 className="text-2xl font-semibold text-midnight mb-2">WHO & globális egészség</h2>
            <p className="text-sm text-black/60">Próbakérdések az EU szerepéről a WHO-val és a világjárvány‑felkészüléssel kapcsolatban.</p>
          </header>
          <form className="space-y-6" aria-labelledby="who-heading">
            <fieldset className="space-y-3">
              <legend className="font-medium text-midnight">1. Erősebb közös uniós gyógyszer‑készlet (strategic stockpile) szükséges?</legend>
              <div className="grid md:grid-cols-4 gap-3">
                {[
                  { v: "yes", l: "Igen" },
                  { v: "partial", l: "Részben (kritikus termékek)" },
                  { v: "national", l: "Maradjon nemzeti" },
                  { v: "unsure", l: "Nem tudom" },
                ].map(o => (
                  <label key={o.v} className="flex items-center gap-2 p-3 border rounded hover:bg-black/5 cursor-pointer">
                    <input type="radio" name="who_q1" value={o.v} />
                    <span>{o.l}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="space-y-3">
              <legend className="font-medium text-midnight">2. Támogatod, hogy az EU közös álláspontot alakítson ki a WHO pandémiás egyezmény tárgyalásain?</legend>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { v: "support", l: "Támogatom" },
                  { v: "conditional", l: "Feltételekkel" },
                  { v: "oppose", l: "Ellenzem" },
                ].map(o => (
                  <label key={o.v} className="flex items-center gap-2 p-3 border rounded hover:bg-black/5 cursor-pointer">
                    <input type="radio" name="who_q2" value={o.v} />
                    <span>{o.l}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="space-y-3">
              <legend className="font-medium text-midnight">3. Legyen kötelező valós idejű genom szekvenálási adatmegosztás EU-s szinten új kórokozók esetén?</legend>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { v: "yes", l: "Igen" },
                  { v: "privacy", l: "Igen, adatvédelmi garanciákkal" },
                  { v: "no", l: "Nem" },
                ].map(o => (
                  <label key={o.v} className="flex items-center gap-2 p-3 border rounded hover:bg-black/5 cursor-pointer">
                    <input type="radio" name="who_q3" value={o.v} />
                    <span>{o.l}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex items-center gap-4 pt-2">
              <button type="button" className="px-5 py-2.5 rounded bg-midnight text-white">Válaszok mentése</button>
              <span className="text-xs text-black/50">(Prototype – nem végleges tárolás)</span>
            </div>
          </form>
        </div>
      </section>

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
