export type Scenario = "sovereign" | "federal" | "overlay";

// EU-27 ISO A2 codes
const EU = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL",
  "PL", "PT", "RO", "SE", "SI", "SK", "ES"
] as const;

const EFTA_UK = ["GB", "NO", "CH", "IS", "LI"] as const; // GB not UK per ISO-3166
const NATO_EUROPE_EXTRA = ["TR"] as const; // simplified
const NA_ATLANTIC = ["US", "CA"] as const;

const EAEU_CORE = ["RU", "BY", "KZ", "AM", "KG"] as const;

// Use NAME property for all country mappings (as in the GeoJSON source)
const CODE_TO_NAME: Record<string, string> = {
  AT: "Austria",
  BE: "Belgium",
  BG: "Bulgaria",
  HR: "Croatia",
  CY: "Cyprus",
  CZ: "Czechia", // was "Czech Republic"; GeoJSON uses "Czechia"
  DK: "Denmark",
  EE: "Estonia",
  FI: "Finland",
  FR: "France",
  DE: "Germany",
  GR: "Greece",
  HU: "Hungary",
  IE: "Ireland",
  IT: "Italy",
  LT: "Lithuania",
  LU: "Luxembourg",
  LV: "Latvia",
  MT: "Malta",
  NL: "Netherlands",
  PL: "Poland",
  PT: "Portugal",
  RO: "Romania",
  SE: "Sweden",
  SI: "Slovenia",
  SK: "Slovakia",
  ES: "Spain",

  // Others used elsewhere
  GB: "United Kingdom",
  NO: "Norway",
  CH: "Switzerland",
  IS: "Iceland",
  LI: "Liechtenstein",
  TR: "Turkey",
  US: "United States",
  CA: "Canada",
  RU: "Russia",
  BY: "Belarus",
  KZ: "Kazakhstan",
  AM: "Armenia",
  KG: "Kyrgyzstan",
};

function codesToName(list: readonly string[]): string[] {
  return list.map((c) => CODE_TO_NAME[c]).filter(Boolean);
}

export function getEUList(): string[] {
  return [...EU];
}
export function getEAList(): string[] {
  return Array.from(new Set([...EU, ...EFTA_UK, ...NATO_EUROPE_EXTRA, ...NA_ATLANTIC]));
}
export function getEZList(): string[] {
  // Keep core required: RU, BY (+ others if needed)
  return ["RU", "BY", ...EAEU_CORE.filter((c) => c !== "RU" && c !== "BY")];
}

export function getEUAdminNames(): string[] {
  return codesToName(EU);
}
export function getEAAdminNames(): string[] {
  return codesToName(getEAList());
}
export function getEZAdminNames(): string[] {
  return codesToName(getEZList());
}

export function getAdminToISO2Map(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [code, name] of Object.entries(CODE_TO_NAME)) out[name] = code;
  return out;
}

export function getAllFlagISO2(): string[] {
  return Array.from(new Set([...getEAList(), ...getEZList()]));
}
