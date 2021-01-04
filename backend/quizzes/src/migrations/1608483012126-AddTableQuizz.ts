import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableQuizz1608483012126 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE public.quizzType AS ENUM ('synonym','word_from_meaning','meaning_from_word','fill_sentence','phrasal_verb','preposition');
            
            CREATE SEQUENCE public.quizz_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;        

            CREATE TABLE public.quizz (
                id integer NOT NULL DEFAULT nextval('public.quizz_id_seq'::regclass),
                type quizzType NOT NULL,
                owner_id integer NOT NULL,
                word_id integer,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now(),
                hits integer NOT NULL,
                total_guesses integer NOT NULL
            );       
            
            ALTER TABLE ONLY public.quizz ADD CONSTRAINT "PK_quizz" PRIMARY KEY (id);
            ALTER TABLE ONLY public.quizz ADD CONSTRAINT "FK_quizz_owner" FOREIGN KEY (owner_id) REFERENCES public."user"(id);
            ALTER TABLE ONLY public.quizz ADD CONSTRAINT "FK_quizz_word" FOREIGN KEY (word_id) REFERENCES public."word"(id);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE public.quizz");
  }
}
