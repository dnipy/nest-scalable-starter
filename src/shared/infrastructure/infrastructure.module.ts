import { Module } from '@nestjs/common';
import { AppRedisModule } from './redis/redis.module';
import { CacheModule } from './cache/cache.module';
import { AppConfigModule } from './config/config.module';
import { QueueModule } from './queue/queue.module';
import { PrismaModule } from './database/prisma/prisma.module';

@Module({
  imports: [
    AppConfigModule,
    AppRedisModule,
    CacheModule,
    PrismaModule,
    QueueModule,
  ],
  exports: [
    AppConfigModule,
    AppRedisModule,
    CacheModule,
    PrismaModule,
    QueueModule,
  ],
})
export class InfrastructureModule {}
