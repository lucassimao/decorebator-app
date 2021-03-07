import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSenseDetail1615120539249 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE SEQUENCE public.sense_detail_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;        

        CREATE TABLE public.sense_detail (
            id integer NOT NULL DEFAULT nextval('public.sense_detail_id_seq'::regclass),
            detail text NOT NULL,
            type varchar(100) NOT NULL,
            sense_id INTEGER NOT NULL,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now()
        );       
        
        ALTER TABLE ONLY public.sense_detail ADD CONSTRAINT "PK_sense_detail" PRIMARY KEY (id);
        ALTER TABLE ONLY public.sense_detail ADD CONSTRAINT "FK_sense_detail_sense" 
            FOREIGN KEY (sense_id) REFERENCES public."sense"(id) ON DELETE CASCADE;
    
        insert into public.sense_detail(detail,type,sense_id) 
                select trim(unnest(examples)),'example',id from sense where array_length(examples,1) >= 1;

        insert into public.sense_detail(detail,type,sense_id) 
                select trim(unnest(definitions)),'definition',id from sense where array_length(definitions,1) >= 1;                
        
        ALTER TABLE public.sense DROP examples;
        ALTER TABLE public.sense DROP definitions;

        ALTER TABLE public.quizz ADD COLUMN sense_detail_id integer;
        ALTER TABLE public.quizz ADD CONSTRAINT "FK_sense_detail" FOREIGN KEY (sense_detail_id) REFERENCES public."sense_detail"(id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("unsupported");
  }
}
