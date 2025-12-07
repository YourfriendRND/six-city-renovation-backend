import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@libs/modules';

import { FileController } from './file.controller';
import { ConfigModule } from '@nestjs/config';
import { storageAppConfig } from '@libs/config';
import { FileBridgeService } from './file-bridge.service';

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
    ConfigModule.forRoot({
      load: [storageAppConfig],
    }),
  ],
  providers: [FileBridgeService],
  controllers: [FileController],
})
export class FileModule {}
