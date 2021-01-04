import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Lemma from "./lemma";
import Quizz from "./quizz";

@Entity()
export default class Sense {
  @Column()
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("text", { array: true, select: false })
  definitions?: string[];

  @Column("text", { array: true, nullable: true, select: false })
  examples?: string[];

  @ManyToMany(() => Lemma, { cascade: true })
  @JoinTable()
  synonyms?: Lemma[];

  @ManyToMany(() => Lemma, { cascade: true })
  @JoinTable()
  antonyms?: Lemma[];

  @ManyToOne(() => Lemma)
  lemma?: Lemma;

  @Column()
  lemmaId?: number;

  @OneToMany(() => Quizz, (quizz) => quizz.sense)
  quizzes?: Quizz[];
}
