export interface PokemonEntry {
  id: string;
  speciesName: string;
  level: number;
  isLegendary: boolean;
  heldItem?: string;
}

export interface Trainer {
  id: string;
  name: string;
  region?: string;
  roster: PokemonEntry[];
}

export interface TournamentRule {
  id: string;
  name: string;
  description: string;
  maxLevel?: number;
  maxLegendaries?: number;
  bannedItems?: string[];
}

export interface Violation {
  id: string;
  trainerId: string;
  ruleId: string;
  ruleName: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  details: string;
  createdAt: string;
}

export interface ComplianceCheckResult {
  isCompliant: boolean;
  violations: Violation[];
}
