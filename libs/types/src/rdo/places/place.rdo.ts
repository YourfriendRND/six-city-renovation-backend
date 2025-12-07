import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { SimplifiedPlaceRdo } from './simplified-place.rdo';
import { FileRdo } from '../files/file.rdo';
import { SimplifiedUserRdo } from '../users/simplified-user.rdo';
import { Features } from '@libs/constants';

export class PlaceRdo extends SimplifiedPlaceRdo {
  @Expose()
  @ApiProperty({
    example:
      'An independent House, strategically located between Rembrand Square and National Opera, but where the bustle of the city comes to rest in this alley flowery and colorful',
    description: 'Описание для предложения аренды',
  })
  description: string;

  @Expose()
  @ApiProperty({
    example: 3,
    description: 'Количество комнат',
  })
  bedrooms: number;

  @Expose()
  @ApiProperty({
    example: 4,
    description: 'Максимальное количество взрослых доступных к заселению',
  })
  adultsCount: number;

  @Expose()
  @ApiProperty({
    example: Object.values(Features),
    description: 'Список доступных услуг',
  })
  features: Features[];

  @Expose()
  @Type(() => SimplifiedUserRdo)
  @ApiProperty({
    type: SimplifiedUserRdo,
    description: 'Данные представителя аренды',
  })
  host: SimplifiedUserRdo;

  @Expose()
  @Type(() => FileRdo)
  @ApiProperty({
    type: [FileRdo],
    description: 'Изображения предложения по аренде',
  })
  images: FileRdo[];
}
