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
import Wordlist from "./wordlist";

@Entity()
export default class Word {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  name!: string;

  @OneToMany(() => Quizz, (quizz) => quizz.word, { lazy: true })
  quizzes?: Quizz[];

  @ManyToOne(() => Wordlist)
  wordlist?: Wordlist;

  @Column()
  wordlistId?: number;

  @ManyToMany(() => Lemma, (lemma) => lemma.words)
  @JoinTable()
  lemmas?: Lemma[];
}
