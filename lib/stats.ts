export type CountryStats = {
  name: string;
  population: number; // absolute
  tfr: number; // total fertility rate
};

// Demo stats (approximate; replace with real dataset later)
export const STATS: Record<string, CountryStats> = {
  FR: { name: "France", population: 68000000, tfr: 1.8 },
  DE: { name: "Germany", population: 84000000, tfr: 1.5 },
  PL: { name: "Poland", population: 37000000, tfr: 1.3 },
  ES: { name: "Spain", population: 48000000, tfr: 1.2 },
  IT: { name: "Italy", population: 59000000, tfr: 1.2 },
  GB: { name: "United Kingdom", population: 68000000, tfr: 1.6 },
  NO: { name: "Norway", population: 5400000, tfr: 1.5 },
  CH: { name: "Switzerland", population: 8800000, tfr: 1.5 },
  IS: { name: "Iceland", population: 380000, tfr: 1.7 },
  LI: { name: "Liechtenstein", population: 39000, tfr: 1.5 },
  TR: { name: "Turkey", population: 85000000, tfr: 1.9 },
  RU: { name: "Russia", population: 144000000, tfr: 1.4 },
  BY: { name: "Belarus", population: 9500000, tfr: 1.3 },
  KZ: { name: "Kazakhstan", population: 20000000, tfr: 3.0 },
  AM: { name: "Armenia", population: 3000000, tfr: 1.6 },
  KG: { name: "Kyrgyzstan", population: 7000000, tfr: 3.2 },
  US: { name: "United States", population: 334000000, tfr: 1.7 },
  CA: { name: "Canada", population: 39000000, tfr: 1.4 },
};

export function getCountryStats(iso2: string): CountryStats | undefined {
  return STATS[iso2.toUpperCase()];
}
