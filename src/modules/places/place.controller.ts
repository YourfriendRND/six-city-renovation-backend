import {
  Controller,
  Get,
  Param,
  Query,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { PlaceService } from './place.service';
import { PaginationPlacesDto } from './dto/pagination-places.dto';
import { PlacesListRdo, CitiesRDO, PlaceRdo } from './rdo';
import { createNotFoundExampleError, fillResponseDto } from 'src/shared/common';

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

  @Get('/cities/:city_id')
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

  @Get(':id')
  @ApiOperation({
    summary: 'Получение деталей предложения по id',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор предложения',
    example: 'b3cb9fff-8153-47fe-94b8-963bce177cb9',
  })
  @ApiOkResponse({
    description: 'Предложение по id найдена',
    type: PlaceRdo,
  })
  @ApiNotFoundResponse({
    description: 'Предложение по id не найдено',
    example: createNotFoundExampleError(
      'Place with id: b3cb9fff-8153-47fe-94b8-963bce177cb9 not found',
    ),
  })
  async findPlaceById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PlaceRdo> {
    const place = await this.placeService.findPlaceById(id);

    return fillResponseDto(PlaceRdo, place);
  }
}
