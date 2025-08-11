"use client";
import * as React from "react";
import type { Scenario } from "@/lib/regions";

export type ScenariosControlProps = {
  value: Scenario;
  onChange: (v: Scenario) => void;
};

export default function ScenariosControl({ value, onChange }: ScenariosControlProps) {
  return (
    <div className="inline-flex rounded-md border border-black/10 bg-white p-1 text-sm shadow-sm">
      {(
        [
          ["sovereign", "Szuverén államok"],
          ["federal", "EU egyesült államok"],
          ["overlay", "EA + EZ overlay"],
        ] as const
      ).map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`px-3 py-1.5 rounded ${
            value === key ? "bg-midnight text-white" : "hover:bg-black/5"
          }`}
          aria-pressed={value === key}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
