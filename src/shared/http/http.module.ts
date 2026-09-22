import { Module } from '@nestjs/common';
import { AppThrottlerModule } from './throttler/throttler.module';

@Module({
  imports: [AppThrottlerModule],
  exports: [AppThrottlerModule],
})
export class HttpModule {}
