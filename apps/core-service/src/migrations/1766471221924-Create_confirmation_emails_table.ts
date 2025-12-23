import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConfirmationEmailsTable1766471221924 implements MigrationInterface {
    name = 'CreateConfirmationEmailsTable1766471221924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_confirmations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "token" character varying(200) NOT NULL, "expired_at" TIMESTAMP WITH TIME ZONE NOT NULL, "is_confirmed" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, CONSTRAINT "PK_178b5599cd7e3ec9cfdfb144b50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_confirmations" ADD CONSTRAINT "FK_97c4781eabb13c92ea53f21d8f9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_confirmations" DROP CONSTRAINT "FK_97c4781eabb13c92ea53f21d8f9"`);
        await queryRunner.query(`DROP TABLE "email_confirmations"`);
    }

}
