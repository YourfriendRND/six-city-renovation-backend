import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Session } from './entities/session.entity';
import { SessionService } from './session.service';
import { CacheModule } from 'src/core/cache/cache.module';
import { ConfigModule } from '@nestjs/config';
import applicationConfig from 'src/shared/config/application/application.config';
import redisConfig from 'src/shared/config/redis/redis.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    CacheModule.forRoot(),
    ConfigModule.forRoot({
      load: [applicationConfig, redisConfig],
    }),
  ],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
