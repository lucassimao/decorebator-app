import { IsEmail } from "class-validator";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import Wordlist from "./wordlist";

@Entity()
export default class User {
  @Column()
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column()
  @IsEmail()
  email?: string;

  @OneToMany(
    () => Wordlist,
    wordlist => wordlist.owner
  )
  wordlists?: Wordlist[];
}
