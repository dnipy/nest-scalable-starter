import { Module } from '@nestjs/common';
import { AppBootstrapModule } from './bootstrap/bootstrap.module';
import { AppShutdownModule } from './shutdown/shutdown.module';

@Module({
  imports: [AppBootstrapModule, AppShutdownModule],
})
export class RuntimeModule {}
