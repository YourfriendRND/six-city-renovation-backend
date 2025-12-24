import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env',
});

/**
 * __dirname в src - apps/core-service/src
 * __dirname в dist - dist/apps/core-service/src
 */
const rootDir = __dirname;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'],
  port: Number(process.env['DB_PORT']),
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_NAME'],

  synchronize: false,
  logging: false,

  entities: [
    join(rootDir, '../**/*.entity.{js,ts}'),
  ],

  migrations: [
    join(rootDir, './migrations/*.{js,ts}'),
  ],
});