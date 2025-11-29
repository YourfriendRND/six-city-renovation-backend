import { Module } from '@nestjs/common';
import { RabbitMQModule, CacheModule } from '@libs/modules';
import { JwtModule } from '@nestjs/jwt';

import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'main_exchange',
          type: 'direct',
        },
      ],
    }),
    JwtModule.register({}),
    CacheModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
