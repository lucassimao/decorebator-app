import { MigrationInterface, QueryRunner } from "typeorm";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
export class addFillNewsSentenceQuizzType1619908954857
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE public.quizzType ADD VALUE 'fill_news_sentence'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
