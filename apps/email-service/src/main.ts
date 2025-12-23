import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  const port = app.get(ConfigService).get('application.email').port;

  await app.listen(port);
  logger.log(`Email Service is running on port ${port}`);
}

bootstrap();
