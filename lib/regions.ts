export type Scenario = "sovereign" | "federal" | "overlay";

// Demo EU subset (extend later)
const EU = ["FR", "DE", "PL", "ES", "IT"] as const;

const EFTA_UK = ["GB", "NO", "CH", "IS", "LI"] as const; // GB not UK per ISO-3166
const NATO_EUROPE_EXTRA = ["TR"] as const; // simplified
const NA_ATLANTIC = ["US", "CA"] as const;

const EAEU_CORE = ["RU", "BY", "KZ", "AM", "KG"] as const;

const CODE_TO_ADMIN: Record<string, string> = {
  FR: "France",
  DE: "Germany",
  PL: "Poland",
  ES: "Spain",
  IT: "Italy",
  GB: "United Kingdom",
  NO: "Norway",
  CH: "Switzerland",
  IS: "Iceland",
  LI: "Liechtenstein",
  TR: "Turkey",
  US: "United States of America",
  CA: "Canada",
  RU: "Russia",
  BY: "Belarus",
  KZ: "Kazakhstan",
  AM: "Armenia",
  KG: "Kyrgyzstan",
};

function codesToAdminNames(list: readonly string[]): string[] {
  return list.map((c) => CODE_TO_ADMIN[c]).filter(Boolean);
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
  return codesToAdminNames(EU);
}
export function getEAAdminNames(): string[] {
  return codesToAdminNames(getEAList());
}
export function getEZAdminNames(): string[] {
  return codesToAdminNames(getEZList());
}

export function getAdminToISO2Map(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [code, admin] of Object.entries(CODE_TO_ADMIN)) out[admin] = code;
  return out;
}

export function getAllFlagISO2(): string[] {
  return Array.from(new Set([...getEAList(), ...getEZList()]));
}
