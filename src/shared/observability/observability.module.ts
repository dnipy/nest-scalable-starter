import { Module } from '@nestjs/common';
import { MetricsModule } from './metrics/metrics.module';
import { ErrorTrackingModule } from './error-tracking/error-tracking.module';
import { AppLoggerModule } from './logger/logger.module';
import { TracingModule } from './tracing/tracing.module';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [
    AppLoggerModule,
    MetricsModule,
    TracingModule,
    ErrorTrackingModule,
    AlertModule,
  ],
  exports: [
    AppLoggerModule,
    MetricsModule,
    TracingModule,
    ErrorTrackingModule,
    AlertModule,
  ],
})
export class ObservabilityModule {}
