import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from '@libs/modules';
import { Econfirmation } from './entities/email-confirmation.entity';
import { EmailConfirmationService } from './email-confirmation.service';
import confirmationConfig from '../../config/confirmation.config';
import { EmailConfirmationController } from './email-confirmation.controller';
import { UserModule } from '../users/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Econfirmation,
        ]),
        ConfigModule.forRoot({
            load: [confirmationConfig],    
        }),
        RabbitMQModule.forRoot({
            exchanges: [
                {
                    name: 'main_exchange',
                    type: 'direct',
                },
            ],
        }),
        UserModule,
    ],
    controllers: [EmailConfirmationController],
    providers: [EmailConfirmationService],
    exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}

