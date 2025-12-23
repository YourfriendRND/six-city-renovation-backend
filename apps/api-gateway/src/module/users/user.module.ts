import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@libs/modules';
import { UserController } from './user.controller';

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
    controllers: [UserController]
})
export class UserModule {}
