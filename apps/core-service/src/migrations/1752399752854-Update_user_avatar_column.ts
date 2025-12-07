import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserAvatarColumn1752399752854 implements MigrationInterface {
  name = 'UpdateUserAvatarColumn1752399752854';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "avatar_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_c3401836efedec3bec459c8f818" UNIQUE ("avatar_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "avatar_url" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c3401836efedec3bec459c8f818" FOREIGN KEY ("avatar_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_c3401836efedec3bec459c8f818"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "avatar_url" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_c3401836efedec3bec459c8f818"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar_id"`);
  }
}
