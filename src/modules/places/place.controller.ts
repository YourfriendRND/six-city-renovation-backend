import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { PlaceService } from './place.service';
import { PaginationPlacesDto } from './dto/pagination-places.dto';
import { Cities } from 'src/shared/constants';
import { PlacesListRdo } from './rdo/places-list.rdo';
import { fillResponseDto } from 'src/shared/common';
import { SimplifiedPlaceRdo } from './rdo/simplified-place.rdo';

@ApiTags('Предложения аренды')
@Controller('places')
export class PlaceController {
  private readonly logger = new Logger(PlaceController.name);

  constructor(private readonly placeService: PlaceService) {}
  @Get('/:city')
  @ApiOperation({
    summary: 'Получение списка предложений аренды по конкретному городу',
  })
  @ApiParam({
    name: 'city',
    description: 'Город по которому ищем предложения аренды',
    example: Cities.Shanghai,
    enum: Cities,
    required: true,
  })
  @ApiOkResponse({
    type: PlacesListRdo,
    description: 'Список предложений аренды по выбранному городу',
  })
  async find(
    @Param('city') city: Cities,
    @Query() pagination: PaginationPlacesDto,
  ): Promise<PlacesListRdo> {
    try {
      const [places, total] = await this.placeService.findAllPlaces(
        city,
        pagination,
      );
      const placesRdo = places.map((place) =>
        fillResponseDto(SimplifiedPlaceRdo, place),
      );
      return fillResponseDto(PlacesListRdo, { places: placesRdo, total });
    } catch (err) {
      this.logger.error(err);
    }
  }
}
