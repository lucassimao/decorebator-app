import {
  Column,
  Entity,


  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import Image from "./image";
import Wordlist from "./wordlist";

@Entity()
export default class Word {
  @Column()
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  name?: string;

  @OneToMany(
    () => Image,
    image => image.word,
    { cascade: true, onDelete: "CASCADE" }
  )
  images?: Image[];

  @Column()
  wordlistId?: number;

  @ManyToOne(
    () => Wordlist,
    wordlist => wordlist.words,
  )
  wordlist?: Wordlist;
 
}
