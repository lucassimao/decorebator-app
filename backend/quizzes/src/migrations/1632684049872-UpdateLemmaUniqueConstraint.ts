import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLemmaUniqueConstraint1632684049872 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`alter table lemma alter lexical_category drop not null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`alter table lemma alter lexical_category set not null`);
    }

}
