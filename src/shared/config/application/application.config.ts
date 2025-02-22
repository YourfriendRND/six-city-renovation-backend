import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { NameSpaces, Environments } from '../../constants';

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
}

export function validate(config: Record<string, unknown>): ApplicationConfig {
  const validatedConfig = plainToInstance(ApplicationConfig, config, {
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

export default registerAs(NameSpaces.Application, () =>
  validate({
    environment: process.env.NODE_ENV ?? Environments.Development,
    port: parseInt(process.env.PORT, 10),
  }),
);
