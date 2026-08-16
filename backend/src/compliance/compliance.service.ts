import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Trainer } from '../trainers/trainer.entity';
import { TournamentRule } from '../rules/tournament-rule.entity';
import { Violation } from '../violations/violation.entity';
import { RuleEngineService } from '../rules/rule-engine.service';
import { PUBLISHER_PORT, PublisherPort } from '../events/publisher.port';

export interface ComplianceCheckResult {
  isCompliant: boolean;
  violations: Violation[];
}

@Injectable()
export class ComplianceService {
  constructor(
    @InjectRepository(Trainer) private readonly trainerRepo: Repository<Trainer>,
    @InjectRepository(TournamentRule) private readonly ruleRepo: Repository<TournamentRule>,
    private readonly ruleEngine: RuleEngineService,
    private readonly dataSource: DataSource,
    @Inject(PUBLISHER_PORT) private readonly publisher: PublisherPort,
  ) {}

  async checkRoster(trainerId: string, ruleId: string): Promise<ComplianceCheckResult> {
    const trainer = await this.trainerRepo.findOne({ where: { id: trainerId }, relations: ['roster'] });
    if (!trainer) throw new NotFoundException(`Trainer ${trainerId} nicht gefunden`);

    const rule = await this.ruleRepo.findOne({ where: { id: ruleId } });
    if (!rule) throw new NotFoundException(`Regel ${ruleId} nicht gefunden`);

    const findings = this.ruleEngine.checkRoster(trainer.roster, rule);

    // Speichern der Violations passiert transaktional - entweder alle oder keine.
    // Vergleiche Kapitel "TypeORM" (Transactions) im Interview-Guide: genau dieses
    // Muster wird dort fuer Audit-Log-Eintraege bei Compliance-Aenderungen erklaert.
    const savedViolations = await this.dataSource.transaction(async (manager) => {
      const violations = findings.map((finding) =>
        manager.create(Violation, {
          trainerId: trainer.id,
          ruleId: rule.id,
          ruleName: rule.name,
          severity: finding.severity,
          details: finding.details,
        }),
      );
      return violations.length ? manager.save(Violation, violations) : [];
    });

    if (savedViolations.length) {
      await this.publisher.publish('compliance.roster.violated', {
        trainerId: trainer.id,
        trainerName: trainer.name,
        ruleId: rule.id,
        ruleName: rule.name,
        violationCount: savedViolations.length,
      });
    }

    return { isCompliant: savedViolations.length === 0, violations: savedViolations };
  }
}
