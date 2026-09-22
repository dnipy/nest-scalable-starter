import { Injectable } from '@nestjs/common';
import { AlertNotifier } from '../alert.interface';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramNotifier implements AlertNotifier {
  constructor(private readonly configService: ConfigService) {}

  async send(message: string): Promise<void> {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');

    if (!token || !chatId) return;

    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    });
  }
}
