import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const cookieSession = require('cookie-session'); //problem with ts config configuration, using the old way.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => next());
  await app.listen(3000);
}
bootstrap();
