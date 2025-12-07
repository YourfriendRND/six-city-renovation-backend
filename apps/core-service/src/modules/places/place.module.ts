import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from '@libs/modules';

import { CorePlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { Place } from './entities/place.entity';
import { City } from './entities/city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Place, City]),
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'main_exchange',
          type: 'direct',
        },
      ],
    }),
  ],
  controllers: [CorePlaceController],
  providers: [PlaceService],
  exports: [PlaceService],
})
export class PlaceModule {}
