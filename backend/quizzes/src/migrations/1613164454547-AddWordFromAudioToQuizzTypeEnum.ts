/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWordFromAudioToQuizzTypeEnum1613164454547
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE public.quizzType ADD VALUE 'word_from_audio'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
