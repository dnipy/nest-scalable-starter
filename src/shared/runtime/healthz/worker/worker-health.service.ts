import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CacheService } from 'src/shared/infrastructure/cache/cache.service';
import { Logger } from 'nestjs-pino';

@Injectable()
export class WorkerHeartbeatService implements OnModuleInit, OnModuleDestroy {
  private timer?: NodeJS.Timeout;
  private key = 'monitor:worker:heartbeat';

  constructor(
    private readonly cache: CacheService,
    private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    this.logger.log({ key: this.key }, `worker start beating to ${this.key}`);
    await this.beat();

    this.timer = setInterval(() => {
      void this.beat();
    }, 5000);
  }

  private async beat() {
    this.logger.log(
      { key: this.key },
      `worker beat and attached to ${this.key}`,
    );
    await this.cache.set(this.key, Date.now().toString(), 15);
  }

  onModuleDestroy() {
    this.logger.log(
      { key: this.key },
      `worker stop beaing to ${this.key} due module destroy`,
    );
    if (this.timer) clearInterval(this.timer);
  }
}
