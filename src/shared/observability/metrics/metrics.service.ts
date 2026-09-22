import { Injectable } from '@nestjs/common';
import { metrics, Counter, Histogram } from '@opentelemetry/api';

@Injectable()
export class MetricsService {
  private readonly meter = metrics.getMeter('langoo');

  readonly httpRequests: Counter = this.meter.createCounter(
    'langoo_http_requests',
    {
      description: 'Number of HTTP requests processed by the application',
    }
  );

  readonly httpErrors = this.meter.createCounter('langoo_http_errors', {
    description: 'Number of HTTP error responses',
  });

  readonly httpRequestDuration = this.meter.createHistogram(
    'langoo_http_request_duration',
    {
      description: 'HTTP request duration',
      unit: 'ms',
    }
  );

  // uploads
  readonly storageUploadCreated: Counter = this.meter.createCounter(
    'langoo_storage_upload_created',
    {
      description: 'Number of file upload sessions created',
    }
  );

  readonly storageUploadCompleted: Counter = this.meter.createCounter(
    'langoo_storage_upload_completed',
    {
      description: 'Number of file uploads completed successfully',
    }
  );

  readonly storageUploadFailed: Counter = this.meter.createCounter(
    'langoo_storage_upload_failed',
    {
      description: 'Number of file uploads that failed validation',
    }
  );

  readonly storageUploadBytes: Counter = this.meter.createCounter(
    'langoo_storage_upload_bytes',
    {
      description: 'Total number of bytes uploaded',
      unit: 'By',
    }
  );

  readonly storageDownloadGenerated: Counter = this.meter.createCounter(
    'langoo_storage_download_generated',
    {
      description: 'Number of file download URLs generated',
    }
  );

  // AI
  readonly aiRequestStarted: Counter = this.meter.createCounter(
    'langoo_ai_request_started',
    {
      description: 'Number of AI requests that started',
    }
  );

  readonly aiRequestSuccess: Counter = this.meter.createCounter(
    'langoo_ai_request_success',
    {
      description: 'Number of AI requests completed successfully',
    }
  );

  readonly aiRequestFailed: Counter = this.meter.createCounter(
    'langoo_ai_request_failed',
    {
      description: 'Number of AI requests that failed',
    }
  );

  readonly aiResponseEmpty: Counter = this.meter.createCounter(
    'langoo_ai_response_empty',
    {
      description: 'Number of AI requests that returned an empty response',
    }
  );

  readonly aiRateLimited: Counter = this.meter.createCounter(
    'langoo_ai_rate_limited',
    {
      description: 'Number of AI requests rejected by provider rate limiting',
    }
  );

  readonly aiAdmissionRejected: Counter = this.meter.createCounter(
    'langoo_ai_admission_rejected',
    {
      description: 'Number of AI requests rejected during provider admission',
    }
  );

  readonly aiTokens: Counter = this.meter.createCounter('langoo_ai_tokens', {
    description: 'Total number of AI tokens consumed',
    unit: 'tokens',
  });

  readonly aiRequestDuration: Histogram = this.meter.createHistogram(
    'langoo_ai_request_duration',
    {
      description: 'AI request duration',
      unit: 'ms',
    }
  );

  // QUEUEs
  queueJobs = this.meter.createCounter('langoo_queue_jobs_total', {
    description: 'Total number of queue jobs processed',
  });

  queueJobDuration = this.meter.createHistogram('langoo_queue_job_duration', {
    description: 'Time spent processing queue jobs',
    unit: 'ms',
  });

  queueJobWaitDuration = this.meter.createHistogram(
    'langoo_queue_job_wait_duration',
    {
      description: 'Time jobs spend waiting before processing',
      unit: 'ms',
    }
  );

  queueWaiting = this.meter.createObservableGauge('langoo_queue_waiting', {
    description: 'Number of jobs currently waiting in a queue',
  });

  queueActive = this.meter.createObservableGauge('langoo_queue_active', {
    description: 'Number of jobs currently being processed in a queue',
  });

  queueDelayed = this.meter.createObservableGauge('langoo_queue_delayed', {
    description: 'Number of delayed jobs currently in a queue',
  });
}
