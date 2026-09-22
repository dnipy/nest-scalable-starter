import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ShutdownService } from './shutdown.service';
import { AlertService } from '../../observability/alert/alert.service';

@Injectable()
export class ShutdownLifecycle
  implements BeforeApplicationShutdown, OnApplicationShutdown
{
  constructor(
    private readonly alert: AlertService,
    private readonly shutdown: ShutdownService,
  ) {}

  async beforeApplicationShutdown(signal?: string) {
    this.shutdown.beginShutdown();
    await this.alert.send(
      `🛑 API shutting down  [${process.env.NODE_ENV || ''}] : (${signal})`,
      0,
      true,
    );
  }

  onApplicationShutdown(signal?: string) {
    console.log(
      'ON_APPLICATION_SHUTDOWN',
      `[${signal}]`,
      `${this.shutdown.getElapsedMs()} ms`,
    );
  }
}
