import { Module } from '@nestjs/common';
import { WorkerHealthModule } from 'src/shared/runtime/healthz/worker/worker-health.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule, WorkerHealthModule, WorkerModule],
})
export class WorkerModule {}
