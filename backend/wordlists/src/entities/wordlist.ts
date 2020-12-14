import { Min } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import Image from "./image";
import User from "./user";
import Word from "./word";

@Entity()
export default class Wordlist {
  @Column()
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  isPrivate?: boolean;

  @Column()
  description?: string;
  @Column()
  language?: string;
  @Column()
  name?: string;
  @Column()
  avatarColor?: string;

  @Column({ nullable: true })
  originalFileExtension?: string;

  @Column({ nullable: true,type:'float' })
  @Min(0)
  originalFileSize?: number;

  @Column({ nullable: true, type:'float' })
  @Min(0)
  originalFileExtractionMs?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @OneToMany(
    () => Word,
    word => word.wordlist,
    { cascade: true }
  )
  words?: Word[];

  @Column()
  ownerId?: number;

  @ManyToOne(
    () => User,
    user => user.wordlists
  )
  owner?: User;
}
