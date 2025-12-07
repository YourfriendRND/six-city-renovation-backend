import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertCities1746112291975 implements MigrationInterface {
  name = 'InsertCities1746112291975';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO cities (id, name, latitude, longitude, is_active) VALUES
                ('474de16e-4671-4912-a4c0-c85461e0dd3f', 'Antalya', 36.896893, 30.713324, true),
                ('46db580d-cfda-41bf-83c2-34b8b2f7d497', 'Buenos Aires', -34.603722, -58.381592, true),
                ('ab1137fa-49eb-4e5c-b745-f00f1cb82c3b', 'New York', 40.712776, -74.005974, true),
                ('8a2d01f5-a3a5-4766-bbe5-0bc712b8f434', 'Shanghai', 31.230416, 121.473701, true),
                ('ee3decfe-dedb-4bc6-88b2-b59b68cd852d', 'Sao Paulo', -23.550520, -46.633308, true),
                ('ea1da2b7-c8cb-4ba5-a47f-ffbc93dc5423', 'Oslo', 59.913869, 10.752245, true)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM cities WHERE id IN (
                '474de16e-4671-4912-a4c0-c85461e0dd3f',
                '46db580d-cfda-41bf-83c2-34b8b2f7d497',
                'ab1137fa-49eb-4e5c-b745-f00f1cb82c3b',
                '8a2d01f5-a3a5-4766-bbe5-0bc712b8f434',
                'ee3decfe-dedb-4bc6-88b2-b59b68cd852d',
                'ea1da2b7-c8cb-4ba5-a47f-ffbc93dc5423'
            )
        `);
  }
}
