import {Entity,Column,PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import Lemma from "./lemma";

@Entity()
export default class Pronunciation{
    @Column()
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({nullable:true})
    audioFile?: string;

    @Column("text",{array:true})
    dialects?: string[];
    @Column()
    phoneticNotation?: string;
    @Column()
    phoneticSpelling?: string;

    @ManyToOne(() => Lemma, lemma => lemma.pronunciations)
    lemma?: Lemma
}