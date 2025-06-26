import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPreviewToCity1749226105895 implements MigrationInterface {
  name = 'AddPreviewToCity1749226105895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cities" ADD "preview_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "cities" ADD CONSTRAINT "UQ_9d8add091ea48d8c7ae867d09e0" UNIQUE ("preview_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cities" ADD CONSTRAINT "FK_9d8add091ea48d8c7ae867d09e0" FOREIGN KEY ("preview_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cities" DROP CONSTRAINT "FK_9d8add091ea48d8c7ae867d09e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cities" DROP CONSTRAINT "UQ_9d8add091ea48d8c7ae867d09e0"`,
    );
    await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "preview_id"`);
  }
}
