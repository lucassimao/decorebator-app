import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Sense from "./sense";
import Word from "./word";

@Entity()
@Index(["name", "language", "lexicalCategory"], { unique: true })
export default class Lemma {
  @Column()
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name!: string;

  @Column()
  language?: string;

  @Column()
  lexicalCategory?: string;

  @ManyToOne(() => Lemma, (lemma) => lemma.phrasalVerbs)
  parent?: Lemma;

  @OneToMany(() => Lemma, (lemma) => lemma.parent, { cascade: true })
  phrasalVerbs?: Lemma[];

  @Column("text", { array: true, nullable: true, select: false })
  phrases?: string[];

  @OneToMany(() => Sense, (sense) => sense.lemma)
  senses?: Sense[];

  @ManyToMany(() => Word, (word) => word.lemmas)
  words?: Word[];
}
