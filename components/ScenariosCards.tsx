"use client";
import * as React from "react";

export default function ScenariosCards() {
  const emit = (detail: "sovereign" | "federal" | "overlay") =>
    window.dispatchEvent(new CustomEvent("europa:set-scenario", { detail }));

  return (
    <section id="scenarios" className="mx-auto max-w-6xl px-4 py-8 grid gap-6 md:grid-cols-3">
      <button onClick={() => emit("sovereign")} className="text-left rounded-lg bg-white p-5 border border-black/5 shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-midnight mb-2">1) Szuverén államok közössége</h3>
        <p className="text-sm text-black/70">Erős határok, országonkénti kiemelés (EU fókusz).</p>
      </button>
      <button onClick={() => emit("federal")} className="text-left rounded-lg bg-white p-5 border border-black/5 shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-midnight mb-2">2) Európai Egyesült Államok</h3>
        <p className="text-sm text-black/70">Egységes kitöltés; határok halványan, szaggatva.</p>
      </button>
      <button onClick={() => emit("overlay")} className="text-left rounded-lg bg-white p-5 border border-black/5 shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-midnight mb-2">3) Euroatlanti + Eurázsiai civilizáció</h3>
        <p className="text-sm text-black/70">Két overlay (EA kék, EZ arany), kevert metszet.</p>
      </button>
    </section>
  );
}
