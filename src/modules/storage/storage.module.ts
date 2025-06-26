import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import storageConfig from 'src/shared/config/storage/storage.config';
import { StorageService } from './storage.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [storageConfig],
    }),
  ],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
