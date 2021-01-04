import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Lemma from "./lemma";

@Entity()
export default class Sense{

    @Column()
    @PrimaryGeneratedColumn()
    id?: number;

    @Column("text",{array:true})
    definitions?: string[]

    @Column("text",{array:true,nullable:true})
    examples?: string[]

    @ManyToMany(() => Lemma,{cascade: true})
    @JoinTable()
    synonyms? : Lemma[]

    @ManyToMany(() => Lemma,{cascade: true})
    @JoinTable()
    antonyms? : Lemma[]    

    @ManyToOne(() => Lemma)
    lemma? : Lemma      
}