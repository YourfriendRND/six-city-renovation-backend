import { Expose, Type } from 'class-transformer';
import { ApiProperty, PickType } from '@nestjs/swagger';

import { PlaceTypes } from 'src/shared/constants';
import { FileRdo } from 'src/modules/files/rdo/file.rdo';
import { CitiesRDO } from './cities.rdo';

class SimplifiedCityRdo extends PickType(CitiesRDO, ['name']) {}

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
    type: SimplifiedCityRdo,
    description: 'Город предложения аренды',
  })
  @Expose()
  @Type(() => SimplifiedCityRdo)
  city: SimplifiedCityRdo;

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
    type: FileRdo,
    description: 'Идентификатор изображения предложения аренды',
  })
  @Expose()
  @Type(() => FileRdo)
  preview: FileRdo;
}
