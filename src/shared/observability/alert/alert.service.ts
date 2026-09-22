import { Injectable } from '@nestjs/common';
import { TelegramNotifier } from './notifiers/telegram.service';
import { BaleNotifier } from './notifiers/bale.service';
import { CacheService } from 'src/shared/infrastructure/cache/cache.service';
import { createHash } from 'crypto';

@Injectable()
export class AlertService {
  constructor(
    private readonly telegram: TelegramNotifier,
    private readonly bale: BaleNotifier,
    private readonly cache: CacheService,
  ) {}

  async send(message: string, cooldownSeconds = 1500, bypassCooldown = false) {
    if (!bypassCooldown) {
      const key = this.buildKey(message);

      const shouldSend = await this.cache.setNX(key, '1', cooldownSeconds);

      if (!shouldSend) {
        return;
      }
    }

    await Promise.allSettled([
      this.telegram.send(message),
      this.bale.send(message),
    ]);
  }

  private buildKey(message: string): string {
    const hash = createHash('sha256').update(message).digest('hex');

    return `alert:${hash}`;
  }
}
