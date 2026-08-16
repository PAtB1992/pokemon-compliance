import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainer } from '../trainers/trainer.entity';
import { PokemonEntry } from '../trainers/pokemon-entry.entity';
import { TournamentRule } from '../rules/tournament-rule.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Trainer) private readonly trainerRepo: Repository<Trainer>,
    @InjectRepository(TournamentRule) private readonly ruleRepo: Repository<TournamentRule>,
  ) {}

  async onModuleInit() {
    const existing = await this.trainerRepo.count();
    if (existing > 0) return;

    this.logger.log('Seed-Daten werden angelegt...');

    await this.ruleRepo.save([
      this.ruleRepo.create({
        name: 'Great League Cap',
        description: 'Standard-Liga: Level-Limit 50, keine Legendaeren, kein Master Ball.',
        maxLevel: 50,
        maxLegendaries: 0,
        bannedItems: ['Master Ball'],
      }),
      this.ruleRepo.create({
        name: 'Legendary Showdown',
        description: 'Sonderturnier: bis zu 2 legendaere Pokemon pro Team erlaubt, kein Level-Limit.',
        maxLegendaries: 2,
      }),
    ]);

    await this.trainerRepo.save([
      this.trainerRepo.create({
        name: 'Trainer Bo',
        region: 'Kanto',
        roster: [
          this.pokemon('Charizard', 80, false, 'Master Ball'),
          this.pokemon('Pikachu', 25, false),
        ],
      }),
      this.trainerRepo.create({
        name: 'Trainer Lin',
        region: 'Johto',
        roster: [
          this.pokemon('Mewtwo', 70, true),
          this.pokemon('Rayquaza', 75, true),
          this.pokemon('Bulbasaur', 15, false),
        ],
      }),
      this.trainerRepo.create({
        name: 'Trainer Kofi',
        region: 'Hoenn',
        roster: [
            this.pokemon('Squirtle', 20, false),
            this.pokemon('Eevee', 18, false)],
      }),
    ]);

    this.logger.log('Seed-Daten angelegt: 3 Trainer, 2 Regeln.');
  }

  private pokemon(speciesName: string, level: number, isLegendary: boolean, heldItem?: string): PokemonEntry {
    const entry = new PokemonEntry();
    entry.speciesName = speciesName;
    entry.level = level;
    entry.isLegendary = isLegendary;
    entry.heldItem = heldItem;
    return entry;
  }
}
