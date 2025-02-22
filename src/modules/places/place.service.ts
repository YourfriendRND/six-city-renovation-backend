import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Place } from './entities/place.entity';
import { Cities, DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/shared/constants';
import { PaginationPlacesDto } from './dto/pagination-places.dto';

@Injectable()
export class PlaceService {
  private readonly logger = new Logger(PlaceService.name);
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}

  async findAllPlaces(
    city: Cities,
    { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT }: PaginationPlacesDto,
  ): Promise<[Place[], number]> {
    try {
      return this.placeRepository.findAndCount({
        where: {
          city,
        },
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (err) {
      this.logger.error(err);
    }
  }
}
