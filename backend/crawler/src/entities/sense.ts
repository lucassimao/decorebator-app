import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Lemma from "./lemma";
import SenseDetail from "./senseDetail";
@Entity()
export default class Sense{

    @Column()
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToMany(() => SenseDetail, detail => detail.sense,{cascade: true})
    details?: SenseDetail[];

    @ManyToMany(() => Lemma,{cascade: true})
    @JoinTable()
    synonyms? : Lemma[]

    @ManyToMany(() => Lemma,{cascade: true})
    @JoinTable()
    antonyms? : Lemma[]    

    @ManyToOne(() => Lemma)
    lemma? : Lemma      
}