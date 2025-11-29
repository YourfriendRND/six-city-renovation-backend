import { Controller } from '@nestjs/common';
import { CustomRabbitSubscribe, WrapRpcResponse } from '@libs/modules';
import { PaginationPlacesDto, PlaceInterface } from '@libs/types';

import { PlaceService } from './place.service';
import { City } from './entities/city.entity';

type PlacesListPayload = {
  cityId: string;
  pagination: PaginationPlacesDto;
};

type PlaceByIdPayload = {
  id: string;
};

@Controller()
export class CorePlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @CustomRabbitSubscribe({
    exchange: 'main_exchange',
    routingKey: 'places/cities',
    queue: 'places_cities',
    createQueueIfNotExist: true,
  })
  @WrapRpcResponse()
  async getCities(): Promise<City[]> {
    const cities = await this.placeService.findActiveCities();
    return cities;
  }

  @CustomRabbitSubscribe({
    exchange: 'main_exchange',
    routingKey: 'places/city_id',
    queue: 'places_city_id',
    createQueueIfNotExist: true,
  })
  @WrapRpcResponse()
  async getPlacesList(
    payload: PlacesListPayload,
  ): Promise<[PlaceInterface[], number]> {
    return this.placeService.findAllPlaces(payload.cityId, payload?.pagination);
  }

  @CustomRabbitSubscribe({
    exchange: 'main_exchange',
    routingKey: 'places/:id',
    queue: 'places_place_id',
    createQueueIfNotExist: true,
  })
  @WrapRpcResponse()
  async getPlaceById(payload: PlaceByIdPayload): Promise<PlaceInterface> {
    return this.placeService.findPlaceById(payload.id);
  }
}
