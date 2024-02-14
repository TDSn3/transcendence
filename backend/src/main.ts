import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './utils/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: `http://localhost:${config.FRONTEND_PORT}`,
  });

  await app.listen(Number(config.BACKEND_PORT));
}
bootstrap();
