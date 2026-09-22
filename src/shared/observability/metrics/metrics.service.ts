import { Injectable } from '@nestjs/common';
import { metrics, Counter } from '@opentelemetry/api';

@Injectable()
export class MetricsService {
  private readonly meter = metrics.getMeter('scalable_app');

  // http metrics
  readonly httpRequests: Counter = this.meter.createCounter(
    'scalable_app_http_requests',
    {
      description: 'Number of HTTP requests processed by the application',
    },
  );

  readonly httpErrors = this.meter.createCounter('scalable_app_http_errors', {
    description: 'Number of HTTP error responses',
  });

  readonly httpRequestDuration = this.meter.createHistogram(
    'scalable_app_http_request_duration',
    {
      description: 'HTTP request duration',
      unit: 'ms',
    },
  );

  // queue metrics
  queueWaiting = this.meter.createObservableGauge(
    'scalable_app_queue_waiting',
    {
      description: 'Number of jobs currently waiting in a queue',
    },
  );

  queueActive = this.meter.createObservableGauge('scalable_app_queue_active', {
    description: 'Number of jobs currently being processed in a queue',
  });

  queueDelayed = this.meter.createObservableGauge(
    'scalable_app_queue_delayed',
    {
      description: 'Number of delayed jobs currently in a queue',
    },
  );
}
