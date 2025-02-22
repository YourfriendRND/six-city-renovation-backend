import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationPlacesDto {
  @ApiPropertyOptional({
    description: 'Номер страницы',
    example: 5,
  })
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    example: 50,
    description: 'Количество элементов на странице',
  })
  @IsNumber()
  @IsOptional()
  limit?: number;
}
