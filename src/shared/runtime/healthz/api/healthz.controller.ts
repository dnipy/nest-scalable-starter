import { Controller, Get, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { PinoLogger } from 'nestjs-pino';
import { AppException } from 'src/shared/http/exceptions/app.exception';
import { ErrorCode } from 'src/shared/http/exceptions/error-code.enum';
import { PrismaService } from 'src/shared/infrastructure/database/prisma/prisma.service';
import { ShutdownService } from 'src/shared/runtime/shutdown/shutdown.service';

@Controller('healthz')
export class HealthzController {
  constructor(
    private prisma: PrismaService,
    private readonly logger: PinoLogger,
    private readonly shutdown: ShutdownService,
    @Inject('REDIS') private readonly redis: Redis,
  ) {
    this.logger.setContext(HealthzController.name);
  }

  @Get()
  async health() {
    if (this.shutdown.isShuttingDown()) {
      throw new AppException(ErrorCode.SERVICE_UNAVAILABLE, 503);
    }
    const db_ok = await this.prisma.$queryRaw`SELECT 1`
      .then(() => true)
      .catch(() => false);

    const redis_ok = await this.redis
      .ping()
      .then((res) => res === 'PONG')
      .catch(() => false);

    const status = db_ok && redis_ok ? 'ok' : 'fail';

    return { status, db_ok, redis_ok };
  }
}
