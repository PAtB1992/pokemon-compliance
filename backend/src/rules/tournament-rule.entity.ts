import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TournamentRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  maxLevel?: number;

  @Column({ nullable: true })
  maxLegendaries?: number;

  @Column('simple-array', { nullable: true })
  bannedItems?: string[];

  // TODO (Uebungsaufgabe, siehe EXERCISE.md Stage 4b): Wenn true, darf keine Spezies
  // mehrfach im selben Roster vorkommen. Die Regel wird aktuell vom RuleEngineService
  // noch NICHT ausgewertet - das ist deine Aufgabe.
  @Column({ default: false })
  noDuplicateSpecies: boolean;

  @Column({ default: true })
  active: boolean;
}
