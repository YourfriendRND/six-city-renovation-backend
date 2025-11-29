import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { SimplifiedPlaceRdo } from './simplified-place.rdo';

export class PlacesListRdo {
  @ApiProperty({
    type: [SimplifiedPlaceRdo],
    description: 'Список предложений аренды',
  })
  @Expose()
  @Type(() => SimplifiedPlaceRdo)
  places: SimplifiedPlaceRdo[];

  @ApiProperty({
    example: 100,
    description: 'Общее количество предложений аренды',
  })
  @Expose()
  total: number;
}
