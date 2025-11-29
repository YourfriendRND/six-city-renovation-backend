import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

import { BaseRpcController } from '../../types';
import { FileInterface, FileByIdPayload } from '@libs/types';
import { FileBridgeService } from './file-bridge.service';

@ApiTags('Работа с файлами')
@Controller('/files')
export class FileController extends BaseRpcController {
  constructor(
    protected readonly amqpConnection: AmqpConnection,
    private readonly fileBridgeService: FileBridgeService,
  ) {
    super(amqpConnection);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение файла по его id' })
  @ApiOkResponse({ description: 'Файл успешно получен' })
  @ApiNotFoundResponse({ description: 'Файл с указанным id не найден' })
  async getFile(@Param('id') id: string): Promise<StreamableFile> {
    const fileMetadata = await this.makeRpcCall<FileInterface, FileByIdPayload>(
      'files/:id',
      {
        id,
      },
    );

    return this.fileBridgeService.getFile(fileMetadata);
  }
}
