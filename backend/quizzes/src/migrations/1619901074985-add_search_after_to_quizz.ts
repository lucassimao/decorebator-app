import { MigrationInterface, QueryRunner } from "typeorm";

export class addSearchAfterToQuizz1619901074985 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE public.quizz ADD COLUMN es_search_after integer;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE public.quizz DROP COLUMN es_search_after;
    `);
  }
}
