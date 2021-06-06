import { MigrationInterface, QueryRunner } from "typeorm";

export class removeWordlistDescriptionNotnull1623009779629 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE public.wordlist alter description drop not null;
    `);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
