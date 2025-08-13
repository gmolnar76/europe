import type maplibregl from 'maplibre-gl';

export type ScenarioKey = 'sovereign' | 'federal' | 'overlay';

export interface ScenarioMeta { key: ScenarioKey; label: string; desc: string }
export const SCENARIOS: Record<ScenarioKey, ScenarioMeta> = {
  sovereign: { key: 'sovereign', label: 'Szuverén együttműködés', desc: 'EU tagországok különböző árnyalatokkal, nemzetállami fókusz.' },
  federal: { key: 'federal', label: 'Föderális vízió', desc: 'Egységes EU blokk egységes (piros) kitöltéssel.' },
  overlay: { key: 'overlay', label: 'Euroatlanti + Eurázsiai', desc: 'Kettős civilizációs overlay (EU + Oroszország / kiterjesztés).' }
};

export interface ScenarioHelpers {
  setBaseShades: (namesOverride?: string[]) => void;
  setBaseEUColor: (color?: string, names?: string[]) => void;
  showEUFill: (visible: boolean, color?: string, opacity?: number) => void;
  getEUAdminNames: () => string[];
}

export function applyScenario(map: maplibregl.Map, key: ScenarioKey, helpers: ScenarioHelpers) {
  if (key === 'sovereign') {
    helpers.setBaseShades();
    helpers.showEUFill(false);
  } else if (key === 'federal') {
    helpers.setBaseEUColor('#EF4444');
    helpers.showEUFill(false);
  } else if (key === 'overlay') {
    const euPlusRu = [...helpers.getEUAdminNames(), 'Russia', 'Russian Federation'];
    helpers.setBaseShades(euPlusRu);
    helpers.showEUFill(false);
  }
}
