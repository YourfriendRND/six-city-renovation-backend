import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class DataBaseConfigSchema {
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
