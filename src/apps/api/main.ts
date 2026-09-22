import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const logger = app.get(Logger);

  logger.log('api started');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
