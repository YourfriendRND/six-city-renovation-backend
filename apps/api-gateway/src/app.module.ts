import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import applicationConfig from './config/app.config';
import { PlaceModule } from './module/places/place.module';
import { FileModule } from './module/files/file.module';
import { AuthModule } from './module/auth/auth.module';
import { jwtConfig } from '@libs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig, jwtConfig],
      envFilePath: './.env',
      cache: true,
    }),
    PlaceModule,
    FileModule,
    AuthModule,
  ],
})
export class AppModule {}
