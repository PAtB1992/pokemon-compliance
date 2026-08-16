import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ComplianceService } from './compliance.service';
import { Trainer } from '../trainers/trainer.entity';
import { TournamentRule } from '../rules/tournament-rule.entity';
import { RuleEngineService } from '../rules/rule-engine.service';
import { PUBLISHER_PORT } from '../events/publisher.port';

describe('ComplianceService', () => {
  let service: ComplianceService;
  let publisher: { publish: jest.Mock };
  let trainerRepo: { findOne: jest.Mock };
  let ruleRepo: { findOne: jest.Mock };
  let dataSource: { transaction: jest.Mock };

  beforeEach(async () => {
    trainerRepo = { findOne: jest.fn() };
    ruleRepo = { findOne: jest.fn() };
    publisher = { publish: jest.fn() };
    dataSource = {
      transaction: jest.fn(async (cb) =>
        cb({
          create: (_entity: unknown, data: unknown) => data,
          save: async (_entity: unknown, rows: Record<string, unknown>[]) =>
            rows.map((r, i) => ({ id: `v${i}`, createdAt: new Date(), ...r })),
        }),
      ),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ComplianceService,
        RuleEngineService,
        { provide: getRepositoryToken(Trainer), useValue: trainerRepo },
        { provide: getRepositoryToken(TournamentRule), useValue: ruleRepo },
        { provide: DataSource, useValue: dataSource },
        { provide: PUBLISHER_PORT, useValue: publisher },
      ],
    }).compile();

    service = moduleRef.get(ComplianceService);
  });

  it('publiziert kein Event, wenn das Team regelkonform ist', async () => {
    trainerRepo.findOne.mockResolvedValue({ id: 't1', name: 'Trainer Bo', roster: [] });
    ruleRepo.findOne.mockResolvedValue({ id: 'r1', name: 'Great League Cap', maxLevel: 50 });

    const result = await service.checkRoster('t1', 'r1');

    expect(result.isCompliant).toBe(true);
    expect(publisher.publish).not.toHaveBeenCalled();
  });

  it('speichert Violations und publiziert ein Event bei Regelverstoss', async () => {
    trainerRepo.findOne.mockResolvedValue({
      id: 't1',
      name: 'Trainer Bo',
      roster: [{ speciesName: 'Charizard', level: 80, isLegendary: false, trainerId: 't1' }],
    });
    ruleRepo.findOne.mockResolvedValue({ id: 'r1', name: 'Great League Cap', maxLevel: 50 });

    const result = await service.checkRoster('t1', 'r1');

    expect(result.isCompliant).toBe(false);
    expect(result.violations).toHaveLength(1);
    expect(publisher.publish).toHaveBeenCalledWith(
      'compliance.roster.violated',
      expect.objectContaining({ trainerId: 't1', violationCount: 1 }),
    );
  });
});
