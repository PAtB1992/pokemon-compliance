import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Trainer } from '../trainers/trainer.entity';

export enum ViolationSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Entity()
export class Violation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Trainer, { onDelete: 'CASCADE' })
  trainer: Trainer;

  @Column()
  trainerId: string;

  @Column()
  ruleId: string;

  @Column()
  ruleName: string;

  @Column({ type: 'simple-enum', enum: ViolationSeverity })
  severity: ViolationSeverity;

  @Column()
  details: string;

  @CreateDateColumn()
  createdAt: Date;
}
