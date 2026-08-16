import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trainer } from '../trainers/trainer.entity';
import { TournamentRule } from '../rules/tournament-rule.entity';
import { Violation } from '../violations/violation.entity';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { RulesModule } from '../rules/rules.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trainer, TournamentRule, Violation]), RulesModule, EventsModule],
  controllers: [ComplianceController],
  providers: [ComplianceService],
})
export class ComplianceModule {}
