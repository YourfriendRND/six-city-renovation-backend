import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import storageConfig from '../../config/storage.config';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [storageConfig],
    }),
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [],
})
export class StorageModule {}
