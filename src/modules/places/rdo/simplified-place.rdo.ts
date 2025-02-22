import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Cities } from 'src/shared/constants';
import { PlaceTypes } from 'src/shared/constants';

export class SimplifiedPlaceRdo {
  @ApiProperty({
    description: 'Идентификатор предложения аренды',
    example: 'a08581a2-ae68-4601-b19e-f7306423e1c2',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'Trend Suites CYCLE',
    description: 'Название предложения аренды',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: true,
    description: 'Является ли предложение "премиум"',
  })
  @Expose()
  isPremium: boolean;

  @ApiProperty({
    example: PlaceTypes.Appartment,
    description: 'Тип предложения аренды',
  })
  @Expose()
  type: PlaceTypes;

  @ApiProperty({
    example: 815,
    description: 'Цена предложения за ночь',
  })
  @Expose()
  price: number;

  @ApiProperty({
    example: Cities.Antalya,
    description: 'Город предложения аренды',
  })
  @Expose()
  city: Cities;

  @ApiProperty({
    example: 36.865271,
    description: 'Координаты предложения: широта',
  })
  @Expose()
  latitude: number;

  @ApiProperty({
    example: 30.636811,
    description: 'Координаты предложения: долгота',
  })
  @Expose()
  longitude: number;

  @ApiProperty({
    example: 'id',
    description: 'Идентификатор изображения предложения аренды',
  })
  @Expose()
  preview: string;
}
