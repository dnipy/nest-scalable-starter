import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { createAdapter } from '@socket.io/redis-adapter';
import { ServerOptions } from 'socket.io';
import Redis from 'ioredis';

export class SocketIoRedisAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private readonly pubClient: Redis,
    private readonly subClient: Redis
  ) {
    super(app);
  }

  override createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);

    server.adapter(createAdapter(this.pubClient, this.subClient));
    console.log('[WS] Redis adapter initialized');

    return server;
  }
}
