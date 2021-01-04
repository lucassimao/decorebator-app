import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeleteCascade1609792716401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE public.image DROP CONSTRAINT "FK_337cbfd1b5c7fe7c010f0cf3741",
        ADD CONSTRAINT "FK_337cbfd1b5c7fe7c010f0cf3741"
           FOREIGN KEY (word_id)
           REFERENCES word(id)
           ON DELETE CASCADE;
           
           
        ALTER TABLE public.word_lemmas_lemma 
        DROP CONSTRAINT "FK_word",
        ADD CONSTRAINT "FK_word"
           FOREIGN KEY (word_id)
           REFERENCES word(id)
           ON DELETE CASCADE,
        DROP CONSTRAINT "FK_lemma",
        ADD CONSTRAINT "FK_lemma"
           FOREIGN KEY (lemma_id)
           REFERENCES lemma(id)
           ON DELETE CASCADE;
           
        ALTER TABLE public.quizz DROP CONSTRAINT "FK_quizz_word",
        ADD CONSTRAINT "FK_quizz_word"
           FOREIGN KEY (word_id)
           REFERENCES word(id)
           ON DELETE CASCADE;
           
        ALTER TABLE public.word DROP CONSTRAINT "FK_8612cb648b437ce629cb071523a",
        ADD CONSTRAINT "FK_8612cb648b437ce629cb071523a"
           FOREIGN KEY (wordlist_id)
           REFERENCES wordlist(id)
           ON DELETE CASCADE;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE public.image DROP CONSTRAINT "FK_337cbfd1b5c7fe7c010f0cf3741",
        ADD CONSTRAINT "FK_337cbfd1b5c7fe7c010f0cf3741"
           FOREIGN KEY (word_id)
           REFERENCES word(id);
           
        ALTER TABLE public.word_lemmas_lemma 
        DROP CONSTRAINT "FK_word",
        ADD CONSTRAINT "FK_word"
           FOREIGN KEY (word_id)
           REFERENCES word(id),
        DROP CONSTRAINT "FK_lemma",
        ADD CONSTRAINT "FK_lemma"
           FOREIGN KEY (lemma_id)
           REFERENCES lemma(id);
           
        ALTER TABLE public.quizz DROP CONSTRAINT "FK_quizz_word",
        ADD CONSTRAINT "FK_quizz_word"
           FOREIGN KEY (word_id)
           REFERENCES word(id);
           
        ALTER TABLE public.word DROP CONSTRAINT "FK_8612cb648b437ce629cb071523a",
        ADD CONSTRAINT "FK_8612cb648b437ce629cb071523a"
           FOREIGN KEY (wordlist_id)
           REFERENCES wordlist(id);
        `);
  }
}
