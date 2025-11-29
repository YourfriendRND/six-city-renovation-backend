import { Repository } from 'typeorm';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { File } from './entities/file.entity';
import { FileInterface } from '@libs/types';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {
    this.logger.log(`${FileService.name} has been initialized`);
  }

  async getFile(id: string): Promise<FileInterface> {
    const fileData = await this.fileRepository.findOne({
      where: { id },
    });

    if (!fileData) {
      throw new NotFoundException(`File with id: ${id} not found`);
    }

    return fileData;
  }
}
