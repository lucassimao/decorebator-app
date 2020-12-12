import { IsEmail, IsIn } from "class-validator";
import fs from "fs";
import path from "path";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import Wordlist from "./wordlist";

type Country = {
  "alpha-2": string;
};
const countryCodes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../resources/countries.json"), "utf8")
).map((country: Country) => country["alpha-2"]);

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
  @Column()
  @IsIn(countryCodes)
  country?: string;
  @Column()
  encryptedPassword?: string;

  @OneToMany(
    () => Wordlist,
    wordlist => wordlist.owner
  )
  wordlists?: Wordlist[];

  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}
