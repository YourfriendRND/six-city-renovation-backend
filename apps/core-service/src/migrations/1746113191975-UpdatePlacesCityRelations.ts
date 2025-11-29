import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePlacesCityRelations1746113191975
  implements MigrationInterface
{
  name = 'UpdatePlacesCityRelations1746113191975';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            UPDATE places p
            SET city_id = c.id
            FROM cities c
            WHERE p.city = c.name
            AND p.city_id IS NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            UPDATE places
            SET city_id = NULL
            WHERE city_id IN (
                SELECT id FROM cities
            )
        `);
  }
}
