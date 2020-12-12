import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";


@Entity()
@Index(["videoId"])
export default class YoutubeSubtitle {
  @Column()
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  videoId?: string;

  @Column()
  languageCode?: string;

  @Column()
  languageName?: string;

  @Column()
  downloadUrl?: string;

  @Column()
  isAutomatic?: boolean;

  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}
