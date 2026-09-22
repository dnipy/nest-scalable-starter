import { Logger } from 'nestjs-pino';
import { Server } from 'socket.io';

export abstract class BaseWsListener {
  constructor(protected readonly logger: Logger) {}

  protected safeEmit(
    server: Server,
    config: {
      roomId: string;
      event: string;
      payload: unknown;
    }
  ) {
    try {
      server.to(config.roomId).emit(config.event, config.payload);

      this.logger.debug(
        {
          roomId: config.roomId,
          event: config.event,
        },
        'WS emitted'
      );
    } catch (error) {
      this.logger.error(
        {
          error,
          roomId: config.roomId,
          event: config.event,
        },
        'WS emit failed'
      );
    }
  }
}
