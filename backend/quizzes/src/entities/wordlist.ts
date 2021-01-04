import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user";

@Entity()
export default class Wordlist {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User)
  owner?: User;
}
