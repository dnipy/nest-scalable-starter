import { Module } from '@nestjs/common';
import { ShutdownLifecycle } from './shutdown-lifecycle.service';
import { ShutdownService } from './shutdown.service';

@Module({
  providers: [ShutdownLifecycle, ShutdownService],
  exports: [ShutdownService],
})
export class AppShutdownModule {}
