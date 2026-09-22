import { Module } from '@nestjs/common';
import { AppRedisModule } from './redis/redis.module';
import { CacheModule } from './cache/cache.module';
import { AppConfigModule } from './config/config.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [AppConfigModule, AppRedisModule, CacheModule, QueueModule],
  exports: [AppConfigModule, AppRedisModule, CacheModule, QueueModule],
})
export class InfrastructureModule {}
