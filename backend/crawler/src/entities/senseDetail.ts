import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Sense from "./sense";
import SenseDetailType from "./senseDetailType";
@Entity()
export default class SenseDetail {
  @Column()
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  detail?: string;

  @Column()
  type?: SenseDetailType;

  @Column()
  senseId?: number;

  @ManyToOne(() => Sense)
  sense?: Sense;
}
