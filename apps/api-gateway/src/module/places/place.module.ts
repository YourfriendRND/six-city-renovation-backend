import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@libs/modules';

import { PlaceController } from './place.controller';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'main_exchange',
          type: 'direct',
        },
      ],
    }),
  ],
  controllers: [PlaceController],
})
export class PlaceModule {}
