import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLemmasToWord1608911122406 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`

        CREATE TABLE public.word_lemmas_lemma (
            word_id integer NOT NULL,
            lemma_id integer NOT NULL
        );       
        
        ALTER TABLE ONLY public.word_lemmas_lemma ADD CONSTRAINT "PK_word_lemmas_lemma" PRIMARY KEY (word_id,lemma_id);

        ALTER TABLE ONLY public.word_lemmas_lemma ADD CONSTRAINT "FK_word" FOREIGN KEY (word_id) REFERENCES public."word"(id);
        ALTER TABLE ONLY public.word_lemmas_lemma ADD CONSTRAINT "FK_lemma" FOREIGN KEY (lemma_id) REFERENCES public."lemma"(id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE public.word_lemmas_lemma DROP CONSTRAINT "FK_word";
        ALTER TABLE public.word_lemmas_lemma DROP CONSTRAINT "FK_lemma";
        DROP TABLE public.word_lemmas_lemma;
    `);
  }
}
