import { Module } from '@nestjs/common';
import { HealthzController } from './healthz.controller';
import { AppShutdownModule } from '../../shutdown/shutdown.module';

@Module({
  imports: [AppShutdownModule],
  controllers: [HealthzController],
})
export class HealthzModule {}
