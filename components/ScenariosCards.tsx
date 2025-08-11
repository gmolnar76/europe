"use client";
import * as React from "react";

export default function ScenariosCards() {
  const [selected, setSelected] = React.useState<"sovereign" | "federal" | "overlay" | null>(null);
  const emit = (detail: "sovereign" | "federal" | "overlay") => {
    setSelected(detail);
    console.log("[ScenariosCards] click:", detail);
    window.dispatchEvent(new CustomEvent("europa:set-scenario", { detail }));
  };

  const baseBtn = "text-left rounded-lg bg-white p-5 border border-black/5 shadow-sm hover:shadow-md transition";
  const active = "ring-2 ring-midnight/40";

  return (
    <section id="scenarios" className="mx-auto max-w-6xl px-4 py-8 grid gap-6 md:grid-cols-3">
      <button type="button" onClick={() => emit("sovereign")} className={`${baseBtn} ${selected === "sovereign" ? active : ""}`} aria-pressed={selected === "sovereign"}>
        <div>
          <h3 className="font-semibold text-midnight mb-1">1) Szuverén államok közössége</h3>
          <p className="text-sm text-black/70">Erős határok, országonkénti kiemelés (EU fókusz).</p>
        </div>
      </button>
      <button type="button" onClick={() => emit("federal")} className={`${baseBtn} ${selected === "federal" ? active : ""}`} aria-pressed={selected === "federal"}>
        <div>
          <h3 className="font-semibold text-midnight mb-1">2) Európai Egyesült Államok</h3>
          <p className="text-sm text-black/70">Egységes kitöltés; határok halványan, szaggatva.</p>
        </div>
      </button>
      <button type="button" onClick={() => emit("overlay")} className={`${baseBtn} ${selected === "overlay" ? active : ""}`} aria-pressed={selected === "overlay"}>
        <div>
          <h3 className="font-semibold text-midnight mb-1">3) Északi keresztény civilizáció</h3>
          <p className="text-sm text-black/70">EU + Oroszország mint egységes blokk.</p>
        </div>
      </button>
    </section>
  );
}
