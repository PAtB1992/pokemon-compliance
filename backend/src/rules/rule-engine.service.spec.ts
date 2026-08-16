import { RuleEngineService } from './rule-engine.service';
import { PokemonEntry } from '../trainers/pokemon-entry.entity';
import { TournamentRule } from './tournament-rule.entity';
import { ViolationSeverity } from '../violations/violation.entity';

function pokemon(overrides: Partial<PokemonEntry> = {}): PokemonEntry {
  return {
    id: 'p1',
    speciesName: 'Pikachu',
    level: 20,
    isLegendary: false,
    heldItem: undefined,
    trainerId: 't1',
    trainer: undefined as unknown as PokemonEntry['trainer'],
    ...overrides,
  };
}

function rule(overrides: Partial<TournamentRule> = {}): TournamentRule {
  return {
    id: 'r1',
    name: 'Test-Regel',
    description: '...',
    maxLevel: undefined,
    maxLegendaries: undefined,
    bannedItems: undefined,
    noDuplicateSpecies: false,
    active: true,
    ...overrides,
  };
}

describe('RuleEngineService', () => {
  let service: RuleEngineService;

  beforeEach(() => {
    service = new RuleEngineService();
  });

  it('meldet keine Verstoesse bei einem regelkonformen Team', () => {
    const roster = [pokemon({ level: 30 }), pokemon({ level: 40, speciesName: 'Bulbasaur' })];
    const result = service.checkRoster(roster, rule({ maxLevel: 50 }));
    expect(result).toHaveLength(0);
  });

  it('meldet einen Verstoss, wenn ein Pokemon das Level-Limit ueberschreitet', () => {
    const roster = [pokemon({ level: 60, speciesName: 'Charizard' })];
    const result = service.checkRoster(roster, rule({ maxLevel: 50 }));
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe(ViolationSeverity.MEDIUM);
    expect(result[0].details).toContain('Charizard');
  });

  it('meldet einen Verstoss bei zu vielen legendaeren Pokemon', () => {
    const roster = [
      pokemon({ speciesName: 'Mewtwo', isLegendary: true }),
      pokemon({ speciesName: 'Rayquaza', isLegendary: true }),
    ];
    const result = service.checkRoster(roster, rule({ maxLegendaries: 1 }));
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe(ViolationSeverity.HIGH);
  });

  it('meldet einen Verstoss bei einem verbotenen Item', () => {
    const roster = [pokemon({ speciesName: 'Snorlax', heldItem: 'Master Ball' })];
    const result = service.checkRoster(roster, rule({ bannedItems: ['Master Ball'] }));
    expect(result).toHaveLength(1);
    expect(result[0].details).toContain('Master Ball');
  });

  it('kann mehrere Regelverstoesse gleichzeitig erkennen', () => {
    const roster = [
      pokemon({ speciesName: 'Mewtwo', level: 70, isLegendary: true, heldItem: 'Master Ball' }),
    ];
    const result = service.checkRoster(
      roster,
      rule({ maxLevel: 50, maxLegendaries: 0, bannedItems: ['Master Ball'] }),
    );
    expect(result).toHaveLength(3);
  });

  // --- Uebungsaufgabe (Stage 4b in EXERCISE.md) -------------------------------
  // Entferne ".skip", sobald du rule.noDuplicateSpecies im RuleEngineService
  // implementiert hast, und bringe den Test zum Gruenwerden.
  it.skip('meldet einen Verstoss bei doppelten Spezies im Team, wenn noDuplicateSpecies aktiv ist', () => {
    const roster = [pokemon({ speciesName: 'Pikachu' }), pokemon({ speciesName: 'Pikachu' })];
    const result = service.checkRoster(roster, rule({ noDuplicateSpecies: true }));
    expect(result).toHaveLength(1);
    expect(result[0].details).toContain('Pikachu');
  });
});
