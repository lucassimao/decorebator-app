import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import QuizzType from "./quizzType";
import Sense from "./sense";
import User from "./user";
import Word from "./word";

@Entity()
export default class Quizz {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: QuizzType,
  })
  type!: QuizzType;

  @ManyToOne(() => User)
  owner?: User;

  @Column()
  ownerId!: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @ManyToOne(() => Word)
  word?: Word;

  @Column()
  wordId!: number;

  @Column()
  hits!: number;

  @Column()
  totalGuesses!: number;

  @ManyToOne(() => Sense)
  sense?: Sense;

  @Column()
  senseId?: number;
}
