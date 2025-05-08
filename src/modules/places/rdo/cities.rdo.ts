import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CitiesRDO {
  @Expose()
  @ApiProperty({
    example: '844049ff-9876-4c92-8dd0-c6f332f298f5',
    description: 'Идентификатор города',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: 'Antalya',
    description: 'Название города',
  })
  name: string;

  @Expose()
  @ApiProperty({
    example: 37.1054,
    description: 'Координаты широты центра города',
  })
  latitude: number;

  @Expose()
  @ApiProperty({
    example: 30.56,
    description: 'Координаты долготы центра города',
  })
  longitude: number;
}
