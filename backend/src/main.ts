import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import config from './utils/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const builder = new DocumentBuilder()
    .setTitle('Transcendence API')
    .setDescription('Transcendence API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, builder);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  await app.listen(Number(config.PORT));
}

bootstrap();

