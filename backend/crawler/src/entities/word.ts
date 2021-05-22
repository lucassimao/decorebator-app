import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Lemma from "./lemma";

@Entity()
export default class Word {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  name?: string;

  @ManyToMany(() => Lemma, { cascade: true })
  @JoinTable()
  lemmas?: Lemma[];
}
