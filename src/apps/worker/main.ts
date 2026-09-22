import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    bufferLogs: true,
  });
  const logger = app.get(Logger);

  logger.log('worker started');

  const shutdown = async (signal: string) => {
    await app.close();
    process.exit(0);
  };

  process.on('unhandledRejection', (reason) => {});

  process.on('uncaughtException', async (error) => {
    process.exit(1);
  });

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap();
