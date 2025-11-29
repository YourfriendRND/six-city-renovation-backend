import { Injectable, Logger, Inject } from '@nestjs/common';
import Redis from 'ioredis';

import { ModuleTokens } from '@libs/constants';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(ModuleTokens.RedisClient)
    private readonly cacheService: Redis,
  ) {
    this.logger.log(`${CacheService.name} has been initialized`);
  }

  async insertRecord<T extends object>(
    key: string,
    value: T,
    ttl = 0,
  ): Promise<T> {
    try {
      await this.cacheService.set(key, JSON.stringify(value), 'PX', ttl);

      return value;
    } catch (err) {
      this.logger.error(
        `Error while set value in cache. Key: ${key}`,
        err.toString(),
      );

      throw err;
    }
  }

  async findRecord<T>(key: string): Promise<T> {
    try {
      const value = await this.cacheService.get(key);

      if (!value) {
        return null;
      }

      return JSON.parse(value);
    } catch (err) {
      this.logger.error(
        `Error while finding value in cache. Key: ${key}`,
        err.toString(),
      );

      throw err;
    }
  }

  async deleteRecord(key: string): Promise<void> {
    try {
      await this.cacheService.del(key);
    } catch (err) {
      this.logger.error(
        `Error while remove value from cache. Key: ${key}`,
        err.toString(),
      );

      throw err;
    }
  }
}
