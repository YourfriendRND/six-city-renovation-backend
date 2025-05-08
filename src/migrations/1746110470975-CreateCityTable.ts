import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCityTable1746110470975 implements MigrationInterface {
  name = 'CreateCityTable1746110470975';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "latitude" numeric(9,6) NOT NULL, "longitude" numeric(9,6) NOT NULL, "is_active" boolean NOT NULL, CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "places" ADD "city_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "places" ADD CONSTRAINT "FK_17369bcc0a398534981282e5bf6" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "places" DROP CONSTRAINT "FK_17369bcc0a398534981282e5bf6"`,
    );
    await queryRunner.query(`ALTER TABLE "places" DROP COLUMN "city_id"`);
    await queryRunner.query(`DROP TABLE "cities"`);
  }
}
