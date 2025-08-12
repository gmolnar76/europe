"use client";
import React from "react";

interface AmountButtonProps {
  amount: number;
  currency?: string;
  onSelect: (amt: number) => void;
  selected: boolean;
}

const AmountButton = ({ amount, currency = "EUR", onSelect, selected }: AmountButtonProps) => (
  <button
    type="button"
    onClick={() => onSelect(amount)}
    className={`px-3 py-2 rounded-md text-xs font-medium border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-midnight/50 select-none ${selected ? 'bg-midnight text-white border-midnight shadow-sm' : 'bg-white hover:bg-midnight/5 border-black/10 text-midnight'}`}
    aria-pressed={selected}
  >{amount} {currency}</button>
);

export default function SupportBar() {
  const [selected, setSelected] = React.useState<number | null>(5);
  const [copied, setCopied] = React.useState<string | null>(null);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1800);
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {[2,5,10,25,50].map(a => (
          <AmountButton key={a} amount={a} onSelect={setSelected} selected={selected===a} />
        ))}
        <span className="text-[10px] uppercase tracking-wide text-offwhite/40 ml-1">Gyors összegek</span>
      </div>
      <div className="flex flex-wrap gap-3 text-xs">
        <a href="#" className="inline-flex items-center gap-1 rounded-md bg-midnight text-white px-3 py-2 hover:opacity-90 transition" aria-label="Stripe fizetés (hamarosan)">
          <span>Stripe</span>
          <span className="text-[10px] bg-white/15 px-1.5 py-0.5 rounded">beta</span>
        </a>
        <a href="#" className="inline-flex items-center gap-1 rounded-md bg-gold text-slate px-3 py-2 hover:brightness-105 transition" aria-label="GitHub Sponsors (hamarosan)">Sponsors</a>
        <a href="#" className="inline-flex items-center gap-1 rounded-md bg-teal text-white px-3 py-2 hover:brightness-110 transition" aria-label="Buy Me a Coffee (hamarosan)">Coffee</a>
        <button type="button" onClick={() => copy('Revolut', '@FELHASZNALO')} className="inline-flex items-center gap-1 rounded-md bg-offwhite border border-black/10 text-midnight px-3 py-2 hover:bg-midnight/5 transition">
          Revolut {copied==='Revolut' && <span className="text-teal font-semibold">✓</span>}
        </button>
        <button type="button" onClick={() => copy('IBAN', 'LT00 0000 0000 0000 000')} className="inline-flex items-center gap-1 rounded-md bg-offwhite border border-black/10 text-midnight px-3 py-2 hover:bg-midnight/5 transition">
          IBAN {copied==='IBAN' && <span className="text-teal font-semibold">✓</span>}
        </button>
        <a href="#" className="inline-flex items-center gap-1 rounded-md bg-black text-white px-3 py-2 hover:opacity-90 transition" aria-label="PayPal (hamarosan)">PayPal</a>
      </div>
      <div className="text-[11px] text-offwhite/60 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>Kiválasztott összeg: {selected ? selected + ' EUR' : '—'}</span>
        <span className="hidden sm:inline text-offwhite/40">A gombok jelenleg prototípus linkek.</span>
      </div>
    </div>
  );
}
