import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { RabbitMQModule as GolevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { rabbitConfig } from '@libs/config';
import { RabbitMQOptionsModuleInterface } from './types';
import { RabbitMQSubscribeService } from './rabbitmq-subscribe.service';

@Module({})
export class RabbitMQModule {
  static forRoot(options: RabbitMQOptionsModuleInterface): DynamicModule {
    return {
      module: RabbitMQModule,
      imports: [
        ConfigModule,
        DiscoveryModule,
        GolevelupRabbitMQModule.forRootAsync({
          imports: [
            ConfigModule.forRoot({
              envFilePath: './.env',
              load: [rabbitConfig],
            }),
          ],
          useFactory: (config: ConfigType<typeof rabbitConfig>) => {
            return {
              exchanges: options.exchanges,
              uri: config.url,
              connectionInitOptions: {
                wait: true,
              },
              prefetchCount: 1,
              registerHandlers: true,
              connectionManagerOptions: {
                heartbeatIntervalInSeconds: 60,
                reconnectTimeInSeconds: 5,
              },
            };
          },
          inject: [rabbitConfig.KEY],
        }),
      ],
      providers: [RabbitMQSubscribeService],
      exports: [GolevelupRabbitMQModule, RabbitMQSubscribeService],
    };
  }
}
