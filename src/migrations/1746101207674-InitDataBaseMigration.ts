import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDataBaseMigration1746101207674 implements MigrationInterface {
    name = 'InitDataBaseMigration1746101207674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying(1000) NOT NULL, "rating" integer NOT NULL, "user_id" uuid, "place_id" uuid, CONSTRAINT "CHK_5beb6e68902d72e98421b9a604" CHECK (rating > 0 AND rating <= 5), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."places_type_enum" AS ENUM('Appartment', 'Private room', 'Hotel', 'Hostel', 'House', 'Other')`);
        await queryRunner.query(`CREATE TABLE "places" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "description" character varying(1000) NOT NULL, "is_premium" boolean NOT NULL DEFAULT false, "type" "public"."places_type_enum" NOT NULL DEFAULT 'Appartment', "bedrooms" integer NOT NULL DEFAULT '1', "adults_count" integer NOT NULL DEFAULT '1', "price" integer NOT NULL, "features" jsonb, "city" character varying NOT NULL, "latitude" numeric(9,6) NOT NULL, "longitude" numeric(9,6) NOT NULL, "host_id" uuid, "preview_id" uuid, CONSTRAINT "REL_7367af74acd48a46470aab4890" UNIQUE ("preview_id"), CONSTRAINT "PK_1afab86e226b4c3bc9a74465c12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(50) NOT NULL, "is_pro" boolean NOT NULL DEFAULT false, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar_url" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "last_login_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "files_places" ("place_id" uuid NOT NULL, "file_id" uuid NOT NULL, CONSTRAINT "PK_564e40c7589db701a33190d4779" PRIMARY KEY ("place_id", "file_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_100bf492bf6859be6858d530ac" ON "files_places" ("place_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_cc8e46da9165dbabe7e7e91658" ON "files_places" ("file_id") `);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_ca36bd1ca8ad51147abd22506f9" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "places" ADD CONSTRAINT "FK_3305ddf3961622cd5bc31ebe4a3" FOREIGN KEY ("host_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "places" ADD CONSTRAINT "FK_7367af74acd48a46470aab48900" FOREIGN KEY ("preview_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "files_places" ADD CONSTRAINT "FK_100bf492bf6859be6858d530ac1" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "files_places" ADD CONSTRAINT "FK_cc8e46da9165dbabe7e7e916580" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files_places" DROP CONSTRAINT "FK_cc8e46da9165dbabe7e7e916580"`);
        await queryRunner.query(`ALTER TABLE "files_places" DROP CONSTRAINT "FK_100bf492bf6859be6858d530ac1"`);
        await queryRunner.query(`ALTER TABLE "places" DROP CONSTRAINT "FK_7367af74acd48a46470aab48900"`);
        await queryRunner.query(`ALTER TABLE "places" DROP CONSTRAINT "FK_3305ddf3961622cd5bc31ebe4a3"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_ca36bd1ca8ad51147abd22506f9"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cc8e46da9165dbabe7e7e91658"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_100bf492bf6859be6858d530ac"`);
        await queryRunner.query(`DROP TABLE "files_places"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "places"`);
        await queryRunner.query(`DROP TYPE "public"."places_type_enum"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
