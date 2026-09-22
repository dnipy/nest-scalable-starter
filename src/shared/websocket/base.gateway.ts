import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Logger } from 'nestjs-pino';

export abstract class BaseGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    protected readonly logger: Logger,
    protected readonly namespace: string
  ) {}

  handleConnection(client: Socket) {
    this.logger.debug(
      {
        namespace: this.namespace,
        socketId: client.id,
      },
      'WS connected'
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(
      {
        namespace: this.namespace,
        socketId: client.id,
      },
      'WS disconnected'
    );
  }
}
