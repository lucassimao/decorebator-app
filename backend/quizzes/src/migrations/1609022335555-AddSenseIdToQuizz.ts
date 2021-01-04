import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSenseIdToQuizz1609022335555 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE public.quizz ADD COLUMN sense_id integer NOT NULL;
            ALTER TABLE ONLY public.quizz ADD CONSTRAINT "FK_sense" FOREIGN KEY (sense_id) REFERENCES public."sense"(id);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE public.quizz DROP CONSTRAINT "FK_sense";
            ALTER TABLE public.quizz DROP COLUMN sense_id;
        `);
  }
}
