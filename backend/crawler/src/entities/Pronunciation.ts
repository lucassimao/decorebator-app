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
    @Column({nullable:true})
    phoneticNotation?: string;
    @Column({nullable:true})
    phoneticSpelling?: string;

    @ManyToOne(() => Lemma, lemma => lemma.pronunciations)
    lemma?: Lemma
}