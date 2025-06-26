import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { registerAs } from '@nestjs/config';

import { NameSpaces } from 'src/shared/constants';
import { validateConfig } from 'src/shared/common';

export class DatabaseConfig {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsNotEmpty()
  @IsNumber()
  port: number;

  @IsString()
  @IsNotEmpty()
  databaseUsername: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  database: string;
}

export default registerAs(NameSpaces.Database, () =>
  validateConfig(DatabaseConfig, ({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    databaseUsername: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })),
);
