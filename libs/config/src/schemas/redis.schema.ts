import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class RedisConfigSchema {
  @IsNotEmpty()
  @IsString()
  host: string;

  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  port: number;

  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
