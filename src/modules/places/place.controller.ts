import {
  Controller,
  Get,
  Param,
  Query,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { PlaceService } from './place.service';
import { PaginationPlacesDto } from './dto/pagination-places.dto';
import { PlacesListRdo, CitiesRDO } from './rdo';
import { fillResponseDto } from 'src/shared/common';

@ApiTags('Предложения аренды')
@Controller('places')
export class PlaceController {
  private readonly logger = new Logger(PlaceController.name);

  constructor(private readonly placeService: PlaceService) {}

  @Get('/cities')
  @ApiOperation({
    summary: 'Получение списка доступных городов',
  })
  @ApiOkResponse({
    description: 'Список доступных городов получен',
    type: [CitiesRDO],
  })
  async findCities(): Promise<CitiesRDO[]> {
    const cities = await this.placeService.findActiveCities();

    return fillResponseDto(CitiesRDO, cities);
  }

  @Get('/:city_id')
  @ApiOperation({
    summary: 'Получение списка предложений аренды по конкретному городу',
  })
  @ApiParam({
    name: 'city_id',
    description: 'Идентификатор города по которому ищем предложения аренды',
    example: '46db580d-cfda-41bf-83c2-34b8b2f7d497',
  })
  @ApiOkResponse({
    type: PlacesListRdo,
    description: 'Список предложений аренды по выбранному городу',
  })
  async find(
    @Param('city_id', ParseUUIDPipe) cityId: string,
    @Query() pagination: PaginationPlacesDto,
  ): Promise<PlacesListRdo> {
    try {
      const [places, total] = await this.placeService.findAllPlaces(
        cityId,
        pagination,
      );

      return fillResponseDto(PlacesListRdo, {
        places,
        total,
      });
    } catch (err) {
      this.logger.error(err);
    }
  }
}
