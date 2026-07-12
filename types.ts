
export interface ElementData {
  name: string;
  symbol: string;
  number: number;
  mass: number;
  shells: number[];
  category: string;
  phase: string;
  reactivity?: string;
  period: number;
  group: number;
  ionizationEnergy?: number; // kJ/mol
  electronAffinity?: number; // kJ/mol
  atomicRadius?: number; // pm
}

export interface AtomState {
  protons: number;
  neutrons: number;
  electrons: number;
}
