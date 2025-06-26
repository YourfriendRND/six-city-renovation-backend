import { Repository } from 'typeorm';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { File } from './entities/file.entity';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class FileService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly storageService: StorageService,
  ) {
    this.logger.log(`${FileService.name} has been initialized`);
  }

  async getFile(id: string) {
    const fileData = await this.fileRepository.findOne({
      where: { id },
    });

    if (!fileData) {
      throw new NotFoundException(`File with id: ${id} not found`);
    }

    const stream = await this.storageService.getFile(id);

    return {
      stream,
      fileName: fileData.name,
      mimeType: fileData.mimetype,
    };
  }
}
