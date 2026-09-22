import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisLifecycle } from './redis-lifecycle.service';
import { Logger } from 'nestjs-pino';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      inject: [ConfigService, Logger],
      useFactory: (config: ConfigService, logger: Logger) => {
        logger.log('REDIS : connectiong ');
        const redis = new Redis({
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: Number(config.get<number>('REDIS_PORT', 6379)),
          enableReadyCheck: true,
          maxRetriesPerRequest: null,
          lazyConnect: false,
        });

        redis.on('ready', () => logger.log('REDIS : ready'));

        redis.on('error', (err) => {
          logger.error('REDIS : error:', err);
        });

        redis.on('close', () => logger.log('REDIS : close'));
        redis.on('end', () => logger.log('REDIS : end'));

        redis.on('reconnecting', () => {
          logger.log('Redis reconnecting...');
        });

        return redis;
      },
    },
    {
      provide: 'REDIS_PUB',
      inject: ['REDIS'],
      useFactory: (redis: Redis) => redis.duplicate(),
    },
    {
      provide: 'REDIS_SUB',
      inject: ['REDIS'],
      useFactory: (redis: Redis) => redis.duplicate(),
    },
    {
      provide: 'REDIS_WS_PUB',
      inject: ['REDIS'],
      useFactory: (redis: Redis) => redis.duplicate(),
    },
    {
      provide: 'REDIS_WS_SUB',
      inject: ['REDIS'],
      useFactory: (redis: Redis) => redis.duplicate(),
    },
    RedisLifecycle,
  ],
  exports: ['REDIS', 'REDIS_PUB', 'REDIS_SUB', 'REDIS_WS_PUB', 'REDIS_WS_SUB'],
})
export class AppRedisModule {}
