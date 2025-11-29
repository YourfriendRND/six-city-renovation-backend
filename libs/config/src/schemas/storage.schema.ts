import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
const MIN_PORT_VALUE = 0;
const MAX_PORT_VALUE = 65535;

export class StorageConfigSchema {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsNumber()
  @Min(MIN_PORT_VALUE)
  @Max(MAX_PORT_VALUE)
  port?: number;

  @IsOptional()
  @IsNumber()
  @Min(MIN_PORT_VALUE)
  @Max(MAX_PORT_VALUE)
  consolePort?: number;

  @IsNotEmpty()
  @IsString()
  endpoint: string;

  @IsNotEmpty()
  @IsString()
  accessKey: string;

  @IsNotEmpty()
  @IsString()
  secretKey: string;

  @IsNotEmpty()
  @IsString()
  bucketName: string;
}
