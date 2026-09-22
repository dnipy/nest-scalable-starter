import { Injectable } from '@nestjs/common';
import { AlertService } from '../alert/alert.service';

@Injectable()
export class ErrorTrackingService {
  constructor(private alertService: AlertService) {}

  async capture(error: {
    message: string;
    stack?: string;
    path?: string;
    method?: string;
    userId?: string;
  }) {
    try {
      await this.alertService.send(
        `
        🚨 APP ERROR

        Message:
        ${error?.message}

        Path:
        ${error?.method} ${error?.path}

        User:
        ${error?.userId ?? 'anonymous'}
      `,
      );
    } catch (error) {}
  }
}
