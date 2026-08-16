import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TournamentRule } from './tournament-rule.entity';

@Injectable()
export class RulesService {
  constructor(@InjectRepository(TournamentRule) private readonly repo: Repository<TournamentRule>) {}

  findAll(): Promise<TournamentRule[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<TournamentRule> {
    const rule = await this.repo.findOne({ where: { id } });
    if (!rule) throw new NotFoundException(`Regel ${id} nicht gefunden`);
    return rule;
  }
}
