import { CustomRabbitSubscribe, WrapRpcResponse } from '@libs/modules';
import { FileInterface, FileByIdPayload } from '@libs/types';
import { Controller } from '@nestjs/common';
import { FileService } from './file.service';

@Controller()
export class CoreFileController {
  constructor(private readonly fileService: FileService) {}

  @CustomRabbitSubscribe({
    exchange: 'main_exchange',
    routingKey: 'files/:id',
    queue: 'files_metadata',
    createQueueIfNotExist: true,
  })
  @WrapRpcResponse()
  async getFileMetadata(payload: FileByIdPayload): Promise<FileInterface> {
    return this.fileService.getFile(payload.id);
  }
}
