import { IsUrl } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import Word from "./word";

@Entity()
export default class Image {
  @Column()
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  wordId?: number;

  @Column({ nullable: false })
  @IsUrl()
  url?: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @ManyToOne(
    () => Word,
    word => word.images
  )
  word?: Word;
}
