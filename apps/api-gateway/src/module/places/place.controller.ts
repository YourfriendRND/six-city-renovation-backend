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
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CityInterface, PlaceInterface } from '@libs/types';
import { CitiesRDO, PlacesListRdo, PlaceRdo } from '@libs/types/rdo';
import { fillResponseDto } from '@libs/config';
import { PaginationPlacesDto } from '@libs/types/dto';
import { BaseRpcController } from '../../types';

@ApiTags('Предложения аренды')
@Controller('places')
export class PlaceController extends BaseRpcController {
  private readonly logger = new Logger(PlaceController.name);
  constructor(protected readonly amqpConnection: AmqpConnection) {
    super(amqpConnection);
  }

  @Get('/cities')
  @ApiOperation({
    summary: 'Получение списка доступных городов',
  })
  @ApiOkResponse({
    description: 'Список доступных городов получен',
    type: [CitiesRDO],
  })
  async findCities(): Promise<CitiesRDO[]> {
    const cities = await this.makeRpcCall<CityInterface[]>('places/cities');

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
    const [places, total] = await this.makeRpcCall<[PlaceInterface[], number]>(
      'places/city_id',
      {
        cityId,
        pagination,
      },
    );

    return fillResponseDto(PlacesListRdo, {
      places,
      total,
    });
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
    example: 'Place with id: b3cb9fff-8153-47fe-94b8-963bce177cb9 not found',
  })
  async findPlaceById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PlaceRdo> {
    const place = await this.makeRpcCall<PlaceInterface>('places/:id', {
      id,
    });

    return fillResponseDto(PlaceRdo, place);
  }
}
