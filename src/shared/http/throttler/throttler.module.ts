import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { AppRedisModule } from '../../infrastructure/redis/redis.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [AppRedisModule],
      inject: ['REDIS'],
      useFactory: (redis: any) => ({
        throttlers: [
          {
            ttl: 60_000,
            limit: 100,
          },
        ],
        storage: new ThrottlerStorageRedisService(redis),
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [ThrottlerModule],
})
export class AppThrottlerModule {}
