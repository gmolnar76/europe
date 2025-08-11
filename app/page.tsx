import Map from "@/components/map/Map";
import ScenariosCards from "@/components/ScenariosCards";

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
      <section className="mx-auto max-w-6xl px-4">
        <Map height={420} />
        <p className="mt-2 text-sm text-black/60">A fenti vezérlővel válts a három szcenárió között.</p>
      </section>

      {/* Scenarios */}
      <ScenariosCards />

      {/* Vote placeholder */}
      <section id="vote" className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-lg bg-white p-6 border border-black/5 shadow-sm">
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
    </div>
  );
}
