import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { NameSpaces } from '../../constants';
import { validateConfig } from 'src/shared/common';
import { IsCorrectTime } from 'src/shared/decorators';

export class JwtConfig {
  @IsNotEmpty()
  @IsString()
  @MinLength(16)
  @MaxLength(64)
  secret: string;

  @IsString()
  @IsNotEmpty()
  @IsCorrectTime()
  expiresIn: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(16)
  @MaxLength(64)
  refreshSecret: string;

  @IsString()
  @IsNotEmpty()
  @IsCorrectTime()
  refreshExpiresIn: string;
}

export default registerAs(NameSpaces.Jwt, () => {
  return validateConfig(JwtConfig, {
    secret: process.env.APPLICATION_JWT_SECRET,
    expiresIn: process.env.APPLICATION_JWT_EXPIRES_IN,
    refreshSecret: process.env.APPLICATION_JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.APPLICATION_JWT_REFRESH_EXPIRES_IN,
  });
});
