import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { ApplicationConfig } from 'src/shared/config/application/application.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService =
    app.get<ConfigService<ApplicationConfig>>(ConfigService);

  const port = configService.get('port');

  const config = new DocumentBuilder()
    .setTitle('The Six city open API')
    .setDescription('The Six city API')
    .setVersion('1.0')
    .addTag('six-city')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);
}

bootstrap();
