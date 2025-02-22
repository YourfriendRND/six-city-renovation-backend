import { IsNotEmpty, IsString, IsNumber, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { registerAs } from '@nestjs/config';

import { NameSpaces } from '../../../shared/constants';

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

export function validate(config: Record<string, unknown>): DatabaseConfig {
  const validatedConfig = plainToInstance(DatabaseConfig, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

export default registerAs(NameSpaces.Database, () =>
  validate({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    databaseUsername: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }),
);
