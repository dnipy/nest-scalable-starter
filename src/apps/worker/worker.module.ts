import { Module } from '@nestjs/common';
import { WorkerFeaturesModule } from 'src/features/worker-features.module';
import { WorkerHealthModule } from 'src/shared/runtime/healthz/worker/worker-health.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule, WorkerHealthModule, WorkerFeaturesModule],
})
export class WorkerModule {}
