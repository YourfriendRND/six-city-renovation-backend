import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ApplicationConfigSchema } from '@libs/config';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const homeUrl = app
    .get(ConfigService)
    .get<ApplicationConfigSchema>('application.gateway').homeUrl;

  app.enableCors({
    origin: [homeUrl],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const port = app
    .get(ConfigService)
    .get<ApplicationConfigSchema>('application.gateway').port;

  const config = new DocumentBuilder()
    .setTitle('The Six city open API')
    .setDescription('The Six city API')
    .setVersion('1.0')
    .addTag('six-city')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(port);
  logger.log(`Application Api-Gateway started on port: ${port}`);
}

bootstrap();
