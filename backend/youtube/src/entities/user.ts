import { IsEmail } from "class-validator";
import {
  Column,

  Entity,
  Index,
  PrimaryGeneratedColumn
} from "typeorm";


@Entity()
@Index(["email"])
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
  encryptedPassword?: string;
}
