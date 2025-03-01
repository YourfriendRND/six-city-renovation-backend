import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { ApplicationConfig } from 'src/shared/config/application/application.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = app
    .get(ConfigService)
    .get<ApplicationConfig>('application').port;

  const config = new DocumentBuilder()
    .setTitle('The Six city open API')
    .setDescription('The Six city API')
    .setVersion('1.0')
    .addTag('six-city')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  console.log(port);
  await app.listen(port);
}

bootstrap();
