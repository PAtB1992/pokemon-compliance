import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Violation } from './violation.entity';

@Injectable()
export class ViolationsService {
  constructor(@InjectRepository(Violation) private readonly repo: Repository<Violation>) {}

  findAll(): Promise<Violation[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findByTrainer(trainerId: string): Promise<Violation[]> {
    return this.repo.find({ where: { trainerId }, order: { createdAt: 'DESC' } });
  }
}
