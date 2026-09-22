import { Injectable } from '@nestjs/common';

@Injectable()
export class ShutdownService {
  private shuttingDown = false;
  private startedAt?: number;

  beginShutdown() {
    if (this.shuttingDown) return;

    this.shuttingDown = true;
    this.startedAt = Date.now();
  }

  isShuttingDown() {
    return this.shuttingDown;
  }

  getElapsedMs() {
    if (!this.startedAt) return 0;
    return Date.now() - this.startedAt;
  }
}
