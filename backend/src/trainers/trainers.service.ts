import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainer } from './trainer.entity';

@Injectable()
export class TrainersService {
  constructor(@InjectRepository(Trainer) private readonly repo: Repository<Trainer>) {}

  findAll(): Promise<Trainer[]> {
    return this.repo.find({ relations: ['roster'] });
  }

  async findOne(id: string): Promise<Trainer> {
    const trainer = await this.repo.findOne({ where: { id }, relations: ['roster'] });
    if (!trainer) throw new NotFoundException(`Trainer ${id} nicht gefunden`);
    return trainer;
  }
}
