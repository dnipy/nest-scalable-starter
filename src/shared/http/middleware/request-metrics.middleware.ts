import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MetricsService } from '../../observability/metrics/metrics.service';
import { getHttpRoutePattern } from 'src/shared/observability/metrics/get-http-route-pattern';

@Injectable()
export class RequestMetricsMiddleware implements NestMiddleware {
  constructor(private readonly metrics: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime.bigint();

    const id = req?.id || res?.getHeader('x-request-id');
    req['requestId'] = id;

    res.on('finish', () => {
      const method = req.method;
      const route = getHttpRoutePattern(req);
      const status_code = res.statusCode;
      const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

      this.metrics.httpRequests.add(1, {
        method,
        route,
        status_code,
      });

      this.metrics.httpRequestDuration.record(durationMs, {
        method,
        route,
        status_code,
      });
    });

    next();
  }
}
