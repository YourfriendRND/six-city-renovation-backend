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
}

export default registerAs(NameSpaces.Jwt, () => {
  return validateConfig(JwtConfig, {
    secret: process.env.APPLICATION_JWT_SECRET,
    expiresIn: process.env.APPLICATION_JWT_EXPIRES_IN,
  });
});
