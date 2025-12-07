import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { storageAppConfig } from '@libs/config';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [storageAppConfig],
      envFilePath: './.env',
      cache: true,
    }),
    StorageModule,
  ],
  providers: [],
})
export class AppModule {}
