import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Place } from './entities/place.entity';
import { PaginationPlacesDto } from './dto/pagination-places.dto';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  SortBy,
  MAX_CITY_COUNT,
} from 'src/shared/constants';
import { City } from './entities/city.entity';

@Injectable()
export class PlaceService {
  private readonly logger = new Logger(PlaceService.name);
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async findAllPlaces(
    cityId: string,
    { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT }: PaginationPlacesDto,
  ): Promise<[Place[], number]> {
    try {
      return this.placeRepository.findAndCount({
        where: {
          city: {
            id: cityId,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: SortBy.Desc,
        },
        relations: {
          preview: true,
          city: true,
        },
        select: {
          city: {
            name: true,
          },
        },
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  async findActiveCities(): Promise<City[]> {
    try {
      return this.cityRepository.find({
        where: {
          isActive: true,
        },
        relations: {
          preview: true,
        },
        take: MAX_CITY_COUNT,
      });
    } catch (err) {
      this.logger.error(err.toString());
    }
  }

  async findPlaceById(id: string): Promise<Place> {
    try {
      const place = await this.placeRepository.findOne({
        where: { id },
        relations: {
          images: true,
          host: true,
          preview: true,
        },
      });

      if (!place) {
        throw new NotFoundException(`Place with id: ${id} not found`);
      }

      return place;
    } catch (err) {
      this.logger.error(err.toString());
      throw err;
    }
  }
}
