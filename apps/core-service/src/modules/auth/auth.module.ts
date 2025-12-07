import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { RabbitMQModule } from '@libs/modules';
import { CoreAuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { AuthService } from './auth.service';
import { SessionModule } from '../sessions/session.module';
import { CacheModule } from '@libs/modules';

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
    UserModule,
    SessionModule,
    CacheModule.forRoot(),
  ],
  controllers: [CoreAuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
