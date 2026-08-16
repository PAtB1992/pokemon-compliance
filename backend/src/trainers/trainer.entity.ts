import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PokemonEntry } from './pokemon-entry.entity';

@Entity()
export class Trainer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  region?: string;

  @OneToMany(() => PokemonEntry, (entry) => entry.trainer, { cascade: true })
  roster: PokemonEntry[];
}
