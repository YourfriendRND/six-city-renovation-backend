import { ApiProperty } from '@nestjs/swagger';

export class ConflictExceptionRdo {
  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: 'Conflict exception message',
  })
  message: string;

  @ApiProperty({
    description: 'Статус код',
    example: 409,
  })
  statusCode: number;
}
