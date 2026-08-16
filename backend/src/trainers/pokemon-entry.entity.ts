import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Trainer } from './trainer.entity';

@Entity()
export class PokemonEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  speciesName: string;

  @Column()
  level: number;

  @Column({ default: false })
  isLegendary: boolean;

  @Column({ nullable: true })
  heldItem?: string;

  @ManyToOne(() => Trainer, (trainer) => trainer.roster, { onDelete: 'CASCADE' })
  trainer: Trainer;

  @Column()
  trainerId: string;
}
