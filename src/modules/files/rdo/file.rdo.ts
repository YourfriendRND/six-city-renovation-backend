import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FileRdo {
  @ApiProperty({
    example: '57fb6274-18f8-11f0-9cd2-0242ac120002',
    description: 'Идентификатор файла в системе',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Наименование файла',
    example: 'avatar.jpg',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'https://example.com',
    description: 'Ссылка на файл',
  })
  @Expose()
  url: string;
}
