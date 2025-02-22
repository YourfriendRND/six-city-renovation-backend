import { Expose } from 'class-transformer';
import { SimplifiedPlaceRdo } from './simplified-place.rdo';
import { ApiProperty } from '@nestjs/swagger';

export class PlacesListRdo {
  @ApiProperty({
    type: [SimplifiedPlaceRdo],
    description: 'Список предложений аренды',
  })
  @Expose()
  places: SimplifiedPlaceRdo[];

  @ApiProperty({
    example: 100,
    description: 'Общее количество предложений аренды',
  })
  @Expose()
  total: number;
}
