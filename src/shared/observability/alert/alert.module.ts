import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { BaleNotifier } from './notifiers/bale.service';
import { TelegramNotifier } from './notifiers/telegram.service';

@Module({
  providers: [AlertService, BaleNotifier, TelegramNotifier],
  exports: [AlertService],
})
export class AlertModule {}
