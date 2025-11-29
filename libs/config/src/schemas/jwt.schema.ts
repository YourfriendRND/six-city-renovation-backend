import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsCorrectTime } from '../common/is-correct-time.decorator';

export class JwtConfigSchema {
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

  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  passwordSalt: string;

  @IsString()
  @IsNotEmpty()
  cookiePrefix: string;
}
