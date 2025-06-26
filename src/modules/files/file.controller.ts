import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { FileService } from './file.service';

@ApiTags('Работа с файлами')
@Controller('/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Получение файла по его id' })
  @ApiOkResponse({ description: 'Файл успешно получен' })
  @ApiNotFoundResponse({ description: 'Файл с указанным id не найден' })
  async getFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { stream, fileName, mimeType } = await this.fileService.getFile(id);

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    return new StreamableFile(stream);
  }
}
