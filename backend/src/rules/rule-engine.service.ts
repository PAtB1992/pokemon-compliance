import {Injectable} from '@nestjs/common';
import {PokemonEntry} from '../trainers/pokemon-entry.entity';
import {TournamentRule} from './tournament-rule.entity';
import {ViolationSeverity} from '../violations/violation.entity';

export interface RuleCheckResult {
  severity: ViolationSeverity;
  details: string;
}

/**
 * Das Herzstueck der Compliance-Pruefung: reine, leicht testbare Business-Logik
 * ohne Datenbank- oder HTTP-Abhaengigkeiten (bewusst kein @InjectRepository hier -
 * vergleiche dazu Kapitel "TypeORM" / "Architektur" im Interview-Guide zum Thema
 * Trennung von Business-Logik und Infrastruktur).
 */
@Injectable()
export class RuleEngineService {
  checkRoster(roster: PokemonEntry[], rule: TournamentRule): RuleCheckResult[] {
    const results: RuleCheckResult[] = [];

    if (rule.maxLevel != null) {
      for (const p of roster) {
        if (p.level > rule.maxLevel) {
          results.push({
            severity: ViolationSeverity.MEDIUM,
            details: `${p.speciesName} (Level ${p.level}) ueberschreitet das Level-Limit von ${rule.maxLevel}.`,
          });
        }
      }
    }

    if (rule.maxLegendaries != null) {
      const legendaries = roster.filter((p) => p.isLegendary);
      if (legendaries.length > rule.maxLegendaries) {
        results.push({
          severity: ViolationSeverity.HIGH,
          details: `Team enthaelt ${legendaries.length} legendaere Pokemon, erlaubt sind maximal ${rule.maxLegendaries} (${legendaries
            .map((p) => p.speciesName)
            .join(', ')}).`,
        });
      }
    }

    if (rule.bannedItems?.length) {
      for (const p of roster) {
        if (p.heldItem && rule.bannedItems.includes(p.heldItem)) {
          results.push({
            severity: ViolationSeverity.HIGH,
            details: `${p.speciesName} traegt das verbotene Item "${p.heldItem}".`,
          });
        }
      }
    }

    if (rule.noDuplicateSpecies) {
      const speciesCount = new Map<string, number>();
      for (const p of roster) {
        speciesCount.set(p.speciesName, (speciesCount.get(p.speciesName) ?? 0) + 1)
      }

      const duplicates: string[] = []
      for (const [species, count] of speciesCount.entries()) {
        if (count > 1) {
          duplicates.push(species)
        }
      }
      if (duplicates.length > 0) {
        results.push({
          severity: ViolationSeverity.LOW,
          details: `Team enthält mehrfach: ${duplicates.join(', ')} `,
        })
      }
    }

    // TODO (Uebungsaufgabe, siehe EXERCISE.md Stage 4b): rule.noDuplicateSpecies auswerten.
    // Aktuell wird dieser Fall noch nicht geprueft - der zugehoerige Test in
    // rule-engine.service.spec.ts ist bewusst als it.skip markiert. Entferne .skip,
    // sobald du die Logik implementiert hast, und bringe den Test zum Gruenwerden.

    return results;
  }
}
