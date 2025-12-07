import { registerAs } from '@nestjs/config';
import { DataBaseConfigSchema, validateConfig } from '@libs/config';
import { NameSpaces } from '@libs/constants';

export default registerAs(NameSpaces.Database, () =>
  validateConfig(DataBaseConfigSchema, {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    databaseUsername: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }),
);
