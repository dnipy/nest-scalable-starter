import { Injectable } from '@nestjs/common';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import basicAuth from 'express-basic-auth';
import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullBoardService {
  constructor(
    private readonly config: ConfigService,
    @InjectQueue('ai-grade') private readonly aiGradeQueue: Queue,
    @InjectQueue('ai-chat') private readonly aiChatQueue: Queue,
    @InjectQueue('ai-light') private readonly aiLightQueue: Queue,
    @InjectQueue('sms') private readonly smsQueue: Queue,
    @InjectQueue('ai-final-review') private readonly aiFinalReview: Queue,
    @InjectQueue('storage-cleanup') private readonly storageCleanup: Queue,
    @InjectQueue('subscription-renewal') private readonly renewalQueue: Queue,
    @InjectQueue('invoice-generator') private readonly invoiceGenerator: Queue
  ) {}
  setup(app: any) {
    const serverAdapter = new ExpressAdapter();

    serverAdapter.setBasePath(
      this.config.get('NODE_ENV') == 'development'
        ? '/admin/queues'
        : '/api/admin/queues'
    );

    createBullBoard({
      queues: [
        new BullMQAdapter(this.aiChatQueue),
        new BullMQAdapter(this.aiLightQueue),
        new BullMQAdapter(this.smsQueue),
        new BullMQAdapter(this.aiGradeQueue),
        new BullMQAdapter(this.aiFinalReview),
        new BullMQAdapter(this.storageCleanup),
        new BullMQAdapter(this.invoiceGenerator),
        new BullMQAdapter(this.renewalQueue),
      ],
      serverAdapter,
    });

    const adminLimiter = rateLimit({
      windowMs: 60 * 1000,
      max: 30,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests to admin panel',
    });

    app.use('/admin/queues', adminLimiter);

    app.use(
      '/admin/queues',
      basicAuth({
        users: {
          [this.config.getOrThrow('BULLBOARD_USER')]:
            this.config.getOrThrow('BULLBOARD_PASSWORD'),
        },
        challenge: true,
      })
    );

    app.use('/admin/queues', serverAdapter.getRouter());
  }
}
