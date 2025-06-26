import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFilesTable1748111748345 implements MigrationInterface {
  name = 'UpdateFilesTable1748111748345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" ADD "mimetype" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD "size" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD "is_private" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "url" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "url" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "is_private"`);
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "size"`);
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "mimetype"`);
  }
}
