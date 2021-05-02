import { MigrationInterface, QueryRunner } from "typeorm";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
export class removeSenseNotNullConstraintOnQuizz1619909038277
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE public.quizz alter sense_id drop not null;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
