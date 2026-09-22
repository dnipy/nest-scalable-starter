import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { Logger } from 'nestjs-pino';

@Injectable()
export class RedisLifecycle implements OnModuleDestroy {
  constructor(
    @Inject('REDIS')
    private readonly redis: Redis,
    private logger: Logger
  ) {}

  async onModuleDestroy() {
    try {
      if (this.redis.status !== 'end') {
        await this.redis.quit();
      }
    } catch {
      this.redis.disconnect();
    } finally {
      this.logger.log('Redis client closed');
    }
  }
}
