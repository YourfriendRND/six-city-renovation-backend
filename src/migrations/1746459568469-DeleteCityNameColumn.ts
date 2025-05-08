import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteCityNameColumn1746459568469 implements MigrationInterface {
  name = 'DeleteCityNameColumn1746459568469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "places" DROP COLUMN "city"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "places" ADD "city" character varying`,
    );
    await queryRunner.query(
      `UPDATE places p
            SET city = c.name
            FROM cities c
            WHERE p.city_id = c.id`,
    );
    await queryRunner.query(
      `ALTER TABLE "places" ALTER COLUMN "city" SET NOT NULL`,
    );
  }
}
