import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  constructor(private readonly logger: Logger) {}

  async onApplicationBootstrap() {
    this.logger.log('BOOTSTRAP : application bootstrap service started');

    this.logger.log('BOOTSTRAP : application bootstrap service done!');
  }
}
