import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { File } from './entities/file.entity';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), StorageModule],
  controllers: [FileController],
  providers: [Logger, FileService],
  exports: [FileService],
})
export class FileModule {}
