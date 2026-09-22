import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { QueueMetricService } from './queue-metric.service';

@Module({
  providers: [MetricsService, QueueMetricService],
  exports: [MetricsService],
})
export class MetricsModule {}
