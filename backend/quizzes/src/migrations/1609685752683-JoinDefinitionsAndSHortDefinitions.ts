import { MigrationInterface, QueryRunner } from "typeorm";

export class JoinDefinitionsAndSHortDefinitions1609685752683
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE sense set definitions=array(select DISTINCT unnest(definitions||short_definitions));
        alter table sense drop column short_definitions; 
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table sense add column short_definitions text[]; 
        `);
  }
}
