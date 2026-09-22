import { Injectable } from '@nestjs/common';
import { context, Span, SpanStatusCode, trace } from '@opentelemetry/api';

@Injectable()
export class TracingService {
  private readonly tracer = trace.getTracer('langoo');

  startSpan(name: string): Span {
    return this.tracer.startSpan(name);
  }

  endSpan(span: Span): void {
    span.end();
  }

  async run<T>(name: string, callback: (span: Span) => Promise<T>): Promise<T> {
    const span = this.tracer.startSpan(name);
    return context.with(trace.setSpan(context.active(), span), async () => {
      try {
        return await callback(span);
      } catch (error) {
        this.recordError(span, error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  recordError(span: Span, error: unknown): void {
    const exception =
      error instanceof Error
        ? error
        : new Error(typeof error === 'string' ? error : 'Unknown error');

    span.recordException(exception);

    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: exception.message,
    });
  }
}
