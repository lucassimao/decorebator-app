import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Quizz from "./quizz";
import Sense from "./sense";
import SenseDetailType from "./senseDetailType";

@Entity()
export default class SenseDetail {
  @Column()
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  detail!: string;

  @Column()
  type!: SenseDetailType;

  @Column()
  senseId?: number;

  @ManyToOne(() => Sense)
  sense?: Sense;

  @OneToMany(() => Quizz, (quizz) => quizz.senseDetail)
  quizzes?: Quizz[];
}
