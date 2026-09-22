import {
  BeforeApplicationShutdown,
  Inject,
  Injectable,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ShutdownService } from './shutdown.service';
import { AlertService } from '../../observability/alert/alert.service';
import { PrismaService } from 'src/shared/infrastructure/database/prisma/prisma.service';
import Redis from 'ioredis';

@Injectable()
export class ShutdownLifecycle
  implements BeforeApplicationShutdown, OnApplicationShutdown
{
  constructor(
    private readonly alert: AlertService,
    private readonly shutdown: ShutdownService,
    private readonly prisma: PrismaService,
    @Inject('REDIS') readonly redis: Redis,
  ) {}

  async beforeApplicationShutdown(signal?: string) {
    this.shutdown.beginShutdown();
    await this.alert.send(
      `🛑 API shutting down  [${process.env.NODE_ENV || ''}] : (${signal})`,
      0,
      true,
    );
  }

  async onApplicationShutdown(signal?: string) {
    await this.prisma.$disconnect();
    this.redis.disconnect();

    console.log(
      'ON_APPLICATION_SHUTDOWN',
      `[${signal}]`,
      `${this.shutdown.getElapsedMs()} ms`,
    );
  }
}
