import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

import { NameSpaces, Environments } from '../../constants';
import { validateConfig } from 'src/shared/common';

export class ApplicationConfig {
  @IsNotEmpty()
  @IsNumber()
  @Min(3000)
  @Max(65535)
  port: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Environments)
  environment: string;

  @IsString()
  homeUrl: string;

  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  passwordSalt: string;

  @IsString()
  @IsNotEmpty()
  applicationGlobalPrefix: string;
}

export default registerAs(NameSpaces.Application, () => {
  return validateConfig(ApplicationConfig, {
    applicationGlobalPrefix:
      process.env.APPLICATION_GLOBAL_PREFIX || 'six_city',
    environment: process.env.NODE_ENV ?? Environments.Development,
    port: parseInt(process.env.PORT, 10),
    homeUrl: process.env.HOME_URL,
    passwordSalt: process.env.PASSWORD_SALT,
  });
});
