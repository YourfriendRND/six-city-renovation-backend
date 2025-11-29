import { registerAs } from '@nestjs/config';

import { NameSpaces } from '@libs/constants';
import { validateConfig } from '../common';
import { RedisConfigSchema } from '../schemas';

export default registerAs(NameSpaces.Redis, () =>
  validateConfig(RedisConfigSchema, {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || '6379',
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  }),
);
