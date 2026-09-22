import { ConfigService } from '@nestjs/config';
import { AlertNotifier } from '../alert.interface';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Logger } from 'nestjs-pino';

@Injectable()
export class BaleNotifier implements AlertNotifier {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async send(message: string): Promise<void> {
    const token = this.configService.get<string>('BALE_BOT_TOKEN');
    const chatId = this.configService.get<string>('BALE_CHAT_ID');

    if (!token || !chatId) return;
    this.logger.log(`CALLING BALE`);
    await axios
      .post(`https://tapi.bale.ai/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: message,
      })
      .catch((error) => this.logger.log({ error }));
  }
}
