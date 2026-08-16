import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trainer } from './trainers/trainer.entity';
import { PokemonEntry } from './trainers/pokemon-entry.entity';
import { TournamentRule } from './rules/tournament-rule.entity';
import { Violation } from './violations/violation.entity';
import { TrainersModule } from './trainers/trainers.module';
import { RulesModule } from './rules/rules.module';
import { ViolationsModule } from './violations/violations.module';
import { ComplianceModule } from './compliance/compliance.module';
import { EventsModule } from './events/events.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [Trainer, PokemonEntry, TournamentRule, Violation],
      synchronize: true, // Nur fuer dieses lokale Uebungsprojekt ok - nie so in echten Produktivsystemen!
    }),
    TrainersModule,
    RulesModule,
    ViolationsModule,
    ComplianceModule,
    EventsModule,
    SeedModule,
  ],
})
export class AppModule {}
