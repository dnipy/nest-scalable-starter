import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';
import { Logger } from 'nestjs-pino';
import { Response } from 'express';
import { MetricsService } from '../../observability/metrics/metrics.service';
import { getHttpRoutePattern } from 'src/shared/observability/metrics/get-http-route-pattern';

@Injectable()
export class ErrorTrackingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: Logger,
    private readonly metrics: MetricsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      catchError((err) => {
        const route = getHttpRoutePattern(req);
        const method = req.method;
        const status_code = res.statusCode;

        this.metrics.httpErrors.add(1, {
          route,
          method,
          status_code,
        });

        this.logger.error({
          requestId: req.requestId || req.id,
          method: req.method,
          url: req.url,
          userId: req.user?.id,
          body: req.body,
          query: req.query,
          message: err.message,
          stack: err.stack,
        });

        return throwError(() => err);
      }),
    );
  }
}
