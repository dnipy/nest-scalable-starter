import { Module } from '@nestjs/common';
import { WorkerHeartbeatService } from './worker-health.service';

@Module({
  providers: [WorkerHeartbeatService],
})
export class WorkerHealthModule {}
