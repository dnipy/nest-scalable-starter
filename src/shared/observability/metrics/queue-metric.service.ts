import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MetricsService } from 'src/shared/observability/metrics/metrics.service';

@Injectable()
export class QueueMetricService implements OnModuleInit {
  private readonly queues: Array<[string, Queue]> = [];

  constructor(
    private readonly metrics: MetricsService,

    @InjectQueue('subscription-renewal')
    subscriptionRenewalQueue: Queue,
  ) {
    this.queues = [['subscription-renewal', subscriptionRenewalQueue]];
  }

  onModuleInit() {
    for (const [name, queue] of this.queues) {
      this.registerQueue(name, queue);
    }
  }

  private registerQueue(name: string, queue: Queue) {
    this.metrics.queueWaiting.addCallback(async (result) => {
      result.observe(await queue.getWaitingCount(), {
        queue: name,
      });
    });

    this.metrics.queueActive.addCallback(async (result) => {
      result.observe(await queue.getActiveCount(), {
        queue: name,
      });
    });

    this.metrics.queueDelayed.addCallback(async (result) => {
      result.observe(await queue.getDelayedCount(), {
        queue: name,
      });
    });
  }
}
