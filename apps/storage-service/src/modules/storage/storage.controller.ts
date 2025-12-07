import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { StorageService } from './storage.service';

@Controller('/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get(':file_id')
  async getFile(@Param('file_id') fileId: string): Promise<StreamableFile> {
    const stream = await this.storageService.getFile(fileId);

    const streamableFile = new StreamableFile(stream);

    return streamableFile;
  }
}
