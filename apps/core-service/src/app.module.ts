import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import applicationConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { jwtConfig } from '@libs/config';

import { PlaceModule } from './modules/places/place.module';
import { FileModule } from './modules/files/file.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { EmailConfirmationModule } from './modules/email-confirmation/email-confirmation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig, databaseConfig, jwtConfig],
      envFilePath: './.env',
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (dbConfig: ConfigType<typeof databaseConfig>) => ({
        type: 'postgres',
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.databaseUsername,
        password: dbConfig.password,
        database: dbConfig.database,
        migrationsRun: false,
        synchronize: false,
        logging: true,
        entities: [join(__dirname, '/modules/**/*.entity{.ts,.js}')],
        migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
      }),
      inject: [databaseConfig.KEY],
    }),
    AuthModule,
    PlaceModule,
    FileModule,
    UserModule,
    EmailConfirmationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
