import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import applicationConfig from 'src/shared/config/application/application.config';
import databaseConfig from 'src/shared/config/database/database.config';

import { PlaceModule } from 'src/modules/places/place.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig, databaseConfig],
      envFilePath: './.env',
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.databaseUsername'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadEntities: false,
        migrationsRun: false,
        synchronize: false,
        logging: true,
        entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
        migrations: [join(__dirname, '/../src/migrations/*{.ts,.js}')],
      }),
      inject: [ConfigService],
    }),
    PlaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
