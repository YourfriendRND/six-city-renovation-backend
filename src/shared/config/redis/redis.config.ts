import { IsNotEmpty, IsString } from 'class-validator';
import { registerAs } from '@nestjs/config';

import { NameSpaces } from 'src/shared/constants';
import { validateConfig } from 'src/shared/common';
//import { parseTimeToSeconds, validateConfig } from 'src/shared/utils';
import { Transform } from 'class-transformer';

export class RedisConfig {
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

export default registerAs(NameSpaces.Redis, () =>
  validateConfig(RedisConfig, {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || '6379',
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  }),
);
