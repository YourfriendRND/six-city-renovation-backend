import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertCityPreview1749285716009 implements MigrationInterface {
  name = 'InsertCityPreview1749285716009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO files ("id", "name", "mimetype", "size") VALUES 
        ('c77e0366-9411-4d5e-a8a6-066eb986ab10', 'antalya_wallpaper', 'webp', 988738), 
        ('787b24a2-4245-4d66-acbd-4b51f1e34a76', 'buenos_aires_wallpaper', 'webp', 471984),
        ('9afb7087-bc28-4d5c-8717-0b2736f2cd35', 'oslo_wallpaper', 'webp', 285634),
        ('a8176d9a-78ba-4bf2-95b8-1f20678c49e0', 'shanghai_wallpaper', 'webp', 215546),
        ('d7a147d2-e863-481d-aa64-25aab35b5b57', 'sao_paolo_wallpaper', 'webp', 1084198),
        ('e18857d9-d0da-4bf8-8eb4-388476086e5f', 'new_york_wallpaper', 'webp', 314528)
        ON CONFLICT (id) DO NOTHING`);
    await queryRunner.query(
      `UPDATE cities SET preview_id = 'c77e0366-9411-4d5e-a8a6-066eb986ab10' WHERE id = '474de16e-4671-4912-a4c0-c85461e0dd3f'`,
    );
    await queryRunner.query(
      `UPDATE cities SET preview_id = '787b24a2-4245-4d66-acbd-4b51f1e34a76' WHERE id = '46db580d-cfda-41bf-83c2-34b8b2f7d497'`,
    );
    await queryRunner.query(
      `UPDATE cities SET preview_id = '9afb7087-bc28-4d5c-8717-0b2736f2cd35' WHERE id = 'ea1da2b7-c8cb-4ba5-a47f-ffbc93dc5423'`,
    );
    await queryRunner.query(
      `UPDATE cities SET preview_id = 'a8176d9a-78ba-4bf2-95b8-1f20678c49e0' WHERE id = '8a2d01f5-a3a5-4766-bbe5-0bc712b8f434'`,
    );
    await queryRunner.query(
      `UPDATE cities SET preview_id = 'd7a147d2-e863-481d-aa64-25aab35b5b57' WHERE id = 'ee3decfe-dedb-4bc6-88b2-b59b68cd852d'`,
    );
    await queryRunner.query(
      `UPDATE cities SET preview_id = 'e18857d9-d0da-4bf8-8eb4-388476086e5f' WHERE id = 'ab1137fa-49eb-4e5c-b745-f00f1cb82c3b'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE cities SET preview_id = NULL WHERE id = 'ab1137fa-49eb-4e5c-b745-f00f1cb82c3b'`,
    );
    await queryRunner.query(
      `UPDATE cities SET preview_id = NULL WHERE id = 'ee3decfe-dedb-4bc6-88b2-b59b68cd852d'`,
    );
    await queryRunner.query(
      `UPDATE cities SET preview_id = NULL WHERE id = '8a2d01f5-a3a5-4766-bbe5-0bc712b8f434'`,
    );
    await queryRunner.query(
      `UPDATE cities SET preview_id = NULL WHERE id = 'ea1da2b7-c8cb-4ba5-a47f-ffbc93dc5423'`,
    );
    await queryRunner.query(
      `UPDATE cities SET preview_id = NULL WHERE id = '46db580d-cfda-41bf-83c2-34b8b2f7d497'`,
    );
    await queryRunner.query(
      `UPDATE cities SET preview_id = NULL WHERE id = '474de16e-4671-4912-a4c0-c85461e0dd3f'`,
    );
    await queryRunner.query(`DELETE FROM files WHERE id IN (
      'c77e0366-9411-4d5e-a8a6-066eb986ab10',
      '787b24a2-4245-4d66-acbd-4b51f1e34a76',
      '9afb7087-bc28-4d5c-8717-0b2736f2cd35',
      'a8176d9a-78ba-4bf2-95b8-1f20678c49e0',
      'd7a147d2-e863-481d-aa64-25aab35b5b57',
      'e18857d9-d0da-4bf8-8eb4-388476086e5f'
    )`);
  }
}
