import {Entity,Column,PrimaryGeneratedColumn, OneToMany, ManyToOne, Index, CreateDateColumn, UpdateDateColumn } from "typeorm";
import Pronunciation from "./Pronunciation";
import moment from 'moment'
import Sense from "./sense";

@Entity()
@Index(["name", "language","lexicalCategory"], { unique: true })
export default class Lemma{

    @Column()
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;
    
    @Column()
    language?: string;

    @Column()
    lexicalCategory?: string;

    @Column()
    provider?: string;

    @Column({nullable:true})
    plural?: string;

    @ManyToOne(() => Lemma, lemma => lemma.prasalVerbs)
    parent?: Lemma;

    @OneToMany(() => Lemma, lemma => lemma.parent,{cascade: true})
    prasalVerbs?: Lemma[]

    @Column("text",{array:true,nullable:true})
    phrases?: string[]

    @OneToMany(() => Pronunciation, lemmaPronunciation => lemmaPronunciation.lemma,{cascade: true, onDelete:"CASCADE"})
    pronunciations?: Pronunciation[]

    @OneToMany(() => Sense, sense => sense.lemma,{cascade: true, onDelete:"CASCADE"})
    senses?: Sense[]

    @CreateDateColumn()
    createdAt?: Date

    @UpdateDateColumn({nullable:true})
    updatedAt?: Date

    isRefreshRequired(): boolean {
        return moment().utc().diff(this.updatedAt,'days') > 10
    }


}