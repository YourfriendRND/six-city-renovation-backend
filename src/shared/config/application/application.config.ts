import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
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
}

export default registerAs(NameSpaces.Application, () => {
  return validateConfig(ApplicationConfig, ({
    environment: process.env.NODE_ENV ?? Environments.Development,
    port: parseInt(process.env.PORT, 10),
    homeUrl: process.env.HOME_URL,
  }));
});
