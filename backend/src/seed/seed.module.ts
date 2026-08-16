import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trainer } from '../trainers/trainer.entity';
import { TournamentRule } from '../rules/tournament-rule.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trainer, TournamentRule])],
  providers: [SeedService],
})
export class SeedModule {}
