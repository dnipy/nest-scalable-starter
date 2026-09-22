import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BullBoardService } from './bull-board.service';
import { AppRedisModule } from '../redis/redis.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [AppRedisModule],
      useFactory: (redisConfig) => ({
        connection: redisConfig,
      }),
      inject: ['REDIS'],
    }),
    BullModule.registerQueue({
      name: 'ai-final-review',
      defaultJobOptions: {
        attempts: 3,

        backoff: {
          type: 'exponential',
          delay: 5000,
        },

        removeOnComplete: 1000,
        removeOnFail: 5000,
      },
    }),
    BullModule.registerQueue({
      name: 'ai-grade',
      defaultJobOptions: {
        attempts: 1,
        removeOnComplete: 1000,
        removeOnFail: 5000,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'ai-light',
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 1000,
        removeOnFail: 5000,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'ai-chat',
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 1000,
        removeOnFail: 5000,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'sms',
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 1000,
        removeOnFail: 5000,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'storage-cleanup',
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 1000,
        removeOnFail: 5000,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'invoice-generator',
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 1000,
        removeOnFail: 5000,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'subscription-renewal',
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 1000,
        removeOnFail: 5000,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      },
    }),
  ],
  providers: [BullBoardService],
  exports: [BullModule],
})
export class QueueModule {}
